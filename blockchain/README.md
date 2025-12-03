# Blockchain - Donation Village

블록체인 기반 투명한 기부 시스템의 스마트 컨트랙트

## 기술 스택

- **Network**: Arbitrum Sepolia (Testnet)
- **Framework**: Hardhat 2.22.16
- **Library**: Ethers.js 6.9.0
- **Standards**: OpenZeppelin Contracts 5.0.0
- **Language**: Solidity

## 디렉토리 구조

```
blockchain/
├── contracts/
│   ├── DonationVillage.sol  # 메인 기부 마을 컨트랙트
│   └── DonationLedger.sol   # 기부 원장 컨트랙트
├── scripts/
│   ├── deploy.js            # 배포 스크립트
│   ├── deploy-all.sh        # 전체 배포 자동화
│   ├── check-env.sh         # 환경 변수 검증
│   └── verify-setup.sh      # 설정 검증
├── lib/
│   ├── contract.ts          # 컨트랙트 연동 로직
│   └── wallet-mock.ts       # 지갑 모킹 (테스트용)
└── hardhat-setup/
    ├── hardhat.config.js    # Hardhat 설정
    ├── package.json         # 블록체인 의존성
    └── contracts/           # 컨트랙트 개발 디렉토리
```

## 스마트 컨트랙트

### DonationVillage.sol
메인 기부 시스템 컨트랙트
- 기부 캠페인 생성 및 관리
- 기부금 수령 및 처리
- 투명한 기부 내역 기록
- NFT 기반 기부 증명서 발행

### DonationLedger.sol
기부 원장 관리 컨트랙트
- 모든 기부 내역 영구 기록
- 기부자와 수혜자 정보 관리
- 감사(Audit) 기능

## 개발 환경 설정

### 1. 의존성 설치

```bash
cd blockchain/hardhat-setup
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```
PRIVATE_KEY=your_wallet_private_key
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=your_arbiscan_api_key
```

### 3. 컴파일

```bash
npm run compile
```

## 배포

### 로컬 네트워크

```bash
# 로컬 노드 시작
npm run node

# 새 터미널에서 배포
npm run deploy:local
```

### Arbitrum Sepolia 테스트넷

```bash
npm run deploy:sepolia
```

### 컨트랙트 검증

```bash
npm run verify
```

## 테스트

```bash
npm run test
```

## 네트워크 정보

- **Arbitrum Sepolia**
  - Chain ID: 421614
  - RPC: https://sepolia-rollup.arbitrum.io/rpc
  - Explorer: https://sepolia.arbiscan.io

## 보안

- OpenZeppelin 라이브러리 사용으로 검증된 패턴 적용
- Reentrancy Guard 적용
- Access Control 구현
- 상세한 보안 가이드는 `/docs/guides/SMART_CONTRACT_SECURITY.md` 참조
