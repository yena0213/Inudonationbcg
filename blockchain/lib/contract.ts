import { ethers } from 'ethers';

// 스마트 컨트랙트 주소 (Arbitrum Sepolia)
// 배포 후 여기에 실제 주소를 입력하세요
export const CONTRACT_ADDRESS = '';

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
  const base = process.env.BLOCK_EXPLORER_BASE || 'https://sepolia-explorer.arbitrum.io/tx/';
  return `${base}${txHash}`;
}

// 스마트 컨트랙트 ABI (주요 함수만)
export const DONATION_LEDGER_ABI = [
  // 캠페인 생성
  "function createCampaign(string campaignId, address organization, string name) external",
  
  // 기부하기 (핵심)
  "function donate(string campaignId, string message) external payable",
  
  // 캠페인 정보 조회
  "function getCampaign(string campaignId) external view returns (tuple(string campaignId, address organization, string name, bool active, uint256 totalDonated, uint256 createdAt))",
  
  // 사용자 기부 내역 조회
  "function getDonationsByDonor(address donor) external view returns (uint256[])",
  
  // 특정 기부 상세 조회
  "function getDonation(uint256 index) external view returns (tuple(address donor, string campaignId, uint256 amount, uint256 timestamp, string message))",
  
  // 사용자 통계 (DID용)
  "function getDonorStats(address donor) external view returns (uint256 totalAmount, uint256 donationCount)",
  
  // 기부 이력 확인 (DID 검증용)
  "function hasDonationHistory(address addr) external view returns (bool)",
  
  // 이벤트
  "event CampaignCreated(string indexed campaignId, address indexed organization, string name, uint256 timestamp)",
  "event DonationMade(address indexed donor, string indexed campaignId, uint256 amount, uint256 timestamp, uint256 donationIndex)"
];
