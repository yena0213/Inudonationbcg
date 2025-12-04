# 🏘️ Donation Village (기부 마을)

블록체인 기반 투명한 기부 게임 플랫폼

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://frontend-5744l5ppb-yenas-projects-4e17e81d.vercel.app)
[![Blockchain](https://img.shields.io/badge/Blockchain-Arbitrum%20Sepolia-blue)](https://sepolia.arbiscan.io/)
[![Database](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)

## 🎮 게임 소개

Donation Village는 블록체인 기술을 활용하여 투명하고 신뢰할 수 있는 기부 경험을 제공하는 게이미피케이션 플랫폼입니다.

### 핵심 컨셉
- 🏠 **가상 마을**: 각 기부 캠페인이 마을의 집으로 표현됩니다
- 💝 **투명한 기부**: 모든 기부 내역이 Arbitrum L2 블록체인에 영구 기록됩니다
- 🎁 **리워드 시스템**: 기부 시 포인트를 획득하고, 가구로 내 집을 꾸밀 수 있습니다
- 🏆 **뱃지 수집**: 기부 금액과 횟수에 따라 다양한 뱃지를 획득합니다
- 🔐 **DID 인증**: 탈중앙화 신원 인증으로 기부 증명서를 발급받습니다

## 🚀 배포 링크

**프로덕션 환경**: https://frontend-5744l5ppb-yenas-projects-4e17e81d.vercel.app

**블록 탐색기**: https://sepolia.arbiscan.io/

**스마트 컨트랙트 주소**: \`0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1\`

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18.3.1 + Vite 6.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Context API
- **Blockchain**: ethers.js 6.9.0
- **Deployment**: Vercel

### Backend
- **Database**: Supabase (PostgreSQL)
- **Functions**: Hono (Serverless)
- **Authentication**: DID-based + Google OAuth

### Blockchain
- **Network**: Arbitrum Sepolia (Layer 2)
- **Smart Contract**: Solidity 0.8.28
- **Framework**: Hardhat 2.22.16
- **Libraries**: OpenZeppelin Contracts 5.0.0

## 📁 프로젝트 구조

\`\`\`
Inudonationbcg/
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── components/    # UI 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── lib/           # 라이브러리 (API, 인증, 컨트랙트)
│   │   └── types/         # TypeScript 타입 정의
│   ├── public/            # 정적 파일
│   └── vercel.json        # Vercel 배포 설정
│
├── backend/               # 백엔드 서비스
│   ├── supabase/          # Supabase 스키마 및 마이그레이션
│   │   ├── schema.sql     # 데이터베이스 스키마
│   │   ├── seed-data.sql  # 샘플 데이터
│   │   └── add-numeric-id.sql  # 블록체인 호환성 마이그레이션
│   └── functions/         # Hono 서버리스 함수
│       └── verify-donation/  # 기부 검증 API
│
└── blockchain/            # 블록체인 스마트 컨트랙트
    ├── contracts/         # Solidity 컨트랙트
    │   └── DonationVillage.sol
    ├── scripts/           # 배포 스크립트
    └── hardhat.config.js  # Hardhat 설정
\`\`\`

## 🎯 주요 기능

### 1. 기부 마을 (Village Page)
- 모든 기부 캠페인을 집으로 시각화
- 카테고리별 필터링 (동물, 환경, 교육)
- 캠페인 진행 상태 실시간 표시
- 마감일 D-Day 표시

### 2. 기부하기 (Donation Flow)
- MetaMask 또는 임베디드 지갑으로 기부
- Arbitrum L2로 빠르고 저렴한 트랜잭션
- KRW → ETH 자동 변환 (1 ETH = 3,000,000 KRW)
- 블록체인 트랜잭션 해시 발급
- IPFS 기부 증명서 발급 (DID 기반)

### 3. 내 집 꾸미기 (My House)
- 포인트로 가구 구매
- 드래그 앤 드롭으로 배치
- 획득한 뱃지 전시
- 지갑 정보 및 DID 확인

### 4. 인벤토리 (Inventory)
- 기부 내역 조회 (블록체인 연동)
- 뱃지 컬렉션
- 포인트 및 지갑 정보
- Arbiscan 연동 (트랜잭션 확인)

### 5. 관리자 대시보드 (Admin Dashboard)
- 캠페인 생성, 수정, 삭제
- 실시간 기부 현황 모니터링
- 조직/단체 계정 전용 기능

## 🏗️ 아키텍처

### 데이터 흐름

\`\`\`
사용자
  ↓
[Frontend (React)]
  ↓
  ├─→ [Supabase] ← 빠른 조회 (캠페인, 사용자)
  └─→ [Arbitrum L2] ← 블록체인 기록 (기부 트랜잭션)
       ↓
   [Smart Contract]
       ↓
   [Event Emission]
       ↓
   [IPFS 증명서] (선택)
\`\`\`

### 듀얼 스토리지 패턴
- **Supabase**: 빠른 데이터 조회, 사용자 정보, 포인트 관리
- **Blockchain**: 불변 기부 기록, 투명성 보장, 검증 가능성

## 🔧 설치 및 실행

### 1. 사전 요구사항
- Node.js 18+
- npm 또는 yarn
- MetaMask (선택)
- Supabase 계정
- Arbitrum Sepolia 테스트넷 ETH

### 2. 환경 변수 설정

**frontend/.env**
\`\`\`bash
# Supabase
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key

# Smart Contract
VITE_CONTRACT_ADDRESS=0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1

# Network
VITE_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
VITE_CHAIN_ID=421614

# Backend
VITE_ENABLE_BACKEND=true
\`\`\`

### 3. 데이터베이스 설정

Supabase SQL Editor에서 실행:
\`\`\`sql
-- 1. 스키마 생성
-- backend/supabase/schema.sql 실행

-- 2. numeric_id 추가 (블록체인 호환성)
-- backend/supabase/add-numeric-id.sql 실행

-- 3. 샘플 데이터 추가 (선택)
-- backend/supabase/seed-data.sql 실행
\`\`\`

### 4. 프론트엔드 실행

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

브라우저에서 http://localhost:5173 접속

### 5. 블록체인 컨트랙트 배포 (선택)

\`\`\`bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network arbitrumSepolia
\`\`\`

## 📊 데이터베이스 스키마

### 주요 테이블

**campaigns** - 기부 캠페인
- \`id\` (UUID): 데이터베이스 고유 ID
- \`numeric_id\` (SERIAL): 스마트 컨트랙트용 숫자 ID
- \`title\`, \`description\`: 캠페인 정보
- \`goal_amount\`, \`current_amount\`: 목표/현재 금액
- \`deadline\`: 마감일

**users** - 사용자
- \`wallet_address\` (PK): 지갑 주소
- \`email\`, \`name\`: 사용자 정보
- \`did\`: 탈중앙화 신원
- \`points\`: 보유 포인트

**donations** - 기부 내역
- \`campaign_id\`: 캠페인 참조
- \`donor_address\`: 기부자 지갑
- \`amount\`: 기부 금액 (ETH)
- \`tx_hash\`: 블록체인 트랜잭션 해시
- \`certificate_url\`: IPFS 증명서 URL

**furniture_owned** - 소유 가구
**user_badges** - 사용자 뱃지

## 🔐 인증 및 보안

### 지갑 지원
- **임베디드 지갑**: 이메일로 자동 생성 (ethers.js)
- **MetaMask**: 외부 지갑 연결
- **Google OAuth**: Supabase Auth 연동

### DID (Decentralized Identity)
- \`did:pkh:eip155:421614:{address}\` 형식
- 지갑 주소 + 체인 ID 기반 고유 식별

### Content Security Policy
- \`unsafe-eval\` 허용 (Vite 빌드 요구사항)
- Supabase, Arbitrum, Google OAuth 도메인 허용

## 🧪 테스트

### 테스트 시나리오
1. **로그인**
   - 이메일 로그인
   - Google OAuth
   - MetaMask 연결

2. **기부하기**
   - 캠페인 선택
   - 금액 입력 (KRW)
   - 트랜잭션 전송
   - Arbiscan 확인

3. **집 꾸미기**
   - 포인트로 가구 구매
   - 가구 배치
   - 뱃지 전시

## 📝 주요 기술 이슈 및 해결

### 1. UUID vs 숫자 ID 매핑
- **문제**: DB는 UUID, 스마트 컨트랙트는 uint256 사용
- **해결**: \`numeric_id\` 컬럼 추가하여 듀얼 ID 관리

### 2. CSP 정책
- **문제**: Vite 빌드에서 eval() 사용으로 CSP 위반
- **해결**: \`unsafe-eval\` 허용 및 필요 도메인만 화이트리스트

### 3. Arbitrum Sepolia 네트워크 자동 추가
- **문제**: MetaMask에 네트워크가 없는 경우 에러
- **해결**: \`wallet_addEthereumChain\` 자동 호출

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📜 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👥 개발팀

- **프론트엔드**: React + TypeScript + Vite
- **백엔드**: Supabase + Hono
- **블록체인**: Solidity + Hardhat + ethers.js

## 🔗 관련 링크

- [Arbitrum Sepolia Testnet](https://sepolia.arbiscan.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Hardhat Documentation](https://hardhat.org/)

## 📧 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 남겨주세요.

---

Made with ❤️ by Donation Village Team
