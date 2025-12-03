#!/bin/bash

echo "🔍 Privy 설정 확인 스크립트"
echo "================================"
echo ""

# .env 파일 존재 확인
if [ ! -f .env ]; then
    echo "❌ .env 파일이 없습니다!"
    echo "📝 .env 파일을 생성하고 다음 내용을 추가하세요:"
    echo ""
    echo "VITE_PRIVY_APP_ID=your_privy_app_id_here"
    echo "VITE_CONTRACT_ADDRESS=your_contract_address_here"
    echo "VITE_CHAIN_ID=421614"
    echo 'VITE_CHAIN_NAME="Arbitrum Sepolia"'
    echo ""
    exit 1
fi

echo "✅ .env 파일 존재함"
echo ""

# VITE_PRIVY_APP_ID 확인
if grep -q "VITE_PRIVY_APP_ID=" .env; then
    PRIVY_APP_ID=$(grep VITE_PRIVY_APP_ID .env | cut -d '=' -f2)
    
    if [ -z "$PRIVY_APP_ID" ] || [ "$PRIVY_APP_ID" = "your_privy_app_id_here" ]; then
        echo "⚠️  VITE_PRIVY_APP_ID가 설정되지 않았습니다"
        echo "📝 https://dashboard.privy.io/ 에서 App ID를 발급받으세요"
        echo ""
    else
        echo "✅ VITE_PRIVY_APP_ID: ${PRIVY_APP_ID:0:20}..."
        echo ""
    fi
else
    echo "❌ VITE_PRIVY_APP_ID가 .env에 없습니다"
    echo ""
fi

# VITE_CONTRACT_ADDRESS 확인
if grep -q "VITE_CONTRACT_ADDRESS=" .env; then
    CONTRACT_ADDRESS=$(grep VITE_CONTRACT_ADDRESS .env | cut -d '=' -f2)
    
    if [ -z "$CONTRACT_ADDRESS" ] || [ "$CONTRACT_ADDRESS" = "your_contract_address_here" ]; then
        echo "⚠️  VITE_CONTRACT_ADDRESS가 설정되지 않았습니다"
        echo "📝 스마트 컨트랙트를 배포한 후 주소를 입력하세요"
        echo ""
    else
        echo "✅ VITE_CONTRACT_ADDRESS: $CONTRACT_ADDRESS"
        echo ""
    fi
else
    echo "❌ VITE_CONTRACT_ADDRESS가 .env에 없습니다"
    echo ""
fi

# VITE_CHAIN_ID 확인
if grep -q "VITE_CHAIN_ID=" .env; then
    CHAIN_ID=$(grep VITE_CHAIN_ID .env | cut -d '=' -f2)
    
    if [ "$CHAIN_ID" = "421614" ]; then
        echo "✅ VITE_CHAIN_ID: $CHAIN_ID (Arbitrum Sepolia)"
    else
        echo "⚠️  VITE_CHAIN_ID: $CHAIN_ID (Arbitrum Sepolia는 421614입니다)"
    fi
    echo ""
else
    echo "❌ VITE_CHAIN_ID가 .env에 없습니다"
    echo ""
fi

# package.json에서 Privy 패키지 확인
if grep -q "@privy-io/react-auth" package.json; then
    VERSION=$(grep "@privy-io/react-auth" package.json | sed 's/.*"@privy-io\/react-auth": "\([^"]*\)".*/\1/')
    echo "✅ @privy-io/react-auth: $VERSION 설치됨"
    echo ""
else
    echo "❌ @privy-io/react-auth가 설치되지 않았습니다"
    echo "📝 npm install @privy-io/react-auth 실행하세요"
    echo ""
fi

# 종합 결과
echo "================================"
echo "📋 다음 단계:"
echo ""
echo "1. https://dashboard.privy.io/ 에서 App ID 발급"
echo "2. .env 파일에 VITE_PRIVY_APP_ID 추가"
echo "3. 스마트 컨트랙트 배포 후 VITE_CONTRACT_ADDRESS 추가"
echo "4. Privy Dashboard에서 다음 설정:"
echo "   - Login Methods: Email, Google, Twitter, Discord, GitHub 활성화"
echo "   - Chains: Arbitrum Sepolia (421614) 추가"
echo "   - Allowed Origins: http://localhost:5173 추가"
echo "5. npm run dev 실행"
echo ""
echo "자세한 내용은 PRIVY_SETUP.md 파일을 참고하세요!"
