# 🚀 Privy 빠른 시작 가이드

## 📦 설치 완료!

필요한 패키지가 모두 추가되었습니다:
- `@privy-io/react-auth` - Privy React SDK
- `@privy-io/wagmi` - Wagmi 통합
- `wagmi` - Ethereum 라이브러리
- `viem` - 타입세이프 Ethereum

## 🔑 1단계: Privy App ID 받기 (5분)

### 방법 1: Privy Dashboard (권장)

1. https://privy.io 방문
2. "Start Building" 클릭하여 가입
3. 새 앱 생성: "Donation Village"
4. Dashboard > Settings에서 **App ID** 복사
5. `.env` 파일 생성:

```bash
VITE_PRIVY_APP_ID=clxxxxxxxxxxxxxxxx
```

### 방법 2: 테스트용 임시 ID (즉시)

테스트만 하려면 임시로 사용 가능:
```bash
VITE_PRIVY_APP_ID=test-app-id
```

⚠️ **주의**: 실제 배포 시에는 반드시 실제 App ID 필요!

## ⚙️ 2단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
# Privy
VITE_PRIVY_APP_ID=your-privy-app-id

# 블록체인 (선택사항 - 기본값 있음)
VITE_CONTRACT_ADDRESS=
VITE_ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
VITE_CHAIN_ID=421614
```

## 🎯 3단계: 실행

```bash
# 패키지 설치 (이미 완료됨)
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:5173 열기

## ✅ 4단계: 테스트

### 시나리오 1: 이메일 로그인

1. "이메일로 시작하기" 클릭
2. 이메일 주소 입력 (예: test@example.com)
3. Privy가 OTP 코드 전송
4. 코드 입력
5. ✅ **자동으로 Embedded Wallet 생성!**
6. ✅ **자동으로 DID 발급!**

### 시나리오 2: 구글 로그인

1. "구글 계정으로 시작하기" 클릭
2. 구글 계정 선택
3. ✅ **즉시 로그인 + 지갑 생성 + DID 발급!**

### 시나리오 3: DID 확인

1. 로그인 후 마을 진입
2. 하단 "마이하우스" 클릭
3. "DID & 증명서" 탭 선택
4. ✅ **DID Document 확인**
5. ✅ **Verifiable Credentials 확인**

## 🔍 기능 확인

### 브라우저 콘솔에서:

로그인 후 콘솔에 다음 로그가 나타나야 함:

```
✅ Privy Ready
✅ User authenticated
✅ Wallet created: 0x1234...5678
✅ DID generated: did:ethr:arbitrum-sepolia:0x1234...5678
```

### 화면에서:

- ✅ 마을 화면 진입
- ✅ 사용자 이름 표시
- ✅ 지갑 주소 표시 (상단)
- ✅ DID 탭에서 증명서 확인

## 🎨 Privy 설정 커스터마이징

`/App.tsx`에서 설정 변경 가능:

```typescript
<PrivyProvider
  appId={PRIVY_APP_ID}
  config={{
    // 로그인 방법
    loginMethods: ['email', 'google'],
    
    // UI 테마
    appearance: {
      theme: 'light',        // 'light' | 'dark'
      accentColor: '#10b981', // 브랜드 색상
      logo: 'https://...',    // 로고 URL
    },
    
    // Embedded Wallet 설정
    embeddedWallets: {
      createOnLogin: 'users-without-wallets', // 자동 생성
      requireUserPasswordOnCreate: false,     // 비밀번호 불필요
    },
    
    // 체인 설정
    defaultChain: arbitrumSepolia,
    supportedChains: [arbitrumSepolia],
  }}
>
```

## 🌐 Google OAuth 활성화

### Privy Dashboard에서:

1. Settings > Login Methods
2. "Google" 토글 ON
3. (선택) 커스텀 OAuth 설정

### 자동 설정 (권장):

Privy가 자동으로 Google OAuth 처리!
별도 Google Cloud Console 설정 불필요

## 📱 지원되는 로그인 방법

현재 활성화된 방법:
- ✅ 이메일 (OTP)
- ✅ 구글 계정

추가 가능한 방법 (Privy Dashboard에서):
- Twitter
- Discord
- GitHub
- Apple
- SMS

## 🔐 보안 기능

Privy가 자동으로 처리:
- ✅ Embedded Wallet 암호화 저장
- ✅ 프라이빗 키 안전 관리
- ✅ MFA (Multi-Factor Auth) 지원
- ✅ 세션 관리

## 🐛 트러블슈팅

### 문제: "Privy not configured"

**원인**: App ID가 없거나 잘못됨

**해결**:
```bash
# .env 파일 확인
cat .env

# App ID가 있는지 확인
# 없으면 Privy Dashboard에서 복사
```

### 문제: "로그인 버튼이 클릭 안 됨"

**원인**: Privy SDK 초기화 중

**해결**:
- 몇 초 기다리기
- 브라우저 콘솔에서 에러 확인
- 페이지 새로고침

### 문제: "Embedded Wallet이 생성 안 됨"

**원인**: Privy 설정 문제

**해결**:
1. Privy Dashboard > Settings > Embedded Wallets
2. "Create on login" 활성화 확인
3. 브라우저 캐시 삭제
4. 다시 로그인

### 문제: "DID가 표시 안 됨"

**원인**: Wallet 생성 전 DID 조회 시도

**해결**:
- 로그인 완료까지 대기
- 마이하우스에서 확인
- 새로고침 후 재확인

## 📚 더 알아보기

- [Privy Docs](https://docs.privy.io)
- [Embedded Wallets Guide](https://docs.privy.io/guide/react/wallets/embedded)
- [DID Specification](https://www.w3.org/TR/did-core/)

## ✨ 다음 단계

1. ✅ Privy 로그인 작동 확인
2. ✅ DID 생성 확인
3. 🔲 스마트 컨트랙트 배포
4. 🔲 실제 기부 트랜잭션 테스트
5. 🔲 배포 환경 설정

## 🎉 완료!

이제 사용자는:
- 이메일이나 구글로 **간편 로그인**
- 자동으로 **Embedded Wallet 생성**
- 자동으로 **DID 발급**
- **메타마스크 없이** 기부 가능!

**투명한 선의, 따뜻한 기부!** 🏘️
