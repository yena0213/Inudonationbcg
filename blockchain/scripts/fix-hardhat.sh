#!/bin/bash

# 🔧 Hardhat 버전 충돌 자동 해결 스크립트
# 사용법: chmod +x fix-hardhat.sh && ./fix-hardhat.sh

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🔧 Hardhat 버전 충돌 자동 해결${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Node.js 버전 확인
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "${RED}❌ Node.js 버전이 18 미만입니다. (현재: v$NODE_VERSION)${NC}"
  echo "Node.js 18 이상이 필요합니다."
  echo ""
  echo "설치 방법:"
  echo "  nvm install 18"
  echo "  nvm use 18"
  exit 1
fi

echo "${GREEN}✅ Node.js 버전 확인: v$(node -v)${NC}"
echo ""

# 현재 상태 확인
if [ -d "node_modules" ]; then
  echo "${YELLOW}⚠️  기존 node_modules 폴더가 있습니다.${NC}"
  read -p "삭제하시겠습니까? (y/n): " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "${YELLOW}🗑️  node_modules 및 package-lock.json 삭제 중...${NC}"
    rm -rf node_modules package-lock.json
    echo "${GREEN}✅ 삭제 완료${NC}"
  else
    echo "${YELLOW}기존 폴더를 유지합니다.${NC}"
  fi
fi

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  📦 정확한 버전으로 설치${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "${YELLOW}1️⃣  Hardhat & Toolbox 설치 중...${NC}"
npm install --save-dev hardhat@2.19.5 @nomicfoundation/hardhat-toolbox@4.0.0

echo ""
echo "${YELLOW}2️⃣  OpenZeppelin & 유틸리티 설치 중...${NC}"
npm install @openzeppelin/contracts@5.0.0 dotenv@16.3.1 ethers@6.9.0

echo ""
echo "${GREEN}✅ 설치 완료!${NC}"
echo ""

# 버전 확인
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🔍 설치된 버전 확인${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "${YELLOW}Hardhat:${NC}"
npm list hardhat | grep hardhat || echo "  (설치됨)"

echo ""
echo "${YELLOW}@nomicfoundation/hardhat-toolbox:${NC}"
npm list @nomicfoundation/hardhat-toolbox | grep hardhat-toolbox || echo "  (설치됨)"

echo ""
echo "${YELLOW}ethers:${NC}"
npm list ethers | grep ethers || echo "  (설치됨)"

echo ""
echo "${YELLOW}@openzeppelin/contracts:${NC}"
npm list @openzeppelin/contracts | grep openzeppelin || echo "  (설치됨)"

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🧪 컴파일 테스트${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# contracts 폴더 확인
if [ ! -d "contracts" ]; then
  echo "${YELLOW}⚠️  contracts 폴더가 없습니다.${NC}"
  echo "컴파일을 건너뜁니다."
  echo ""
  echo "${GREEN}다음 단계:${NC}"
  echo "  1. contracts/DonationVillage.sol 파일 복사"
  echo "  2. scripts/deploy.js 파일 복사"
  echo "  3. hardhat.config.js 파일 복사"
  echo "  4. .env 파일 생성"
  echo "  5. ${YELLOW}npx hardhat compile${NC} 실행"
  exit 0
fi

# 컴파일 테스트
echo "${YELLOW}컴파일 시도 중...${NC}"
if npx hardhat compile; then
  echo ""
  echo "${GREEN}✅ 컴파일 성공!${NC}"
else
  echo ""
  echo "${RED}⚠️  컴파일 실패${NC}"
  echo "contracts 폴더에 .sol 파일이 있는지 확인하세요."
  exit 1
fi

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}  🎉 Hardhat 설정 완료!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "설치된 버전:"
echo "  - Hardhat: 2.19.5"
echo "  - Hardhat Toolbox: 4.0.0"
echo "  - ethers.js: 6.9.0"
echo "  - OpenZeppelin: 5.0.0"
echo ""

echo "다음 단계:"
echo "  1. ${YELLOW}.env${NC} 파일 확인/생성"
echo "  2. ${YELLOW}hardhat.config.js${NC} 설정 확인"
echo "  3. ${GREEN}npm run deploy:sepolia${NC} - 배포 시작"
echo ""

echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
