#!/bin/bash

# 🔍 .env 파일 자동 검증 스크립트
# 사용법: chmod +x check-env.sh && ./check-env.sh

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🔍 .env 파일 검증${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# .env 파일 존재 확인
if [ ! -f .env ]; then
  echo "${RED}❌ .env 파일이 없습니다!${NC}"
  echo ""
  echo "다음 명령어로 생성하세요:"
  echo "  ${YELLOW}touch .env${NC}"
  echo ""
  echo "그리고 다음 내용을 추가하세요:"
  echo "  ${YELLOW}PRIVATE_KEY=0x여기에_당신의_Private_Key${NC}"
  echo "  ${YELLOW}ALCHEMY_API_KEY=여기에_Alchemy_API_Key${NC}"
  echo ""
  exit 1
fi

echo "${GREEN}✅ .env 파일이 존재합니다${NC}"
echo ""

# .env 파일 읽기
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# PRIVATE_KEY 확인
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🔑 PRIVATE_KEY 검증${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -z "$PRIVATE_KEY" ]; then
  echo "${RED}❌ PRIVATE_KEY가 설정되지 않았습니다!${NC}"
  echo ""
  echo "MetaMask에서 Private Key를 가져오는 방법:"
  echo "  1. MetaMask 확장 프로그램 열기"
  echo "  2. 계정 아이콘 > 계정 상세정보"
  echo "  3. '개인 키 내보내기' 클릭"
  echo "  4. Private Key 복사 (0x로 시작)"
  echo ""
  echo ".env 파일에 추가:"
  echo "  ${YELLOW}PRIVATE_KEY=0x1234...abcd${NC}"
  echo ""
  exit 1
fi

# Private Key 길이 확인
KEY_LENGTH=${#PRIVATE_KEY}
if [ $KEY_LENGTH -ne 66 ]; then
  echo "${RED}❌ PRIVATE_KEY 길이가 올바르지 않습니다!${NC}"
  echo "   현재 길이: ${RED}$KEY_LENGTH${NC}"
  echo "   필요 길이: ${GREEN}66${NC} (0x + 64자)"
  echo ""
  
  if [ $KEY_LENGTH -lt 66 ]; then
    echo "   Private Key가 너무 짧습니다."
  else
    echo "   Private Key가 너무 깁니다."
  fi
  
  echo ""
  echo "올바른 형식:"
  echo "  ${YELLOW}0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef${NC}"
  echo ""
  exit 1
fi

# 0x로 시작하는지 확인
if [[ ! $PRIVATE_KEY =~ ^0x ]]; then
  echo "${RED}❌ PRIVATE_KEY가 0x로 시작하지 않습니다!${NC}"
  echo ""
  echo "올바른 형식:"
  echo "  ${YELLOW}0x1234567890abcdef...${NC}"
  echo ""
  exit 1
fi

# 16진수인지 확인
if [[ ! $PRIVATE_KEY =~ ^0x[a-fA-F0-9]{64}$ ]]; then
  echo "${RED}❌ PRIVATE_KEY가 올바른 16진수 형식이 아닙니다!${NC}"
  echo ""
  echo "허용되는 문자: 0-9, a-f, A-F"
  echo "공백, 따옴표, 특수문자는 제거하세요"
  echo ""
  exit 1
fi

echo "${GREEN}✅ PRIVATE_KEY 형식이 올바릅니다!${NC}"
echo "   길이: ${GREEN}$KEY_LENGTH${NC} (정확함)"
echo "   형식: ${GREEN}0x + 64자 16진수${NC}"
echo ""

# ALCHEMY_API_KEY 확인
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🌐 ALCHEMY_API_KEY 검증${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -z "$ALCHEMY_API_KEY" ]; then
  echo "${YELLOW}⚠️  ALCHEMY_API_KEY가 설정되지 않았습니다${NC}"
  echo ""
  echo "공개 RPC를 사용하지만, Alchemy를 사용하는 것이 더 안정적입니다."
  echo ""
  echo "Alchemy API Key 가져오기:"
  echo "  1. https://www.alchemy.com 방문"
  echo "  2. 무료 계정 생성"
  echo "  3. Create App > Arbitrum Sepolia"
  echo "  4. API Key 복사"
  echo ""
  echo ".env 파일에 추가:"
  echo "  ${YELLOW}ALCHEMY_API_KEY=your_api_key_here${NC}"
  echo ""
else
  echo "${GREEN}✅ ALCHEMY_API_KEY가 설정되었습니다!${NC}"
  echo "   API Key: ${GREEN}${ALCHEMY_API_KEY:0:10}...${NC}"
  echo ""
fi

# ARBISCAN_API_KEY 확인 (선택사항)
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}  🔍 ARBISCAN_API_KEY 검증 (선택사항)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -z "$ARBISCAN_API_KEY" ]; then
  echo "${YELLOW}⚠️  ARBISCAN_API_KEY가 설정되지 않았습니다${NC}"
  echo ""
  echo "컨트랙트 검증에 필요하지만 선택사항입니다."
  echo ""
  echo "Arbiscan API Key 가져오기:"
  echo "  1. https://arbiscan.io 방문"
  echo "  2. 계정 생성 및 로그인"
  echo "  3. My Profile > API Keys > Add"
  echo "  4. API Key 복사"
  echo ""
else
  echo "${GREEN}✅ ARBISCAN_API_KEY가 설정되었습니다!${NC}"
  echo ""
fi

# 최종 요약
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}  🎉 검증 완료!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "설정된 환경 변수:"
echo "  - ${GREEN}PRIVATE_KEY${NC}: ✅ 올바름"

if [ -n "$ALCHEMY_API_KEY" ]; then
  echo "  - ${GREEN}ALCHEMY_API_KEY${NC}: ✅ 설정됨"
else
  echo "  - ${YELLOW}ALCHEMY_API_KEY${NC}: ⚠️  없음 (공개 RPC 사용)"
fi

if [ -n "$ARBISCAN_API_KEY" ]; then
  echo "  - ${GREEN}ARBISCAN_API_KEY${NC}: ✅ 설정됨"
else
  echo "  - ${YELLOW}ARBISCAN_API_KEY${NC}: ⚠️  없음 (검증 불가)"
fi

echo ""
echo "${GREEN}다음 단계:${NC}"
echo "  1. 지갑에 Arbitrum Sepolia ETH 받기"
echo "     ${BLUE}https://www.alchemy.com/faucets/arbitrum-sepolia${NC}"
echo ""
echo "  2. 컨트랙트 컴파일"
echo "     ${YELLOW}npx hardhat compile${NC}"
echo ""
echo "  3. 컨트랙트 배포"
echo "     ${YELLOW}npx hardhat run scripts/deploy.js --network arbitrumSepolia${NC}"
echo ""

echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
