# 🏡 기부 마을 (Donation Village)

**블록체인 기반 투명한 기부 플랫폼 with DID & 게임화**

동물의 숲 스타일의 귀여운 UI로 기부하고, DID 기반 증명서를 받고, 포인트로 내 집을 꾸미는 Web3 기부 플랫폼입니다.

---

## ✨ 주요 기능

### 🔐 Privy Embedded Wallet
- **소셜 로그인만으로 시작** (Google, Twitter, Discord, GitHub, Email)
- **메타마스크 설치 불필요** - 자동으로 지갑 생성
- **사용자 친화적** - Web2 수준의 간편한 UX

### 🆔 DID (Decentralized Identifier)
- **W3C 표준 기반** 탈중앙화 신원 증명
- **형식**: `did:ethr:arbitrum-sepolia:{address}`
- **DID Document** 자동 생성 및 관리

### 📜 Verifiable Credentials
- **기부 완료 시 자동 발급**
- **W3C VC 표준 준수**
- **블록체인 기반 검증** - 위변조 불가능
- **영구 보관** - 언제든 증명 가능

### 🎮 게임화 요소
- **기부 시 포인트 획득** - 1 ETH = 10,000 포인트
- **가구 구매 및 집 꾸미기** - 드래그 앤 드롭
- **뱃지 시스템** - 기부 마일스톤 달성
- **동물의 숲 스타일 UI** - 귀여운 디자인

### 🔗 블록체인 투명성
- **Layer 2 (Arbitrum Sepolia)** - 낮은 수수료
- **스마트 컨트랙트** - OpenZeppelin v5 기반
- **온체인 기��� 기록** - Arbiscan에서 검증 가능
- **오프체인 게임 레이어** - 빠른 반응성

---

## 🚀 빠른 시작

### 1️⃣ Privy App ID 발급

```bash
# 1. https://dashboard.privy.io/ 방문
# 2. 계정 생성 및 앱 생성
# 3. App ID 복사
```

### 2️⃣ 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정
VITE_PRIVY_APP_ID=your_privy_app_id_here
VITE_CONTRACT_ADDRESS=0x... # 배포된 컨트랙트 주소
```

### 3️⃣ 설치 및 실행

```bash
# 의존성 설치
npm install

# 설정 확인
bash check-privy-setup.sh

# 개발 서버 실행
npm run dev
```

### 4️⃣ Privy Dashboard 설정

- **Login Methods**: Email, Google, Twitter, Discord, GitHub 활성화
- **Chains**: Arbitrum Sepolia (421614) 추가
- **Allowed Origins**: `http://localhost:5173` 추가

---

## 📖 상세 가이드

- 📘 [QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md) - 3단계 빠른 배포
- 📗 [PRIVY_SETUP.md](./PRIVY_SETUP.md) - Privy 상세 설정
- 📕 [DEPLOYMENT.md](./DEPLOYMENT.md) - 스마트 컨트랙트 배포

---

## 🏗️ 기술 스택

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘

### Web3
- **Privy** - Embedded Wallet & 소셜 로그인
- **Ethers.js v6** - 블록체인 연동
- **Viem** - TypeScript 친화적 라이브러리

### Blockchain
- **Arbitrum Sepolia** - Layer 2 네트워크
- **Solidity** - 스마트 컨트랙트
- **Hardhat** - 개발 환경
- **OpenZeppelin v5** - 보안 라이브러리

### Identity
- **DID (W3C)** - 탈중앙화 신원
- **Verifiable Credentials** - 검증 가능한 자격증명

### Backend
- **Supabase** - 데이터베이스 & 인증
- **Edge Functions** - 서버리스 API

---

## 📁 프로젝트 구조

```
donation-village/
├── components/              # React 컴포넌트
│   ├── LoginScreen.tsx     # Privy 로그인
│   ├── VillageMain.tsx     # 마을 메인 화면
│   ├── OrganizationHouse.tsx # 단체 집 (기부)
│   ├── MyHouse.tsx         # 내 집 (DID & VC)
│   ├── Inventory.tsx       # 인벤토리
│   └── DonationModal.tsx   # 기부 모달
├── lib/                    # 유틸리티
│   ├── did.ts             # DID 관리
│   ├── contract.ts        # 스마트 컨트랙트 연동
│   └── api.ts             # API 호출
├── hardhat-setup/         # 스마트 컨트랙트
│   ├── contracts/
│   │   └── DonationVillage.sol
│   └── scripts/
│       └── deploy.js
├── supabase/              # 백엔드
│   └── functions/
│       └── server/
│           └── index.tsx
├── index.tsx              # Privy Provider
├── App.tsx                # 메인 앱
└── .env                   # 환경 변수
```

