#!/bin/bash

# 🚀 기부 마을 전체 배포 자동화 스크립트
# 사용법: chmod +x deploy-all.sh && ./deploy-all.sh

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🚀 기부 마을 전체 배포 자동화 스크립트${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# .env 파일 확인
if [ ! -f ".env" ]; then
  echo "${RED}❌ .env 파일이 없습니다!${NC}"
  echo "먼저 .env.example을 복사하여 .env를 만들고 환경 변수를 입력하세요."
  exit 1
fi

# .env 파일 로드
source .env

echo "${YELLOW}🔍 환경 변수 확인 중...${NC}"
echo ""

# 필수 환경 변수 확인
REQUIRED_VARS=(
  "PRIVATE_KEY"
  "ALCHEMY_API_KEY"
  "VITE_PRIVY_APP_ID"
  "VITE_SUPABASE_URL"
  "VITE_SUPABASE_ANON_KEY"
)

MISSING_VARS=()

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    MISSING_VARS+=("$VAR")
  fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo "${RED}❌ 다음 환경 변수가 설정되지 않았습니다:${NC}"
  for VAR in "${MISSING_VARS[@]}"; do
    echo "   - $VAR"
  done
  echo ""
  echo "먼저 .env 파일을 수정해주세요."
  exit 1
fi

echo "${GREEN}✅ 환경 변수 확인 완료${NC}"
echo ""

# 사용자 확인
echo "${YELLOW}다음 단계를 진행합니다:${NC}"
echo "  1. 블록체인 컨트랙트 배포 (Arbitrum Sepolia)"
echo "  2. 백엔드 배포 (Supabase Edge Functions)"
echo "  3. 프론트엔드 배포 (Vercel)"
echo ""
read -p "계속하시겠습니까? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "${YELLOW}배포가 취소되었습니다.${NC}"
  exit 0
fi

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  Step 1/3: 블록체인 컨트랙트 배포${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Hardhat 의존성 확인
if ! command -v npx &> /dev/null; then
  echo "${RED}❌ npx가 설치되어 있지 않습니다. Node.js를 설치하세요.${NC}"
  exit 1
fi

# 컨트랙트 배포
echo "${YELLOW}🔗 스마트 컨트랙트 배포 중...${NC}"
npx hardhat run scripts/deploy.js --network arbitrumSepolia

echo ""
echo "${GREEN}✅ 블록체인 배포 완료${NC}"
echo "${YELLOW}📝 컨트랙트 주소를 복사하여 .env 파일의 VITE_CONTRACT_ADDRESS에 입력하세요.${NC}"
echo ""
read -p "컨트랙트 주소를 입력하고 Enter를 누르세요: " CONTRACT_ADDRESS

# .env 파일 업데이트
if [ ! -z "$CONTRACT_ADDRESS" ]; then
  if grep -q "VITE_CONTRACT_ADDRESS=" .env; then
    # 기존 값 업데이트
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|VITE_CONTRACT_ADDRESS=.*|VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" .env
    else
      sed -i "s|VITE_CONTRACT_ADDRESS=.*|VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" .env
    fi
  else
    # 새로운 줄 추가
    echo "VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env
  fi
  echo "${GREEN}✅ .env 파일에 컨트랙트 주소가 저장되었습니다.${NC}"
fi

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  Step 2/3: 백엔드 배포 (Supabase)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Supabase CLI 확인
if ! command -v supabase &> /dev/null; then
  echo "${YELLOW}⚠️  Supabase CLI가 설치되어 있지 않습니다.${NC}"
  read -p "지금 설치하시겠습니까? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm install -g supabase
  else
    echo "${YELLOW}Supabase 배포를 건너뜁니다.${NC}"
    echo "나중에 수동으로 배포하세요: supabase functions deploy server"
    SKIP_SUPABASE=true
  fi
fi

if [ "$SKIP_SUPABASE" != "true" ]; then
  echo "${YELLOW}🔐 Supabase 로그인 중...${NC}"
  supabase login
  
  echo ""
  read -p "Supabase Project ID를 입력하세요: " SUPABASE_PROJECT_ID
  
  if [ ! -z "$SUPABASE_PROJECT_ID" ]; then
    echo "${YELLOW}🔗 프로젝트 연결 중...${NC}"
    supabase link --project-ref $SUPABASE_PROJECT_ID
    
    echo ""
    echo "${YELLOW}☁️  Edge Functions 배포 중...${NC}"
    supabase functions deploy server
    
    echo ""
    echo "${GREEN}✅ 백엔드 배포 완료${NC}"
    echo "${YELLOW}📝 Supabase Dashboard에서 다음 환경 변수를 설정하세요:${NC}"
    echo "   - CONTRACT_ADDRESS: $CONTRACT_ADDRESS"
    echo "   - ALCHEMY_API_KEY: (Alchemy에서 발급)"
    echo ""
  else
    echo "${YELLOW}Project ID가 입력되지 않아 Supabase 배포를 건너뜁니다.${NC}"
  fi
fi

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  Step 3/3: 프론트엔드 배포 (Vercel)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# lib/api.ts 수정
if [ -f "lib/api.ts" ]; then
  echo "${YELLOW}🔧 ENABLE_BACKEND를 true로 변경 중...${NC}"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/const ENABLE_BACKEND = false/const ENABLE_BACKEND = true/' lib/api.ts
  else
    sed -i 's/const ENABLE_BACKEND = false/const ENABLE_BACKEND = true/' lib/api.ts
  fi
  echo "${GREEN}✅ lib/api.ts 수정 완료${NC}"
fi

# Vercel CLI 확인
if ! command -v vercel &> /dev/null; then
  echo "${YELLOW}⚠️  Vercel CLI가 설치되어 있지 않습니다.${NC}"
  read -p "지금 설치하시겠습니까? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm install -g vercel
  else
    echo "${YELLOW}Vercel 배포를 건너뜁니다.${NC}"
    echo "나중에 수동으로 배포하세요: vercel --prod"
    SKIP_VERCEL=true
  fi
fi

if [ "$SKIP_VERCEL" != "true" ]; then
  echo "${YELLOW}🔐 Vercel 로그인 중...${NC}"
  vercel login
  
  echo ""
  echo "${YELLOW}🚀 Vercel 배포 중...${NC}"
  vercel --prod
  
  echo ""
  echo "${GREEN}✅ 프론트엔드 배포 완료${NC}"
  echo "${YELLOW}📝 Vercel Dashboard에서 환경 변수를 설정하세요:${NC}"
  echo "   - VITE_PRIVY_APP_ID"
  echo "   - VITE_CONTRACT_ADDRESS"
  echo "   - VITE_SUPABASE_URL"
  echo "   - VITE_SUPABASE_ANON_KEY"
  echo "   - VITE_ALCHEMY_API_KEY"
  echo "   - VITE_CHAIN_ID=421614"
fi

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}  🎉 배포 완료!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "다음 단계:"
echo ""
echo "1. ${YELLOW}Arbiscan${NC}에서 컨트랙트 확인:"
echo "   https://sepolia.arbiscan.io/address/$CONTRACT_ADDRESS"
echo ""
echo "2. ${YELLOW}Supabase Dashboard${NC}에서 환경 변수 설정"
echo "   https://supabase.com/dashboard"
echo ""
echo "3. ${YELLOW}Vercel Dashboard${NC}에서 환경 변수 설정 및 재배포"
echo "   https://vercel.com/dashboard"
echo ""
echo "4. ${YELLOW}Privy Dashboard${NC}에서 Allowed Origins 추가"
echo "   https://dashboard.privy.io"
echo ""
echo "5. 배포된 앱 테스트:"
echo "   - 소셜 로그인"
echo "   - 기부 프로세스"
echo "   - Arbiscan에서 트랜잭션 확인"
echo ""

echo "${GREEN}축하합니다! 투명한 기부 플랫폼이 배포되었습니다! 🌟${NC}"
echo ""
