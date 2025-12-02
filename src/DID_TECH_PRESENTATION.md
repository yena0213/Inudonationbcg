# 🎯 DID 기술 발표 대본
## "투명한 선의, 따뜻한 기부" - 블록체인 기반 기부 플랫폼

---

## 📌 1. 프로젝트 소개 (30초)

안녕하세요. 저희는 **블록체인 기반 기부 플랫폼**을 개발했습니다.

핵심 슬로건은 **"투명한 선의, 따뜻한 기부"** 입니다.

기존 기부 플랫폼의 문제점은:
- ❌ 기부 내역이 불투명
- ❌ 중간 과정에서 손실 가능
- ❌ 기부 증명이 어려움

저희는 이를 해결하기 위해:
- ✅ **블록체인으로 영구 기록** (위변조 불가능)
- ✅ **DID로 탈중앙화 신원 관리**
- ✅ **게임화로 재미있는 기부 경험**

이 3가지를 결합했습니다.

---

## 🔐 2. DID (Decentralized Identifier) 구현 (2분)

### 2.1 DID란 무엇인가?

**DID = 탈중앙화 신원 인증**
- 기존 방식: 네이버, 카카오 같은 중앙 서버가 신원 관리
- DID 방식: 블록체인 지갑 주소가 곧 신원 → 나만 통제 가능

### 2.2 우리 프로젝트의 DID 형식

```typescript
// DID 형식: did:ethr:arbitrum-sepolia:{지갑주소}
// 예시: did:ethr:arbitrum-sepolia:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

function createDID(address: string): string {
  return `did:ethr:arbitrum-sepolia:${address.toLowerCase()}`;
}
```

**구성 요소:**
1. `did` - DID 프로토콜 식별자
2. `ethr` - Ethereum 기반 DID
3. `arbitrum-sepolia` - 네트워크 (Arbitrum Layer 2 테스트넷)
4. `0x742d...` - 실제 지갑 주소

### 2.3 DID Document 구조

```javascript
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:ethr:arbitrum-sepolia:0x742d...",
  
  // 검증 방법 (암호화 키)
  "verificationMethod": [{
    "id": "did:ethr:arbitrum-sepolia:0x742d...#controller",
    "type": "EcdsaSecp256k1RecoveryMethod2020",
    "controller": "did:ethr:arbitrum-sepolia:0x742d...",
    "blockchainAccountId": "eip155:421614:0x742d..."
  }],
  
  // 인증 방법
  "authentication": ["did:ethr:arbitrum-sepolia:0x742d...#controller"],
  
  // 서비스 엔드포인트 (스마트 컨트랙트)
  "service": [{
    "id": "did:ethr:arbitrum-sepolia:0x742d...#donation-ledger",
    "type": "DonationLedger",
    "serviceEndpoint": "0x1234..." // 컨트랙트 주소
  }]
}
```

### 2.4 Verifiable Credential (검증 가능한 자격증명)

**VC = 기부 증명서 (디지털 영수증)**

```typescript
interface DonationCredential {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.donation-village.org/credentials/v1'
  ],
  type: ['VerifiableCredential', 'DonationCredential'],
  
  issuer: 'did:ethr:arbitrum-sepolia:0xContract...', // 발급자: 스마트 컨트랙트
  issuanceDate: '2025-12-02T10:30:00Z',
  
  credentialSubject: {
    id: 'did:ethr:arbitrum-sepolia:0x742d...', // 기부자 DID
    donationAmount: '50000',
    donationCount: 3,
    campaignId: 'unicef-children',
    txHash: '0x873b14f867623a30ebc588f593f7ac76f7d474b3a66f631c33cf1a5fdce16b0d',
    timestamp: '2025-12-02T10:30:00Z'
  },
  
  // 디지털 서명 (위변조 방지)
  proof: {
    type: 'EthereumEip712Signature2021',
    created: '2025-12-02T10:30:00Z',
    proofPurpose: 'assertionMethod',
    verificationMethod: '0x742d...',
    signature: '0xabc123...'
  }
}
```

### 2.5 VC 서명 및 검증 프로세스

