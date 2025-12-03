/**
 * Wallet Mock for Development
 * 실제 배포 시에는 Privy SDK로 교체
 */

import { ethers } from 'ethers';

export interface MockWallet {
  address: string;
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
}

let mockWallet: MockWallet | null = null;

/**
 * Mock 지갑 생성 (개발용)
 */
export async function createMockWallet(): Promise<MockWallet> {
  if (mockWallet) return mockWallet;

  // 랜덤 지갑 생성
  const wallet = ethers.Wallet.createRandom();
  
  // Arbitrum Sepolia RPC에 연결
  const provider = new ethers.JsonRpcProvider(
    'https://sepolia-rollup.arbitrum.io/rpc'
  );
  
  const connectedWallet = wallet.connect(provider);
  
  mockWallet = {
    address: wallet.address,
    provider: provider as any,
    signer: connectedWallet
  };
  
  console.log('🔐 Mock Wallet Created:', wallet.address);
  console.log('⚠️ This is a development wallet. Use Privy in production.');
  
  return mockWallet;
}

/**
 * Mock 지갑 가져오기
 */
export function getMockWallet(): MockWallet | null {
  return mockWallet;
}

/**
 * Mock 로그인 (이메일 기반)
 */
export async function mockLogin(email: string): Promise<MockWallet> {
  // 이메일을 시드로 사용하여 결정론적 지갑 생성
  const seed = ethers.id(email);
  const wallet = new ethers.Wallet(seed);
  
  const provider = new ethers.JsonRpcProvider(
    'https://sepolia-rollup.arbitrum.io/rpc'
  );
  
  const connectedWallet = wallet.connect(provider);
  
  mockWallet = {
    address: wallet.address,
    provider: provider as any,
    signer: connectedWallet
  };
  
  console.log('✅ Mock Login:', email, '→', wallet.address);
  
  return mockWallet;
}

/**
 * Mock 로그아웃
 */
export function mockLogout(): void {
  mockWallet = null;
  console.log('👋 Mock Logout');
}

/**
 * 로그인 상태 확인
 */
export function isLoggedIn(): boolean {
  return mockWallet !== null;
}

/**
 * 현재 주소 가져오기
 */
export function getCurrentAddress(): string | null {
  return mockWallet?.address || null;
}
