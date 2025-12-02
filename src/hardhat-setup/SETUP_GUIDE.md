# 🚀 Hardhat 설정 및 배포 가이드

## ✅ 파일 구조 확인

hardhat-setup 폴더는 이제 다음과 같이 구성됩니다:

```
hardhat-setup/
├── contracts/
│   └── DonationVillage.sol    ✅ 생성됨
├── scripts/
│   └── deploy.js               ✅ 생성됨
├── .env                        ⚠️ 직접 생성 필요
├── .env.example                ✅ 생성됨
├── hardhat.config.js           ✅ 생성됨
├── package.json                ✅ 생성됨
└── README.md                   ✅ 생성됨
```

---

## 📝 단계별 설정

### 1단계: hardhat-setup 폴더로 이동

```bash
cd hardhat-setup
```

### 2단계: .env 파일 생성

```bash
# .env.example을 복사
cp .env.example .env

# 또는 직접 생성
touch .env
```

### 3단계: .env 파일 편집

```bash
nano .env
```

다음 내용 입력:
```env
PRIVATE_KEY=0x여기에_MetaMask_Private_Key_붙여넣기
ALCHEMY_API_KEY=여기에_Alchemy_API_Key_붙여넣기
```

**예시:**
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
ALCHEMY_API_KEY=abc123xyz456
```

### 4단계: 패키지 설치

```bash
npm install
```

**설치 내용:**
- Hardhat 2.22.16
- Hardhat Toolbox 5.0.0
- OpenZeppelin Contracts 5.0.0
- Ethers.js 및 기타 의존성

### 5단계: 컴파일

```bash
npx hardhat compile
```

**성공 시 출력:**
```
Compiled 1 Solidity file successfully (evm target: paris).
✓
```

### 6단계: 배포

```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

---

## 🎯 배포 성공 예시

```
🚀 Starting deployment...
📍 Network: arbitrumSepolia
👤 Deploying contracts with account: 0x1234567890abcdef1234567890abcdef12345678
💰 Account balance: 0.05 ETH

📝 Deploying DonationVillage contract...
✅ DonationVillage deployed to: 0xABCDEF1234567890ABCDEF1234567890ABCDEF12

📊 Deployment transaction hash: 0x...

🔍 Verifying initial campaigns...
📋 Initial campaign count: 3

📌 Campaign 1:
   Organization: 숲속동물보호센터
   Title: 겨울나기 따뜻한 보금자리 만들기
   Category: 동물
   Goal: 10.0 ETH
   Active: true

📌 Campaign 2:
   Organization: 초록나무재단
   Title: 사막화 방지 나무 심기 프로젝트
   Category: 환경
   Goal: 20.0 ETH
   Active: true

📌 Campaign 3:
   Organization: 희망교육협회
   Title: 소외계층 아동 교육 지원
   Category: 교육
   Goal: 15.0 ETH
   Active: true

📄 Deployment Info:
{
  "network": "arbitrumSepolia",
  "contractAddress": "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
  "deployer": "0x1234567890abcdef1234567890abcdef12345678",
  "deploymentTime": "2025-12-01T12:00:00.000Z",
  "transactionHash": "0x...",
  "campaignCount": "3"
}

🔐 To verify the contract on Arbiscan, run:
npx hardhat verify --network arbitrumSepolia 0xABCDEF1234567890ABCDEF1234567890ABCDEF12

📝 Add these to your .env file:
VITE_CONTRACT_ADDRESS=0xABCDEF1234567890ABCDEF1234567890ABCDEF12
VITE_CHAIN_ID=421614
VITE_CHAIN_NAME="Arbitrum Sepolia"

✨ Deployment completed successfully!
```

---

## 🔑 Private Key 가져오기

### MetaMask에서:
1. MetaMask 확장 프로그램 열기
2. 계정 아이콘 클릭 (우측 상단)
3. "계정 상세정보" 클릭
4. "개인 키 내보내기" 클릭
5. 비밀번호 입력
6. Private Key 복사 (0x로 시작하는 66자)

⚠️ **중요**: 테스트넷 전용 지갑을 사용하세요!

---

## 🌊 Alchemy API Key 가져오기

