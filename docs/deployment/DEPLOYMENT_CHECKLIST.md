# ✅ 기부 마을 배포 체크리스트

실제 프로덕션 배포를 위한 단계별 체크리스트입니다.

---

## 🎯 Phase 1: 계정 및 서비스 준비

### 1-1. 외부 서비스 가입 및 설정

- [ ] **Alchemy** 가입 및 앱 생성
  - URL: https://dashboard.alchemy.com
  - Arbitrum Sepolia 네트워크 선택
  - API Key 복사 및 저장
  
- [ ] **Privy** 가입 및 앱 생성
  - URL: https://dashboard.privy.io
  - 새 앱 생성
  - App ID 복사
  - Login Methods 설정:
    - [x] Email
    - [x] Google
    - [x] Twitter
    - [x] Discord
    - [x] GitHub
  - Embedded Wallets 활성화
  
- [ ] **Supabase** 프로젝트 생성
  - URL: https://supabase.com/dashboard
  - 프로젝트 생성
  - Project URL 복사
  - Anon Key 복사
  
- [ ] **Arbiscan** API Key 발급
  - URL: https://arbiscan.io/register
  - API Key 생성 (컨트랙트 검증용)
  
- [ ] **Vercel** 가입
  - URL: https://vercel.com
  - GitHub 연동

### 1-2. 테스트넷 지갑 준비

- [ ] 테스트넷 전용 새 지갑 생성 (MetaMask)
- [ ] Private Key 안전하게 저장
- [ ] Arbitrum Sepolia 네트워크 추가
- [ ] Faucet에서 테스트넷 ETH 받기 (0.05 ETH 권장)
  - https://faucet.quicknode.com/arbitrum/sepolia
  - https://www.alchemy.com/faucets/arbitrum-sepolia

---

## 🔗 Phase 2: 블록체인 (스마트 컨트랙트) 배포

### 2-1. Hardhat 프로젝트 설정

```bash
cd hardhat-setup
npm install
cp .env.example .env
```

- [ ] `.env` 파일에 값 입력:
  - [ ] `PRIVATE_KEY` (테스트넷 지갑)
  - [ ] `ALCHEMY_API_KEY`
  - [ ] `ARBISCAN_API_KEY`

### 2-2. 컴파일 및 테스트

```bash
npm run compile
```

- [ ] 컴파일 성공 확인
- [ ] `artifacts/` 디렉토리 생성 확인

### 2-3. 컨트랙트 배포

```bash
npm run deploy:sepolia
```

- [ ] 배포 성공 메시지 확인
- [ ] 컨트랙트 주소 복사 및 저장:
  ```
  Contract Address: 0x_________________________
  ```
- [ ] Arbiscan에서 컨트랙트 확인:
  - https://sepolia.arbiscan.io/address/[YOUR_CONTRACT_ADDRESS]

### 2-4. 컨트랙트 검증 (선택)

```bash
npx hardhat verify --network arbitrumSepolia [CONTRACT_ADDRESS]
```

- [ ] 검증 완료
- [ ] Arbiscan에서 소스코드 확인 가능

---

## 🖥️ Phase 3: 백엔드 (Supabase) 배포

### 3-1. Supabase CLI 설치 및 연결

```bash
npm install -g supabase
supabase login
supabase link --project-ref [YOUR_PROJECT_ID]
```

- [ ] Supabase 로그인 성공
- [ ] 프로젝트 연결 완료

### 3-2. 환경 변수 설정

Supabase Dashboard → Settings → Edge Functions → Secrets

- [ ] `CONTRACT_ADDRESS`: 배포한 스마트 컨트랙트 주소
- [ ] `ALCHEMY_API_KEY`: Alchemy API Key
- [ ] `PRIVATE_KEY`: 서버용 지갑 Private Key (기부 검증용)

### 3-3. Edge Functions 배포

```bash
supabase functions deploy server
```

- [ ] 배포 성공 확인
- [ ] 배포된 함수 URL 확인:
  ```
  Function URL: https://[project-id].supabase.co/functions/v1/make-server-17e2e0df
  ```

### 3-4. 백엔드 테스트

```bash
curl https://[project-id].supabase.co/functions/v1/make-server-17e2e0df/health \
  -H "Authorization: Bearer [ANON_KEY]"
```

- [ ] Health check 응답 확인
- [ ] Contract address 출력 확인

---

## 💻 Phase 4: 프론트엔드 배포

### 4-1. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
cp .env.example .env
```

- [ ] `.env` 파일에 모든 값 입력:
  - [ ] `VITE_PRIVY_APP_ID`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_CONTRACT_ADDRESS`
  - [ ] `VITE_ALCHEMY_API_KEY`
  - [ ] `VITE_CHAIN_ID=421614`
  - [ ] `VITE_CHAIN_NAME=Arbitrum Sepolia`

### 4-2. 개발 모드 비활성화

`/lib/api.ts` 파일 수정:

```typescript
const ENABLE_BACKEND = true; // false → true로 변경
```

- [ ] `ENABLE_BACKEND = true`로 변경
- [ ] 저장 및 커밋

