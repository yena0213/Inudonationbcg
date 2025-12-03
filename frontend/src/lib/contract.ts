import { ethers } from 'ethers';

// 스마트 컨트랙트 주소 (Arbitrum Sepolia)
// 배포 완료: 2025-12-02
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1';

const DEFAULT_EXPLORER_BASE = 'https://sepolia-explorer.arbitrum.io/tx/';

const normalizeExplorerBase = (raw?: string) => {
  const base = raw?.trim();
  if (!base || base.includes('docs.arbitrum.io')) return DEFAULT_EXPLORER_BASE;
  if (base.includes('/tx/')) return base.endsWith('/') ? base : `${base}/`;
  if (base.endsWith('/tx')) return `${base}/`;
  return `${base.endsWith('/') ? base : `${base}/`}tx/`;
};

// 컨트랙트 배포 여부 확인
export function isContractDeployed(): boolean {
  return CONTRACT_ADDRESS !== '' && CONTRACT_ADDRESS.startsWith('0x');
}

// KRW를 ETH로 변환 (1 ETH = 약 3,000,000 KRW로 가정)
export function krwToEth(krwAmount: number): string {
  const ethPerKrw = 1 / 3000000; // 1 KRW = 0.00000033 ETH
  const ethAmount = krwAmount * ethPerKrw;
  return ethAmount.toFixed(18);
}

// 트랜잭션 탐색기 URL 생성
export function getTxExplorerUrl(txHash: string): string {
  const base = normalizeExplorerBase(import.meta.env.VITE_BLOCK_EXPLORER_BASE);
  return `${base}${txHash}`;
}

// DonationVillage 컨트랙트 ABI
export const DONATION_VILLAGE_ABI = [
  // 캠페인 조회
  "function getCampaign(uint256 campaignId) external view returns (tuple(string organizationName, string title, string description, string category, uint256 goalAmount, uint256 currentAmount, address beneficiary, bool active, uint256 createdAt))",
  "function campaignCount() external view returns (uint256)",

  // 기부하기 (핵심) - uint256 campaignId 사용!
  "function donate(uint256 campaignId, string message) external payable",

  // 기부 내역 조회
  "function getDonation(uint256 donationId) external view returns (tuple(address donor, uint256 campaignId, uint256 amount, uint256 timestamp, string message))",
  "function getUserDonations(address user) external view returns (uint256[])",
  "function getCampaignDonations(uint256 campaignId) external view returns (uint256[])",
  "function donationCount() external view returns (uint256)",

  // 사용자 통계
  "function totalDonatedByUser(address user) external view returns (uint256)",

  // 이벤트
  "event DonationMade(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor, uint256 amount, uint256 timestamp)",
  "event CampaignCreated(uint256 indexed campaignId, string organizationName, string title, address beneficiary)"
];

// 호환성을 위한 별칭
export const DONATION_LEDGER_ABI = DONATION_VILLAGE_ABI;
