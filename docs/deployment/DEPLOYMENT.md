# 🚀 배포 가이드

## 📋 목차
1. [사전 준비](#사전-준비)
2. [Hardhat 환경 설정](#hardhat-환경-설정)
3. [스마트 컨트랙트 배포](#스마트-컨트랙트-배포)
4. [Privy 설정](#privy-설정)
5. [Supabase 설정](#supabase-설정)
6. [프론트엔드 배포](#프론트엔드-배포)

---

## 사전 준비

### 필요한 것들

1. **Node.js** (v18 이상)
2. **Arbitrum Sepolia 테스트넷 ETH**
   - [Arbitrum Faucet](https://faucet.quicknode.com/arbitrum/sepolia)에서 받기
3. **Privy 계정**
   - [Privy Dashboard](https://dashboard.privy.io/)에서 앱 생성
4. **Supabase 프로젝트**
   - [Supabase](https://supabase.com/)에서 프로젝트 생성
5. **Arbiscan API Key** (선택)
   - [Arbiscan](https://arbiscan.io/apis)에서 발급

---

## Hardhat 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일 수정:

```env
# 배포자 지갑 프라이빗 키 (테스트넷용)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Arbitrum RPC URL
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Arbiscan API Key (컨트랙트 검증용)
ARBISCAN_API_KEY=your_arbiscan_api_key

# Privy
VITE_PRIVY_APP_ID=your_privy_app_id

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

⚠️ **중요**: 절대 실제 자산이 있는 지갑의 프라이빗 키를 사용하지 마세요!

---

## 스마트 컨트랙트 배포

### 1. 컴파일

```bash
npx hardhat compile
```

### 2. 로컬 테스트

```bash
npx hardhat test
```

### 3. Arbitrum Sepolia 테스트넷에 배포

```bash
npm run deploy:sepolia
```

배포가 완료되면 다음과 같은 출력이 나타납니다:

```
✅ DonationLedger deployed to: 0x123...abc
📝 Creating initial campaigns...
✅ Campaign created: 겨울나기 따뜻한 보금자리 만들기
✅ Campaign created: 사막화 방지 나무 심기 프로젝트
✅ Campaign created: 소외계층 아동 교육 지원
🎉 Deployment complete!

Contract Address: 0x123...abc
Network: arbitrumSepolia
```

### 4. 컨트랙트 검증 (Arbiscan)

```bash
npx hardhat verify --network arbitrumSepolia <CONTRACT_ADDRESS>
```

### 5. 환경 변수 업데이트

`.env` 파일에 컨트랙트 주소 추가:

```env
VITE_CONTRACT_ADDRESS=0x123...abc
VITE_CHAIN_ID=421614
```

---

## Privy 설정

### 1. Privy 대시보드에서 앱 생성

1. [Privy Dashboard](https://dashboard.privy.io/)에 로그인
2. "Create App" 클릭
3. 앱 이름 입력 (예: "Donation Village")

### 2. Embedded Wallets 활성화

1. 좌측 메뉴에서 "Embedded Wallets" 클릭
2. "Enable Embedded Wallets" 활성화
3. "Create on Login" 옵션 활성화

### 3. 로그인 방법 설정

1. 좌측 메뉴에서 "Login Methods" 클릭
2. Email, Google, Twitter 활성화

### 4. 지원 네트워크 추가

1. 좌측 메뉴에서 "Networks" 클릭
2. "Add Network" 클릭
3. Arbitrum Sepolia 추가:
   - Chain ID: `421614`
   - RPC URL: `https://sepolia-rollup.arbitrum.io/rpc`

### 5. App ID 복사

1. "Settings" → "API Keys"
2. App ID 복사
3. `.env` 파일에 추가:

```env
VITE_PRIVY_APP_ID=your_app_id_here
```

---

## Supabase 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 비밀번호 설정

### 2. 환경 변수 설정

1. 프로젝트 대시보드에서 "Settings" → "API"
2. URL과 API Keys 복사
3. `.env` 파일에 추가:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Edge Function 배포

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref <PROJECT_REF>

# Edge Function 배포
supabase functions deploy server
```

### 4. 환경 변수 설정 (Supabase)

```bash
supabase secrets set CONTRACT_ADDRESS=0x123...abc
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## 프론트엔드 배포

### 로컬 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com/)에 로그인
3. "New Project" 클릭
4. GitHub 레포 선택
5. 환경 변수 설정:
   - `VITE_PRIVY_APP_ID`
   - `VITE_CONTRACT_ADDRESS`
   - `VITE_CHAIN_ID`
6. "Deploy" 클릭

---

## 📊 배포 체크리스트

- [ ] Node.js 설치 확인
- [ ] Arbitrum Sepolia ETH 받기
- [ ] Hardhat 컴파일 성공
- [ ] 스마트 컨트랙트 배포 완료
- [ ] Arbiscan에서 컨트랙트 검증
- [ ] Privy 앱 생성 및 설정
- [ ] Supabase 프로젝트 생성
- [ ] Supabase Edge Function 배포
- [ ] 모든 환경 변수 설정 완료
- [ ] 프론트엔드 빌드 성공
- [ ] 프론트엔드 배포 완료

---

## 🧪 테스트 방법

### 1. 로그인 테스트

1. 프론트엔드 접속
2. "마을 입장하기" 클릭
3. Privy 로그인 (이메일/소셜)
4. 지갑 자동 생성 확인

### 2. 기부 테스트

1. 마을에서 단체 집 클릭
2. 캠페인 선택
3. "이 캠페인에 기부하기" 클릭
4. 금액 입력
5. "블록체인에 기부하기" 클릭
6. 트랜잭션 완료 대기
7. Arbiscan에서 트랜잭션 확인

### 3. DID 확인

1. 가방 → 지갑 탭
2. DID 주소 확인: `did:ethr:arbitrum-sepolia:0x...`
3. 기부 내역 확인

### 4. 포인트/뱃지 확인

1. 기부 완료 후 포인트 적립 확인
2. 가방 → 뱃지 탭에서 뱃지 획득 확인

---

## 🔧 문제 해결

### 컨트랙트 배포 실패

```
Error: insufficient funds for gas
```

**해결**: Arbitrum Sepolia Faucet에서 테스트 ETH 받기

### Privy 연결 실패

```
Error: Invalid App ID
```

**해결**: `.env` 파일의 `VITE_PRIVY_APP_ID` 확인

### 트랜잭션 실패

```
Error: execution reverted
```

**해결**: 
1. 지갑 잔액 확인
2. 컨트랙트 주소 확인
3. 캠페인이 활성화되어 있는지 확인

---

## 📚 추가 리소스

- [Hardhat 문서](https://hardhat.org/docs)
- [Privy 문서](https://docs.privy.io/)
- [Arbitrum 문서](https://docs.arbitrum.io/)
- [Supabase 문서](https://supabase.com/docs)
- [DID 표준](https://www.w3.org/TR/did-core/)

---

## 🚨 보안 주의사항

1. **절대 프라이빗 키를 공개하지 마세요**
2. **테스트넷에서 충분히 테스트 후 메인넷 배포**
3. **SERVICE_ROLE_KEY는 서버 환경에서만 사용**
4. **실제 서비스는 보안 감사 필수**
5. **Figma Make는 프로토타입용이므로 실제 서비스 시 별도 인프라 필요**

---

## 💬 지원

문제가 발생하면 다음을 확인하세요:

1. 모든 환경 변수가 올바르게 설정되어 있는지
2. 네트워크 연결 상태
3. 브라우저 콘솔 에러 메시지
4. Hardhat 로그

Happy Coding! 🎉