**1) 서명 생성:**
```typescript
async function signCredential(credential, signer) {
  // 1. Credential을 JSON 문자열로 변환
  const message = JSON.stringify(credential);
  
  // 2. Ethereum 지갑으로 서명
  const signature = await signer.signMessage(message);
  
  // 3. Proof 추가
  credential.proof = {
    type: 'EthereumEip712Signature2021',
    signature: signature
  };
  
  return credential;
}
```

**2) 검증:**
```typescript
async function verifyCredential(credential) {
  // 1. 원본 메시지 복원
  const message = JSON.stringify({
    '@context': credential['@context'],
    type: credential.type,
    issuer: credential.issuer,
    credentialSubject: credential.credentialSubject
  });
  
  // 2. 서명에서 주소 복구
  const recoveredAddress = ethers.verifyMessage(
    message, 
    credential.proof.signature
  );
  
  // 3. 복구된 주소와 검증 메소드 비교
  return recoveredAddress === credential.proof.verificationMethod;
}
```

**보안 원리:**
- 타원곡선 암호학 (ECDSA) 사용
- 서명은 개인키로만 생성 가능
- 공개키(주소)로 검증 가능
- → **위변조 시 검증 실패**

### 2.6 DID 실제 사용 시나리오

**시나리오 1: 기부하기**
```
1. 사용자 로그인 → MetaMask 지갑 연결
2. 기부 실행 → 블록체인 트랜잭션 발생
3. VC 자동 생성 → localStorage 저장
4. 언제든지 조회 가능
```

**시나리오 2: 기부 증명서 제출**
```
1. 회사에 기부 증명서 제출 필요
2. VC를 JSON으로 다운로드
3. 누구나 verifyCredential() 함수로 검증 가능
4. Arbiscan에서 트랜잭션 확인 가능
```

**시나리오 3: 뱃지 획득 (Soul Bound Token)**
```typescript
interface BadgeCredential {
  type: ['VerifiableCredential', 'BadgeCredential'],
  credentialSubject: {
    id: 'did:ethr:arbitrum-sepolia:0x742d...',
    badge: {
      name: '골드 기부자',
      tier: 'gold',
      criteria: '100,000원 이상 기부',
      imageUrl: 'ipfs://...'
    }
  }
}
```

뱃지도 VC로 발급 → **양도 불가능한 영구 기록**

---

## 🏗️ 3. 백엔드 아키텍처 (2분)

### 3.1 전체 아키텍처

```
┌──────────────┐
│   Frontend   │ (React + Tailwind)
│   (브라우저)   │
└──────┬───────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│   Supabase   │              │  Arbitrum Sepolia │
│ Edge Function│              │   (블록체인)       │
│  (Hono 서버)  │              │                  │
└──────┬───────┘              └──────────────────┘
       │                                 ▲
       ▼                                 │
┌──────────────┐                        │
│  PostgreSQL  │                        │
│  (KV Store)  │                        │
│              │                        │
│ ┌──────────┐ │              ┌─────────┴────────┐
│ │ user:0x..│ │◄─────────────│ Smart Contract   │
│ │ points   │ │   검증 후 저장   │ DonationLedger   │
│ │ badges   │ │              │                  │
│ │ furniture│ │              └──────────────────┘
│ └──────────┘ │
└──────────────┘
```

### 3.2 온체인 vs 오프체인 데이터

#### 온체인 (Arbitrum Blockchain)
**영구 불변 기록 - 위변조 불가능**

```solidity
// 스마트 컨트랙트에 저장되는 데이터
struct Donation {
    address donor;        // 기부자 지갑 주소
    string campaignId;    // 캠페인 ID
    uint256 amount;       // 기부 금액 (wei)
    uint256 timestamp;    // 기부 시각
    string message;       // 응원 메시지
}

// 전체 기부 기록
Donation[] public donations;

// 사용자별 통계
mapping(address => uint256) public totalDonated;
mapping(address => uint256) public donationCount;
```

**장점:**
- ✅ 영구 보존 (삭제/수정 불가)
- ✅ 투명성 (누구나 조회 가능)
- ✅ 신뢰성 (블록체인 합의 알고리즘)

**단점:**
- ❌ 느림 (15초~1분)
- ❌ 비용 발생 (가스비)
- ❌ 대용량 데이터 저장 어려움

