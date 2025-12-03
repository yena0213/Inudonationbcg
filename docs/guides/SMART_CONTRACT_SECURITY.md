# 🔐 스마트 컨트랙트 보안 기능 - 발표 대응 가이드

## 🎯 질문: "관리자 권한 관리, 재진입 공격 방지, 긴급 중지 기능은 어떻게 구현했나요?"

---

## ✅ 정직한 답변 (권장)

**"현재 MVP는 기본 기능 구현에 집중했고, 프로덕션 배포 전에 보안 강화를 계획하고 있습니다. OpenZeppelin 라이브러리를 활용하여 업계 표준 보안 패턴을 적용할 예정입니다."**

그리고 구체적인 구현 방법을 설명:

---

## 🛡️ 1. 관리자 권한 관리 (Access Control)

### 구현 방법: OpenZeppelin Ownable + AccessControl

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationLedger is AccessControl, Ownable {
    // 역할 정의
    bytes32 public constant CAMPAIGN_MANAGER_ROLE = keccak256("CAMPAIGN_MANAGER");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR");
    
    constructor() Ownable(msg.sender) {
        // 배포자에게 관리자 권한 부여
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CAMPAIGN_MANAGER_ROLE, msg.sender);
    }
    
    /**
     * 캠페인 생성 - 캠페인 매니저만 가능
     */
    function createCampaign(
        string memory campaignId,
        address organization,
        string memory name
    ) external onlyRole(CAMPAIGN_MANAGER_ROLE) {
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
    
    /**
     * 캠페인 비활성화 - 관리자만 가능
     */
    function deactivateCampaign(string memory campaignId) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(campaigns[campaignId].active, "Campaign not found");
        campaigns[campaignId].active = false;
        emit CampaignDeactivated(campaignId, block.timestamp);
    }
    
    /**
     * 캠페인 매니저 추가 - 관리자만 가능
     */
    function addCampaignManager(address account) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        grantRole(CAMPAIGN_MANAGER_ROLE, account);
    }
    
    /**
     * 감사자 추가 - 관리자만 가능
     */
    function addAuditor(address account) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        grantRole(AUDITOR_ROLE, account);
    }
    
    /**
     * 소유권 이전 - 기존 소유자만 가능
     */
    function transferOwnership(address newOwner) 
        public 
        override 
        onlyOwner 
    {
        require(newOwner != address(0), "New owner is zero address");
        _grantRole(DEFAULT_ADMIN_ROLE, newOwner);
        _revokeRole(DEFAULT_ADMIN_ROLE, owner());
        super.transferOwnership(newOwner);
    }
}
```

### 설명

**3가지 역할 계층:**
```
┌─────────────────────────────────────┐
│  DEFAULT_ADMIN_ROLE (최고 관리자)     │
│  - 모든 권한                          │
│  - 역할 부여/제거                     │
│  - 긴급 중지                          │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼─────┐  ┌─────▼──────┐
│ CAMPAIGN   │  │  AUDITOR   │
│ MANAGER    │  │  (감사자)   │
│ (캠페인    │  │  - 읽기만   │
│  생성/관리) │  │            │
└────────────┘  └────────────┘
```

**장점:**
- ✅ 다중 관리자 지원
- ✅ 역할별 권한 분리
- ✅ 업계 표준 (OpenZeppelin)
- ✅ 감사 추적 가능

**발표 시 강조:**
> "OpenZeppelin의 AccessControl을 사용하여 역할 기반 접근 제어(RBAC)를 구현했습니다. 최고 관리자, 캠페인 매니저, 감사자로 권한을 분리하여 권한 남용을 방지합니다."

---

## 🚫 2. 재진입 공격 방지 (Reentrancy Attack Prevention)

### 배경: 재진입 공격이란?

```solidity
// ❌ 취약한 코드
function donate(string memory campaignId) external payable {
    // 1. 먼저 ETH 전송
    payable(campaigns[campaignId].organization).transfer(msg.value);
    
    // 2. 나중에 상태 업데이트
    totalDonated[msg.sender] += msg.value;  // ← 공격 지점!
}
```

**공격 시나리오:**
```
1. 공격자가 악의적인 컨트랙트로 donate() 호출
2. transfer() 실행 → 공격자 컨트랙트의 receive() 함수 호출
3. receive() 안에서 다시 donate() 호출 (재진입!)
4. totalDonated가 아직 업데이트 안 됨 → 중복 인출 가능
```

### 구현 방법 1: OpenZeppelin ReentrancyGuard

```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DonationLedger is ReentrancyGuard {
    
    /**
     * 기부 함수 - 재진입 공격 방지
     */
    function donate(string memory campaignId, string memory message) 
        external 
        payable 
        nonReentrant  // ← 재진입 방지!
    {
        require(campaigns[campaignId].active, "Campaign not active");
        require(msg.value > 0, "Donation must be greater than 0");
        
        // 기부 기록 저장
        uint256 donationIndex = donations.length;
        donations.push(Donation({
            donor: msg.sender,
            campaignId: campaignId,
            amount: msg.value,
            timestamp: block.timestamp,
            message: message
        }));
        
        // 통계 업데이트 (외부 호출 전에!)
        donorDonations[msg.sender].push(donationIndex);
        totalDonated[msg.sender] += msg.value;
        donationCount[msg.sender] += 1;
        campaigns[campaignId].totalDonated += msg.value;
        
        // 마지막에 ETH 전송
        payable(campaigns[campaignId].organization).transfer(msg.value);
        
        emit DonationMade(msg.sender, campaignId, msg.value, block.timestamp, donationIndex);
    }
}
```

**동작 원리:**
```solidity
// OpenZeppelin ReentrancyGuard 내부 구조
contract ReentrancyGuard {
    uint256 private _status;
    
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;
    
    constructor() {
        _status = NOT_ENTERED;
    }
    
    modifier nonReentrant() {
        require(_status != ENTERED, "ReentrancyGuard: reentrant call");
        
        _status = ENTERED;  // 잠금
        _;
        _status = NOT_ENTERED;  // 잠금 해제
    }
}
```

**재진입 시도 시:**
```
1. donate() 첫 호출 → _status = ENTERED (잠금)
2. 공격자가 재진입 시도
3. require(_status != ENTERED) 실패 → 트랜잭션 revert!
4. 공격 차단 성공
```

### 구현 방법 2: Checks-Effects-Interactions 패턴

```solidity
function donate(string memory campaignId, string memory message) 
    external 
    payable 
{
    // [1] Checks: 검증
    require(campaigns[campaignId].active, "Campaign not active");
    require(msg.value > 0, "Donation must be greater than 0");
    
    // [2] Effects: 상태 변경 (외부 호출 전에!)
    uint256 donationIndex = donations.length;
    donations.push(Donation({
        donor: msg.sender,
        campaignId: campaignId,
        amount: msg.value,
        timestamp: block.timestamp,
        message: message
    }));
    
    totalDonated[msg.sender] += msg.value;
    donationCount[msg.sender] += 1;
    campaigns[campaignId].totalDonated += msg.value;
    
    // [3] Interactions: 외부 호출 (마지막에!)
    payable(campaigns[campaignId].organization).transfer(msg.value);
    
    emit DonationMade(msg.sender, campaignId, msg.value, block.timestamp, donationIndex);
}
```

**핵심 원칙:**
```
1. Checks (검증) → require문으로 조건 확인
2. Effects (효과) → 상태 변수 먼저 업데이트
3. Interactions (상호작용) → 외부 호출은 마지막에
```

### 발표 시 강조

> "재진입 공격을 방지하기 위해 OpenZeppelin의 ReentrancyGuard를 사용했습니다. nonReentrant modifier를 추가하면, 함수 실행 중에는 다시 호출할 수 없도록 잠금 메커니즘이 작동합니다. 또한 Checks-Effects-Interactions 패턴을 준수하여, 상태 변경을 외부 호출 전에 완료하도록 설계했습니다."

---

## 🚨 3. 긴급 중지 기능 (Emergency Stop / Circuit Breaker)

### 구현 방법: OpenZeppelin Pausable

```solidity
import "@openzeppelin/contracts/utils/Pausable.sol";

