#!/bin/bash

echo "🔍 기부 마을 설정 검증 스크립트"
echo "================================"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS=0
WARNINGS=0
ERRORS=0

# 1. Node.js 버전 확인
echo "📦 1. Node.js 환경 확인"
echo "------------------------"
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
    ((SUCCESS++))
else
    echo -e "${RED}❌ Node.js가 설치되지 않았습니다${NC}"
    ((ERRORS++))
fi

NPM_VERSION=$(npm -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
    ((SUCCESS++))
else
    echo -e "${RED}❌ npm이 설치되지 않았습니다${NC}"
    ((ERRORS++))
fi
echo ""

# 2. 필수 파일 확인
echo "📁 2. 필수 파일 확인"
echo "------------------------"
FILES=(
    ".env"
    "vite.config.ts"
    ".npmrc"
    "env.d.ts"
    "index.tsx"
    "App.tsx"
)

for FILE in "${FILES[@]}"; do
    if [ -f "$FILE" ]; then
        echo -e "${GREEN}✅ $FILE${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ $FILE 파일이 없습니다${NC}"
        ((ERRORS++))
    fi
done
echo ""

# 3. 환경 변수 확인
echo "��� 3. 환경 변수 확인"
echo "------------------------"
if [ -f .env ]; then
    # VITE_PRIVY_APP_ID 확인
    if grep -q "VITE_PRIVY_APP_ID=" .env; then
        PRIVY_ID=$(grep VITE_PRIVY_APP_ID .env | cut -d '=' -f2)
        if [ -z "$PRIVY_ID" ] || [ "$PRIVY_ID" = "clxdummy123" ]; then
            echo -e "${YELLOW}⚠️  VITE_PRIVY_APP_ID: 더미 값 (실제 App ID 필요)${NC}"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✅ VITE_PRIVY_APP_ID: ${PRIVY_ID:0:20}...${NC}"
            ((SUCCESS++))
        fi
    else
        echo -e "${RED}❌ VITE_PRIVY_APP_ID가 .env에 없습니다${NC}"
        ((ERRORS++))
    fi
    
    # VITE_CONTRACT_ADDRESS 확인
    if grep -q "VITE_CONTRACT_ADDRESS=" .env; then
        CONTRACT=$(grep VITE_CONTRACT_ADDRESS .env | cut -d '=' -f2)
        if [ -z "$CONTRACT" ] || [ "$CONTRACT" = "0x0000000000000000000000000000000000000000" ]; then
            echo -e "${YELLOW}⚠️  VITE_CONTRACT_ADDRESS: 더미 값 (실제 주소 필요)${NC}"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✅ VITE_CONTRACT_ADDRESS: $CONTRACT${NC}"
            ((SUCCESS++))
        fi
    else
        echo -e "${RED}❌ VITE_CONTRACT_ADDRESS가 .env에 없습니다${NC}"
        ((ERRORS++))
    fi
    
    # VITE_CHAIN_ID 확인
    if grep -q "VITE_CHAIN_ID=" .env; then
        CHAIN_ID=$(grep VITE_CHAIN_ID .env | cut -d '=' -f2)
        if [ "$CHAIN_ID" = "421614" ]; then
            echo -e "${GREEN}✅ VITE_CHAIN_ID: $CHAIN_ID (Arbitrum Sepolia)${NC}"
            ((SUCCESS++))
        else
            echo -e "${YELLOW}⚠️  VITE_CHAIN_ID: $CHAIN_ID (권장: 421614)${NC}"
            ((WARNINGS++))
        fi
    fi
fi
echo ""

# 4. Vite 설정 확인
echo "⚙️  4. Vite 설정 확인"
echo "------------------------"
if [ -f vite.config.ts ]; then
    if grep -q "exclude.*solana" vite.config.ts; then
        echo -e "${GREEN}✅ Solana 패키지 제외 설정됨${NC}"
        ((SUCCESS++))
    else
        echo -e "${YELLOW}⚠️  Solana 제외 설정이 없습니다${NC}"
        ((WARNINGS++))
    fi
fi
echo ""

# 5. package.json 확인
echo "📦 5. 의존성 확인"
echo "------------------------"
if [ -f package.json ]; then
    if grep -q "@privy-io/react-auth" package.json; then
        VERSION=$(grep "@privy-io/react-auth" package.json | sed 's/.*"@privy-io\/react-auth": "\([^"]*\)".*/\1/')
        echo -e "${GREEN}✅ @privy-io/react-auth: $VERSION${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ @privy-io/react-auth가 설치되지 않았습니다${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "ethers" package.json; then
        echo -e "${GREEN}✅ ethers: 설치됨${NC}"
        ((SUCCESS++))
    fi
    
    if grep -q "viem" package.json; then
        echo -e "${GREEN}✅ viem: 설치됨${NC}"
        ((SUCCESS++))
    fi
fi
echo ""

# 6. DID 라이브러리 확인
echo "🆔 6. DID 시스템 확인"
echo "------------------------"
if [ -f lib/did.ts ]; then
    echo -e "${GREEN}✅ lib/did.ts${NC}"
    ((SUCCESS++))
    
    if grep -q "createDID" lib/did.ts; then
        echo -e "${GREEN}✅ createDID 함수 존재${NC}"
        ((SUCCESS++))
    fi
    
    if grep -q "createDIDDocument" lib/did.ts; then
        echo -e "${GREEN}✅ createDIDDocument 함수 존재${NC}"
        ((SUCCESS++))
    fi
    
    if grep -q "createDonationCredential" lib/did.ts; then
        echo -e "${GREEN}✅ createDonationCredential 함수 존재${NC}"
        ((SUCCESS++))
    fi
else
    echo -e "${RED}❌ lib/did.ts 파일이 없습니다${NC}"
    ((ERRORS++))
fi
echo ""

# 7. 컴포넌트 확인
echo "🎨 7. UI 컴포넌트 확인"
echo "------------------------"
COMPONENTS=(
    "components/LoginScreen.tsx"
    "components/VillageMain.tsx"
    "components/MyHouse.tsx"
    "components/OrganizationHouse.tsx"
    "components/DonationModal.tsx"
    "components/Inventory.tsx"
)

for COMP in "${COMPONENTS[@]}"; do
    if [ -f "$COMP" ]; then
        echo -e "${GREEN}✅ $COMP${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ $COMP 파일이 없습니다${NC}"
        ((ERRORS++))
    fi
done
echo ""

# 결과 요약
echo "================================"
echo "📊 검증 결과 요약"
echo "================================"
echo -e "${GREEN}✅ 성공: $SUCCESS${NC}"
echo -e "${YELLOW}⚠️  경고: $WARNINGS${NC}"
echo -e "${RED}❌ 오류: $ERRORS${NC}"
echo ""

# 다음 단계 안내
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 기본 설정이 완료되었습니다!${NC}"
    echo ""
    
    if [ $WARNINGS -gt 0 ]; then
        echo "📋 다음 단계:"
        echo ""
        echo "1. Privy App ID 발급:"
        echo "   https://dashboard.privy.io/"
        echo ""
        echo "2. .env 파일 수정:"
        echo "   VITE_PRIVY_APP_ID=실제_App_ID"
        echo "   VITE_CONTRACT_ADDRESS=배포된_컨트랙트_주소"
        echo ""
        echo "3. Privy Dashboard 설정:"
        echo "   - Login Methods: Email, Google, Twitter 등 활성화"
        echo "   - Chains: Arbitrum Sepolia (421614) 추가"
        echo "   - Allowed Origins: http://localhost:5173 추가"
        echo ""
        echo "4. 개발 서버 실행:"
        echo "   npm run dev"
        echo ""
    else
        echo "🚀 모든 준비가 완료되었습니다!"
        echo ""
        echo "개발 서버를 실행하세요:"
        echo "  npm run dev"
        echo ""
    fi
else
    echo -e "${RED}⚠️  오류를 해결해야 합니다!${NC}"
    echo ""
    echo "📘 자세한 가이드:"
    echo "  - QUICK_DEPLOY_GUIDE.md"
    echo "  - PRIVY_SETUP.md"
    echo "  - SOLANA_FIX.md"
    echo ""
fi

echo "================================"
