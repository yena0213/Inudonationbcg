/**
 * Google OAuth + Embedded Wallet + MetaMask DID 하이브리드
 * Supabase Auth + ethers.js 사용 (Privy 없이)
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { supabase } from './supabase-client';
import { createDID } from './did';

interface User {
  email: string;
  name?: string;
  walletAddress: string;
  did: string;
  walletType: 'embedded' | 'metamask';
  isOrganization?: boolean;
}

interface AuthContextType {
  user: User | null;
  ready: boolean;
  authenticated: boolean;
  login: (email: string, name?: string, isOrganization?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMetamask: () => Promise<void>;
  logout: () => void;
  getEthereumProvider: () => ethers.JsonRpcProvider | ethers.BrowserProvider;
  getEthereumSigner: () => ethers.Signer | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'donation_village_user';
const WALLET_KEY = 'donation_village_wallet';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [metamaskProvider, setMetamaskProvider] = useState<ethers.BrowserProvider | null>(null);
  const [metamaskSigner, setMetamaskSigner] = useState<ethers.Signer | null>(null);

  // RPC Provider
  const rpcUrl = import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // 초기 로드: 로컬스토리지에서 복구
  useEffect(() => {
    const restoreSession = async () => {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      const savedWallet = localStorage.getItem(WALLET_KEY);
      
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const userData: User = {
            ...parsed,
            isOrganization: !!parsed.isOrganization,
          };
          
          // MetaMask 세션 복구
          if (userData.walletType === 'metamask' && (window as any).ethereum) {
            const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
            setMetamaskProvider(browserProvider);
            const accounts = await browserProvider.send('eth_accounts', []);
            if (accounts && accounts.length > 0) {
              const signer = await browserProvider.getSigner();
              setMetamaskSigner(signer);
              setUser(userData);
              console.log('✅ MetaMask 세션 복구:', accounts[0]);
            }
          }
          
          // 임베디드 지갑 세션 복구
          if (savedWallet && userData.walletType === 'embedded') {
            const walletData = JSON.parse(savedWallet);
            const restoredWallet = new ethers.Wallet(walletData.privateKey, provider);
            setWallet(restoredWallet);
            setUser(userData);
            console.log('✅ 세션 복구:', userData.email);
          }
        } catch (err) {
          console.error('세션 복구 실패:', err);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(WALLET_KEY);
        }
      }
      
      // Supabase OAuth 콜백 처리
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const googleEmail = session.user.email;
          const googleName = session.user.user_metadata.full_name || session.user.user_metadata.name;
          
          if (googleEmail && !user) {
            console.log('✅ Google OAuth 콜백:', googleEmail);
            await login(googleEmail, googleName, false);
          }
        }
      });
      
      setReady(true);
    };

    restoreSession();
  }, []);

  // 결정론적 지갑 생성 (이메일 → 프라이빗 키)
  const createWalletFromEmail = (email: string): ethers.Wallet => {
    const seed = ethers.id(email); // 이메일 해시
    const newWallet = new ethers.Wallet(seed, provider);
    return newWallet;
  };

  // 이메일 로그인
  const login = async (email: string, name?: string, isOrganization?: boolean) => {
    const newWallet = createWalletFromEmail(email);
    const walletAddress = newWallet.address;
    const did = createDID(walletAddress, 421614); // Arbitrum Sepolia

    const userData: User = {
      email,
      name: name || email.split('@')[0],
      walletAddress,
      did,
      walletType: 'embedded',
      isOrganization: !!isOrganization,
    };

    const walletData = {
      privateKey: newWallet.privateKey,
    };

    setUser(userData);
    setWallet(newWallet);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(WALLET_KEY, JSON.stringify(walletData));

    console.log('✅ 로그인 성공:', {
      email,
      wallet: walletAddress,
      did,
    });
  };

  // Google OAuth 로그인 (성공 후 Supabase 세션을 통해 login() 호출)
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw error;
    }
  };

  // MetaMask 로그인 (하이브리드 DID)
  const loginWithMetamask = async () => {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask 지갑이 설치되어 있지 않습니다');
    }

    const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    setMetamaskProvider(browserProvider);

    // 네트워크 확인 및 필요 시 전환
    try {
      const network = await browserProvider.getNetwork();
      if (network.chainId !== 421614n) {
        await browserProvider.send('wallet_switchEthereumChain', [{ chainId: '0x66eee' }]); // 421614 in hex
      }
    } catch (err) {
      console.warn('체인 전환 실패 또는 건너뜀:', err);
    }

    const accounts = await browserProvider.send('eth_requestAccounts', []);
    if (!accounts || accounts.length === 0) {
      throw new Error('MetaMask 계정을 가져올 수 없습니다');
    }

    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();
    setMetamaskSigner(signer);

    const did = createDID(address, 421614); // Arbitrum Sepolia
    const userData: User = {
      email: `${address.toLowerCase()}@metamask`,
      name: 'MetaMask 지갑',
      walletAddress: address,
      did,
      walletType: 'metamask',
      isOrganization: false,
    };

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(WALLET_KEY, JSON.stringify({ type: 'metamask' }));

    console.log('✅ MetaMask 로그인 성공:', address);
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    setWallet(null);
    setMetamaskSigner(null);
    setMetamaskProvider(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WALLET_KEY);
    supabase.auth.signOut();
    console.log('👋 로그아웃');
  };

  // Provider 반환
  const getEthereumProvider = () => metamaskProvider || provider;

  // Signer 반환
  const getEthereumSigner = () => metamaskSigner || wallet;

  const value: AuthContextType = {
    user,
    ready,
    authenticated: user !== null,
    login,
    loginWithGoogle,
    loginWithMetamask,
    logout,
    getEthereumProvider,
    getEthereumSigner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

// 호환성 유지를 위한 usePrivy, useWallets
export function usePrivy() {
  const auth = useAuth();
  return {
    ready: auth.ready,
    authenticated: auth.authenticated,
    user: auth.user ? {
      email: { address: auth.user.email },
      wallet: { address: auth.user.walletAddress },
    } : null,
    login: auth.loginWithGoogle,
    logout: auth.logout,
  };
}

export function useWallets() {
  const auth = useAuth();
  return {
    wallets: auth.user ? [{
      address: auth.user.walletAddress,
      chainType: 'ethereum',
    }] : [],
  };
}
