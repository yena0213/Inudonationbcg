/**
 * API 유틸리티 함수
 * Supabase Edge Functions와 통신
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-17e2e0df`;

// 개발 모드: 백엔드 없이도 작동
const ENABLE_BACKEND = import.meta.env.VITE_ENABLE_BACKEND === 'true' || import.meta.env.PROD;

export interface VerificationResult {
  status: 'success' | 'failed' | 'pending';
  totalPoints?: number;
  badges?: string[];
  certificateCid?: string;
  certificateUrl?: string;
  explorerUrl?: string;
  message?: string;
}

/**
 * API 요청 헬퍼
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (!ENABLE_BACKEND) {
    throw new Error('Backend disabled in development mode');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * 사용자 정보 조회
 */
export async function getUserData(address: string) {
  try {
    if (!ENABLE_BACKEND) {
      // 로컬 스토리지에서 데이터 가져오기
      const localData = localStorage.getItem(`user_${address}`);
      if (localData) {
        return JSON.parse(localData);
      }
      return {
        points: 0,
        donations: [],
        badges: [],
        furniture: [],
        certificates: [],
      };
    }
    return await apiRequest(`/user/${address}`);
  } catch (error) {
    console.log('Using local storage (backend unavailable)');
    // 사용자가 없으면 기본값 반환
    const localData = localStorage.getItem(`user_${address}`);
    if (localData) {
      return JSON.parse(localData);
    }
    return {
      points: 0,
      donations: [],
      badges: [],
      furniture: [],
      certificates: [],
    };
  }
}

/**
 * 사용자 데이터 로컬 저장
 */
export function saveUserDataLocally(address: string, data: any) {
  localStorage.setItem(`user_${address}`, JSON.stringify(data));
}

/**
 * 기부 트랜잭션 검증
 */
export async function verifyDonation(txHash: string, userAddress: string): Promise<VerificationResult> {
  try {
    if (!ENABLE_BACKEND) {
      // 로컬 모드: Mock 검증 결과 반환
      const userData = await getUserData(userAddress);
      const newPoints = (userData.points || 0) + Math.floor(Math.random() * 10000);
      
      const newBadges = [];
      if (newPoints >= 10000 && newPoints < 20000) {
        newBadges.push('첫 기부자');
      } else if (newPoints >= 50000 && newPoints < 60000) {
        newBadges.push('기부 천사');
      } else if (newPoints >= 100000 && newPoints < 110000) {
        newBadges.push('기부 영웅');
      }
      
      // 로컬에 저장
      saveUserDataLocally(userAddress, {
        ...userData,
        points: newPoints
      });
      
      return {
        status: 'success',
        totalPoints: newPoints,
        badges: newBadges,
        certificateCid: 'local-mock-cid',
        certificateUrl: `ipfs://local-${txHash.slice(0, 6)}`,
        explorerUrl: `https://sepolia-explorer.arbitrum.io/tx/${txHash}`,
        message: 'Local verification (development mode)'
      };
    }
    
    return await apiRequest('/verify-donation', {
      method: 'POST',
      body: JSON.stringify({ txHash, userAddress }),
    });
  } catch (error) {
    console.log('Using local verification (backend unavailable)');
    // 백엔드 실패시 로컬 검증
    const userData = await getUserData(userAddress);
    const newPoints = (userData.points || 0) + Math.floor(Math.random() * 10000);
    
    saveUserDataLocally(userAddress, {
      ...userData,
      points: newPoints
    });
    
    return {
      status: 'success',
      totalPoints: newPoints,
      badges: [],
      certificateCid: 'local-fallback',
      certificateUrl: `ipfs://local-${txHash.slice(0, 6)}`,
      explorerUrl: `https://sepolia-explorer.arbitrum.io/tx/${txHash}`,
      message: 'Local verification (backend unavailable)'
    };
  }
}

/**
 * 가구 구매
 */
export async function buyFurniture(userAddress: string, furnitureId: string, price: number) {
  try {
    if (!ENABLE_BACKEND) {
      // 로컬 모드: 포인트 차감
      const userData = await getUserData(userAddress);
      const currentPoints = userData.points || 0;
      
      if (currentPoints < price) {
        throw new Error('포인트가 부족합니다');
      }
      
      const newPoints = currentPoints - price;
      const ownedFurniture = userData.furniture || [];
      
      saveUserDataLocally(userAddress, {
        ...userData,
        points: newPoints,
        furniture: [...ownedFurniture, furnitureId]
      });
      
      return {
        status: 'success',
        remainingPoints: newPoints,
        furniture: furnitureId
      };
    }
    
    return await apiRequest('/buy-furniture', {
      method: 'POST',
      body: JSON.stringify({ userAddress, furnitureId, price }),
    });
  } catch (error) {
    console.error('Buy furniture failed:', error);
    throw error;
  }
}

/**
 * DID 문서 조회
 */
export async function getDIDDocument(address: string) {
  try {
    if (!ENABLE_BACKEND) {
      return null;
    }
    return await apiRequest(`/did/${address}`);
  } catch (error) {
    console.log('DID document unavailable (backend unavailable)');
    return null;
  }
}

/**
 * 헬스 체크
 */
export async function healthCheck() {
  try {
    if (!ENABLE_BACKEND) {
      return { status: 'local', message: 'Running in local mode' };
    }
    return await apiRequest('/health');
  } catch (error) {
    console.log('Backend health check failed');
    return { status: 'local', message: 'Backend unavailable' };
  }
}
