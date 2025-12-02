# 🚀 빠른 배포 가이드 (Privy + DID 통합)

## ✅ 완료된 작업

- ✅ 스마트 컨트랙트 Arbitrum Sepolia에 배포 완료
- ✅ Privy SDK 통합 완료
- ✅ DID (Decentralized Identifier) 구현 완료
- ✅ Verifiable Credentials 자동 발급 시스템 구현 완료
- ✅ Solana 의존성 오류 해결 완료

---

## 🎯 이제 할 일 (3단계만!)

### 1️⃣ Privy App ID 발급 (5분)

```bash
# 1. Privy 계정 생성
https://dashboard.privy.io/

# 2. 새 앱 생성
- "Create App" 클릭
- 앱 이름: "Donation Village"

# 3. App ID 복사
- Settings → Basics → App ID 복사
```

### 2️⃣ 환경 변수 설정 (2분)

```bash
# 프로젝트 루트에 .env 파일 생성
cp .env.example .env

# .env 파일 수정
VITE_PRIVY_APP_ID=여기에_복사한_App_ID_붙여넣기
VITE_CONTRACT_ADDRESS=배포된_컨트랙트_주소
```

### 3️⃣ Privy Dashboard 설정 (3분)

#### Login Methods
- ✅ Email
- ✅ Google
- ✅ Twitter
- ✅ Discord
- ✅ GitHub

#### Chains
- ✅ Arbitrum Sepolia (421614) 추가
- ❌ Solana 체인 비활성화

#### Allowed Origins
- ✅ `http://localhost:5173` 추가

---

## 🎮 실행하기

```bash
# 설정 확인
bash check-privy-setup.sh

# 개발 서버 실행
npm run dev
```

---

## 🧪 테스트 시나리오

### 1. 로그인 테스트
1. ✅ 앱 실행 → 로그인 화면
2. ✅ "로그인 / 회원가입" 클릭
3. ✅ Privy 모달 나타남
4. ✅ Google로 로그인
5. ✅ 자동으로 지갑 생성됨
6. ✅ DID 자동 생성됨
7. ✅ 마을 화면으로 이동

### 2. DID 확인
1. ✅ "마이하우스" 클릭
2. ✅ "DID & 증명서" 탭 클릭
3. ✅ DID 정보 확인:
   ```
   did:ethr:arbitrum-sepolia:0x...
   ```

### 3. 기부 및 VC 발급
1. ✅ 단체 집 방문
2. ✅ "기부하기" 클릭
3. ✅ 기부 완료
4. ✅ Verifiable Credential 자동 발급
5. ✅ "마이하우스" → "DID & 증명서"에서 확인
6. ✅ 기부 내역, 트랜잭션 해시 표시

---

## 📊 주요 기능

### 🔐 Privy Embedded Wallet
- 소셜 로그인만으로 자동 지갑 생성
- 메타마스크 설치 불필요
- 사용자 친화적인 UX

### 🆔 DID (Decentralized Identifier)
- W3C 표준 기반
- 형식: `did:ethr:arbitrum-sepolia:{address}`
- 탈중앙화 신원 증명

### 📜 Verifiable Credentials
- 기부 완료 시 자동 발급
- W3C VC 표준 준수
- 블록체인 기반 검증 가능
- localStorage에 안전하게 저장

### 🎮 게임화
- 기부 시 포인트 획득
- 포인트로 가구 구매
- 나만의 집 꾸미기
- 뱃지 시스템

---

## 🔧 문제 해결

### Q: Privy 모달이 나타나지 않아요
**A:** 
1. `.env` 파일의 `VITE_PRIVY_APP_ID` 확인
2. Privy Dashboard → Allowed Origins에 `http://localhost:5173` 추가
3. 브라우저 콘솔에서 에러 확인

### Q: Solana 관련 오류가 나와요
**A:** 
1. Privy Dashboard → Chains에서 Solana 비활성화
2. `/index.tsx`에서 `externalWallets.solana.connectors: []` 확인됨

### Q: 로그인 후 지갑 주소가 없어요
**A:** 
1. Privy Dashboard → Embedded Wallets 활성화
2. "Create wallet on login" 설정 확인

### Q: DID가 생성되지 않아요
**A:** 
1. 브라우저 콘솔 확인
2. localStorage 확인: `did_document_{address}` 키 존재 확인
3. 로그아웃 후 재로그인

---

## 📁 프로젝트 구조

```
donation-village/
├── components/
│   ├── LoginScreen.tsx         # Privy 로그인
│   ├── MyHouse.tsx             # DID & VC 표시
│   └── ...
├── lib/
│   ├── did.ts                  # DID 유틸리티
│   └── contract.ts             # 스마트 컨트랙트 연동
├── hardhat-setup/              # 스마트 컨트랙트
│   ├── contracts/
│   └── scripts/deploy.js
├── index.tsx                   # Privy Provider
├── App.tsx                     # 메인 앱
├── .env                        # 환경 변수 (직접 생성)
└── .env.example                # 환경 변수 템플릿
```

---

## 🌐 배포 (Vercel/Netlify)

### 환경 변수 추가
```bash
VITE_PRIVY_APP_ID=your_app_id
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=421614
VITE_CHAIN_NAME="Arbitrum Sepolia"
```

### Privy Dashboard 설정
```
Allowed Origins에 추가:
https://your-app.vercel.app
```

---

## 📚 참고 문서

- [PRIVY_SETUP.md](./PRIVY_SETUP.md) - 상세 Privy 설정 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 스마트 컨트랙트 배포 가이드
- Privy 공식 문서: https://docs.privy.io/
- DID 표준: https://www.w3.org/TR/did-core/
- VC 표준: https://www.w3.org/TR/vc-data-model/

---

## 🎉 완성!

**Privy + DID + Verifiable Credentials**가 완전히 통합된 블록체인 기부 플랫폼이 준비되었습니다!

### 주요 차별점:
- ✅ **진입 장벽 제거**: 소셜 로그인만으로 시작
- ✅ **신원 증명**: DID 기반 탈중앙화 신원
- ✅ **투명성**: 블록체인 기록 + Verifiable Credentials
- ✅ **게임화**: 동물의 숲 스타일 UX
- ✅ **확장성**: L2 네트워크로 낮은 수수료

**MVP로 딱 적절한 범위입니다!** 🚀