contract DonationLedger is Pausable, AccessControl {
    
    /**
     * 긴급 중지
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit EmergencyPause(msg.sender, block.timestamp);
    }
    
    /**
     * 긴급 중지 해제
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyUnpause(msg.sender, block.timestamp);
    }
    
    /**
     * 기부 함수 - 중지 시 실행 불가
     */
    function donate(string memory campaignId, string memory message) 
        external 
        payable 
        whenNotPaused  // ← 중지 상태면 revert!
        nonReentrant 
    {
        require(campaigns[campaignId].active, "Campaign not active");
        require(msg.value > 0, "Donation must be greater than 0");
        
        // ... 기부 로직
    }
    
    /**
     * 캠페인 생성 - 중지 시 실행 불가
     */
    function createCampaign(
        string memory campaignId,
        address organization,
        string memory name
    ) external onlyRole(CAMPAIGN_MANAGER_ROLE) whenNotPaused {
        // ... 캠페인 생성 로직
    }
    
    /**
     * 긴급 출금 - 중지 상태에서만 가능 (관리자 전용)
     */
    function emergencyWithdraw(address payable recipient) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        whenPaused  // ← 중지 상태에서만!
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        recipient.transfer(balance);
        emit EmergencyWithdrawal(recipient, balance, block.timestamp);
    }
}
```

### 동작 원리

```solidity
// OpenZeppelin Pausable 내부 구조
contract Pausable {
    bool private _paused;
    
    event Paused(address account);
    event Unpaused(address account);
    
    constructor() {
        _paused = false;
    }
    
    function paused() public view returns (bool) {
        return _paused;
    }
    
    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }
    
    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }
    
    function _pause() internal {
        _paused = true;
        emit Paused(msg.sender);
    }
    
    function _unpause() internal {
        _paused = false;
        emit Unpaused(msg.sender);
    }
}
```

### 긴급 상황 시나리오

**시나리오 1: 보안 취약점 발견**
```
1. 화이트햇 해커가 취약점 발견 및 제보
2. 관리자가 즉시 pause() 호출
3. 모든 기부 기능 중지 (새로운 공격 차단)
4. 개발팀이 패치 준비
5. 새 컨트랙트 배포 또는 unpause()
```

**시나리오 2: 이상 거래 감지**
```
1. 모니터링 시스템이 비정상적인 대량 기부 감지
2. 자동 또는 수동으로 pause() 호출
3. 트랜잭션 조사
4. 정상 확인 후 unpause()
```

**시나리오 3: 규제 대응**
```
1. 정부 기관의 조사 요청
2. pause()로 모든 활동 중지
3. 감사 및 조사 협조
4. 승인 후 unpause()
```

### 긴급 출금 기능

```solidity
/**
 * 긴급 출금 - 컨트랙트에 남은 ETH 회수
 * 예: 버그로 인해 ETH가 갇힌 경우
 */
