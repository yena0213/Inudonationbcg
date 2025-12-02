# 🚀 가장 간단한 배포 방법

## 📦 다운로드해야 할 것

### 블록체인 파일만 로컬로 복사하세요:

```
로컬 컴퓨터/
└── donation-blockchain/
    ├── contracts/
    │   └── DonationVillage.sol
    ├── scripts/
    │   └── deploy.js
    ├── package.json
    ├── hardhat.config.js
    ├── .env.example
    └── README.md
```

---

## 🎯 3단계 배포

### 1️⃣ 블록체인 (로컬 컴퓨터에서)

```bash
# 1. 폴더 생성
mkdir donation-blockchain
cd donation-blockchain

# 2. 위의 파일들을 Figma Make에서 복사/붙여넣기
# (또는 아래 내용을 직접 생성)

# 3. 설치
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv ethers

# 4. 환경 변수
cp .env.example .env
nano .env

# 5. 배포
npx hardhat run scripts/deploy.js --network arbitrumSepolia

# ✅ 컨트랙트 주소 복사!
```

---

### 2️⃣ 백엔드 (Supabase Dashboard)

**다운로드 필요 없음!** 브라우저에서만:

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택
3. Settings → Edge Functions → Secrets
4. 환경 변수 추가:
   - `CONTRACT_ADDRESS`: 위에서 복사한 주소
   - `ALCHEMY_API_KEY`: Alchemy API Key
   - `PRIVATE_KEY`: 서버용 지갑 (선택)

5. Edge Functions 배포:
```bash
# 터미널에서 (어디서든 가능)
npm install -g supabase
supabase login
supabase functions deploy server --project-ref YOUR_PROJECT_ID
```

---

### 3️⃣ 프론트엔드 (Figma Make에서)

**다운로드 필요 없음!** Figma Make에서:

1. `.env` 파일 생성 (Figma Make 환경 변수 설정):
   - `VITE_PRIVY_APP_ID`
   - `VITE_CONTRACT_ADDRESS`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ALCHEMY_API_KEY`

2. `/lib/api.ts` 수정:
   ```typescript
   const ENABLE_BACKEND = true; // false → true
   ```

3. Figma Make에서 Deploy 버튼 클릭!

---

## 📝 요약

### 다운로드 필요:
- ✅ **블록체인 파일만** (6개 파일)

### 다운로드 불필요:
- ❌ 프론트엔드 (Figma Make에 있음)
- ❌ 백엔드 (Supabase에 있음)

---

## 🎁 더 쉬운 방법 (All-in-One)

모든 내용을 하나의 파일로 정리했습니다:

