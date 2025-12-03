# 📦 전체 프로젝트 다운로드 - All-in-One 가이드

## 🎯 목적
이 문서는 Figma Make에서 프로젝트를 다운로드하는 **모든 방법**을 정리했습니다.

---

## 방법 1: Figma Make Export 기능 (⭐ 가장 쉬움)

### 단계:
1. Figma Make 좌측 상단 메뉴 클릭
2. **"Export"** 또는 **"Download Project"** 찾기
3. ZIP 파일 다운로드
4. 압축 해제 후 사용

```bash
cd donation-village
npm install
npm run dev
```

✅ **이 방법이 가능하면 아래는 안 봐도 됩니다!**

---

## 방법 2: Figma Make → GitHub → Clone

### 단계:
1. Figma Make가 GitHub와 연동되어 있는지 확인
2. GitHub 저장소로 자동 푸시됨
3. 로컬에서 Clone:

```bash
git clone https://github.com/YOUR_USERNAME/donation-village.git
cd donation-village
npm install
```

---

## 방법 3: 수동으로 파일 복사 (Export 없을 경우)

### 3-1. 전체 파일 목록

**최소 필수 파일 (16개):**

#### 루트 (5개)
1. `package.json`
2. `index.tsx`
3. `App.tsx`
4. `hardhat.config.js`
5. `.env.example`

#### Components (7개)
6. `components/LoginScreen.tsx`
7. `components/VillageMain.tsx`
8. `components/MyHouse.tsx`
9. `components/OrganizationHouse.tsx`
10. `components/DonationModal.tsx`
11. `components/DonationDetail.tsx`
12. `components/Inventory.tsx`

#### Lib (4개)
13. `lib/api.ts`
14. `lib/contract.ts`
15. `lib/did.ts`
16. `lib/wallet-mock.ts`

#### Blockchain (2개)
17. `contracts/DonationVillage.sol`
18. `scripts/deploy.js`

#### Backend (2개)
19. `supabase/functions/server/index.tsx`
20. `supabase/functions/server/kv_store.tsx`

#### Styles & Utils (2개)
21. `styles/globals.css`
22. `utils/supabase/info.tsx`

#### Components/UI (선택 - 필요시)
23-50. `components/ui/*.tsx` (약 27개 파일)

---

### 3-2. 수동 복사 절차

#### Step 1: 로컬에 폴더 생성
```bash
mkdir donation-village
cd donation-village

mkdir -p components/ui
mkdir -p components/figma
mkdir -p lib
mkdir -p styles
mkdir -p contracts
mkdir -p scripts
mkdir -p supabase/functions/server
mkdir -p utils/supabase
```

#### Step 2: 각 파일 복사
Figma Make에서 위의 22개 필수 파일을 하나씩 복사/붙여넣기

#### Step 3: 환경 설정
```bash
cp .env.example .env
nano .env  # 환경 변수 입력
```

#### Step 4: 의존성 설치
```bash
npm install
```

---

## 🚀 다운로드 후 배포 방법

### Quick 배포 (자동화 스크립트 사용)

```bash
# 실행 권한 부여
chmod +x deploy-all.sh

# 배포 시작
./deploy-all.sh
```

스크립트가 자동으로:
1. ✅ 환경 변수 확인
2. ✅ 블록체인 배포
3. ✅ 백엔드 배포
4. ✅ 프론트엔드 배포

---

### Manual 배포 (단계별)

#### 1. 블록체인 배포
```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
# 컨트랙트 주소 복사!
```

#### 2. 백엔드 배포
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase functions deploy server
```

Supabase Dashboard에서 환경 변수 설정:
- `CONTRACT_ADDRESS`
- `ALCHEMY_API_KEY`

#### 3. 프론트엔드 배포

`lib/api.ts` 수정:
```typescript
const ENABLE_BACKEND = true; // false → true
```

Vercel 배포:
```bash
npm install -g vercel
vercel login
vercel --prod
```

Vercel Dashboard에서 환경 변수 추가:
- `VITE_PRIVY_APP_ID`
- `VITE_CONTRACT_ADDRESS`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ALCHEMY_API_KEY`
- `VITE_CHAIN_ID=421614`

---

## 📊 필요한 외부 서비스

### 사전 준비 체크리스트:

- [ ] **Alchemy** 가입 및 API Key 발급
  - https://dashboard.alchemy.com
  - Arbitrum Sepolia 앱 생성

- [ ] **Privy** 가입 및 App ID 발급
  - https://dashboard.privy.io
  - Login Methods 활성화

- [ ] **Supabase** 프로젝트 생성
  - https://supabase.com/dashboard
  - Project URL & Anon Key 복사

