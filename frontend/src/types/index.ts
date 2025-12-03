/**
 * 공통 타입 정의
 */

// Campaign 타입 정의
export interface Campaign {
  id: string;
  organizationName: string;
  title: string;
  description: string;
  category: '동물' | '환경' | '교육';
  goalAmount: number;
  currentAmount: number;
  imageUrl: string;
  houseColor: string;
  organizationAddress?: string;
  deadline?: string; // 마감일 (ISO 8601 형식)
}

// User 타입 정의
export interface User {
  email: string;
  name?: string;
  walletAddress: string;
  did: string;
  points?: number;
  walletType?: 'embedded' | 'metamask';
  isOrganization?: boolean;
}

// FurnitureItem 타입 정의
export interface FurnitureItem {
  id: string;
  name: string;
  type: 'furniture' | 'decoration' | 'flooring' | 'wallpaper';
  imageUrl: string;
  price: number;
  owned: boolean;
}

// Badge 타입 정의
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: string;
  condition: string;
}

// Donation 타입 정의
export interface Donation {
  id: string;
  campaignId: string;
  campaignName: string;
  organizationName: string;
  amount: number;
  message?: string;
  txHash: string;
  timestamp: string;
  category: string;
}

export interface AdminStory {
  id: string;
  centerName: string;
  title: string;
  organizationImage: string;
  contentImage: string;
  description: string;
  explorerLink: string;
  benefit: string;
  createdAt: string;
}
