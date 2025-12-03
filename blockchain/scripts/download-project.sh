#!/bin/bash

# 🚀 기부 마을 프로젝트 다운로드 스크립트
# 사용법: chmod +x download-project.sh && ./download-project.sh

set -e

echo "🎯 기부 마을 프로젝트 설정 시작..."
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 프로젝트 이름
PROJECT_NAME="donation-village"

echo "${YELLOW}📁 프로젝트 폴더 생성 중...${NC}"

# 폴더 구조 생성
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

mkdir -p components/ui
mkdir -p components/figma
mkdir -p lib
mkdir -p styles
mkdir -p contracts
mkdir -p scripts
mkdir -p supabase/functions/server
mkdir -p utils/supabase
mkdir -p hardhat-setup

echo "${GREEN}✅ 폴더 구조 생성 완료${NC}"
echo ""

echo "${YELLOW}📝 안내: 다음 파일들을 Figma Make에서 복사해주세요${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 루트 필수 파일:"
echo "   - package.json"
echo "   - index.tsx"
echo "   - App.tsx"
echo "   - hardhat.config.js"
echo "   - .env.example"
echo ""

echo "2. Components (components/):"
echo "   - LoginScreen.tsx"
echo "   - VillageMain.tsx"
echo "   - MyHouse.tsx"
echo "   - OrganizationHouse.tsx"
echo "   - DonationModal.tsx"
echo "   - DonationDetail.tsx"
echo "   - Inventory.tsx"
echo "   - figma/ImageWithFallback.tsx"
echo ""

echo "3. Lib (lib/):"
echo "   - api.ts"
echo "   - contract.ts"
echo "   - did.ts"
echo "   - wallet-mock.ts"
echo ""

echo "4. Blockchain (contracts/ & scripts/):"
echo "   - contracts/DonationVillage.sol"
echo "   - scripts/deploy.js"
echo ""

echo "5. Backend (supabase/functions/server/):"
echo "   - index.tsx"
echo "   - kv_store.tsx"
echo ""

echo "6. Styles & Utils:"
echo "   - styles/globals.css"
echo "   - utils/supabase/info.tsx"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "${YELLOW}⏳ 파일 복사 후 Enter를 눌러주세요...${NC}"
read -p ""

# package.json 확인
if [ ! -f "package.json" ]; then
  echo "${RED}❌ package.json이 없습니다. 먼저 복사해주세요.${NC}"
  exit 1
fi

echo "${GREEN}✅ package.json 확인 완료${NC}"
echo ""

# .env 파일 생성
if [ ! -f ".env" ]; then
  echo "${YELLOW}🔐 .env 파일 생성 중...${NC}"
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "${GREEN}✅ .env 파일이 생성되었습니다. 환경 변수를 입력해주세요.${NC}"
  else
    echo "${RED}⚠️  .env.example이 없습니다.${NC}"
  fi
fi

echo ""
echo "${YELLOW}📦 npm 패키지 설치 중...${NC}"
npm install

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}✨ 프로젝트 설정 완료!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "다음 단계:"
echo ""
echo "1. ${YELLOW}.env${NC} 파일을 열어서 환경 변수를 입력하세요:"
echo "   nano .env"
echo ""
echo "2. 개발 서버 실행:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "3. 블록체인 배포:"
echo "   ${GREEN}npx hardhat run scripts/deploy.js --network arbitrumSepolia${NC}"
echo ""
echo "4. 백엔드 배포:"
echo "   ${GREEN}supabase functions deploy server${NC}"
echo ""
echo "5. 프론트엔드 배포:"
echo "   ${GREEN}vercel --prod${NC}"
echo ""

echo "📚 자세한 가이드는 DEPLOYMENT_GUIDE.md를 참고하세요!"
echo ""
