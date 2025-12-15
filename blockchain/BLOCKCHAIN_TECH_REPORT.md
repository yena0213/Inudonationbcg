# 블록체인 기반 투명 기부 플랫폼

## 📋 프로젝트 개요

**프로젝트명**: Donation Village (기부 마을)
**목적**: 블록체인 기술과 게이미피케이션을 결합한 투명한 기부 플랫폼
**배포 네트워크**: Arbitrum Sepolia Testnet (Layer 2)
**스마트 컨트랙트 주소**: `0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1`

---

## 🔗 1. 블록체인 기술 스택

### 1.1 스마트 컨트랙트 개발 환경

| 기술 | 버전 | 역할 |
|------|------|------|
| **Solidity** | 0.8.20+ | 스마트 컨트랙트 개발 언어 |
| **Hardhat** | 2.22.16 | 개발 프레임워크 및 테스팅 환경 |
| **OpenZeppelin Contracts** | 5.0.0 | 보안 라이브러리 |
| **ethers.js** | 6.13.4 | 블록체인 상호작용 라이브러리 |

### 1.2 블록체인 네트워크

- **메인 네트워크**: Arbitrum Sepolia (Testnet)
- **Chain ID**: 421614
- **RPC Endpoint**: `https://sepolia-rollup.arbitrum.io/rpc`
- **블록 탐색기**: https://sepolia.arbiscan.io/
- **선택 이유**:
  - Layer 2 솔루션으로 낮은 가스비 (이더리움 메인넷 대비 10~100배 저렴)
  - 빠른 트랜잭션 속도 (2초 이내 컨펌)
  - 이더리움 메인넷과 동일한 보안성

---

## 🏗️ 2. 스마트 컨트랙트 아키텍처

### 2.1 DonationVillage.sol - 메인 컨트랙트

**파일 위치**: `blockchain/contracts/DonationVillage.sol`

#### 핵심 기능

**1) 상속 구조 (OpenZeppelin 활용)**
```solidity
contract DonationVillage is Ownable, ReentrancyGuard, Pausable
```

- `Ownable`: 관리자 권한 관리 (캠페인 생성, 활성화/비활성화)
- `ReentrancyGuard`: 재진입 공격 방지 (기부금 인출 시 보안)
- `Pausable`: 긴급 중지 기능 (해킹 대응)

**2) 데이터 구조체**

```solidity
struct Campaign {
    string organizationName;  // 단체명
    string title;             // 캠페인 제목
    string description;       // 설명
    string category;          // 카테고리 (동물/환경/교육)
    uint256 goalAmount;       // 목표 금액 (wei 단위)
    uint256 currentAmount;    // 현재 모금액
    address payable beneficiary; // 수혜자 주소
    bool active;              // 활성 상태
    uint256 createdAt;        // 생성 타임스탬프
}

struct Donation {
    address donor;            // 기부자 주소
    uint256 campaignId;       // 캠페인 ID
    uint256 amount;           // 기부 금액
    uint256 timestamp;        // 기부 시간
    string message;           // 기부 메시지
}
```

**3) 핵심 함수**

| 함수명 | 가시성 | 기능 | 보안 메커니즘 |
|--------|--------|------|--------------|
| `createCampaign()` | external | 캠페인 생성 | `onlyOwner` |
| `donate()` | external payable | 기부 실행 | `nonReentrant`, `whenNotPaused` |
| `withdrawFunds()` | external | 기부금 인출 | `nonReentrant`, beneficiary 검증 |
| `setCampaignStatus()` | external | 캠페인 활성화 | `onlyOwner` |
| `pause()` / `unpause()` | external | 긴급 중지 | `onlyOwner` |

#### 기부 함수 상세 분석 (donate)

**코드**: `blockchain/contracts/DonationVillage.sol:123-155`

