# Donation Village - 블록체인 기반 투명한 기부 플랫폼

블록체인 기술을 활용한 투명하고 게임화된 기부 플랫폼입니다.

## 프로젝트 구조

이 프로젝트는 **Frontend**, **Backend**, **Blockchain** 세 부분으로 구성되어 있습니다:

```
Inudonationbcg/
├── frontend/           # React + Vite 프론트엔드
├── backend/            # Supabase 백엔드
├── blockchain/         # Hardhat 스마트 컨트랙트
├── docs/              # 프로젝트 문서
│   ├── deployment/    # 배포 가이드
│   ├── setup/         # 초기 설정
│   ├── fixes/         # 트러블슈팅
│   ├── guides/        # 사용 가이드
│   └── presentations/ # 프레젠테이션
└── src/               # 레거시 소스 (참고용)
```

## 빠른 시작

### 1. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

개발 서버가 http://localhost:5173 에서 실행됩니다.

### 2. Backend 설정

```bash
cd backend
# .env 파일에 Supabase 설정 추가
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### 3. Blockchain 배포

```bash
cd blockchain/hardhat-setup
npm install
npm run compile
npm run deploy:sepolia
```

## 기술 스택

### Frontend
- React 18.3.1 + TypeScript
- Vite 6.3.5
- Radix UI + Tailwind CSS
- React Context API

### Backend
- Supabase (BaaS)
- Hono (서버리스 함수)
- DID 기반 인증

### Blockchain
- Solidity
- Hardhat 2.22.16
- Ethers.js 6.9.0
- OpenZeppelin Contracts 5.0.0
- Arbitrum Sepolia (Testnet)

## 주요 기능

- **투명한 기부**: 모든 기부 내역이 블록체인에 기록됩니다
- **게임화**: 마을 시스템을 통한 참여형 기부 경험
- **NFT 증명서**: 기부 시 NFT 기반 증명서 발급
- **DID 인증**: 탈중앙화 신원 인증
- **실시간 동기화**: Supabase Realtime을 통한 데이터 동기화

## 디렉토리별 상세 정보

각 디렉토리의 README를 참조하세요:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Blockchain README](./blockchain/README.md)

## 문서

자세한 문서는 `/docs` 디렉토리를 참조하세요:
- [배포 가이드](./docs/deployment/)
- [초기 설정](./docs/setup/)
- [사용 가이드](./docs/guides/)

## 라이선스

MIT

## 원본 프로젝트

Figma 디자인: https://www.figma.com/design/6FqBalD70QrWJjhygN2I4D/Blockchain-Donation-Game-MVP
