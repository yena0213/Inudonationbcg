# 🏗️ Donation Village - Smart Contract Setup

블록체인 스마트 컨트랙트 배포를 위한 Hardhat 프로젝트입니다.

## 📦 설치

```bash
# 이 디렉토리로 이동
cd hardhat-setup

# 의존성 설치
npm install
```

## 🔧 환경 설정

1. `.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

2. `.env` 파일에 필요한 값 입력:
   - `PRIVATE_KEY`: 배포용 지갑의 Private Key (테스트넷 전용!)
   - `ALCHEMY_API_KEY`: Alchemy에서 발급받은 API Key
   - `ARBISCAN_API_KEY`: Arbiscan에서 발급받은 API Key (검증용)

## 💰 테스트넷 ETH 받기

Arbitrum Sepolia 테스트넷에서 무료로 ETH를 받으세요:

- **QuickNode Faucet**: https://faucet.quicknode.com/arbitrum/sepolia
- **Alchemy Faucet**: https://www.alchemy.com/faucets/arbitrum-sepolia
- **Chainlink Faucet**: https://faucets.chain.link/arbitrum-sepolia

최소 0.01 ETH 이상 권장합니다.

## 🚀 컨트랙트 배포

### 로컬 테스트 (Hardhat Network)

```bash
# 로컬 노드 시작 (터미널 1)
npm run node

# 컨트랙트 배포 (터미널 2)
npm run deploy:local
```

### Arbitrum Sepolia 배포 (테스트넷)

```bash
# Arbitrum Sepolia에 배포
npm run deploy:sepolia

# 출력 예시:
# ✅ DonationVillage deployed to: 0x1234567890abcdef...
# 📋 Initial campaign count: 3
```

**배포 후 반드시 컨트랙트 주소를 복사하세요!**

## 🔍 컨트랙트 검증

배포 후 Arbiscan에서 소스코드를 공개하려면:

```bash
npx hardhat verify --network arbitrumSepolia <CONTRACT_ADDRESS>

# 예시:
# npx hardhat verify --network arbitrumSepolia 0x1234567890abcdef...
```

검증이 완료되면 Arbiscan에서 Read/Write Contract 기능을 사용할 수 있습니다.

## 📝 컨트랙트 주요 기능

### DonationVillage.sol

#### 주요 함수:

- `createCampaign()`: 새 캠페인 생성 (관리자만)
- `donate(campaignId, message)`: 기부하기 (payable)
- `withdrawFunds(campaignId)`: 기부금 인출 (수혜자만)
- `getUserDonations(address)`: 사용자의 기부 내역 조회
- `getCampaign(campaignId)`: 캠페인 정보 조회
- `getTotalDonated(address)`: 사용자의 총 기부 금액

#### 보안 기능:

- **Ownable**: 관리자 권한 관리
- **ReentrancyGuard**: 재진입 공격 방지
- **Pausable**: 긴급 중지 기능

#### 초기 캠페인:

배포 시 자동으로 3개의 Mock 캠페인이 생성됩니다:
1. 숲속동물보호센터 - 겨울나기 따뜻한 보금자리 만들기
2. 초록나무재단 - 사막화 방지 나무 심기 프로젝트
3. 희망교육협회 - 소외계층 아동 교육 지원

## 🧪 테스트

```bash
# 테스트 실행 (작성된 경우)
npm test
```

## 📊 컴파일

```bash
# 컨트랙트 컴파일
npm run compile
```

컴파일 후 `artifacts/` 디렉토리에 ABI와 바이트코드가 생성됩니다.

## 🔗 다음 단계

1. ✅ 컨트랙트 배포 완료
2. 📋 컨트랙트 주소 복사
3. 🔍 Arbiscan에서 검증
4. 🌐 백엔드 환경 변수에 `CONTRACT_ADDRESS` 설정
5. 💻 프론트엔드 환경 변수에 `VITE_CONTRACT_ADDRESS` 설정
6. 🚀 프론트엔드 배포!

## ⚠️ 주의사항

- **절대로 메인넷에 테스트 컨트랙트를 배포하지 마세요!**
- Private Key는 절대로 GitHub에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 추가하세요
- 테스트넷 전용 지갑을 사용하세요

## 📚 참고 자료

- [Hardhat 공식 문서](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Arbitrum 개발자 문서](https://docs.arbitrum.io)
- [Ethers.js 문서](https://docs.ethers.org)

## 🆘 트러블슈팅

### Error: insufficient funds for intrinsic transaction cost

→ 배포용 지갑에 Arbitrum Sepolia ETH가 부족합니다. Faucet에서 받으세요.

### Error: invalid private key

→ `.env` 파일의 `PRIVATE_KEY`가 올바른지 확인하세요. `0x`로 시작해야 합니다.

### Error: network arbitrumSepolia doesn't exist

→ `hardhat.config.js` 파일이 올바르게 설정되었는지 확인하세요.

### Verification failed

→ 배포 직후에는 검증이 실패할 수 있습니다. 1-2분 후 다시 시도하세요.

---

**준비됐나요? 이제 `npm install` → `npm run deploy:sepolia`로 시작하세요!** 🚀