```solidity
function donate(uint256 _campaignId, string memory _message)
    external
    payable
    nonReentrant
    whenNotPaused
{
    // 1. 입력 검증
    require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
    require(msg.value > 0, "Donation amount must be greater than 0");

    Campaign storage campaign = campaigns[_campaignId];
    require(campaign.active, "Campaign is not active");

    // 2. 기부 기록 저장
    donationCount++;
    donations[donationCount] = Donation({
        donor: msg.sender,
        campaignId: _campaignId,
        amount: msg.value,
        timestamp: block.timestamp,
        message: _message
    });

    // 3. 상태 업데이트
    campaign.currentAmount += msg.value;
    userDonations[msg.sender].push(donationCount);
    campaignDonations[_campaignId].push(donationCount);
    totalDonatedByUser[msg.sender] += msg.value;

    // 4. 이벤트 발생
    emit DonationMade(donationCount, _campaignId, msg.sender, msg.value, block.timestamp);
}
```

**보안 메커니즘**:
- `nonReentrant`: 재진입 공격 방지
- `whenNotPaused`: 긴급 중지 상황 대응
- `require` 검증: 유효성 검사 (가스비 절약)
- `msg.value` 자동 송금: 컨트랙트가 ETH 보관

---

### 2.2 DonationLedger.sol - 기부 기록 전용 컨트랙트

**파일 위치**: `blockchain/contracts/DonationLedger.sol`

#### DonationVillage와의 차이점

| 기능 | DonationVillage | DonationLedger |
|------|----------------|----------------|
| **목적** | 기부 + 게이미피케이션 | 순수 기부 기록 관리 |
| **ETH 보관** | 컨트랙트 보관 → 수혜자 인출 | 즉시 단체 주소로 전송 |
| **ID 타입** | `uint256` (자동 증가) | `string` (UUID 호환) |
| **OpenZeppelin** | 사용 (Ownable, ReentrancyGuard) | 미사용 (단순 구조) |
| **DID 지원** | X | O (did:pkh 형식) |

#### 즉시 전송 메커니즘

**코드**: `blockchain/contracts/DonationLedger.sol:146-148`

```solidity
// 단체에 기부금 즉시 전송
(bool success, ) = campaigns[_campaignId].organization.call{value: msg.value}("");
require(success, "Transfer to organization failed");
```

**장점**:
- 중간 보관 없이 투명성 확보
- 단체가 즉시 사용 가능
- 컨트랙트 해킹 시 자금 손실 최소화

---

## 🔐 3. 구현된 보안 메커니즘

### 3.1 재진입 공격 방지 (Reentrancy Attack)

**적용 위치**: `DonationVillage.sol:123, 160`

```solidity
function donate(...) external payable nonReentrant { ... }
function withdrawFunds(...) external nonReentrant { ... }
```

**메커니즘**:
- OpenZeppelin의 `ReentrancyGuard` 상속
- 내부적으로 `_status` 변수를 사용하여 재진입 감지
- 동일 트랜잭션 내 재호출 시 revert

**방어하는 공격 시나리오**:
```
악의적 컨트랙트 → donate() 호출
  → 기부 이벤트 발생
    → fallback() 함수에서 다시 donate() 호출 (재진입)
      → ❌ ReentrancyGuard가 차단
```

### 3.2 접근 제어 (Access Control)

**적용 함수**:
```solidity
function createCampaign(...) external onlyOwner { ... }
function setCampaignStatus(...) external onlyOwner { ... }
function pause() external onlyOwner { ... }
```

**메커니즘**:
- OpenZeppelin `Ownable` 사용
- `onlyOwner` modifier로 관리자만 실행 가능
- 소유권 이전 가능 (`transferOwnership()`)

### 3.3 긴급 중지 (Circuit Breaker)

**적용 위치**: `DonationVillage.sol:196-205`

```solidity
function pause() external onlyOwner {
    _pause();
}

function donate(...) external whenNotPaused { ... }
```

**시나리오**:
1. 해킹 의심 상황 발견
2. 관리자가 `pause()` 호출
3. 모든 `whenNotPaused` 함수 정지
4. 문제 해결 후 `unpause()` 재개

