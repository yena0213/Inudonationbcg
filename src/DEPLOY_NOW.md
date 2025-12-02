# 🚀 지금 바로 배포하기

## ✅ 준비 완료!

모든 파일이 준비되었습니다. 이제 배포만 하면 됩니다!

---

## 📂 프로젝트 구조

```
/ (루트)
├── hardhat-setup/          ✅ 배포용 폴더
│   ├── contracts/
│   │   └── DonationVillage.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── hardhat.config.js
│   ├── package.json
│   └── .env               ⚠️ 직접 생성 필요
├── contracts/              (프론트엔드용)
├── App.tsx
└── ...
```

---

## 🎯 방법 1: hardhat-setup 폴더에서 배포 (권장)

### 단계 1: .env 파일 생성

**루트에서 실행:**
```bash
# hardhat-setup/.env 파일 생성
cat > hardhat-setup/.env << 'EOF'
PRIVATE_KEY=0x여기에_MetaMask_Private_Key_붙여넣기
ALCHEMY_API_KEY=여기에_Alchemy_API_Key_붙여넣기
EOF
```

또는 **에디터로 직접 생성:**
```bash
nano hardhat-setup/.env
```

내용:
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
ALCHEMY_API_KEY=abc123xyz456
```

### 단계 2: 패키지 설치

```bash
cd hardhat-setup
npm install
```

### 단계 3: 컴파일

```bash
npx hardhat compile
```

### 단계 4: 배포

```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

---

## 🎯 방법 2: 루트에서 직접 배포

hardhat-setup 폴더로 이동하지 않고 루트에서 실행:

### 단계 1: .env 파일 생성

```bash
nano hardhat-setup/.env
```

### 단계 2: 배포 스크립트 실행

```bash
# hardhat-setup 폴더로 이동
cd hardhat-setup

# 패키지 설치
npm install

# 컴파일
npx hardhat compile

# 배포
npx hardhat run scripts/deploy.js --network arbitrumSepolia

# 다시 루트로
cd ..
```

---

## 🎯 방법 3: 원라이너 (가장 빠름!)

모든 것을 한 번에:

```bash
# .env 파일이 있다고 가정하고
cd hardhat-setup && \
npm install && \
npx hardhat compile && \
npx hardhat run scripts/deploy.js --network arbitrumSepolia && \
cd ..
```

---

## 📝 .env 파일 템플릿

`hardhat-setup/.env` 파일에 다음을 입력하세요:

```env
# MetaMask Private Key (0x로 시작하는 66자)
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Alchemy API Key (선택사항)
ALCHEMY_API_KEY=abc123xyz456

# Arbiscan API Key (검증용, 선택사항)
ARBISCAN_API_KEY=
```

---

## 🔑 Private Key 가져오기

### MetaMask:
1. MetaMask 열기
2. 계정 아이콘 클릭 (우측 상단)
3. "계정 상세정보" 클릭
4. "개인 키 내보내기" 클릭
5. 비밀번호 입력
6. Private Key 복사 (0x + 64자 = 총 66자)

**예시:**
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
└─ 0x (2자) + 64자 = 총 66자
```

⚠️ **중요**: 테스트넷 전용 지갑을 사용하세요!

---

## 🌊 Alchemy API Key (선택사항)

Alchemy를 사용하면 더 안정적인 RPC를 사용할 수 있습니다.

### 가져오기:
1. https://www.alchemy.com 방문
2. 무료 계정 생성
3. "Create App" 클릭
4. Chain: **Arbitrum**, Network: **Arbitrum Sepolia**
5. API Key 복사

### 없어도 됩니다!
Alchemy API Key가 없어도 배포는 가능합니다. 
공개 RPC(`https://sepolia-rollup.arbitrum.io/rpc`)를 사용합니다.

---

## 💧 Arbitrum Sepolia ETH 받기

### Alchemy Faucet (권장):
```
https://www.alchemy.com/faucets/arbitrum-sepolia
```

1. 지갑 주소 입력
2. "Send Me ETH" 클릭
3. 약 0.1 ETH 받음

### 필요한 양:
- 최소: **0.01 ETH**
- 권장: **0.05 ETH** (여러 번 배포 가능)

---

## 🧪 배포 테스트 전 확인

### 자동 검증 스크립트:

