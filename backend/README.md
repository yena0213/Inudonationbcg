# Backend - Donation Village

블록체인 기반 기부 플랫폼의 백엔드 서비스

## 기술 스택

- **BaaS**: Supabase (인증, 데이터베이스)
- **Runtime**: Hono (서버리스 함수)
- **Auth**: DID (Decentralized Identity) 기반 인증
- **Language**: TypeScript

## 디렉토리 구조

```
backend/
├── lib/
│   ├── api.ts              # API 통신 로직
│   ├── supabase-client.ts  # Supabase 클라이언트 설정
│   ├── auth-context.tsx    # 인증 컨텍스트
│   └── did.ts              # DID 관리
├── supabase/
│   └── functions/          # Supabase Edge Functions
│       └── server/
│           ├── index.tsx   # 서버 함수
│           └── kv_store.tsx # Key-Value 스토어
└── utils/
    └── supabase/           # Supabase 유틸리티
```

## 주요 기능

### 인증 시스템
- DID 기반 탈중앙화 인증
- Supabase Auth 통합
- OAuth 지원 (Google 등)

### API
- RESTful API 엔드포인트
- Supabase Realtime 구독
- Edge Functions을 통한 서버리스 처리

### 데이터베이스
- PostgreSQL (Supabase)
- 실시간 데이터 동기화
- Row Level Security (RLS)

## 환경 변수

`.env` 파일에 다음 변수를 설정하세요:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

## 개발

```bash
# Supabase CLI 설치
npm install -g supabase

# 로컬 Supabase 시작
supabase start

# Edge Functions 배포
supabase functions deploy
```