### 3.4 입력 검증 (Input Validation)

**모든 함수에 적용된 require 검증**:

```solidity
require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
require(msg.value > 0, "Donation amount must be greater than 0");
require(_beneficiary != address(0), "Invalid beneficiary address");
require(campaign.active, "Campaign is not active");
```

**가스비 최적화 효과**:
- 실패할 트랜잭션을 조기 차단
- 불필요한 상태 변경 방지

### 3.5 Checks-Effects-Interactions 패턴

**withdrawFunds 함수 예시**:

```solidity
function withdrawFunds(uint256 _campaignId) external nonReentrant {
    // 1. Checks (검증)
    require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
    Campaign storage campaign = campaigns[_campaignId];
    require(msg.sender == campaign.beneficiary, "Only beneficiary can withdraw");
    require(campaign.currentAmount > 0, "No funds to withdraw");

    // 2. Effects (상태 변경)
    uint256 amount = campaign.currentAmount;
    campaign.currentAmount = 0;  // ⭐ 외부 호출 전에 상태 변경

    // 3. Interactions (외부 호출)
    (bool success, ) = campaign.beneficiary.call{value: amount}("");
    require(success, "Transfer failed");

    emit FundsWithdrawn(_campaignId, campaign.beneficiary, amount);
}
```

---

## 🔄 4. 블록체인-애플리케이션 통합

### 4.1 ethers.js를 통한 컨트랙트 상호작용

**파일 위치**: `frontend/src/lib/contract.ts`

#### 컨트랙트 ABI 정의

```typescript
export const DONATION_VILLAGE_ABI = [
  // 읽기 함수 (view)
  "function getCampaign(uint256 campaignId) external view returns (...)",
  "function campaignCount() external view returns (uint256)",

  // 쓰기 함수 (트랜잭션)
  "function donate(uint256 campaignId, string message) external payable",

  // 이벤트
  "event DonationMade(uint256 indexed donationId, uint256 indexed campaignId, ...)"
];
```

#### 기부 트랜잭션 생성 프로세스

```typescript
// 1. Provider 연결 (Arbitrum Sepolia)
const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");

// 2. 사용자 지갑 연결 (MetaMask or 임베디드)
const signer = await provider.getSigner();

// 3. 컨트랙트 인스턴스 생성
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  DONATION_VILLAGE_ABI,
  signer
);

// 4. KRW → ETH 변환
const ethAmount = krwToEth(10000); // 10,000원 = 0.00333... ETH

// 5. 기부 트랜잭션 전송
const tx = await contract.donate(
  campaignId,
  "응원합니다!",
  { value: ethers.parseEther(ethAmount) }
);

// 6. 트랜잭션 대기
const receipt = await tx.wait();

// 7. 트랜잭션 해시 반환
console.log("TX Hash:", receipt.hash);
// → Arbiscan에서 확인 가능: https://sepolia.arbiscan.io/tx/{hash}
```

### 4.2 이벤트 리스닝 (Event Listening)

```typescript
// 컨트랙트 이벤트 구독
contract.on("DonationMade", (donationId, campaignId, donor, amount, timestamp) => {
  console.log(`새 기부: ${ethers.formatEther(amount)} ETH`);
  // 프론트엔드 UI 자동 업데이트
});
```

### 4.3 듀얼 스토리지 전략

| 데이터 | Supabase (중앙 DB) | Blockchain (탈중앙) |
|--------|-------------------|-------------------|
| **캠페인 정보** | ✅ 빠른 CRUD | ✅ 불변 검증 |
| **기부 내역** | ✅ 검색/필터링 | ✅ 투명성 증명 |
| **트랜잭션 해시** | ✅ 저장 | ✅ Arbiscan 조회 |
| **사용자 정보** | ✅ 개인정보 | ❌ (프라이버시) |
| **포인트/뱁지** | ✅ 실시간 업데이트 | ❌ (비용 효율) |