루트에서 실행:
```bash
# hardhat-setup/.env 파일 확인
bash check-env.sh hardhat-setup/.env
```

또는 수동 확인:
```bash
# 1. .env 파일 존재 확인
ls -la hardhat-setup/.env

# 2. PRIVATE_KEY 길이 확인 (66자여야 함)
cat hardhat-setup/.env | grep PRIVATE_KEY

# 3. 지갑 잔액 확인 (hardhat-setup 폴더에서)
cd hardhat-setup
npx hardhat run --network arbitrumSepolia <<'EOF'
const [signer] = await ethers.getSigners();
const balance = await signer.getBalance();
console.log("Address:", signer.address);
console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
EOF
```

---

## 🎉 배포 성공 예시

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

✨ Deployment completed successfully!
```

**🎯 이 주소를 복사하세요: `0xABCDEF1234567890ABCDEF1234567890ABCDEF12`**

---

## 📋 배포 후 할 일

### 1. 컨트랙트 주소 저장

배포 성공 후 출력된 주소를 복사하세요:
```
✅ DonationVillage deployed to: 0x1234567890abcdef1234567890abcdef12345678
                                 └─────── 이 주소를 복사 ──────────┘
```

### 2. Arbiscan에서 확인

브라우저에서 열기:
```
https://sepolia.arbiscan.io/address/0x컨트랙트_주소
```

### 3. 프론트엔드 업데이트

`App.tsx` 파일을 열고 CONTRACT_ADDRESS를 업데이트:

```typescript
// App.tsx 상단
const CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678"; // ✅ 여기에 붙여넣기
```

### 4. 컨트랙트 검증 (선택)

Arbiscan에서 소스코드를 공개하려면:

```bash
cd hardhat-setup
npx hardhat verify --network arbitrumSepolia 0x컨트랙트_주소
```

---

## 🔧 문제 해결

### 에러 1: "cd: no such file or directory: hardhat-setup"

**해결**: 루트에서 실행하세요
```bash
# 현재 위치 확인
pwd

# 루트로 이동
cd /

# 또는 상대 경로로
ls -la | grep hardhat-setup
cd hardhat-setup
```

### 에러 2: "Private key too short"

**해결**: Private Key가 66자인지 확인
```bash
# 길이 확인
cat hardhat-setup/.env | grep PRIVATE_KEY | wc -c
# 출력이 79여야 함 (PRIVATE_KEY= + 66자 + 개행)
```

### 에러 3: "Insufficient funds"

**해결**: Faucet에서 ETH 받기
```
https://www.alchemy.com/faucets/arbitrum-sepolia
```

### 에러 4: "ENOENT: no such file"

**해결**: npm install 실행
```bash
cd hardhat-setup
npm install
```

---

## ✅ 최종 체크리스트

**배포 전 확인:**

- [ ] `hardhat-setup/.env` 파일 생성
- [ ] PRIVATE_KEY 설정 (0x + 64자)
- [ ] ALCHEMY_API_KEY 설정 (선택)
- [ ] Arbitrum Sepolia ETH 보유 (최소 0.01)
- [ ] `cd hardhat-setup` 실행
- [ ] `npm install` 실행
- [ ] `npx hardhat compile` 성공
- [ ] `npx hardhat run scripts/deploy.js --network arbitrumSepolia` 실행

**배포 후:**

- [ ] 컨트랙트 주소 복사
- [ ] Arbiscan에서 확인
- [ ] App.tsx에 주소 업데이트
- [ ] 프론트엔드 테스트

---

## 🚀 지금 실행할 명령어

**복사해서 붙여넣기:**

```bash
# 1. .env 파일 생성 (에디터로)
nano hardhat-setup/.env

# 내용:
# PRIVATE_KEY=0x여기에_붙여넣기
# ALCHEMY_API_KEY=여기에_붙여넣기

# 저장: Ctrl+O, 엔터, Ctrl+X

# 2. 배포
cd hardhat-setup && \
npm install && \
npx hardhat compile && \
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

---

## 📞 도움이 필요하면?

**에러 메시지를 그대로 보내주세요!**

예시:
```
Error HH404: ...
```

즉시 해결해드립니다! 💪

---

**모든 준비가 완료되었습니다!** 🎉

**지금 바로 배포를 시작하세요!** 🚀