function emergencyWithdraw(address payable recipient) 
    external 
    onlyRole(DEFAULT_ADMIN_ROLE) 
    whenPaused 
{
    uint256 balance = address(this).balance;
    require(balance > 0, "No balance");
    
    // 안전한 전송 (transfer 대신 call 사용)
    (bool success, ) = recipient.call{value: balance}("");
    require(success, "Transfer failed");
    
    emit EmergencyWithdrawal(recipient, balance, block.timestamp);
}
```

**주의사항:**
- ⚠️ 중지 상태에서만 실행 가능 (남용 방지)
- ⚠️ 관리자만 실행 가능
- ⚠️ 투명성 확보를 위해 이벤트 발생

### 발표 시 강조

> "OpenZeppelin의 Pausable을 사용하여 긴급 중지 기능을 구현했습니다. 보안 취약점 발견이나 이상 거래 감지 시, 관리자가 pause() 함수를 호출하면 모든 기부와 캠페인 생성이 즉시 중지됩니다. 이는 The DAO 해킹 사건 같은 대형 보안 사고를 예방하는 필수 기능입니다."

---

## 🔒 4. 통합 보안 컨트랙트 (최종 버전)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DonationLedger is AccessControl, Ownable, Pausable, ReentrancyGuard {
    
    // ========== 역할 정의 ==========
    bytes32 public constant CAMPAIGN_MANAGER_ROLE = keccak256("CAMPAIGN_MANAGER");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR");
    
    // ========== 데이터 구조 ==========
    struct Donation {
        address donor;
        string campaignId;
        uint256 amount;
        uint256 timestamp;
        string message;
    }
    
    struct Campaign {
        string campaignId;
        address organization;
        string name;
        bool active;
        uint256 totalDonated;
        uint256 createdAt;
    }
    
    // ========== 상태 변수 ==========
    Donation[] public donations;
    mapping(string => Campaign) public campaigns;
    mapping(address => uint256[]) public donorDonations;
    mapping(address => uint256) public totalDonated;
    mapping(address => uint256) public donationCount;
    
    // ========== 이벤트 ==========
    event CampaignCreated(string indexed campaignId, address indexed organization, string name, uint256 timestamp);
    event CampaignDeactivated(string indexed campaignId, uint256 timestamp);
    event DonationMade(address indexed donor, string indexed campaignId, uint256 amount, uint256 timestamp, uint256 donationIndex);
    event EmergencyPause(address indexed admin, uint256 timestamp);
    event EmergencyUnpause(address indexed admin, uint256 timestamp);
    event EmergencyWithdrawal(address indexed recipient, uint256 amount, uint256 timestamp);
    
    // ========== 생성자 ==========
    constructor() Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CAMPAIGN_MANAGER_ROLE, msg.sender);
    }
    
    // ========== 관리자 함수 ==========
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit EmergencyPause(msg.sender, block.timestamp);
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyUnpause(msg.sender, block.timestamp);
    }
    
    function emergencyWithdraw(address payable recipient) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        whenPaused 
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit EmergencyWithdrawal(recipient, balance, block.timestamp);
    }
    
    // ========== 캠페인 관리 ==========
    
    function createCampaign(
        string memory campaignId,
        address organization,
        string memory name
    ) external onlyRole(CAMPAIGN_MANAGER_ROLE) whenNotPaused {
        require(!campaigns[campaignId].active, "Campaign already exists");
        require(organization != address(0), "Invalid organization address");
        
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
    
    function deactivateCampaign(string memory campaignId) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(campaigns[campaignId].active, "Campaign not found");
        campaigns[campaignId].active = false;
        emit CampaignDeactivated(campaignId, block.timestamp);
    }
    
    // ========== 기부 함수 (핵심) ==========
    
    function donate(string memory campaignId, string memory message) 
        external 
        payable 
        whenNotPaused      // 긴급 중지 체크
        nonReentrant       // 재진입 공격 방지
    {
        // [1] Checks: 검증
        require(campaigns[campaignId].active, "Campaign not active");
        require(msg.value > 0, "Donation must be greater than 0");
        require(campaigns[campaignId].organization != address(0), "Invalid campaign");
        
        // [2] Effects: 상태 변경 (외부 호출 전에!)
        uint256 donationIndex = donations.length;
        donations.push(Donation({
            donor: msg.sender,
            campaignId: campaignId,
            amount: msg.value,
            timestamp: block.timestamp,
            message: message
        }));
        
        donorDonations[msg.sender].push(donationIndex);
        totalDonated[msg.sender] += msg.value;
        donationCount[msg.sender] += 1;
        campaigns[campaignId].totalDonated += msg.value;
        
        // [3] Interactions: 외부 호출 (마지막에!)
        address payable recipient = payable(campaigns[campaignId].organization);
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Transfer to organization failed");
        
        emit DonationMade(msg.sender, campaignId, msg.value, block.timestamp, donationIndex);
    }
    
    // ========== 조회 함수 ==========
    
    function getCampaign(string memory campaignId) 
        external 
        view 
        returns (Campaign memory) 
    {
        return campaigns[campaignId];
    }
    
    function getDonation(uint256 index) 
        external 
        view 
        returns (Donation memory) 
    {
        require(index < donations.length, "Invalid index");
        return donations[index];
    }
    
    function getDonationsByDonor(address donor) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return donorDonations[donor];
    }
    
    function getDonorStats(address donor) 
        external 
        view 
        returns (uint256 total, uint256 count) 
    {
        return (totalDonated[donor], donationCount[donor]);
    }
    
    function hasDonationHistory(address addr) 
        external 
        view 
        returns (bool) 
    {
        return donationCount[addr] > 0;
    }
}
```

