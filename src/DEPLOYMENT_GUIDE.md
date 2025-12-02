# 🚀 기부 마을 배포 가이드

이 가이드는 프론트엔드, 블록체인, 백엔드를 실제 환경에 배포하는 전체 과정을 안내합니다.

---

## 📋 배포 순서

1. **블록체인 (스마트 컨트랙트)** - Arbitrum Sepolia에 배포
2. **백엔드 (Supabase Edge Functions)** - 트랜잭션 검증 서버 구축
3. **프론트엔드 (React App)** - Vercel에 배포

---

## 1️⃣ 블록체인 스마트 컨트랙트 배포

### 필요한 도구
- Node.js (v18 이상)
- Hardhat
- Arbitrum Sepolia 테스트넷 ETH (무료 Faucet)
- MetaMask 또는 배포용 Private Key

### 1-1. Hardhat 프로젝트 설정

```bash
# 새 디렉토리 생성
mkdir donation-village-contracts
cd donation-village-contracts

# npm 초기화
npm init -y

# Hardhat 설치
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv ethers

# Hardhat 프로젝트 초기화
npx hardhat init
# "Create a JavaScript project" 선택
```

### 1-2. 환경 변수 설정

`.env` 파일 생성:

```env
# 배포용 지갑 Private Key (0x 포함)
PRIVATE_KEY=your_private_key_here

# Alchemy/Infura API Key (Arbitrum Sepolia RPC)
ALCHEMY_API_KEY=your_alchemy_api_key

# Arbiscan API Key (컨트랙트 검증용)
ARBISCAN_API_KEY=your_arbiscan_api_key
```

### 1-3. Hardhat 설정 파일

`hardhat.config.js` 수정:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
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

### 1-4. 스마트 컨트랙트 작성

`contracts/DonationVillage.sol` 파일 사용 (이미 생성됨)

### 1-5. 배포 스크립트

`scripts/deploy.js` 파일 사용 (이미 생성됨)

### 1-6. 컨트랙트 배포

```bash
# Arbitrum Sepolia에 배포
npx hardhat run scripts/deploy.js --network arbitrumSepolia

Error HH8: There's one or more errors in your config file:

  * Invalid account: #0 for network: arbitrumSepolia - private key too short, expected 32 bytes

To learn more about Hardhat's configuration, please go to https://hardhat.org/config/

For more info go to https://hardhat.org/HH8 or run Hardhat with --show-stack-traces
# 출력 예시:
# DonationVillage deployed to: 0x1234567890abcdef...
# 이 주소를 복사하세요!
```

### 1-7. 컨트랙트 검증 (선택)

```bash
npx hardhat verify --network arbitrumSepolia <CONTRACT_ADDRESS>
```

### 1-8. 테스트넷 ETH 받기

- Arbitrum Sepolia Faucet: https://faucet.quicknode.com/arbitrum/sepolia
- 또는 Alchemy Faucet: https://www.alchemy.com/faucets/arbitrum-sepolia

---

## 2️⃣ 백엔드 (Supabase Edge Functions) 배포

### 2-1. Supabase CLI 설치

```bash
npm install -g supabase
```

### 2-2. Supabase 프로젝트 연결

```bash
# Supabase 로그인
supabase login

# 기존 프로젝트에 연결
supabase link --project-ref <YOUR_PROJECT_ID>
```

### 2-3. 환경 변수 설정

Supabase Dashboard → Settings → Edge Functions → Secrets에서 설정:

```
CONTRACT_ADDRESS=0x... (위에서 배포한 컨트랙트 주소)
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=서버용_지갑_private_key (기부 검증용)
```

### 2-4. Edge Functions 배포

```bash
# 서버 함수 배포
supabase functions deploy server

# 배포 확인
supabase functions list
```

### 2-5. 백엔드 테스트

```bash
curl https://<project-id>.supabase.co/functions/v1/make-server-17e2e0df/health \
  -H "Authorization: Bearer <ANON_KEY>"
```

---

## 3️⃣ 프론트엔드 배포

### 3-1. Privy 설정

1. https://dashboard.privy.io 접속
2. 새 앱 생성
3. App ID 복사
4. Login Methods 설정:
   - Email
   - Google
   - Twitter
   - Discord
   - GitHub
5. Embedded Wallets 활성화

### 3-2. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# Privy
VITE_PRIVY_APP_ID=your_privy_app_id

# Supabase (이미 있음)
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Contract
VITE_CONTRACT_ADDRESS=0x... (배포한 컨트랙트 주소)
VITE_ALCHEMY_API_KEY=your_alchemy_api_key

# Network
VITE_CHAIN_ID=421614
VITE_CHAIN_NAME=Arbitrum Sepolia
```

### 3-3. 프론트엔드 코드 수정

`/lib/api.ts`에서:

```typescript
// 개발 모드 비활성화
const ENABLE_BACKEND = true; // false → true로 변경
```

### 3-4. Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 루트에서 배포
vercel

# 환경 변수 설정 (Vercel Dashboard에서도 가능)
vercel env add VITE_PRIVY_APP_ID
vercel env add VITE_CONTRACT_ADDRESS
# ... 기타 환경 변수들

# 프로덕션 배포
vercel --prod
```

### 3-5. Vercel Dashboard에서 환경 변수 설정

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Environment Variables
3. 위의 모든 환경 변수 추가
4. Redeploy 클릭

---

## 4️⃣ 배포 확인 체크리스트

### ✅ 블록체인
- [ ] 컨트랙트가 Arbitrum Sepolia에 배포됨
- [ ] Arbiscan에서 컨트랙트 확인 가능
- [ ] 컨트랙트 주소 복사함

### ✅ 백엔드
- [ ] Supabase Edge Functions 배포됨
- [ ] Health check 엔드포인트 작동
- [ ] 환경 변수 설정 완료

### ✅ 프론트엔드
- [ ] Privy 앱 생성 및 설정 완료
- [ ] 환경 변수 설정 완료
- [ ] ENABLE_BACKEND = true로 변경
- [ ] Vercel에 배포 완료
- [ ] 소셜 로그인 작동 확인

---

## 🔧 트러블슈팅

### 컨트랙트 배포 실패
- Private Key가 올바른지 확인
- 지갑에 Arbitrum Sepolia ETH가 있는지 확인
- RPC URL이 올바른지 확인

### 백엔드 연결 실패
- CORS 설정 확인
- Supabase 환경 변수 확인
- API URL이 올바른지 확인

### 프론트엔드 로그인 실패
- Privy App ID 확인
- 소셜 로그인 OAuth 설정 확인 (Google, Twitter 등)
- 환경 변수가 `VITE_` 접두사로 시작하는지 확인

---

## 📚 추가 리소스

- **Arbitrum Docs**: https://docs.arbitrum.io
- **Privy Docs**: https://docs.privy.io
- **Supabase Docs**: https://supabase.com/docs
- **Hardhat Docs**: https://hardhat.org/docs

---

## 🎉 배포 완료 후

1. 실제 이메일/소셜 로그인 테스트
2. 기부 프로세스 전체 테스트
3. Arbiscan에서 트랜잭션 확인
4. 모바일 브라우저 테스트
5. 사용자 피드백 수집

배포에 성공하셨다면, 이제 실제 사용자들과 함께 투명한 기부 경험을 만들어가세요! 🌟
