/**
 * Supabase Database API
 * 실제 운영 환경에서 사용
 */

import { supabase } from './supabase-client';
import type { Campaign } from '../types';

// ==================== 캠페인 관련 ====================

/**
 * 모든 캠페인 조회
 */
export async function getAllCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch campaigns:', error);
    throw error;
  }

  // DB 스키마를 Frontend 타입으로 변환
  return (data || []).map((row) => ({
    id: row.id,
    organizationName: row.organization_name,
    title: row.title,
    description: row.description,
    category: row.category,
    goalAmount: parseFloat(row.goal_amount),
    currentAmount: parseFloat(row.current_amount),
    imageUrl: row.image_url,
    houseColor: row.house_color,
    organizationAddress: row.organization_address,
    deadline: row.deadline,
  }));
}

/**
 * 단일 캠페인 조회
 */
export async function getCampaignById(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch campaign:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    organizationName: data.organization_name,
    title: data.title,
    description: data.description,
    category: data.category,
    goalAmount: parseFloat(data.goal_amount),
    currentAmount: parseFloat(data.current_amount),
    imageUrl: data.image_url,
    houseColor: data.house_color,
    organizationAddress: data.organization_address,
    deadline: data.deadline,
  };
}

/**
 * 캠페인 생성 (관리자)
 */
export async function createCampaign(campaign: Omit<Campaign, 'id' | 'currentAmount'>): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([
      {
        organization_name: campaign.organizationName,
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        goal_amount: campaign.goalAmount,
        current_amount: 0,
        image_url: campaign.imageUrl,
        house_color: campaign.houseColor,
        organization_address: campaign.organizationAddress,
        deadline: campaign.deadline,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Failed to create campaign:', error);
    throw error;
  }

  return {
    id: data.id,
    organizationName: data.organization_name,
    title: data.title,
    description: data.description,
    category: data.category,
    goalAmount: parseFloat(data.goal_amount),
    currentAmount: parseFloat(data.current_amount),
    imageUrl: data.image_url,
    houseColor: data.house_color,
    organizationAddress: data.organization_address,
    deadline: data.deadline,
  };
}

/**
 * 캠페인 업데이트 (관리자)
 */
export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
  const dbUpdates: any = {};

  if (updates.organizationName) dbUpdates.organization_name = updates.organizationName;
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.description) dbUpdates.description = updates.description;
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.goalAmount !== undefined) dbUpdates.goal_amount = updates.goalAmount;
  if (updates.currentAmount !== undefined) dbUpdates.current_amount = updates.currentAmount;
  if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;
  if (updates.houseColor) dbUpdates.house_color = updates.houseColor;
  if (updates.organizationAddress) dbUpdates.organization_address = updates.organizationAddress;
  if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;

  const { data, error } = await supabase
    .from('campaigns')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update campaign:', error);
    throw error;
  }

  return {
    id: data.id,
    organizationName: data.organization_name,
    title: data.title,
    description: data.description,
    category: data.category,
    goalAmount: parseFloat(data.goal_amount),
    currentAmount: parseFloat(data.current_amount),
    imageUrl: data.image_url,
    houseColor: data.house_color,
    organizationAddress: data.organization_address,
    deadline: data.deadline,
  };
}

/**
 * 캠페인 삭제 (관리자)
 */
export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase.from('campaigns').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete campaign:', error);
    throw error;
  }
}

/**
 * 캠페인 금액 증가 (기부 시)
 */
export async function increaseCampaignAmount(campaignId: string, amount: number): Promise<void> {
  // 현재 금액 조회
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('current_amount')
    .eq('id', campaignId)
    .single();

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  const newAmount = parseFloat(campaign.current_amount) + amount;

  // 금액 업데이트
  const { error } = await supabase
    .from('campaigns')
    .update({ current_amount: newAmount })
    .eq('id', campaignId);

  if (error) {
    console.error('Failed to increase campaign amount:', error);
    throw error;
  }
}

// ==================== 사용자 관련 ====================

/**
 * 사용자 정보 조회 또는 생성
 */
export async function getOrCreateUser(walletAddress: string, userData: {
  email?: string;
  name?: string;
  did?: string;
  walletType?: 'embedded' | 'metamask';
  isOrganization?: boolean;
}) {
  // 기존 사용자 조회
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found는 정상
    console.error('Failed to fetch user:', error);
    throw error;
  }

  // 사용자가 없으면 생성
  if (!user) {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          wallet_address: walletAddress,
          email: userData.email,
          name: userData.name,
          did: userData.did,
          wallet_type: userData.walletType,
          is_organization: userData.isOrganization || false,
          points: 0,
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error('Failed to create user:', createError);
      throw createError;
    }

    user = newUser;
  }

  return {
    walletAddress: user.wallet_address,
    email: user.email,
    name: user.name,
    did: user.did,
    walletType: user.wallet_type,
    isOrganization: user.is_organization,
    points: user.points || 0,
  };
}

