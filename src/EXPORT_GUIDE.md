# 📦 프로젝트 전체 다운로드 & 배포 가이드

## 🎯 전체 프로젝트를 로컬에서 직접 배포하기

---

## 방법 1: Figma Make Export 기능 (가장 쉬움 ⭐)

### 1. Figma Make에서 프로젝트 Export
- 좌측 상단 메뉴 또는 설정에서 **"Export Project"** 클릭
- ZIP 파일 다운로드
- 압축 해제

### 2. 로컬에서 실행
```bash
cd donation-village
npm install
npm run dev
```

---

## 방법 2: Git Clone (GitHub 사용 시)

### 1. GitHub에 푸시
Figma Make가 GitHub와 연동되어 있다면:
```bash
# GitHub에서 자동으로 푸시됨
```

### 2. 로컬에서 Clone
```bash
git clone https://github.com/YOUR_USERNAME/donation-village.git
cd donation-village
npm install
npm run dev
```

---

## 방법 3: 수동으로 파일 복사 (Export 없을 경우)

아래의 `/PROJECT_STRUCTURE.md` 파일을 참고하여
각 파일을 수동으로 복사하세요.

---

## 📁 다운로드 후 프로젝트 구조

```
donation-village/
├── 📱 Frontend
│   ├── App.tsx
│   ├── index.tsx
│   ├── package.json
│   ├── .env.example
│   ├── components/
│   ├── lib/
│   └── styles/
│
├── 🔗 Blockchain  
│   ├── contracts/
│   │   └── DonationVillage.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── hardhat.config.js
│   └── package.json
│
├── ⚙️ Backend
│   └── supabase/
│       └── functions/
│           └── server/
│               └── index.tsx
│
└── 📚 Docs
    ├── DEPLOYMENT_GUIDE.md
    ├── QUICK_START.md
    └── README.md
```

---

## 🚀 로컬에서 전체 배포하기

### Step 0: 환경 변수 설정
```bash
# 프로젝트 루트에서
cp .env.example .env
nano .env  # 모든 환경 변수 입력
```

### Step 1: 블록체인 배포
```bash
# 1. Hardhat 설치 (루트에서)
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 2. OpenZeppelin 설치
npm install @openzeppelin/contracts dotenv ethers

# 3. 배포
npx hardhat run scripts/deploy.js --network arbitrumSepolia

# ✅ 컨트랙트 주소 복사
```

### Step 2: 백엔드 배포
```bash
# 1. Supabase CLI 설치
npm install -g supabase

# 2. 로그인 및 프로젝트 연결
supabase login
supabase link --project-ref YOUR_PROJECT_ID

# 3. Edge Functions 배포
supabase functions deploy server

# 4. Supabase Dashboard에서 환경 변수 설정
# - CONTRACT_ADDRESS
# - ALCHEMY_API_KEY
```

### Step 3: 프론트엔드 배포
```bash
# 1. .env 파일 수정 (Step 1의 컨트랙트 주소 입력)

# 2. lib/api.ts 수정
# ENABLE_BACKEND = false → true

# 3. Vercel 배포
npm install -g vercel
vercel login
vercel

# 4. 환경 변수 추가
vercel env add VITE_PRIVY_APP_ID
vercel env add VITE_CONTRACT_ADDRESS
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ALCHEMY_API_KEY
vercel env add VITE_CHAIN_ID

# 5. 프로덕션 배포
vercel --prod
```

---

## 🔧 로컬 개발 환경 실행

### 개발 모드로 테스트:
```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 📦 필요한 외부 서비스

### 사전 준비:
1. **Alchemy** - API Key 발급
2. **Privy** - App ID 발급  
3. **Supabase** - 프로젝트 생성
4. **Vercel** - 계정 생성
5. **MetaMask** - 테스트넷 지갑
6. **Arbitrum Sepolia ETH** - Faucet에서 받기

---

## 🎁 Bonus: 자동화 스크립트

`deploy-all.sh` 파일이 생성되었습니다!

```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

한 번에 모든 배포를 실행합니다.

---

## ⚠️ 주의사항

### .gitignore 확인
```
node_modules/
.env
.env.local
artifacts/
cache/
dist/
```

### Private Key 보안
- 절대로 GitHub에 커밋하지 마세요
- .env 파일을 안전하게 보관하세요
- 테스트넷 전용 지갑을 사용하세요

---

## 🆘 문제 해결

### Export 기능이 없다면?
→ `/PROJECT_STRUCTURE.md` 파일을 보고 수동으로 복사

### npm install 오류
→ Node.js 버전 확인 (v18 이상 필요)
```bash
node --version
npm --version
```

### Hardhat 오류
→ package.json에 hardhat 설정 확인

---

## 📞 다음 단계

1. ✅ 프로젝트 다운로드
2. ✅ 환경 변수 설정
3. ✅ 블록체인 배포
4. ✅ 백엔드 배포
5. ✅ 프론트엔드 배포
6. ✅ 테스트 및 확인

**축하합니다! 이제 완전히 독립적인 배포가 가능합니다!** 🎉
