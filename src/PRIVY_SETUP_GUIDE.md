# 🔐 Privy 설정 가이드

Privy를 사용하여 Google OAuth와 Embedded Wallet을 구현합니다.

## 📝 1단계: Privy 계정 생성

1. https://privy.io 방문
2. "Start Building" 클릭
3. 이메일로 가입

## 🎯 2단계: 앱 생성

1. Privy Dashboard에 로그인
2. "Create New App" 클릭
3. 앱 이름: "Donation Village"
4. Network: Arbitrum Sepolia 선택

## 🔑 3단계: App ID 복사

1. Dashboard > Settings > API Keys
2. "App ID" 복사 (예: `clxxxxxxxxxxxxxxxx`)

## ⚙️ 4단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
VITE_PRIVY_APP_ID=clxxxxxxxxxxxxxxxx
```

## 🌐 5단계: Google OAuth 설정

### Privy Dashboard에서:

1. Settings > Login Methods
2. "Google" 활성화
3. OAuth 설정:
   - Redirect URI: `http://localhost:5173` (개발용)
   - Production URI: `https://your-domain.com` (배포용)

### Google Cloud Console에서 (선택사항 - 커스텀 OAuth):

1. https://console.cloud.google.com 방문
2. 새 프로젝트 생성: "Donation Village"
3. API & Services > Credentials
4. "Create Credentials" > "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized redirect URIs:
   ```
   https://auth.privy.io/api/v1/oauth/callback
   ```
7. Client ID와 Client Secret 복사
8. Privy Dashboard에 입력

## 🎨 6단계: Embedded Wallet 설정

Privy Dashboard > Settings > Embedded Wallets:

```
✅ Create wallet on first login
✅ Skip password requirement
✅ Default chain: Arbitrum Sepolia
```

## 🚀 7단계: 테스트

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 열기

### 테스트 시나리오:

1. **이메일 로그인**
   - "이메일로 시작하기" 클릭
   - 이메일 입력
   - OTP 코드 확인
   - ✅ 자동으로 Embedded Wallet 생성

2. **구글 로그인**
   - "구글 계정으로 시작하기" 클릭
   - 구글 계정 선택
   - ✅ 자동으로 Embedded Wallet 생성
   - ✅ DID 자동 발급

## 🔍 8단계: 확인 사항

### 브라우저 콘솔에서:

```javascript
// 로그인 후
console.log('User:', user);
console.log('Wallet:', user.walletAddress);
console.log('DID:', user.did);
```

### 예상 출력:

```
✅ User: { email: "test@gmail.com", ... }
✅ Wallet: 0x1234...5678
✅ DID: did:ethr:arbitrum-sepolia:0x1234...5678
```

## 🎯 9단계: DID 확인

1. 로그인 후 마을 진입
2. 하단 "마이하우스" 클릭
3. "DID & 증명서" 탭 클릭
4. ✅ DID Document 확인
5. ✅ Verifiable Credentials 확인

## 🌍 10단계: 배포 설정

### Vercel/Netlify 환경 변수:

```
VITE_PRIVY_APP_ID=your-app-id
VITE_CONTRACT_ADDRESS=your-contract-address
VITE_ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
```

### Privy Dashboard > Settings > Domains:

```
✅ localhost:5173 (개발)
✅ your-domain.vercel.app (배포)
```

## 🔧 트러블슈팅

### 문제: "Privy not configured"

**해결:**
```bash
# .env 파일 확인
cat .env

# App ID가 정확한지 확인
# Privy Dashboard에서 다시 복사
```

### 문제: Google OAuth 실패

**해결:**
1. Privy Dashboard > Login Methods > Google 활성화 확인
2. Redirect URI 확인
3. 브라우저 쿠키 허용 확인

### 문제: Embedded Wallet 생성 안 됨

**해결:**
1. Privy Dashboard > Embedded Wallets 설정 확인
2. "Create on login" 활성화
3. 브라우저 캐시 삭제 후 재시도

## 📚 참고 자료

- Privy Docs: https://docs.privy.io
- React Auth Guide: https://docs.privy.io/guide/react/
- Embedded Wallets: https://docs.privy.io/guide/react/wallets/embedded

## ✅ 체크리스트

```
□ Privy 계정 생성
□ 앱 생성 완료
□ App ID 복사
□ .env 파일 설정
□ Google OAuth 활성화
□ Embedded Wallet 설정
□ 로컬 테스트 성공
□ DID 확인 완료
□ 기부 트랜잭션 테스트
□ 배포 환경 설정
```

---

## 🎉 완료!

이제 사용자는:
- ✅ 이메일 또는 구글로 로그인
- ✅ 자동으로 Embedded Wallet 생성
- ✅ 자동으로 DID 발급
- ✅ 메타마스크 없이 기부 가능

**투명한 선의, 따뜻한 기부!** 🏘️