#### 오프체인 (Supabase PostgreSQL)
**빠른 읽기/쓰기 - 게임 데이터**

```javascript
// KV Store에 저장되는 데이터
{
  "user:0x742d35cc6634c0532925a3b844bc9e7595f0beb": {
    "points": 150000,              // 포인트 (빠른 조회 필요)
    "furniture": [                 // 보유 가구
      { "id": "wooden_table", "position": { "x": 100, "y": 200 } },
      { "id": "blue_sofa", "position": { "x": 300, "y": 150 } }
    ],
    "badges": [                    // 획득 뱃지
      "first_donation",
      "bronze_donor",
      "silver_donor"
    ],
    "donations": [                 // 트랜잭션 해시만 저장
      {
        "txHash": "0x873b14f867...",
        "campaignId": "unicef-children",
        "timestamp": "2025-12-02T10:30:00Z"
      }
    ]
  }
}
```

**장점:**
- ✅ 빠름 (밀리초)
- ✅ 무료
- ✅ 대용량 가능

**단점:**
- ❌ 중앙화 (Supabase 서버 의존)
- ❌ 위변조 가능성 (신뢰 필요)

### 3.3 Supabase의 역할

**1) Edge Function (Hono 웹서버)**
```typescript
// /supabase/functions/server/index.tsx

// 1. 트랜잭션 검증
app.post('/verify-donation', async (c) => {
  const { txHash, userAddress } = await c.req.json();
  
  // 블록체인에서 트랜잭션 조회
  const receipt = await provider.getTransactionReceipt(txHash);
  
  // 이벤트 파싱
  const donationEvent = contract.interface.parseLog(receipt.logs[0]);
  
  // 포인트 적립
  await kv.set(`user:${userAddress}`, {
    points: points + newPoints
  });
});

// 2. 사용자 정보 조회
app.get('/user/:address', async (c) => {
  const address = c.req.param('address');
  const userData = await kv.get(`user:${address}`);
  
  // 블록체인에서 실제 통계도 조회
  const [totalAmount, donationCount] = await contract.getDonorStats(address);
  
  return c.json({ ...userData, onChainStats: { totalAmount, donationCount } });
});

// 3. DID Document 조회
app.get('/did/:address', async (c) => {
  const address = c.req.param('address');
  
  // 블록체인에서 기부 이력 확인
  const hasHistory = await contract.hasDonationHistory(address);
  
  // DID Document 생성
  const didDocument = createDIDDocument(address);
  
  return c.json({ didDocument });
});
```

**2) PostgreSQL (KV Store)**
```sql
-- kv_store_17e2e0df 테이블
CREATE TABLE kv_store_17e2e0df (
  key TEXT PRIMARY KEY,        -- "user:0x742d..."
  value JSONB NOT NULL,        -- { points: 150000, ... }
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- 인덱스 최적화
CREATE INDEX idx_key_prefix ON kv_store_17e2e0df (key text_pattern_ops);
```

**3) 인증 (Supabase Auth)**
```typescript
// 이메일 회원가입
await supabase.auth.admin.createUser({
  email: 'user@example.com',
  password: 'password123',
  email_confirm: true  // 자동 인증
});

// 로그인
const { data: { session } } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// 지갑 주소 연결
// session.user.id + MetaMask 주소를 연결
```

### 3.4 데이터 흐름 (기부 프로세스)

```
[1] 사용자가 "3만원 기부" 버튼 클릭
     │
     ▼
[2] Frontend: DonationModal 열림
     │
     ▼
[3] Frontend: MetaMask 팝업
     │
     ▼
[4] 사용자가 트랜잭션 승인
     │
     ▼
[5] Arbitrum Blockchain: 트랜잭션 처리 (15초)
     │
     ├─ 스마트 컨트랙트 donate() 함수 실행
     │  ├─ 기부 기록 저장
     │  └─ DonationMade 이벤트 발생
     │
     ▼
[6] Frontend: txHash 받음 (0x873b14f...)
     │
     ▼
[7] Frontend → Backend: POST /verify-donation
     │                    { txHash, userAddress }
     ▼
[8] Backend: 블록체인에서 검증
     │
     ├─ provider.getTransactionReceipt(txHash)
     ├─ 이벤트 파싱
     ├─ 기부자 주소 확인
     └─ 금액 확인
     │
     ▼
[9] Backend: PostgreSQL에 포인트 저장
     │
     └─ kv.set("user:0x742d...", { points: 30000 })
     │
     ▼
[10] Backend: 뱃지 체크
     │
     ├─ 첫 기부? → "첫 기부" 뱃지 지급
     ├─ 10만원 이상? → "브론즈 기부자" 뱃지 지급
     └─ ...
     │
     ▼
[11] Backend → Frontend: 응답
     │                    { points: 30000, badges: ['first_donation'] }
     ▼
[12] Frontend: VC 생성 및 저장
     │
     ├─ createDonationCredential()
     ├─ signCredential()
     └─ saveCredential() → localStorage
     │
     ▼
[13] Frontend: 성공 화면 표시
     │
     └─ "3만원 기부 완료! 30,000P 획득!"
```

