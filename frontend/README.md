# Frontend - Donation Village

블록체인 기반 기부 플랫폼의 프론트엔드 애플리케이션

## 기술 스택

- **Framework**: React 18.3.1 + Vite 6.3.5
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: React Context API
- **Language**: TypeScript

## 디렉토리 구조

```
frontend/
├── src/
│   ├── components/     # React 컴포넌트
│   │   ├── ui/        # Radix UI 기반 재사용 가능한 UI 컴포넌트
│   │   ├── common/    # 공통 컴포넌트
│   │   └── figma/     # Figma 디자인 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── styles/        # 글로벌 스타일 및 토큰
│   ├── types/         # TypeScript 타입 정의
│   ├── data/          # 정적 데이터
│   ├── App.tsx        # 메인 앱 컴포넌트
│   └── main.tsx       # 엔트리 포인트
├── index.html         # HTML 템플릿
├── vite.config.ts     # Vite 설정
└── package.json       # 의존성 관리
```

## 주요 페이지

- `LoginPage` - 로그인 페이지
- `VillagePage` - 메인 마을 페이지
- `MyHousePage` - 개인 하우스
- `OrganizationPage` - 기관 페이지
- `InventoryPage` - 인벤토리

## 개발 서버 실행

```bash
cd frontend
npm install
npm run dev
```

## 빌드

```bash
npm run build
```
