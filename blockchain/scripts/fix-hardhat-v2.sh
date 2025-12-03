#!/bin/bash

# 🔧 Hardhat 버전 충돌 해결 v2 (업데이트됨)
# 사용법: chmod +x fix-hardhat-v2.sh && ./fix-hardhat-v2.sh

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🔧 Hardhat 버전 충돌 해결 v2${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Node.js 버전 확인
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "${RED}❌ Node.js 버전이 18 미만입니다. (현재: $(node -v))${NC}"
  echo "Node.js 18 이상이 필요합니다."
  exit 1
fi

echo "${GREEN}✅ Node.js 버전: $(node -v)${NC}"
echo ""

# 버전 선택
echo "${YELLOW}설치할 버전을 선택하세요:${NC}"
echo ""
echo "1. ${GREEN}Hardhat 2.22.16 + Toolbox 5.0.0${NC} (⭐ 권장)"
echo "2. Hardhat 2.26.2 + Toolbox 4.0.0"
echo "3. Hardhat 3.0.16 + Toolbox 5.0.0 (최신)"
echo ""
read -p "선택 (1-3): " -n 1 -r
echo ""
echo ""

case $REPLY in
  1)
    HARDHAT_VERSION="2.22.16"
    TOOLBOX_VERSION="5.0.0"
    echo "${GREEN}선택: Hardhat 2.22.16 + Toolbox 5.0.0${NC}"
    ;;
  2)
    HARDHAT_VERSION="2.26.2"
    TOOLBOX_VERSION="4.0.0"
    echo "${GREEN}선택: Hardhat 2.26.2 + Toolbox 4.0.0${NC}"
    ;;
  3)
    HARDHAT_VERSION="3.0.16"
    TOOLBOX_VERSION="5.0.0"
    echo "${GREEN}선택: Hardhat 3.0.16 + Toolbox 5.0.0${NC}"
    ;;
  *)
    echo "${RED}잘못된 선택입니다. 기본값(1번)을 사용합니다.${NC}"
    HARDHAT_VERSION="2.22.16"
    TOOLBOX_VERSION="5.0.0"
    ;;
esac

echo ""

# 기존 파일 삭제
if [ -d "node_modules" ] || [ -f "package-lock.json" ]; then
  echo "${YELLOW}🗑️  기존 node_modules 및 package-lock.json 삭제 중...${NC}"
  rm -rf node_modules package-lock.json
  echo "${GREEN}✅ 삭제 완료${NC}"
fi

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  📦 패키지 설치${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "${YELLOW}1️⃣  Hardhat & Toolbox 설치 중...${NC}"
npm install --save-dev hardhat@$HARDHAT_VERSION @nomicfoundation/hardhat-toolbox@$TOOLBOX_VERSION

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

INSTALLED_HARDHAT=$(npm list hardhat --depth=0 2>/dev/null | grep hardhat@ | sed 's/.*hardhat@//' | sed 's/ .*//')
INSTALLED_TOOLBOX=$(npm list @nomicfoundation/hardhat-toolbox --depth=0 2>/dev/null | grep hardhat-toolbox@ | sed 's/.*hardhat-toolbox@//' | sed 's/ .*//')

echo "${GREEN}✅ Hardhat: $INSTALLED_HARDHAT${NC}"
echo "${GREEN}✅ Hardhat Toolbox: $INSTALLED_TOOLBOX${NC}"
echo "${GREEN}✅ ethers: 6.9.0${NC}"
echo "${GREEN}✅ OpenZeppelin: 5.0.0${NC}"

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🧪 컴파일 테스트${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# contracts 폴더 확인
if [ ! -d "contracts" ] || [ -z "$(ls -A contracts 2>/dev/null)" ]; then
  echo "${YELLOW}⚠️  contracts 폴더가 비어있습니다.${NC}"
  echo ""
  echo "${GREEN}다음 단계:${NC}"
  echo "  1. ${YELLOW}contracts/DonationVillage.sol${NC} 파일 생성"
  echo "  2. ${YELLOW}scripts/deploy.js${NC} 파일 생성"
  echo "  3. ${YELLOW}.env${NC} 파일 생성"
  echo "  4. ${GREEN}npx hardhat compile${NC} 실행"
  echo ""
  exit 0
fi

# 컴파일 테스트
echo "${YELLOW}컴파일 시도 중...${NC}"
if npx hardhat compile 2>&1 | grep -q "Compiled"; then
  echo ""
  echo "${GREEN}✅ 컴파일 성공!${NC}"
  COMPILE_SUCCESS=true
else
  echo ""
  echo "${YELLOW}⚠️  컴파일 경고 또는 실패${NC}"
  echo "contracts 폴더의 .sol 파일을 확인하세요."
  COMPILE_SUCCESS=false
fi

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}  🎉 설정 완료!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "설치된 버전:"
echo "  - Hardhat: ${GREEN}$INSTALLED_HARDHAT${NC}"
echo "  - Hardhat Toolbox: ${GREEN}$INSTALLED_TOOLBOX${NC}"
echo "  - ethers.js: ${GREEN}6.9.0${NC}"
echo "  - OpenZeppelin: ${GREEN}5.0.0${NC}"
echo ""

if [ "$COMPILE_SUCCESS" = true ]; then
  echo "${GREEN}다음 단계:${NC}"
  echo "  1. ${YELLOW}.env${NC} 파일 확인 (PRIVATE_KEY, ALCHEMY_API_KEY)"
  echo "  2. ${GREEN}npm run deploy:sepolia${NC} - 배포 시작"
  echo ""
else
  echo "${YELLOW}다음 단계:${NC}"
  echo "  1. contracts 폴더에 .sol 파일 추가"
  echo "  2. ${GREEN}npx hardhat compile${NC} - 컴파일 확인"
  echo "  3. ${YELLOW}.env${NC} 파일 생성"
  echo "  4. ${GREEN}npm run deploy:sepolia${NC} - 배포"
  echo ""
fi

echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