---

## 🎯 사용 시나리오

### 1. 로그인
1. "로그인 / 회원가입" 클릭
2. Google/Twitter/Discord/GitHub/Email 중 선택
3. 자동으로 지갑 생성 + DID 발급
4. 마을 화면으로 이동

### 2. 기부
1. 단체 집 클릭
2. 캠페인 정보 확인
3. "기부하기" 클릭 → 금액 입력
4. 트랜잭션 승인
5. **Verifiable Credential 자동 발급**
6. 포인트 획득

### 3. 집 꾸미기
1. "마이하우스" 이동
2. 포인트로 가구 구매
3. 드래그 앤 드롭으로 배치
4. 나만의 공간 완성

### 4. DID & 증명서 확인
1. "마이하우스" → "DID & 증명서" 탭
2. DID 정보 확인
3. 발급받은 Verifiable Credentials 확인
4. 기부 내역, 트랜잭션 해시 등 상세 정보 확인

---

## 🧪 테스트

### 로컬 테스트
```bash
npm run dev
```

### 스마트 컨트랙트 배포
```bash
cd hardhat-setup
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

### 컨트랙트 검증
```bash
npx hardhat verify --network arbitrumSepolia <CONTRACT_ADDRESS>
```

---

## 🌐 배포

### Vercel 배포

```bash
# 1. Vercel 프로젝트 생성
vercel

# 2. 환경 변수 추가
vercel env add VITE_PRIVY_APP_ID
vercel env add VITE_CONTRACT_ADDRESS
vercel env add VITE_CHAIN_ID
vercel env add VITE_CHAIN_NAME

# 3. 배포
vercel --prod
```

### Privy Dashboard 설정
- Allowed Origins에 배포 URL 추가

---

## 🔐 보안

- ✅ **Private Key는 절대 공개하지 마세요**
- ✅ `.env` 파일은 `.gitignore`에 포함
- ✅ Privy App ID는 클라이언트 사이드라 공개 가능
- ✅ 스마트 컨트랙트는 OpenZeppelin 검증된 코드 사용

---

## 📊 DID & VC 상세

### DID (Decentralized Identifier)

```typescript
// 자동 생성되는 DID 형식
did:ethr:arbitrum-sepolia:0x1234567890123456789012345678901234567890

// DID Document 구조
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:ethr:arbitrum-sepolia:0x...",
  "verificationMethod": [...],
  "authentication": [...],
  "service": [...]
}
```

### Verifiable Credential

```typescript
// 기부 완료 시 자동 발급
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.donation-village.org/credentials/v1"
  ],
  "type": ["VerifiableCredential", "DonationCredential"],
  "issuer": "did:ethr:arbitrum-sepolia:0x...", // 컨트랙트
  "issuanceDate": "2024-12-02T...",
  "credentialSubject": {
    "id": "did:ethr:arbitrum-sepolia:0x...", // 기부자
    "donationAmount": "0.01",
    "donationCount": 5,
    "campaignId": "camp1",
    "txHash": "0x...",
    "timestamp": "2024-12-02T..."
  }
}
```

---

## 🤝 기여

이슈 및 Pull Request 환영합니다!

---

## 📄 라이선스

MIT License

---

## 🙏 감사

- **Privy** - Embedded Wallet 제공
- **OpenZeppelin** - 스마트 컨트랙트 라이브러리
- **Arbitrum** - Layer 2 솔루션
- **W3C** - DID & VC 표준

---

## 📞 문의

- GitHub Issues
- Email: your-email@example.com

---

## 🎉 MVP 완성!

**블록체인 기부 + DID + 게임화**가 완전히 통합된 플랫폼이 준비되었습니다!

### 차별화 포인트:
- ✅ **진입 장벽 Zero** - 소셜 로그인만으로 Web3 시작
- ✅ **신뢰할 수 있는 신원** - DID 기반 탈중앙화 ID
- ✅ **검증 가능한 기부** - Verifiable Credentials
- ✅ **재미있는 경험** - 게임화된 UX
- ✅ **투명한 기록** - 블록체인 영구 저장

**이제 기부는 투명하고 즐겁습니다!** 🚀