### 4-3. 로컬 테스트

```bash
npm install
npm run dev
```

- [ ] 로컬 서버 실행 확인
- [ ] 소셜 로그인 테스트
- [ ] 기부 프로세스 테스트 (실제 트랜잭션)
- [ ] Arbiscan에서 트랜잭션 확인

### 4-4. Vercel 배포

#### GitHub 연동 방식 (권장):

1. GitHub에 코드 푸시
2. Vercel에서 Import Project
3. 환경 변수 설정

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

- [ ] GitHub 푸시 완료
- [ ] Vercel에서 프로젝트 import
- [ ] Vercel Dashboard → Settings → Environment Variables에 모든 변수 추가
- [ ] Redeploy 트리거

#### CLI 방식:

```bash
npm install -g vercel
vercel login
vercel

# 환경 변수 추가
vercel env add VITE_PRIVY_APP_ID
vercel env add VITE_CONTRACT_ADDRESS
# ... 기타 변수들

# 프로덕션 배포
vercel --prod
```

- [ ] CLI 배포 완료
- [ ] 배포 URL 확인:
  ```
  Production URL: https://_______.vercel.app
  ```

### 4-5. Privy 설정 업데이트

Privy Dashboard → Settings:

- [ ] Allowed Origins에 배포 URL 추가
  - `https://_______.vercel.app`
- [ ] Redirect URIs 설정
  - `https://_______.vercel.app/auth/callback`

---

## 🧪 Phase 5: 프로덕션 테스트

### 5-1. 기능 테스트

- [ ] **로그인 테스트**
  - [ ] Email 로그인
  - [ ] Google 로그인
  - [ ] Twitter 로그인
  - [ ] Discord 로그인
  - [ ] GitHub 로그인

- [ ] **기부 프로세스**
  - [ ] 캠페인 목록 로드
  - [ ] 기부 모달 열기
  - [ ] 기부 실행 (실제 트랜잭션)
  - [ ] 트랜잭션 확인 대기
  - [ ] 포인트 적립 확인
  - [ ] Arbiscan에서 트랜잭션 확인

- [ ] **게임화 기능**
  - [ ] 포인트 표시
  - [ ] 뱃지 획득
  - [ ] 가구 구매
  - [ ] 방 꾸미기

- [ ] **블록체인 연동**
  - [ ] 트랜잭션 해시 클릭 시 Arbiscan 링크
  - [ ] 실제 블록체인 데이터 조회
  - [ ] DID 문서 생성

### 5-2. 성능 테스트

- [ ] 페이지 로딩 속도 확인
- [ ] 모바일 반응형 확인
- [ ] 다양한 브라우저 테스트
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Mobile Safari
  - [ ] Mobile Chrome

### 5-3. 보안 체크

- [ ] Private Key가 프론트엔드에 노출되지 않는지 확인
- [ ] CORS 설정 확인
- [ ] API 엔드포인트 보안 확인
- [ ] 환경 변수가 `.env`에만 있고 Git에 커밋되지 않았는지 확인

---

## 📊 Phase 6: 모니터링 및 유지보수

### 6-1. 모니터링 설정

- [ ] Vercel Analytics 활성화
- [ ] Supabase Logs 확인 방법 숙지
- [ ] Arbiscan에서 컨트랙트 활동 모니터링

### 6-2. 문서화

- [ ] 최종 컨트랙트 주소 문서화
- [ ] API 엔드포인트 목록 정리
- [ ] 사용자 가이드 작성 (선택)

### 6-3. 백업

- [ ] `.env` 파일 안전한 곳에 백업
- [ ] Private Key 안전하게 보관
- [ ] 컨트랙트 ABI 파일 백업

---

## 🎉 배포 완료!

축하합니다! 이제 실제 사용자들이 투명한 기부를 경험할 수 있습니다.

### 📝 최종 확인 항목:

- [ ] ✅ 스마트 컨트랙트 배포 및 검증
- [ ] ✅ 백엔드 Edge Functions 작동
- [ ] ✅ 프론트엔드 Vercel 배포
- [ ] ✅ 소셜 로그인 작동
- [ ] ✅ 실제 기부 트랜잭션 성공
- [ ] ✅ Arbiscan에서 트랜잭션 확인 가능
- [ ] ✅ 모바일 테스트 완료

### 🔗 중요한 URL들:

```
프로덕션 URL: https://_______.vercel.app
컨트랙트 주소: 0x_________________________
Arbiscan: https://sepolia.arbiscan.io/address/0x_______
Supabase: https://[project-id].supabase.co
```

---

## 🆘 문제 해결

문제가 발생하면 `/DEPLOYMENT_GUIDE.md`의 트러블슈팅 섹션을 참고하세요.

**주요 로그 확인 방법:**
- Vercel: Dashboard → Deployments → Logs
- Supabase: Dashboard → Edge Functions → Logs
- Blockchain: Arbiscan → Transaction Details

---

**준비되셨나요? Phase 1부터 차근차근 시작하세요!** 🚀