/**
 * 사용자 포인트 업데이트
 */
export async function updateUserPoints(walletAddress: string, points: number): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ points })
    .eq('wallet_address', walletAddress);

  if (error) {
    console.error('Failed to update user points:', error);
    throw error;
  }
}

/**
 * 사용자 포인트 증가
 */
export async function increaseUserPoints(walletAddress: string, amount: number): Promise<number> {
  // 현재 포인트 조회
  const { data: user } = await supabase
    .from('users')
    .select('points')
    .eq('wallet_address', walletAddress)
    .single();

  if (!user) {
    throw new Error('User not found');
  }

  const newPoints = (user.points || 0) + amount;

  // 포인트 업데이트
  await updateUserPoints(walletAddress, newPoints);

  return newPoints;
}

// ==================== 기부 내역 관련 ====================

/**
 * 기부 내역 저장
 */
export async function saveDonation(donation: {
  campaignId: string;
  donorAddress: string;
  amount: number;
  message?: string;
  txHash: string;
  category: string;
  certificateUrl?: string;
}) {
  const { data, error } = await supabase
    .from('donations')
    .insert([
      {
        campaign_id: donation.campaignId,
        donor_address: donation.donorAddress,
        amount: donation.amount,
        message: donation.message,
        tx_hash: donation.txHash,
        category: donation.category,
        certificate_url: donation.certificateUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Failed to save donation:', error);
    throw error;
  }

  return data;
}

/**
 * 사용자의 기부 내역 조회 (캠페인 정보 포함)
 */
export async function getUserDonations(walletAddress: string) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      id,
      amount,
      transaction_hash,
      message,
      created_at,
      campaigns (
        id,
        title,
        organization_name
      )
    `)
    .eq('donor_wallet', walletAddress)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch user donations:', error);
    throw error;
  }

  // 데이터 변환
  return (data || []).map((donation: any) => ({
    id: donation.id,
    campaignId: donation.campaigns?.id || '',
    campaignTitle: donation.campaigns?.title || '알 수 없는 캠페인',
    organizationName: donation.campaigns?.organization_name || '알 수 없음',
    amount: parseFloat(donation.amount),
    txHash: donation.transaction_hash,
    timestamp: donation.created_at,
    message: donation.message,
    status: 'success',
  }));
}

// ==================== 가구 관련 ====================

/**
 * 가구 구매
 */
export async function buyFurniture(userAddress: string, furnitureId: string, price: number) {
  // 현재 포인트 확인
  const { data: user } = await supabase
    .from('users')
    .select('points')
    .eq('wallet_address', userAddress)
    .single();

  if (!user) {
    throw new Error('User not found');
  }

  const currentPoints = user.points || 0;
  if (currentPoints < price) {
    throw new Error('포인트가 부족합니다');
  }

  // 가구 소유 추가
  const { error: furnitureError } = await supabase
    .from('furniture_owned')
    .insert([
      {
        user_address: userAddress,
        furniture_id: furnitureId,
      },
    ]);

  if (furnitureError) {
    console.error('Failed to add furniture:', furnitureError);
    throw furnitureError;
  }

  // 포인트 차감
  const newPoints = currentPoints - price;
  await updateUserPoints(userAddress, newPoints);

  return {
    status: 'success',
    remainingPoints: newPoints,
    furniture: furnitureId,
  };
}

/**
 * 사용자 소유 가구 목록
 */
export async function getUserFurniture(userAddress: string) {
  const { data, error } = await supabase
    .from('furniture_owned')
    .select('furniture_id')
    .eq('user_address', userAddress);

  if (error) {
    console.error('Failed to fetch user furniture:', error);
    throw error;
  }

  return (data || []).map((row) => row.furniture_id);
}

// ==================== 뱃지 관련 ====================

/**
 * 뱃지 추가
 */
export async function addUserBadge(userAddress: string, badgeName: string) {
  const { error } = await supabase
    .from('user_badges')
    .insert([
      {
        user_address: userAddress,
        badge_name: badgeName,
      },
    ]);

  // 중복 뱃지는 무시
  if (error && error.code !== '23505') {
    console.error('Failed to add badge:', error);
    throw error;
  }
}

/**
 * 사용자 뱃지 목록 조회
 */
export async function getUserBadges(walletAddress: string) {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_name, earned_at')
    .eq('user_address', walletAddress)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch user badges:', error);
    // 에러 발생 시 빈 배열 반환 (테이블이 없을 수도 있음)
    return [];
  }

  return (data || []).map((badge: any) => badge.badge_name);
}