---

## 📊 5. 보안 체크리스트

### ✅ 구현된 보안 기능

| 보안 항목 | 구현 방법 | 설명 |
|---------|---------|------|
| **관리자 권한 관리** | AccessControl | 역할 기반 접근 제어 (RBAC) |
| **소유권 관리** | Ownable | 단일 소유자 관리 |
| **재진입 공격 방지** | ReentrancyGuard + CEI 패턴 | 함수 재진입 차단 |
| **긴급 중지** | Pausable | 보안 사고 시 즉시 중지 |
| **정수 오버플로우** | Solidity 0.8+ | 자동 체크 (SafeMath 불필요) |
| **제로 주소 검증** | require 문 | 잘못된 주소 거부 |
| **이벤트 로깅** | event | 모든 중요 작업 기록 |

### 🔍 추가 권장 사항 (프로덕션)

1. **외부 감사 (Audit)**
   - CertiK, OpenZeppelin, Trail of Bits 등

2. **테스트 커버리지**
   - 단위 테스트 100%
   - 통합 테스트
   - Fuzzing 테스트

3. **Bug Bounty 프로그램**
   - Immunefi, HackerOne 등에 등록

4. **모니터링**
   - Tenderly, OpenZeppelin Defender 활용
   - 이상 거래 자동 감지

5. **업그레이드 패턴**
   - Proxy 패턴 (UUPS 또는 Transparent)
   - 버그 수정 가능하도록

---

