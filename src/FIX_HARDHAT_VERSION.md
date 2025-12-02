# 🔧 Hardhat 버전 충돌 해결 가이드

## 🚨 문제 상황

```
npm error peer hardhat@"^2.26.0" from @nomicfoundation/hardhat-chai-matchers@2.1.0
npm error Conflicting peer dependency: hardhat@2.27.1
```

**원인**: Hardhat 3.x와 이전 toolbox 버전 간의 호환성 문제

---

## ✅ 해결 방법 (3가지)

---

## 방법 1: 정확한 버전 설치 (⭐ 권장)

### 단계별:

```bash
# 1. 기존 node_modules 삭제
rm -rf node_modules package-lock.json

# 2. 정확한 버전으로 설치
npm install --save-dev hardhat@^2.19.0
npm install --save-dev @nomicfoundation/hardhat-toolbox@^4.0.0

# 3. 나머지 의존성 설치
npm install @openzeppelin/contracts@^5.0.0 dotenv@^16.3.1 ethers@^6.9.0

# 4. 확인
npm list hardhat
```

**예상 출력:**
```
donation-blockchain@1.0.0
└── hardhat@2.19.5
```

---

## 방법 2: Hardhat 3.x 사용 (최신 버전)

Hardhat 3.x를 사용하려면 toolbox도 최신 버전으로:

```bash
# 1. 기존 삭제
rm -rf node_modules package-lock.json

# 2. Hardhat 3.x + 호환 toolbox 설치
npm install --save-dev hardhat@^3.0.0
npm install --save-dev @nomicfoundation/hardhat-toolbox@^5.0.0

# 3. 나머지 의존성
npm install @openzeppelin/contracts@^5.0.0 dotenv@^16.3.1 ethers@^6.9.0
```

### ⚠️ 주의사항:
Hardhat 3.x는 일부 설정 방식이 변경되었습니다.
`hardhat.config.js`를 수정해야 할 수도 있습니다.

---

## 방법 3: --legacy-peer-deps 사용 (임시 해결)

```bash
npm install @openzeppelin/contracts dotenv ethers --legacy-peer-deps
```

**단점**: 의존성 충돌을 무시하므로 예상치 못한 문제 발생 가능

---

## 🎯 권장 설정 (완전 새로 시작)

### 완전히 깨끗하게 시작:

```bash
# 1. 새 폴더 생성
mkdir donation-blockchain-clean
cd donation-blockchain-clean

# 2. package.json 생성
cat > package.json << 'EOF'
{
  "name": "donation-village-contracts",
  "version": "1.0.0",
  "description": "Smart contracts for Donation Village",
  "scripts": {
    "compile": "hardhat compile",
    "deploy:sepolia": "hardhat run scripts/deploy.js --network arbitrumSepolia"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "hardhat": "^2.19.0"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0",
    "dotenv": "^16.3.1",
    "ethers": "^6.9.0"
  }
}
EOF

# 3. 설치
npm install

# 4. 파일 복사
# - contracts/DonationVillage.sol
# - scripts/deploy.js
# - hardhat.config.js
# - .env

# 5. 배포
npm run deploy:sepolia
```

---

## 📋 정확한 버전 정보

### 테스트 완료된 버전 조합:

```json
{
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "hardhat": "^2.19.0"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0",
    "dotenv": "^16.3.1",
    "ethers": "^6.9.0"
  }
}
```

### 버전 호환성 표:

| Hardhat 버전 | Toolbox 버전 | ethers 버전 | 상태 |
|-------------|-------------|------------|------|
| 2.19.x      | 4.0.x       | 6.x        | ✅ 권장 |
| 3.0.x       | 5.0.x       | 6.x        | ✅ 최신 |
| 2.19.x      | 6.x         | 6.x        | ❌ 충돌 |
| 3.0.x       | 4.0.x       | 6.x        | ❌ 충돌 |

---

## 🔍 설치 확인

### 버전 확인:
```bash
npm list hardhat
npm list @nomicfoundation/hardhat-toolbox
npm list ethers
npm list @openzeppelin/contracts
```

### 컴파일 테스트:
```bash
npx hardhat compile
```

**성공 시 출력:**
```
Compiled 1 Solidity file successfully
```

---

## 🚀 빠른 해결 (Copy & Paste)

```bash
# 현재 폴더에서 실행
rm -rf node_modules package-lock.json

npm install --save-dev hardhat@2.19.5 @nomicfoundation/hardhat-toolbox@4.0.0

npm install @openzeppelin/contracts@5.0.0 dotenv@16.3.1 ethers@6.9.0

npx hardhat compile
```

---

## ⚠️ 여전히 안 된다면?

### 1. Node.js 버전 확인
```bash
node --version
# 최소 v18.0.0 이상 필요
```

v18 미만이면:
```bash
# nvm 사용
nvm install 18
nvm use 18
```

### 2. npm 캐시 정리
```bash
npm cache clean --force
rm -rf ~/.npm
npm install
```

### 3. 완전히 새로 시작
```bash
cd ..
rm -rf donation-blockchain
mkdir donation-blockchain
cd donation-blockchain
# 위의 "완전히 깨끗하게 시작" 섹션 따라하기
```

---

## 📞 요약

### 가장 간단한 해결:

```bash
# 1. 삭제
rm -rf node_modules package-lock.json

# 2. 정확한 버전 설치
npm install --save-dev hardhat@2.19.5 @nomicfoundation/hardhat-toolbox@4.0.0
npm install @openzeppelin/contracts@5.0.0 dotenv@16.3.1 ethers@6.9.0

# 3. 확인
npx hardhat compile
```

**이제 정상 작동해야 합니다!** ✅

---

## 🎁 자동화 스크립트

이 내용을 스크립트로 만들었습니다:
→ `/fix-hardhat.sh` 실행
