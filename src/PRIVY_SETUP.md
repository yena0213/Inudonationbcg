# Privy 설정 가이드

## 1️⃣ Privy App ID 발급받기

### 단계 1: Privy 계정 생성
1. https://dashboard.privy.io/ 방문
2. "Sign Up" 클릭하여 계정 생성
3. 이메일 인증 완료

### 단계 2: 새 앱 생성
1. Dashboard에서 "Create App" 클릭
2. 앱 이름 입력 (예: "Donation Village")
3. 생성 완료

### 단계 3: App ID 복사
1. Dashboard에서 생성한 앱 선택
2. "Settings" → "Basics" 메뉴로 이동
3. **App ID** 복사 (예: `clpxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

## 2️⃣ 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Privy 설정
VITE_PRIVY_APP_ID=여기에_App_ID_붙여넣기

# 배포된 스마트 컨트랙트 주소
VITE_CONTRACT_ADDRESS=0x...

# 체인 정보 (Arbitrum Sepolia)
VITE_CHAIN_ID=421614
VITE_CHAIN_NAME="Arbitrum Sepolia"
```

**예시:**
```bash
VITE_PRIVY_APP_ID=clpqwe123-4567-89ab-cdef-0123456789ab
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_CHAIN_ID=421614
VITE_CHAIN_NAME="Arbitrum Sepolia"
```

---

## 3️⃣ Privy Dashboard 설정

### 로그인 방식 활성화
1. Privy Dashboard → "Login Methods"
2. 다음 항목들을 **활성화**:
   - ✅ Email
   - ✅ Google
   - ✅ Twitter
   - ✅ Discord
   - ✅ GitHub

### Embedded Wallet 설정
1. Privy Dashboard → "Embedded Wallets"
2. 다음 설정 확인:
   - ✅ "Create wallet on login" 활성화
   - ✅ "Require password" 비활성화 (간편 로그인)

### 체인 설정
1. Privy Dashboard → "Chains"
2. **Arbitrum Sepolia (421614)** 추가
3. **Solana 관련 체인은 비활성화** (의존성 충돌 방지)

### 허용된 도메인 설정
1. Privy Dashboard → "Settings" → "Allowed Origins"
2. 다음 도메인 추가:
   - `http://localhost:5173` (개발 환경)
   - `https://yourdomain.com` (배포 시 실제 도메인)

---

## 4️⃣ 실행하기

```bash
# 환경 변수 확인
cat .env

# 개발 서버 실행
npm run dev

# 또는
yarn dev
```

---

## 5️⃣ 확인 사항

### ✅ 로그인 테스트
1. 앱 실행 후 로그인 화면으로 이동
2. "로그인 / 회원가입" 버튼 클릭
3. Privy 로그인 모달이 나타나는지 확인
4. 이메일 또는 소셜 로그인 시도
5. 로그인 성공 후 마을 화면으로 이동하는지 확인

### ✅ DID 생성 확인
1. 로그인 후 "마이하우스" 이동
2. "DID & 증명서" 탭 클릭
3. DID가 생성되어 있는지 확인
   - 형식: `did:ethr:arbitrum-sepolia:0x...`

### ✅ 지갑 주소 확인
1. 브라우저 개발자 도구 → Console 열기
2. 로그인 시 다음 로그 확인:
   ```
   ✅ Privy 로그인 성공: { email: '...', walletAddress: '0x...' }
   ✅ DID 생성: did:ethr:arbitrum-sepolia:0x...
   ```

---

## 6️⃣ 문제 해결

### 문제: App ID가 없다고 나옴
**해결:** `.env` 파일의 `VITE_PRIVY_APP_ID`를 확인하세요. `VITE_` 접두사가 필수입니다.

### 문제: Solana 관련 오류
**해결:** 
1. Privy Dashboard에서 Solana 체인 비활성화
2. `/index.tsx`에서 `externalWallets.solana.connectors: []` 설정 확인

### 문제: CORS 에러
**해결:** 
1. Privy Dashboard → "Allowed Origins"에 현재 도메인 추가
2. `http://localhost:5173` 추가 확인

### 문제: 로그인 후 지갑 주소가 없음
**해결:** 
1. Privy Dashboard → "Embedded Wallets" 활성화 확인
2. "Create wallet on login" 설정 확인

---

## 7️⃣ 배포 시 주의사항

### Vercel/Netlify 배포
1. 환경 변수를 플랫폼에 추가:
   - `VITE_PRIVY_APP_ID`
   - `VITE_CONTRACT_ADDRESS`
   - `VITE_CHAIN_ID`
   - `VITE_CHAIN_NAME`

2. Privy Dashboard → "Allowed Origins"에 배포 URL 추가:
   - 예: `https://your-app.vercel.app`

### 보안
- ⚠️ `.env` 파일은 절대 Git에 커밋하지 마세요
- ⚠️ `.gitignore`에 `.env` 추가 확인
- ✅ App ID는 공개되어도 괜찮습니다 (클라이언트 사이드)

---

## 📚 참고 자료

- Privy 공식 문서: https://docs.privy.io/
- Privy React SDK: https://docs.privy.io/guide/react/
- DID 표준: https://www.w3.org/TR/did-core/
- Arbitrum Sepolia: https://sepolia.arbiscan.io/

---

## 🎉 완료!

이제 Privy Embedded Wallet과 DID 기능이 완전히 통합되었습니다!

- ✅ 소셜 로그인 (Google, Twitter, Discord, GitHub, Email)
- ✅ 자동 지갑 생성 (Embedded Wallet)
- ✅ DID 기반 신원 관리
- ✅ Verifiable Credentials 발급
- ✅ Arbitrum Sepolia 네트워크 연동
