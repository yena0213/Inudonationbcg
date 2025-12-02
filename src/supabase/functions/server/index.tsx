import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { ethers } from 'npm:ethers@6';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS 설정
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Supabase 클라이언트
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// 컨트랙트 설정
const CONTRACT_ADDRESS = Deno.env.get('CONTRACT_ADDRESS') || '';
const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';

const CONTRACT_ABI = [
  "function donate(string campaignId, string message) external payable",
  "function getDonation(uint256 index) external view returns (tuple(address donor, string campaignId, uint256 amount, uint256 timestamp, string message))",
  "function getDonorStats(address donor) external view returns (uint256 totalAmount, uint256 donationCount)",
  "function hasDonationHistory(address addr) external view returns (bool)",
  "event DonationMade(address indexed donor, string indexed campaignId, uint256 amount, uint256 timestamp, uint256 donationIndex)"
];

// Provider 생성
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 컨트랙트가 배포되었는지 확인
const isContractDeployed = CONTRACT_ADDRESS && CONTRACT_ADDRESS.startsWith('0x');

// 컨트랙트 객체는 배포된 경우에만 생성
let contract: ethers.Contract | null = null;
if (isContractDeployed) {
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  console.log('✅ Contract initialized:', CONTRACT_ADDRESS);
} else {
  console.log('⚠️ Contract not deployed. Running in mock mode.');
}

/**
 * 트랜잭션 검증 및 처리
 */
app.post('/make-server-17e2e0df/verify-donation', async (c) => {
  try {
    const { txHash, userAddress } = await c.req.json();
    
    if (!txHash || !userAddress) {
      return c.json({ error: 'txHash and userAddress are required' }, 400);
    }

    console.log(`Verifying transaction: ${txHash} for user: ${userAddress}`);

    // 트랜잭션 조회
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return c.json({ 
        status: 'pending',
        message: '트랜잭션이 아직 처리 중입니다...' 
      }, 202);
    }

    if (receipt.status === 0) {
      return c.json({ 
        status: 'failed',
        message: '트랜잭션이 실패했습니다.' 
      }, 400);
    }

    // 이벤트 파싱
    const logs = receipt.logs;
    let donationEvent = null;
    
    for (const log of logs) {
      try {
        const parsed = contract?.interface.parseLog({
          topics: log.topics as string[],
          data: log.data
        });
        
        if (parsed && parsed.name === 'DonationMade') {
          donationEvent = parsed;
          break;
        }
      } catch (e) {
        // 다른 컨트랙트의 이벤트일 수 있음
        continue;
      }
    }

    if (!donationEvent) {
      return c.json({ error: 'Donation event not found in transaction' }, 400);
    }

    const { donor, campaignId, amount, donationIndex } = donationEvent.args;

    // 기부자 주소 확인
    if (donor.toLowerCase() !== userAddress.toLowerCase()) {
      return c.json({ error: 'Donor address mismatch' }, 400);
    }

    // 포인트 적립 (1 wei = 1 point, 실제로는 환율 적용 필요)
    const amountInWei = BigInt(amount.toString());
    const points = Number(amountInWei / BigInt(1e15)); // 0.001 ETH = 1 point (예시)

    // KV에 사용자 포인트 저장
    const userKey = `user:${userAddress.toLowerCase()}`;
    const userData = await kv.get(userKey) || { points: 0, donations: [] };
    userData.points = (userData.points || 0) + points;
    userData.donations = userData.donations || [];
    userData.donations.push({
      txHash,
      campaignId,
      amount: amount.toString(),
      timestamp: new Date().toISOString(),
      donationIndex: donationIndex.toString()
    });
    await kv.set(userKey, userData);

    // 뱃지 체크 및 지급
    const badges = await checkAndAwardBadges(userAddress, userData);

    console.log(`✅ Donation verified: ${points} points awarded to ${userAddress}`);

    return c.json({
      status: 'success',
      points,
      totalPoints: userData.points,
      donationCount: userData.donations.length,
      badges,
      message: '기부가 완료되었습니다!'
    });

  } catch (error: any) {
    console.error('Error verifying donation:', error);
    return c.json({ 
      error: 'Verification failed',
      details: error.message 
    }, 500);
  }
});

/**
 * 사용자 정보 조회
 */