**이유**:
- 블록체인: 모든 데이터 저장 시 높은 가스비
- Supabase: 빠른 조회 및 게이미피케이션 데이터 관리
- **하이브리드**: 기부 핵심 데이터만 블록체인 기록

---

## 🎯 5. 핵심 메커니즘

### 5.1 투명성 보장 메커니즘

**1) 불변성 (Immutability)**
```
기부 데이터 → 블록체인 저장 → 영구 보존 → 누구도 수정 불가
```

**2) 검증 가능성 (Verifiability)**
```
트랜잭션 해시 → Arbiscan 조회 → 실제 기록 확인
  - From: 기부자 주소
  - To: 컨트랙트 주소
  - Value: 기부 금액
  - Status: 성공/실패
  - Block Number: 블록 번호
  - Timestamp: 기록 시간
```

**3) 공개성 (Transparency)**
- 모든 트랜잭션 공개: https://sepolia.arbiscan.io/address/0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1
- 누구나 컨트랙트 코드 확인 가능
- Event 로그로 실시간 추적

### 5.2 DID (Decentralized Identity) 구현

**형식**:
```
did:pkh:eip155:421614:{wallet_address}
```

**구성 요소**:
- `did`: Decentralized Identifier
- `pkh`: Public Key Hash
- `eip155`: 이더리움 네임스페이스
- `421614`: Arbitrum Sepolia Chain ID
- `{wallet_address}`: 사용자 지갑 주소

**활용**:
```typescript
// 기부 증명서 발급 시
const did = `did:pkh:eip155:421614:${walletAddress}`;
// → IPFS에 저장 또는 Verifiable Credential 발급
```

### 5.3 가스비 최적화 전략

**1) Layer 2 사용 (Arbitrum)**
- 메인넷 대비 10~100배 저렴한 가스비
- 평균 기부 트랜잭션: ~$0.01 (메인넷: $5~$50)

**2) 효율적인 Storage 패턴**

```solidity
// ❌ 비효율: 배열 전체 반환
function getAllDonations() external view returns (Donation[] memory) { ... }

// ✅ 효율: 인덱스만 반환
function getUserDonations(address _user) external view returns (uint256[] memory) {
    return userDonations[_user];
}
```

**3) Mapping 사용**
```solidity
// ✅ O(1) 조회 시간
mapping(uint256 => Campaign) public campaigns;
mapping(address => uint256[]) public userDonations;
```

---

## 📊 6. 구현된 기능 및 데이터 흐름

### 6.1 기부 프로세스 전체 플로우

```
[사용자]
  ↓ 1. 캠페인 선택 및 금액 입력 (10,000 KRW)

[프론트엔드]
  ↓ 2. KRW → ETH 변환 (0.00333 ETH)
  ↓ 3. MetaMask 서명 요청

[MetaMask]
  ↓ 4. 트랜잭션 서명 (Private Key)

[Arbitrum Sepolia L2]
  ↓ 5. donate() 함수 실행
  ↓ 6. 가스비 차감 (~0.0001 ETH)
  ↓ 7. 블록에 기록 (2초 이내)
  ↓ 8. DonationMade 이벤트 발생

[스마트 컨트랙트]
  ↓ 9. currentAmount += 0.00333 ETH
  ↓ 10. donations 매핑에 기록 저장

[프론트엔드]
  ↓ 11. 트랜잭션 해시 수신
  ↓ 12. Supabase에 기부 내역 저장
  ↓ 13. 포인트 지급 (10,000 KRW × 10 = 100,000 포인트)

[Arbiscan]
  ✅ 14. 트랜잭션 실시간 조회 가능
```

### 6.2 캠페인 생성 프로세스

```solidity
// 관리자가 호출 (onlyOwner)
createCampaign(
    "숲속동물보호센터",
    "겨울나기 따뜻한 보금자리 만들기",
    "추운 겨울을 나는 유기동물들에게...",
    "동물",
    10 ether,  // 목표 금액
    0x123...  // 수혜자 지갑 주소
);

// 블록체인에 기록:
// - campaignId: 1 (자동 증가)
// - beneficiary: 0x123... (수혜자 주소)
// - active: true
// - createdAt: block.timestamp
```

