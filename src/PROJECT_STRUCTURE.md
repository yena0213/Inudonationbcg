# 📁 프로젝트 전체 파일 구조

## 🎯 수동으로 복사할 파일 목록

Figma Make에서 Export 기능이 없다면, 이 파일들을 하나씩 복사하세요.

---

## 📂 필수 파일 (Core Files)

### 루트 디렉토리
```
/
├── package.json          ⭐ 필수
├── .env.example          ⭐ 필수
├── index.tsx             ⭐ 필수
├── App.tsx               ⭐ 필수
├── hardhat.config.js     ⭐ 필수
└── README.md             📚 선택
```

---

## 🎨 Frontend 파일

### /components/ (메인 컴포넌트)
```
components/
├── LoginScreen.tsx        ⭐ 필수
├── VillageMain.tsx        ⭐ 필수
├── MyHouse.tsx            ⭐ 필수
├── OrganizationHouse.tsx  ⭐ 필수
├── DonationModal.tsx      ⭐ 필수
├── DonationDetail.tsx     ⭐ 필수
└── Inventory.tsx          ⭐ 필수
```

### /components/figma/
```
components/figma/
└── ImageWithFallback.tsx  ⭐ 필수
```

### /components/ui/ (UI 컴포넌트)
```
components/ui/
├── button.tsx            ⭐ 필수
├── dialog.tsx            ⭐ 필수
├── card.tsx              ⭐ 필수
└── ... (필요시 복사)
```

### /lib/ (유틸리티)
```
lib/
├── api.ts                ⭐ 필수
├── contract.ts           ⭐ 필수
├── did.ts                ⭐ 필수
└── wallet-mock.ts        ⭐ 필수
```

### /styles/
```
styles/
└── globals.css           ⭐ 필수
```

### /utils/
```
utils/
└── supabase/
    └── info.tsx          ⭐ 필수
```

---

## 🔗 Blockchain 파일

### /contracts/
```
contracts/
├── DonationVillage.sol   ⭐ 필수 (메인 컨트랙트)
└── DonationLedger.sol    📚 참고용
```

### /scripts/
```
scripts/
└── deploy.js             ⭐ 필수
```

### 루트
```
/
└── hardhat.config.js     ⭐ 필수
```

---

## ⚙️ Backend 파일

### /supabase/
```
supabase/
└── functions/
    └── server/
        ├── index.tsx     ⭐ 필수
        └── kv_store.tsx  ⭐ 필수 (Protected - 수정 금지)
```

---

## 📚 Documentation 파일 (선택)

```
/
├── README.md
├── DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_CHECKLIST.md
├── DEPLOYMENT_SUMMARY.md
├── QUICK_START.md
├── DEPLOYMENT_SIMPLE.md
├── EXPORT_GUIDE.md
├── COPY_THESE_FILES.md
└── PROJECT_STRUCTURE.md (이 파일)
```

---

## 📦 Package 설정 파일

### 루트 package.json (⭐ 매우 중요)
이 파일의 전체 내용을 복사하세요.

### /hardhat-setup/ (선택 - 별도 배포용)
```
hardhat-setup/
├── package.json
├── hardhat.config.js
├── .env.example
└── README.md
```

---

## 🔐 환경 변수 파일

### .env.example (복사 후 .env로 이름 변경)
```env
VITE_PRIVY_APP_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CONTRACT_ADDRESS=
VITE_ALCHEMY_API_KEY=
VITE_CHAIN_ID=421614
VITE_CHAIN_NAME=Arbitrum Sepolia
VITE_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
```

---

## 📊 파일 우선순위

### 🔴 최우선 (없으면 작동 안 됨)
1. `package.json`
2. `index.tsx`
3. `App.tsx`
4. `/components/` 폴더 전체
5. `/lib/api.ts`
6. `/contracts/DonationVillage.sol`
7. `/scripts/deploy.js`
8. `hardhat.config.js`

### 🟡 중요 (기능에 필요)
1. `/lib/` 나머지 파일들
2. `/supabase/functions/server/`
3. `/styles/globals.css`
4. `.env.example`

### 🟢 선택 (개선을 위해)
1. `/components/ui/` 컴포넌트들
2. Documentation 파일들
3. `/hardhat-setup/` 폴더

---

## 🚀 수동 복사 단계

### 1단계: 폴더 구조 생성
```bash
mkdir -p donation-village
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

### 2단계: 필수 파일 복사
Figma Make에서 위의 "⭐ 필수" 파일들을 하나씩 복사/붙여넣기

### 3단계: 환경 설정
```bash
cp .env.example .env
nano .env  # 환경 변수 입력
```

### 4단계: 설치 및 실행
```bash
npm install
npm run dev  # 개발 모드 테스트
```

---

## 📝 빠른 체크리스트

프로젝트가 제대로 복사되었는지 확인:

- [ ] `npm install` 실행 시 오류 없음
- [ ] `npm run dev` 실행 시 서버 시작
- [ ] 브라우저에서 로그인 화면 표시
- [ ] `/contracts/DonationVillage.sol` 존재
- [ ] `/scripts/deploy.js` 존재
- [ ] `hardhat.config.js` 존재

---

## 🎁 자동화 도구

더 쉬운 방법을 원하신다면 `/download-project.sh` 스크립트를 사용하세요!

---

## 💡 Tip

Figma Make의 **Export** 또는 **Download** 버튼을 먼저 찾아보세요.
대부분의 경우 한 번에 ZIP으로 다운로드할 수 있습니다!

**Export 방법:**
1. 좌측 상단 메뉴
2. Settings 또는 Project Settings
3. "Export Project" 또는 "Download as ZIP"

없다면 위의 파일들을 수동으로 복사하세요! 📋
