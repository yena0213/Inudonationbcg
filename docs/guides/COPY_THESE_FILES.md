# 📋 이 파일들만 복사하세요

## 🎯 로컬 컴퓨터에 필요한 파일 (블록체인 배포용)

### 1. package.json
```json
{
  "name": "donation-village-contracts",
  "version": "1.0.0",
  "scripts": {
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
```

### 2. hardhat.config.js
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 421614
    }
  }
};
```

### 3. .env (직접 작성)
```env
PRIVATE_KEY=0x당신의_지갑_Private_Key
ALCHEMY_API_KEY=당신의_Alchemy_API_Key
```

### 4. contracts/DonationVillage.sol
→ Figma Make의 `/contracts/DonationVillage.sol` 전체 복사

### 5. scripts/deploy.js
→ Figma Make의 `/scripts/deploy.js` 전체 복사

---

## 🚀 사용 방법

```bash
# 1. 폴더 생성
mkdir my-donation-blockchain
cd my-donation-blockchain

# 2. 위의 파일들 생성
# package.json 생성
# hardhat.config.js 생성
# .env 생성
# contracts/DonationVillage.sol 생성
# scripts/deploy.js 생성

# 3. 설치
npm install

# 4. 배포
npm run deploy:sepolia
```

---

## ✅ 더 쉬운 방법

Figma Make에서 **Export Project** 기능이 있다면 전체를 다운받고,
필요한 부분만 사용하세요!

또는 아래의 간단한 스크립트 사용:

```bash
# download.sh
#!/bin/bash

mkdir -p donation-blockchain/contracts
mkdir -p donation-blockchain/scripts

# 필요한 파일들을 Figma Make에서 복사
echo "Figma Make에서 다음 파일들을 복사하세요:"
echo "1. /contracts/DonationVillage.sol"
echo "2. /scripts/deploy.js"
echo "3. /hardhat-setup/package.json"
echo "4. /hardhat-setup/hardhat.config.js"
```

---

## 💡 핵심 요점

**블록체인만 로컬에서 배포하면 됩니다!**

- ✅ 프론트엔드: Figma Make → Vercel (자동)
- ✅ 백엔드: Supabase CLI 또는 Dashboard
- ✅ 블록체인: 로컬 Hardhat → Arbitrum Sepolia

**5개 파일만 복사하면 끝!** 🎉
