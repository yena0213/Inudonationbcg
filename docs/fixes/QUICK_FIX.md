# ⚡ Hardhat 버전 충돌 - 빠른 해결

## 🎯 문제
```
npm error peer hardhat@"^2.26.0" from @nomicfoundation/hardhat-chai-matchers
```

## ✅ 해결 (30초)

### 터미널에 그대로 복사/붙여넣기:

```bash
# 1. 기존 삭제
rm -rf node_modules package-lock.json

# 2. 정확한 버전 설치
npm install --save-dev hardhat@2.19.5 @nomicfoundation/hardhat-toolbox@4.0.0

# 3. 의존성 설치
npm install @openzeppelin/contracts@5.0.0 dotenv@16.3.1 ethers@6.9.0

# 4. 확인
npx hardhat compile
```

---

## 📦 정확한 버전

우리 프로젝트는 다음 버전을 사용합니다:

```json
{
  "devDependencies": {
    "hardhat": "2.19.5",
    "@nomicfoundation/hardhat-toolbox": "4.0.0"
  },
  "dependencies": {
    "@openzeppelin/contracts": "5.0.0",
    "ethers": "6.9.0",
    "dotenv": "16.3.1"
  }
}
```

**중요**: `^` 기호 없이 정확한 버전을 사용합니다!

---

## 🚀 자동 스크립트

```bash
chmod +x fix-hardhat.sh
./fix-hardhat.sh
```

→ 모든 과정 자동화!

---

## ⚠️ 여전히 에러가 난다면?

### 1. Node.js 버전 확인
```bash
node --version
# v18.0.0 이상이어야 함
```

v18 미만이면:
```bash
# Mac/Linux (nvm 사용)
nvm install 18
nvm use 18

# 또는 공식 사이트에서 다운로드
# https://nodejs.org
```

### 2. npm 캐시 정리
```bash
npm cache clean --force
rm -rf ~/.npm
```

### 3. 완전히 새로 시작
```bash
cd ..
rm -rf 현재폴더
mkdir donation-blockchain
cd donation-blockchain

# 위의 "정확한 버전 설치" 명령어 다시 실행
```

---

## 📞 요약

**문제**: Hardhat 3.x가 설치되어 toolbox와 충돌  
**해결**: Hardhat 2.19.5 + Toolbox 4.0.0으로 다운그레이드  
**시간**: 30초  

**완료!** 🎉