### 6.3 기부금 인출 프로세스

```solidity
// 수혜자가 호출
withdrawFunds(campaignId);

// 검증:
require(msg.sender == campaign.beneficiary);  // 수혜자만 가능
require(campaign.currentAmount > 0);          // 잔액 확인

// 실행:
campaign.currentAmount = 0;  // ⭐ 상태 먼저 변경
(bool success, ) = beneficiary.call{value: amount}("");  // ETH 전송

// 이벤트:
emit FundsWithdrawn(campaignId, beneficiary, amount);
```

---

## 🧪 7. 테스트 및 검증

### 7.1 실제 트랜잭션 확인

**컨트랙트 주소**: `0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1`

**Arbiscan 조회**:
- 전체 트랜잭션: https://sepolia.arbiscan.io/address/0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1#internaltx
- 컨트랙트 코드: 소스 코드 검증 완료
- 이벤트 로그: DonationMade 이벤트 실시간 추적

### 7.2 보안 검증

**OpenZeppelin Contracts 사용**:
- ✅ Ownable.sol (v5.0.0)
- ✅ ReentrancyGuard.sol (v5.0.0)
- ✅ Pausable.sol (v5.0.0)
- 모든 컨트랙트는 업계 표준 감사 완료

---

## 📈 8. 성능 및 확장성

### 8.1 트랜잭션 성능

| 메트릭 | Arbitrum L2 | Ethereum 메인넷 |
|--------|-------------|----------------|
| **컨펌 시간** | 2초 | 15초 |
| **가스비** | $0.01 | $5~$50 |
| **TPS** | 4,000+ | 15~30 |

### 8.2 Storage 효율성

```solidity
// 각 기부 기록: ~200 바이트
struct Donation {
    address donor;       // 20 bytes
    uint256 campaignId;  // 32 bytes
    uint256 amount;      // 32 bytes
    uint256 timestamp;   // 32 bytes
    string message;      // 가변 (평균 50 bytes)
}

// 1,000건 기부 = ~200 KB
// Arbitrum L2 저장 비용: 매우 저렴
```

---

## 🎓 9. 핵심 기술 요약

### 사용된 블록체인 기술

1. **Solidity 스마트 컨트랙트**
   - Ownable, ReentrancyGuard, Pausable 패턴
   - Struct 기반 데이터 모델링
   - Event 기반 로깅

2. **Layer 2 Scaling**
   - Arbitrum Rollup 사용
   - 낮은 가스비 + 빠른 속도

3. **ethers.js 통합**
   - Provider-Signer 패턴
   - Contract Instance 생성
   - 트랜잭션 서명 및 전송

4. **보안 메커니즘**
   - Reentrancy Guard
   - Access Control
   - Circuit Breaker
   - Checks-Effects-Interactions 패턴

5. **DID 구현**
   - did:pkh 표준
   - 지갑 주소 기반 신원 증명

### 구현된 핵심 메커니즘

- ✅ **투명성**: 모든 기부 블록체인 기록
- ✅ **불변성**: 영구 보존, 수정 불가
- ✅ **검증 가능성**: Arbiscan 실시간 조회
- ✅ **보안**: OpenZeppelin 표준 적용
- ✅ **효율성**: L2 사용으로 저비용 운영
- ✅ **확장성**: 수천 건 트랜잭션 처리 가능

---

## 🔗 참조 링크

- **배포된 앱**: https://frontend-5744l5ppb-yenas-projects-4e17e81d.vercel.app
- **스마트 컨트랙트**: https://sepolia.arbiscan.io/address/0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1
- **OpenZeppelin**: https://docs.openzeppelin.com/contracts/
- **Arbitrum**: https://docs.arbitrum.io/