---

## ⛓️ 4. 스마트 컨트랙트 주요 함수 (2분)

### 4.1 컨트랙트 구조

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationLedger {
    // 기부 기록 구조체
    struct Donation {
        address donor;
        string campaignId;
        uint256 amount;
        uint256 timestamp;
        string message;
    }
    
    // 캠페인 구조체
    struct Campaign {
        string campaignId;
        address organization;
        string name;
        bool active;
        uint256 totalDonated;
        uint256 createdAt;
    }
    
    // 상태 변수
    Donation[] public donations;                           // 전체 기부 기록
    mapping(string => Campaign) public campaigns;          // 캠페인 목록
    mapping(address => uint256[]) public donorDonations;   // 사용자별 기부 인덱스
    mapping(address => uint256) public totalDonated;       // 사용자별 총 기부액
    mapping(address => uint256) public donationCount;      // 사용자별 기부 횟수
    
    // 이벤트
    event CampaignCreated(string indexed campaignId, address indexed organization, string name, uint256 timestamp);
    event DonationMade(address indexed donor, string indexed campaignId, uint256 amount, uint256 timestamp, uint256 donationIndex);
}
```

### 4.2 주요 함수 설명

#### 1) createCampaign - 캠페인 생성
```solidity
function createCampaign(
    string memory campaignId,
    address organization,
    string memory name
) external {
    require(!campaigns[campaignId].active, "Campaign already exists");
    
    campaigns[campaignId] = Campaign({
        campaignId: campaignId,
        organization: organization,
        name: name,
        active: true,
        totalDonated: 0,
        createdAt: block.timestamp
    });
    
    emit CampaignCreated(campaignId, organization, name, block.timestamp);
}
```

**용도:**
- 관리자가 새로운 기부 캠페인 생성
- 예: "유니세프 아동 급식", "월드비전 우물 파기"

**파라미터:**
- `campaignId`: 고유 ID (예: "unicef-children")
- `organization`: 단체 지갑 주소
- `name`: 캠페인 이름

#### 2) donate - 기부하기 (핵심!)
```solidity
function donate(
    string memory campaignId,
    string memory message
) external payable {
    require(campaigns[campaignId].active, "Campaign not found or inactive");
    require(msg.value > 0, "Donation amount must be greater than 0");
    
    // 기부 기록 생성
    uint256 donationIndex = donations.length;
    donations.push(Donation({
        donor: msg.sender,
        campaignId: campaignId,
        amount: msg.value,
        timestamp: block.timestamp,
        message: message
    }));
    
    // 인덱스 저장
    donorDonations[msg.sender].push(donationIndex);
    
    // 통계 업데이트
    totalDonated[msg.sender] += msg.value;
    donationCount[msg.sender] += 1;
    campaigns[campaignId].totalDonated += msg.value;
    
    // ETH를 단체에 전송
    payable(campaigns[campaignId].organization).transfer(msg.value);
    
    // 이벤트 발생
    emit DonationMade(msg.sender, campaignId, msg.value, block.timestamp, donationIndex);
}
```

**동작 과정:**
```
1. 캠페인 유효성 검사
2. 기부 금액 확인 (0보다 커야 함)
3. Donation 구조체 생성 및 배열에 추가
4. 사용자의 기부 인덱스 저장
5. 통계 업데이트 (총액, 횟수)
6. ETH를 단체 주소로 즉시 전송
7. DonationMade 이벤트 발생
```

**프론트엔드 호출:**
```typescript
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// 3만원 → 0.01 ETH로 변환
const ethAmount = krwToEth(30000);
const valueInWei = ethers.parseEther(ethAmount);