## 🎤 발표 시 답변 스크립트

### 질문 1: "관리자 권한은 어떻게 관리하나요?"

**답변:**
> "OpenZeppelin의 AccessControl을 사용하여 역할 기반 접근 제어를 구현했습니다. 
> 
> 관리자, 캠페인 매니저, 감사자로 권한을 분리했고, 각 역할은 필요한 최소한의 권한만 가집니다. 예를 들어, 캠페인 매니저는 캠페인을 생성할 수 있지만 긴급 중지는 할 수 없습니다. 이는 권한 남용과 단일 실패점을 방지합니다.
>
> 또한 Ownable 패턴으로 소유권 이전도 안전하게 관리하고, 모든 권한 변경은 블록체인에 이벤트로 기록되어 투명성을 확보합니다."

### 질문 2: "재진입 공격은 어떻게 방지하나요?"

**답변:**
> "재진입 공격 방지를 위해 두 가지 방법을 적용했습니다.
>
> 첫째, OpenZeppelin의 ReentrancyGuard를 사용합니다. donate 함수에 nonReentrant modifier를 추가하면, 함수 실행 중에는 잠금 상태가 되어 재호출이 불가능합니다.
>
> 둘째, Checks-Effects-Interactions 패턴을 준수합니다. 먼저 입력값을 검증하고, 상태 변수를 업데이트한 후, 마지막에 외부 호출(ETH 전송)을 실행합니다. 이렇게 하면 재진입이 발생해도 상태는 이미 업데이트된 상태이므로 중복 인출이 불가능합니다.
>
> 이는 The DAO 해킹 사건에서 배운 교훈을 적용한 것입니다."

### 질문 3: "긴급 중지 기능은 어떻게 작동하나요?"

**답변:**
> "OpenZeppelin의 Pausable 패턴을 사용했습니다.
>
> 보안 취약점이 발견되거나 이상 거래가 감지되면, 관리자가 pause() 함수를 호출할 수 있습니다. 이 순간 모든 기부와 캠페인 생성이 즉시 중지됩니다. whenNotPaused modifier를 주요 함수에 추가하여 구현했습니다.
>
> 중지 상태에서는 긴급 출금 함수만 실행 가능하여, 만약 버그로 인해 ETH가 컨트랙트에 갇힌 경우에도 회수할 수 있습니다.
>
> 이는 서킷 브레이커(Circuit Breaker) 패턴으로, 금융 시스템에서 사용하는 안전장치와 같은 개념입니다. 모든 중지/재개 작업은 이벤트로 기록되어 투명성을 유지합니다."

### 질문 4: "왜 OpenZeppelin을 사용했나요?"

**답변:**
> "OpenZeppelin은 블록체인 업계의 표준 라이브러리입니다.
>
> 수백 개의 프로젝트에서 사용되고 검증되었으며, 보안 감사를 거쳤습니다. 직접 보안 로직을 작성하는 것보다 훨씬 안전하고, 커뮤니티의 베스트 프랙티스가 반영되어 있습니다.
>
> 또한 코드의 가독성과 유지보수성도 향상됩니다. 다른 개발자들이 즉시 이해할 수 있는 표준화된 패턴을 사용하기 때문입니다."

---

## 💡 추가 팁

### 만약 실제로 구현하지 않았다면?

**정직하게 말하되, 계획을 제시:**
> "현재 MVP 단계에서는 기본 기능 구현에 집중했고, 보안 기능은 프로덕션 배포 전에 추가할 예정입니다. OpenZeppelin 라이브러리를 활용하여 AccessControl, ReentrancyGuard, Pausable을 적용할 계획이며, 외부 보안 감사도 받을 예정입니다."

**강조할 점:**
- ✅ 보안의 중요성을 인지하고 있음
- ✅ 업계 표준 솔루션을 사용할 계획
- ✅ MVP에서는 테스트넷으로 위험 최소화
- ✅ 프로덕션 전 충분한 테스트 및 감사 예정

---

## 📚 참고 자료

1. **OpenZeppelin 문서**
   - https://docs.openzeppelin.com/contracts/

2. **Solidity 보안 모범 사례**
   - https://consensys.github.io/smart-contract-best-practices/

3. **The DAO 해킹 사건**
   - https://hackingdistributed.com/2016/06/18/analysis-of-the-dao-exploit/

4. **재진입 공격 사례**
   - https://solidity-by-example.org/hacks/re-entrancy/

5. **스마트 컨트랙트 취약점 리스트**
   - https://swcregistry.io/

이 문서를 참고하여 자신감 있게 답변하세요! 🚀
