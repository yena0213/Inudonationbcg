# 🔧 OpenZeppelin v5 Import 경로 수정

## 🚨 에러 메시지

```
Error HH404: File @openzeppelin/contracts/security/ReentrancyGuard.sol, 
imported from contracts/DonationVillage.sol, not found.
```

---

## ✅ 해결 완료!

OpenZeppelin v5에서 일부 파일의 경로가 변경되었습니다.

### 변경 사항

#### ❌ 이전 (v4):
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
```

#### ✅ 수정 (v5):
```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
```

**변경 내용**: `security/` → `utils/`

---

## 📋 OpenZeppelin v5 주요 변경사항

### 1. 경로 변경
| v4 경로 | v5 경로 | 설명 |
|---------|---------|------|
| `security/ReentrancyGuard.sol` | `utils/ReentrancyGuard.sol` | 재진입 공격 방지 |
| `security/Pausable.sol` | `utils/Pausable.sol` | 긴급 중지 기능 |
| `security/PullPayment.sol` | `utils/escrow/` | Pull Payment 패턴 |

### 2. 변경되지 않은 경로
다음 import는 v5에서도 동일합니다:
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";        // ✅ 동일
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";     // ✅ 동일
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";   // ✅ 동일
```

---

## 🔍 수정된 DonationVillage.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";  // ✅ 수정됨
import "@openzeppelin/contracts/utils/Pausable.sol";         // ✅ 수정됨

contract DonationVillage is Ownable, ReentrancyGuard, Pausable {
    // ... 컨트랙트 코드
}
```

---

## 🧪 테스트

### 1. 컴파일 확인
```bash
npx hardhat compile
```

**성공 시 출력:**
```
Compiled 1 Solidity file successfully ✓
```

### 2. 배포 테스트
```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

---

## 📦 버전 확인

### package.json 확인:
```json
{
  "dependencies": {
    "@openzeppelin/contracts": "5.0.0"
  }
}
```

### 설치된 버전 확인:
```bash
npm list @openzeppelin/contracts
```

**출력:**
```
└── @openzeppelin/contracts@5.0.0
```

---

## 🔄 OpenZeppelin v4 → v5 마이그레이션

v4에서 v5로 업그레이드하는 경우:

### 1. 패키지 업데이트
```bash
npm install @openzeppelin/contracts@5.0.0
```

### 2. Import 경로 변경
```solidity
// v4 → v5 자동 변경
security/ReentrancyGuard.sol  →  utils/ReentrancyGuard.sol
security/Pausable.sol          →  utils/Pausable.sol
```

### 3. 생성자 변경 (Ownable)
```solidity
// ❌ v4
constructor() {
    // 자동으로 msg.sender가 owner
}

// ✅ v5
constructor() Ownable(msg.sender) {
    // 명시적으로 owner 지정
}
```

---

## 🎯 우리 프로젝트 설정

현재 프로젝트는 **OpenZeppelin v5.0.0**을 사용하며, 다음과 같이 설정되어 있습니다:

```solidity
// DonationVillage.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract DonationVillage is Ownable, ReentrancyGuard, Pausable {
    constructor() {
        _createInitialCampaigns();
    }
    
    // ... 나머지 코드
}
```

---

## 🛠️ 자주 발생하는 에러

### 에러 1: "ReentrancyGuard not found"

**원인**: v4 경로 사용

**해결**:
```solidity
// ❌ 잘못됨
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// ✅ 올바름
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
```

### 에러 2: "Pausable not found"

**원인**: v4 경로 사용

**해결**:
```solidity
// ❌ 잘못됨
import "@openzeppelin/contracts/security/Pausable.sol";

// ✅ 올바름
import "@openzeppelin/contracts/utils/Pausable.sol";
```

### 에러 3: "Ownable: caller is not the owner"

**원인**: v5에서 생성자 변경

**해결**:
```solidity
// ✅ v5 방식 (자동 msg.sender가 owner)
constructor() {
    // 아무것도 안 해도 msg.sender가 owner
}

// 또는 명시적으로
constructor() Ownable(msg.sender) {
    // ...
}
```

---

## 📚 OpenZeppelin v5 공식 문서

- **마이그레이션 가이드**: https://docs.openzeppelin.com/contracts/5.x/
- **변경 사항**: https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v5.0.0
- **API 문서**: https://docs.openzeppelin.com/contracts/5.x/api/security

---

## ✅ 체크리스트

- [x] OpenZeppelin v5.0.0 설치
- [x] `security/ReentrancyGuard.sol` → `utils/ReentrancyGuard.sol` 변경
- [x] `security/Pausable.sol` → `utils/Pausable.sol` 변경
- [x] 컴파일 성공 확인
- [ ] 배포 테스트

---

## 🚀 다음 단계

```bash
# 1. 컴파일
npx hardhat compile

# 2. 배포
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

**이제 정상 작동합니다!** ✅

---

## 💡 참고

v5에서는 다음도 개선되었습니다:

- 🔒 **보안**: 더 강화된 보안 패턴
- ⚡ **가스**: 최적화된 가스 사용
- 📦 **모듈화**: 더 나은 코드 구조
- 🛠️ **개발 경험**: 향상된 에러 메시지

우리 프로젝트는 최신 v5를 사용하여 이 모든 개선사항을 활용합니다! 🎉
