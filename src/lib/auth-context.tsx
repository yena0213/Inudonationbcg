/**
 * Google OAuth + Embedded Wallet + DID
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
}

interface AuthContextType {
  user: User | null;
  ready: boolean;
  authenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  getEthereumProvider: () => ethers.JsonRpcProvider;
  getEthereumSigner: () => ethers.Wallet | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'donation_village_user';
const WALLET_KEY = 'donation_village_wallet';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);

  // RPC Provider
  const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');

  // 초기 로드: 로컬스토리지에서 복구
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    const savedWallet = localStorage.getItem(WALLET_KEY);
    
    if (savedUser && savedWallet) {
      try {
        const userData = JSON.parse(savedUser);
        const walletData = JSON.parse(savedWallet);
        
        const restoredWallet = new ethers.Wallet(walletData.privateKey, provider);
        setWallet(restoredWallet);
        setUser(userData);
        
        console.log('✅ 세션 복구:', userData.email);
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
          await login(googleEmail, googleName);
        }
      }
    });
    
    setReady(true);
  }, []);

  // 결정론적 지갑 생성 (이메일 → 프라이빗 키)
  const createWalletFromEmail = (email: string): ethers.Wallet => {
    const seed = ethers.id(email); // 이메일 해시
    const newWallet = new ethers.Wallet(seed, provider);
    return newWallet;
  };

  // 이메일 로그인
  const login = async (email: string, name?: string) => {
    const newWallet = createWalletFromEmail(email);
    const walletAddress = newWallet.address;
    const did = createDID(walletAddress, 421614); // Arbitrum Sepolia

    const userData: User = {
      email,
      name: name || email.split('@')[0],
      walletAddress,
      did,
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

  // Google OAuth 로그인
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

  // 로그아웃
  const logout = () => {
    setUser(null);
    setWallet(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WALLET_KEY);
    supabase.auth.signOut();
    console.log('👋 로그아웃');
  };

  // Provider 반환
  const getEthereumProvider = () => provider;

  // Signer 반환
  const getEthereumSigner = () => wallet;

  const value: AuthContextType = {
    user,
    ready,
    authenticated: user !== null,
    login,
    loginWithGoogle,
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
