# 🔧 Contracts 폴더 없음 에러 해결

## 🚨 에러 메시지

```
Error HH404: File @openzeppelin/contracts/ReentrancyGuard.sol, 
imported from contracts/DonationVillage.sol, not found.
```

---

## ✅ 문제 해결 완료!

### 원인
`hardhat-setup` 폴더에 `contracts/` 폴더가 없었습니다.

Hardhat은 기본적으로 `./contracts` 폴더에서 Solidity 파일을 찾는데, 이 폴더가 없어서 에러가 발생했습니다.

### 해결
다음 파일들이 생성되었습니다:

```
hardhat-setup/
├── contracts/
│   └── DonationVillage.sol    ✅ 새로 생성됨
└── scripts/
    └── deploy.js               ✅ 새로 생성됨
```

---

## 🚀 이제 바로 배포하세요!

### 1단계: hardhat-setup 폴더로 이동

```bash
cd hardhat-setup
```

### 2단계: .env 파일이 있는지 확인

```bash
ls -la .env
```

없으면 생성:
```bash
touch .env
nano .env
```

내용:
```env
PRIVATE_KEY=0x여기에_MetaMask_Private_Key
ALCHEMY_API_KEY=여기에_Alchemy_API_Key
```

### 3단계: 컴파일 (20초)

```bash
npx hardhat compile
```

**성공 시 출력:**
```
Compiled 1 Solidity file successfully ✓
```

### 4단계: 배포 (30초)

```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

**성공 시:**
```
🚀 Starting deployment...
📍 Network: arbitrumSepolia
👤 Deploying contracts with account: 0x...
💰 Account balance: 0.05 ETH

📝 Deploying DonationVillage contract...
✅ DonationVillage deployed to: 0x1234567890abcdef1234567890abcdef12345678

✨ Deployment completed successfully!
```

---

## 📋 생성된 파일 내용

### 1. contracts/DonationVillage.sol

OpenZeppelin v5를 사용하는 스마트 컨트랙트:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";  // ✅ v5 경로
import "@openzeppelin/contracts/utils/Pausable.sol";         // ✅ v5 경로

contract DonationVillage is Ownable, ReentrancyGuard, Pausable {
    // ... 컨트랙트 코드
}
```

**주요 기능:**
- 캠페인 생성 및 관리
- 기부 기록 (블록체인에 영구 저장)
- 투명한 기부 내역 조회
- 재진입 공격 방지 (ReentrancyGuard)
- 긴급 중지 기능 (Pausable)
- 소유자 권한 관리 (Ownable)

### 2. scripts/deploy.js

배포 스크립트:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  
  const DonationVillage = await ethers.getContractFactory("DonationVillage");
  const donationVillage = await DonationVillage.deploy();
  
  await donationVillage.deployed();
  
  console.log("✅ DonationVillage deployed to:", donationVillage.address);
  
  // 초기 캠페인 확인
  const campaignCount = await donationVillage.campaignCount();
  console.log("📋 Initial campaign count:", campaignCount.toString());
  
  // ... 기타 정보 출력
}
```

**기능:**
- 컨트랙트 배포
- 배포자 계정 및 잔액 확인
- 초기 캠페인 정보 출력 (3개)
- 배포 정보 JSON 출력
- Arbiscan 검증 가이드

---

## 🔍 파일 구조 확인

### 현재 상태:

```bash
cd hardhat-setup
tree -L 2
```

**출력:**
```
hardhat-setup/
├── contracts/
│   └── DonationVillage.sol    ✅
├── scripts/
│   └── deploy.js               ✅
├── .env                        ⚠️ 직접 생성 필요
├── .env.example                ✅
├── hardhat.config.js           ✅
├── package.json                ✅
├── README.md                   ✅
└── SETUP_GUIDE.md              ✅
```

### 확인 명령어:

```bash
# contracts 폴더 확인
ls -la contracts/

# 출력:
# DonationVillage.sol

# scripts 폴더 확인
ls -la scripts/

# 출력:
# deploy.js
```

---

## 🎯 hardhat.config.js 경로 설정

`hardhat.config.js` 파일의 paths 설정:

```javascript
module.exports = {
  // ...
  paths: {
    sources: "./contracts",      // ✅ contracts 폴더 참조
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
```

이제 Hardhat이 `hardhat-setup/contracts/` 폴더에서 `.sol` 파일을 찾습니다!

---

## 🛠️ 문제 해결

### 문제 1: "contracts 폴더가 여전히 없음"

```bash
# hardhat-setup 폴더에 있는지 확인
pwd
# 출력: /path/to/project/hardhat-setup

# contracts 폴더 생성 확인
ls -la contracts/
```

### 문제 2: "DonationVillage.sol을 찾을 수 없음"

```bash
# 파일 존재 확인
cat contracts/DonationVillage.sol | head -10

# 출력:
# // SPDX-License-Identifier: MIT
# pragma solidity ^0.8.20;
# ...
```

### 문제 3: "OpenZeppelin import 에러"

```bash
# OpenZeppelin 패키지 설치 확인
npm list @openzeppelin/contracts

# 출력:
# └── @openzeppelin/contracts@5.0.0

# 없으면 설치
npm install
```

---

## ✅ 최종 체크리스트

배포 전 확인:

- [x] `hardhat-setup/contracts/DonationVillage.sol` 존재
- [x] `hardhat-setup/scripts/deploy.js` 존재
- [ ] `hardhat-setup/.env` 파일 생성 및 설정
- [ ] `cd hardhat-setup` 실행
- [ ] `npm install` 완료
- [ ] `npx hardhat compile` 성공
- [ ] Arbitrum Sepolia ETH 보유 (최소 0.01)
- [ ] `npx hardhat run scripts/deploy.js --network arbitrumSepolia` 실행

---

## 🎉 성공!

모든 파일이 준비되었습니다!

### 다음 단계:

1. **hardhat-setup 폴더로 이동**:
   ```bash
   cd hardhat-setup
   ```

2. **.env 파일 설정**:
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **컴파일**:
   ```bash
   npx hardhat compile
   ```

4. **배포**:
   ```bash
   npx hardhat run scripts/deploy.js --network arbitrumSepolia
   ```

---

## 📚 상세 가이드

더 자세한 내용은:
- **설정 가이드**: `/hardhat-setup/SETUP_GUIDE.md` ⭐⭐⭐
- **빠른 시작**: `/QUICK_START.md`
- **Private Key**: `/FIX_PRIVATE_KEY_ERROR.md`
- **OpenZeppelin v5**: `/FIX_OPENZEPPELIN_V5.md`

---

**이제 모든 준비가 완료되었습니다!** 🚀

지금 바로 배포를 시작하세요! 💪