- [ ] **Vercel** 계정 생성
  - https://vercel.com

- [ ] **MetaMask** 지갑 생성
  - 테스트넷 전용!

- [ ] **Arbitrum Sepolia ETH** 받기
  - https://faucet.quicknode.com/arbitrum/sepolia
  - 최소 0.05 ETH 권장

- [ ] **Arbiscan** API Key (선택)
  - https://arbiscan.io/register
  - 컨트랙트 검증용

---

## 📂 다운로드한 프로젝트 구조

```
donation-village/
│
├── 📱 Frontend
│   ├── App.tsx
│   ├── index.tsx
│   ├── package.json
│   ├── .env
│   │
│   ├── components/
│   │   ├── LoginScreen.tsx
│   │   ├── VillageMain.tsx
│   │   ├── MyHouse.tsx
│   │   ├── OrganizationHouse.tsx
│   │   ├── DonationModal.tsx
│   │   ├── DonationDetail.tsx
│   │   ├── Inventory.tsx
│   │   └── ui/ (27개 UI 컴포넌트)
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── contract.ts
│   │   ├── did.ts
│   │   └── wallet-mock.ts
│   │
│   └── styles/
│       └── globals.css
│
├── 🔗 Blockchain
│   ├── contracts/
│   │   └── DonationVillage.sol
│   ├── scripts/
│   │   └── deploy.js
│   └── hardhat.config.js
│
├── ⚙️ Backend
│   └── supabase/
│       └── functions/
│           └── server/
│               ├── index.tsx
│               └── kv_store.tsx
│
└── 📚 Documentation
    ├── README.md
    ├── DEPLOYMENT_GUIDE.md
    ├── QUICK_START.md
    └── ...
```

---

## 🎁 자동화 스크립트 목록

### 1. `download-project.sh`
프로젝트 폴더 구조를 생성하고 안내 메시지 출력

```bash
chmod +x download-project.sh
./download-project.sh
```

### 2. `deploy-all.sh`
전체 배포 자동화 (블록체인 + 백엔드 + 프론트엔드)

```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

---

## ⚠️ 주의사항

### 보안
- ✅ `.env` 파일은 절대 GitHub에 커밋 금지
- ✅ Private Key는 테스트넷 전용 지갑 사용
- ✅ `.gitignore`에 민감한 파일 추가

### .gitignore 예시
```
node_modules/
.env
.env.local
artifacts/
cache/
dist/
*.log
```

---

## 🆘 문제 해결

### Q: Export 기능을 찾을 수 없어요
→ Figma Make 좌측 상단 메뉴, Settings, 또는 프로젝트 이름 옆 `...` 버튼 확인

### Q: 파일이 너무 많아요
→ `/COPY_THESE_FILES.md`의 최소 필수 파일 22개만 복사

### Q: npm install 오류
→ Node.js 버전 확인 (v18 이상 필요)
```bash
node --version
npm --version
```

### Q: Hardhat 실행 오류
→ 먼저 Hardhat 설치:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv ethers
```

---

## 📞 추가 도움말

### 📚 문서 목록:
- **전체 가이드**: `DEPLOYMENT_GUIDE.md`
- **빠른 시작**: `QUICK_START.md`
- **체크리스트**: `DEPLOYMENT_CHECKLIST.md`
- **파일 구조**: `PROJECT_STRUCTURE.md`
- **복사 가이드**: `COPY_THESE_FILES.md`
- **Export 가이드**: `EXPORT_GUIDE.md`
- **이 문서**: `ALL_IN_ONE.md`

### 🔗 유용한 링크:
- Hardhat: https://hardhat.org
- Arbitrum: https://docs.arbitrum.io
- Privy: https://docs.privy.io
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs

---

## 🎉 요약

### 가장 쉬운 방법 (우선순위 순):

1. **Figma Make Export 기능 사용** ⭐⭐⭐
   - 한 번에 ZIP 다운로드
   - 압축 해제 후 바로 사용

2. **GitHub Clone** ⭐⭐
   - Figma Make가 GitHub와 연동된 경우
   - `git clone` 명령어로 다운로드

3. **수동 복사** ⭐
   - Export 기능이 없을 경우
   - 22개 필수 파일만 복사

### 배포 방법:

1. **자동화 스크립트** ⭐⭐⭐
   - `./deploy-all.sh` 실행
   - 모든 과정 자동화

2. **단계별 수동 배포** ⭐⭐
   - 블록체인 → 백엔드 → 프론트엔드
   - 각 단계를 직접 제어

---

**이제 프로젝트를 다운로드하고 배포할 준비가 완료되었습니다!** 🚀

선택하신 방법으로 시작하세요! 💪