// donate 함수 호출
const tx = await contract.donate(
  'unicef-children',           // campaignId
  '어린이들에게 희망을!',        // message
  {
    value: valueInWei,          // 0.01 ETH
    gasLimit: 300000            // 가스 리미트
  }
);

// 트랜잭션 완료 대기
const receipt = await tx.wait();
console.log('기부 완료!', receipt.hash);
```

#### 3) getCampaign - 캠페인 조회
```solidity
function getCampaign(string memory campaignId)
    external
    view
    returns (Campaign memory)
{
    return campaigns[campaignId];
}
```

**용도:**
- 캠페인 정보 조회 (총 모금액, 활성 상태 등)

**호출:**
```typescript
const campaign = await contract.getCampaign('unicef-children');
console.log('총 모금액:', ethers.formatEther(campaign.totalDonated), 'ETH');
```

#### 4) getDonationsByDonor - 사용자 기부 내역
```solidity
function getDonationsByDonor(address donor)
    external
    view
    returns (uint256[] memory)
{
    return donorDonations[donor];
}
```

**용도:**
- 사용자가 기부한 모든 기록의 인덱스 배열 반환

**호출:**
```typescript
const indices = await contract.getDonationsByDonor('0x742d...');
// 결과: [0, 5, 12] → 0번, 5번, 12번 기부 기록
```

#### 5) getDonation - 특정 기부 조회
```solidity
function getDonation(uint256 index)
    external
    view
    returns (Donation memory)
{
    require(index < donations.length, "Invalid donation index");
    return donations[index];
}
```

**용도:**
- 인덱스로 특정 기부 기록 조회

**호출:**
```typescript
const donation = await contract.getDonation(5);
console.log({
  donor: donation.donor,
  amount: ethers.formatEther(donation.amount),
  message: donation.message,
  timestamp: new Date(donation.timestamp * 1000)
});
```

#### 6) getDonorStats - 사용자 통계 (DID용)
```solidity
function getDonorStats(address donor)
    external
    view
    returns (uint256 totalAmount, uint256 count)
{
    return (totalDonated[donor], donationCount[donor]);
}
```

**용도:**
- DID 검증 시 사용자의 총 기부액과 횟수 조회

**호출:**
```typescript
const [totalAmount, count] = await contract.getDonorStats('0x742d...');
console.log(`총 ${ethers.formatEther(totalAmount)} ETH, ${count}회 기부`);
```

#### 7) hasDonationHistory - 기부 이력 확인 (DID 검증)
```solidity
function hasDonationHistory(address addr)
    external
    view
    returns (bool)
{
    return donationCount[addr] > 0;
}
```

**용도:**
- DID Document 발급 전 기부 이력 확인

**호출:**
```typescript
const hasHistory = await contract.hasDonationHistory('0x742d...');
if (hasHistory) {
  // DID Document 발급 가능
}
```

### 4.3 가스 최적화

**1) 배열 대신 mapping 사용**
```solidity
// ❌ 비효율
address[] public donors;  // 전체 순회 필요 (O(n))

// ✅ 효율적
mapping(address => bool) public isDonor;  // 즉시 조회 (O(1))
```

**2) 변수 패킹**
```solidity
struct Campaign {
    uint256 totalDonated;   // 32 bytes
    uint256 createdAt;      // 32 bytes
    address organization;   // 20 bytes
    bool active;            // 1 byte  ← 한 슬롯에 저장
}
```

**3) 이벤트 활용**
```solidity
// ❌ 스토리지에 모든 데이터 저장 → 비쌈
mapping(address => string[]) public messages;

// ✅ 이벤트로 기록 → 저렴
event DonationMade(string message);
// 나중에 이벤트 로그로 조회 가능
```

---

## 🚀 5. 배포 과정 (1분)

### 5.1 스마트 컨트랙트 배포

**1) Hardhat 프로젝트 설정**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

npx hardhat init
```

**2) hardhat.config.js**
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    "arbitrum-sepolia": {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 421614
    }
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: process.env.ARBISCAN_API_KEY
    }
  }
};
```

**3) 배포 스크립트**
```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying DonationLedger to Arbitrum Sepolia...");
  
  const DonationLedger = await hre.ethers.getContractFactory("DonationLedger");
  const contract = await DonationLedger.deploy();
  
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("✅ DonationLedger deployed to:", address);
  
  // 검증을 위해 대기
  console.log("Waiting for block confirmations...");
  await contract.deploymentTransaction().wait(5);
  
  // Arbiscan에서 검증
  console.log("Verifying contract...");
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

**4) 배포 실행**
```bash
# 테스트넷 ETH 받기
# https://faucet.quicknode.com/arbitrum/sepolia

# 배포
npx hardhat run scripts/deploy.js --network arbitrum-sepolia

# 결과:
# ✅ DonationLedger deployed to: 0x1234567890abcdef...
```

**5) 프론트엔드에 주소 입력**
```typescript
// /lib/contract.ts
export const CONTRACT_ADDRESS = '0x1234567890abcdef...';
```

### 5.2 프론트엔드 배포 (Vercel)

**1) Vercel 연동**
```bash
npm install -g vercel

vercel login
vercel
```

**2) 환경 변수 설정**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
CONTRACT_ADDRESS=0x1234...
```

**3) 배포**
```bash
vercel --prod
```

### 5.3 Supabase Edge Function 배포

**1) Supabase CLI 설치**
```bash
npm install -g supabase

supabase login
supabase link --project-ref <project-id>
```

**2) 환경 변수 설정**
```bash
supabase secrets set CONTRACT_ADDRESS=0x1234...
```

**3) 배포**
```bash
supabase functions deploy server
```

---

## 🎯 6. 핵심 기술 정리 (30초)

### 온체인 (Arbitrum Sepolia)
- ✅ 기부 기록 영구 저장
- ✅ DID 기반 신원 관리
- ✅ Verifiable Credential 발급

### 오프체인 (Supabase)
- ✅ 게임 데이터 (포인트, 가구, 뱃지)
- ✅ 빠른 읽기/쓰기
- ✅ 트랜잭션 검증 서버

### 보안
- ✅ ECDSA 디지털 서명
- ✅ 블록체인 합의 알고리즘
- ✅ 이벤트 기반 검증

### 사용자 경험
- ✅ 동물의 숲 스타일 게임화
- ✅ MetaMask 지갑 연동
- ✅ 투명한 기부 증명

---

## 💡 7. Q&A 예상 질문

**Q1: 왜 Arbitrum을 선택했나요?**
A: Ethereum 메인넷은 가스비가 비쌉니다. Arbitrum은 Layer 2 솔루션으로 가스비가 1/10 수준이고, Ethereum과 완전 호환되어 선택했습니다.

**Q2: DID가 기존 OAuth보다 나은 점은?**
A: OAuth는 중앙 서버가 통제하지만, DID는 사용자가 직접 통제합니다. 서비스가 망해도 신원은 유지됩니다.

**Q3: 왜 모든 데이터를 블록체인에 저장하지 않나요?**
A: 블록체인은 느리고 비쌉니다. 증명이 필요한 데이터(기부 기록)만 온체인에, 게임 데이터는 오프체인에 저장하여 최적화했습니다.

**Q4: Verifiable Credential은 어디에 저장되나요?**
A: 현재는 localStorage에 저장하지만, 실제 프로덕션에서는 IPFS나 사용자 개인 클라우드에 저장할 수 있습니다.

**Q5: 스마트 컨트랙트 보안은 어떻게 보장하나요?**
A: Solidity 베스트 프랙티스를 따랐고, OpenZeppelin 라이브러리를 사용했습니다. 실제 배포 전에는 감사(Audit)가 필요합니다.

---

## 🎬 마무리 (30초)

저희 프로젝트는:

1. **블록체인**으로 기부를 투명하게 기록하고
2. **DID**로 탈중앙화 신원을 관리하며
3. **게임화**로 재미있는 경험을 제공합니다

이를 통해 "투명한 선의, 따뜻한 기부" 문화를 만들고자 합니다.

감사합니다! 🙏