app.get('/make-server-17e2e0df/user/:address', async (c) => {
  try {
    const address = c.req.param('address').toLowerCase();
    const userKey = `user:${address}`;
    const userData = await kv.get(userKey) || { points: 0, donations: [], badges: [] };

    // 블록체인에서 실제 통계 조회 (컨트랙트가 배포된 경우에만)
    if (contract && isContractDeployed) {
      try {
        const [totalAmount, donationCount] = await contract.getDonorStats(address);
        userData.onChainStats = {
          totalAmount: totalAmount.toString(),
          donationCount: Number(donationCount)
        };
      } catch (error) {
        console.error('Failed to fetch on-chain stats:', error);
      }
    }

    return c.json(userData);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * 뱃지 체크 및 지급
 */
async function checkAndAwardBadges(userAddress: string, userData: any) {
  const badges = userData.badges || [];
  const newBadges: string[] = [];

  const totalPoints = userData.points || 0;
  const donationCount = userData.donations?.length || 0;

  // 뱃지 조건 체크
  const badgeConditions = [
    { id: 'first_donation', name: '첫 기부', condition: donationCount >= 1 },
    { id: 'bronze_donor', name: '브론즈 기부자', condition: totalPoints >= 10000 },
    { id: 'silver_donor', name: '실버 기부자', condition: totalPoints >= 50000 },
    { id: 'gold_donor', name: '골드 기부자', condition: totalPoints >= 100000 },
    { id: 'frequent_donor', name: '단골 기부자', condition: donationCount >= 5 },
    { id: 'generous_donor', name: '넉넉한 기부자', condition: donationCount >= 10 },
  ];

  for (const badge of badgeConditions) {
    if (badge.condition && !badges.includes(badge.id)) {
      badges.push(badge.id);
      newBadges.push(badge.name);
    }
  }

  // 업데이트
  if (newBadges.length > 0) {
    userData.badges = badges;
    const userKey = `user:${userAddress.toLowerCase()}`;
    await kv.set(userKey, userData);
  }

  return newBadges;
}

/**
 * 사용자 가구 구매
 */
app.post('/make-server-17e2e0df/buy-furniture', async (c) => {
  try {
    const { userAddress, furnitureId, price } = await c.req.json();
    
    if (!userAddress || !furnitureId || !price) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const address = userAddress.toLowerCase();
    const userKey = `user:${address}`;
    const userData = await kv.get(userKey) || { points: 0, furniture: [] };

    // 포인트 확인
    if (userData.points < price) {
      return c.json({ error: '포인트가 부족합니다' }, 400);
    }

    // 포인트 차감 및 가구 추가
    userData.points -= price;
    userData.furniture = userData.furniture || [];
    userData.furniture.push({
      id: furnitureId,
      purchasedAt: new Date().toISOString()
    });

    await kv.set(userKey, userData);

    return c.json({
      success: true,
      remainingPoints: userData.points,
      furniture: userData.furniture
    });

  } catch (error: any) {
    console.error('Error buying furniture:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * DID 문서 조회
 */
app.get('/make-server-17e2e0df/did/:address', async (c) => {
  try {
    const address = c.req.param('address').toLowerCase();
    
    // 컨트랙트가 배포되지 않은 경우
    if (!contract || !isContractDeployed) {
      return c.json({ 
        error: 'Contract not deployed',
        message: 'DID service is not available yet' 
      }, 503);
    }
    
    // 블록체인에서 기부 이력 확인
    const hasHistory = await contract.hasDonationHistory(address);
    
    if (!hasHistory) {
      return c.json({ error: 'No donation history found for this DID' }, 404);
    }

    // DID Document 생성
    const did = `did:ethr:arbitrum-sepolia:${address}`;
    const didDocument = {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      verificationMethod: [
        {
          id: `${did}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: did,
          blockchainAccountId: `eip155:421614:${address}`
        }
      ],
      authentication: [`${did}#controller`],
      service: [
        {
          id: `${did}#donation-ledger`,
          type: 'DonationLedger',
          serviceEndpoint: CONTRACT_ADDRESS
        }
      ]
    };

    // 통계 정보 추가
    const [totalAmount, donationCount] = await contract.getDonorStats(address);
    
    return c.json({
      didDocument,
      stats: {
        totalAmount: totalAmount.toString(),
        donationCount: Number(donationCount),
        hasVerifiedDonations: true
      }
    });

  } catch (error: any) {
    console.error('Error fetching DID:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * 헬스 체크
 */
app.get('/make-server-17e2e0df/health', (c) => {
  return c.json({ 
    status: 'ok',
    contractAddress: CONTRACT_ADDRESS,
    network: 'Arbitrum Sepolia'
  });
});

// 서버 시작
Deno.serve(app.fetch);