1. https://www.alchemy.com 방문
2. 무료 계정 생성
3. "Create App" 클릭
4. 설정:
   - Chain: **Arbitrum**
   - Network: **Arbitrum Sepolia**
5. API Key 복사

---

## 💧 Arbitrum Sepolia ETH 받기

### 방법 1: Alchemy Faucet (권장)
```
https://www.alchemy.com/faucets/arbitrum-sepolia
```

### 방법 2: QuickNode Faucet
```
https://faucet.quicknode.com/arbitrum/sepolia
```

### 방법 3: Sepolia → Arbitrum Sepolia 브릿지
1. Sepolia ETH 받기: https://sepoliafaucet.com
2. 브릿지: https://bridge.arbitrum.io

최소 **0.01 ETH** 필요 (가스비 포함)

---

## 🔧 문제 해결

### 에러 1: "contracts not found"

**원인**: contracts 폴더가 없음

**해결**: 이미 생성되어 있어야 함. 확인:
```bash
ls -la contracts/
# DonationVillage.sol이 있어야 함
```

### 에러 2: "Private key too short"

**원인**: .env 파일의 PRIVATE_KEY가 잘못됨

**해결**:
1. .env 파일 확인: `cat .env`
2. PRIVATE_KEY가 0x로 시작하고 66자인지 확인
3. `/FIX_PRIVATE_KEY_ERROR.md` 참조

### 에러 3: "ReentrancyGuard not found"

**원인**: OpenZeppelin 패키지가 설치되지 않음

**해결**:
```bash
npm install
```

### 에러 4: "Insufficient funds"

**원인**: 지갑에 ETH가 부족함

**해결**:
1. Faucet에서 Arbitrum Sepolia ETH 받기
2. 지갑 잔액 확인:
   ```bash
   npx hardhat run scripts/check-balance.js --network arbitrumSepolia
   ```

---

## 🎯 빠른 명령어

```bash
# 1. hardhat-setup 폴더로 이동
cd hardhat-setup

# 2. .env 파일 생성 및 편집
cp .env.example .env
nano .env

# 3. 패키지 설치
npm install

# 4. 컴파일
npx hardhat compile

# 5. 배포
npx hardhat run scripts/deploy.js --network arbitrumSepolia

# 6. 컨트랙트 검증 (선택)
npx hardhat verify --network arbitrumSepolia 0x컨트랙트_주소
```

---

## ✅ 체크리스트

배포 전 확인:
- [ ] hardhat-setup 폴더에 있음
- [ ] .env 파일 생성됨
- [ ] PRIVATE_KEY 설정 (0x + 64자)
- [ ] ALCHEMY_API_KEY 설정 (선택)
- [ ] npm install 완료
- [ ] Arbitrum Sepolia ETH 보유 (최소 0.01)
- [ ] npx hardhat compile 성공
- [ ] 배포 준비 완료

---

## 📚 추가 문서

- **빠른 시작**: `/QUICK_START.md`
- **Private Key 에러**: `/FIX_PRIVATE_KEY_ERROR.md`
- **OpenZeppelin v5**: `/FIX_OPENZEPPELIN_V5.md`
- **Hardhat 버전**: `/SOLUTION.md`

---

## 🔐 보안 주의사항

⚠️ **절대 하지 말 것:**
- 실제 자산이 있는 지갑의 Private Key 사용
- .env 파일을 Git에 커밋
- Private Key를 다른 사람과 공유
- Private Key를 스크린샷으로 공유

✅ **반드시 할 것:**
- 테스트넷 전용 지갑 사용
- .gitignore에 .env 추가
- Private Key를 안전하게 보관
- 배포 후 컨트랙트 주소 저장

---

## 🎉 배포 후 다음 단계

1. **컨트랙트 주소 복사**
2. **프론트엔드 업데이트**:
   - App.tsx의 CONTRACT_ADDRESS 업데이트
3. **Arbiscan 확인**:
   - https://sepolia.arbiscan.io/address/0x컨트랙트_주소
4. **컨트랙트 검증** (선택):
   ```bash
   npx hardhat verify --network arbitrumSepolia 0x컨트랙트_주소
   ```
5. **테스트 기부 진행**

---

**모든 준비가 완료되었습니다!** 🚀

지금 바로 배포를 시작하세요! 💪
