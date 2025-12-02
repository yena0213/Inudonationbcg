# 🎨 리팩토링 완료 가이드

## ✅ 완료된 작업

### 1. 📁 프로젝트 구조 개선

```
/
├── pages/               # 페이지 컴포넌트
│   ├── LoginPage.tsx
│   ├── VillagePage.tsx
│   ├── OrganizationPage.tsx
│   ├── MyHousePage.tsx
│   └── InventoryPage.tsx
├── components/
│   ├── common/          # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── LoadingSpinner.tsx   # 새로 추가
│   │   ├── Container.tsx         # 새로 추가
│   │   ├── PageHeader.tsx        # 새로 추가
│   │   └── index.ts
│   └── [특화 컴포넌트들...]
├── types/               # 타입 정의
│   └── index.ts
├── data/                # 더미 데이터
│   └── campaigns.ts
├── styles/
│   ├── globals.css
│   └── tokens.css       # 디자인 토큰
└── App.tsx
```

### 2. 🎨 디자인 토큰 시스템

모든 스타일 값을 CSS 변수로 토큰화했습니다.

#### 색상 토큰
```css
/* 브랜드 색상 */
--color-brand-primary: #22C55E;
--color-brand-secondary: #10B981;

/* 배경 색상 */
--color-bg-primary: #FEFCE8;
--color-bg-secondary: #FEF3C7;
--color-bg-tertiary: #FFFFFF;

/* 텍스트 색상 */
--color-text-primary: #1F2937;
--color-text-secondary: #6B7280;
--color-text-inverse: #FFFFFF;

/* 상태 색상 */
--color-success: #22C55E;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;
```

#### 간격 토큰
```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

#### 폰트 토큰
```css
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 1.875rem;    /* 30px */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### 기타 토큰
```css
/* 보더 라디우스 */
--radius-xl: 1rem;        /* 16px */
--radius-2xl: 1.5rem;     /* 24px */
--radius-3xl: 2rem;       /* 32px */

/* 그림자 */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* 애니메이션 */
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Z-Index */
--z-modal: 40;
--z-overlay: 30;
--z-dropdown: 10;
```

### 3. 🧩 공통 컴포넌트

#### Button 컴포넌트
```tsx
import { Button } from '@/components/common';

// 사용 예시
<Button variant="primary" size="md">
  기부하기
</Button>

<Button variant="success" size="lg" fullWidth>
  확인
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean

#### Card 컴포넌트
```tsx
import { Card } from '@/components/common';

<Card padding="lg" shadow hover>
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</Card>
```

**Props:**
- `padding`: 'sm' | 'md' | 'lg'
- `shadow`: boolean
- `hover`: boolean (hover 효과)
- `onClick`: () => void

#### LoadingSpinner 컴포넌트 (새로 추가)
```tsx
import { LoadingSpinner } from '@/components/common';

<LoadingSpinner size="md" message="로딩 중..." />
```

#### Container 컴포넌트 (새로 추가)
```tsx
import { Container } from '@/components/common';

<Container maxWidth="lg">
  <h1>페이지 내용</h1>
</Container>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `padding`: boolean

#### PageHeader 컴포넌트 (새로 추가)
```tsx
import { PageHeader } from '@/components/common';

<PageHeader
  title="내 집"
  subtitle="가구를 배치하고 꾸며보세요"
  onBack={() => navigate('/')}
  actions={<Button>설정</Button>}
/>
```

### 4. 📄 페이지 분리

각 화면을 독립적인 페이지 컴포넌트로 분리했습니다.

#### App.tsx (라우팅 로직만)
```tsx
function AppContent() {
  const [currentView, setCurrentView] = useState<View>('village');
  
  return (
    <>
      {currentView === 'village' && <VillagePage />}
      {currentView === 'organization' && <OrganizationPage />}
      {currentView === 'myhouse' && <MyHousePage />}
      {currentView === 'inventory' && <InventoryPage />}
    </>
  );
}
```

#### 페이지 컴포넌트
- `LoginPage`: 로그인 화면
- `VillagePage`: 마을 메인 화면
- `OrganizationPage`: 기부 단체 상세 + 기부 모달 포함
- `MyHousePage`: 내 집 관리
- `InventoryPage`: 가방 (인벤토리)

### 5. 📦 타입 분리

모든 타입을 `/types/index.ts`로 통합했습니다.

```tsx
import { Campaign, User, Donation } from '@/types';
```

### 6. 📊 데이터 분리

더미 데이터를 `/data/campaigns.ts`로 분리했습니다.

```tsx
import { CAMPAIGNS } from '@/data/campaigns';
```

## 🎯 사용 가이드

### 1. 토큰 사용 방법

#### 방법 1: 인라인 스타일 (권장)
```tsx
<div style={{ 
  backgroundColor: 'var(--color-bg-primary)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-2xl)',
  boxShadow: 'var(--shadow-lg)',
}}>
  내용
</div>
```

#### 방법 2: Tailwind + 토큰
```tsx
<div className="p-6" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
  내용
</div>
```

### 2. 공통 컴포넌트 임포트

```tsx
// 개별 임포트
import { Button } from '@/components/common';
import { Card } from '@/components/common';

// 한 번에 임포트
import { Button, Card, Modal } from '@/components/common';
```

### 3. 새 페이지 추가하기

```tsx
// /pages/NewPage.tsx
export function NewPage({ onBack }: { onBack: () => void }) {
  return (
    <Container>
      <PageHeader title="새 페이지" onBack={onBack} />
      <Card>
        <p>내용</p>
      </Card>
    </Container>
  );
}

// App.tsx에 추가
{currentView === 'new' && <NewPage onBack={handleBack} />}
```

## 🎨 디자인 일관성 규칙

### 1. 색상 사용
- ✅ `var(--color-brand-primary)` 사용
- ❌ `#22C55E` 직접 사용 금지

### 2. 간격 사용
- ✅ `var(--spacing-lg)` 사용
- ❌ `24px` 직접 사용 금지

### 3. 보더 라디우스
- ✅ `var(--radius-2xl)` 사용
- ❌ `16px` 직접 사용 금지

### 4. 애니메이션
- ✅ `transition: var(--transition-base)` 사용
- ❌ `transition: 250ms` 직접 사용 금지

## 🔧 토큰 수정 방법

모든 토큰은 `/styles/tokens.css` 파일에서 수정합니다.

```css
/* 브랜드 색상 변경 예시 */
:root {
  --color-brand-primary: #FF6B6B;  /* 초록 → 빨강 */
  --color-brand-secondary: #EE5A6F;
}
```

변경 후 모든 컴포넌트에 자동 반영됩니다! 🎉

## 📝 추가 작업 필요 사항

### 1. 기존 컴포넌트 토큰화
다음 컴포넌트들도 토큰 기반으로 리팩토링 필요:
- [ ] LoginScreen.tsx
- [ ] VillageMain.tsx
- [ ] OrganizationHouse.tsx
- [ ] MyHouse.tsx
- [ ] Inventory.tsx
- [ ] DonationModal.tsx
- [ ] DonationDetail.tsx

### 2. 반응형 토큰 추가
```css
/* 브레이크포인트 토큰 */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### 3. 애니메이션 유틸리티 클래스 확장
```css
.animate-bounce-slow { /* 이미 있음 */ }
.animate-fade-in { /* 이미 있음 */ }
.animate-slide-up { /* 이미 있음 */ }

/* 추가 필요 */
.animate-slide-down { }
.animate-scale-in { }
```

## 🎉 장점

### 1. 유지보수성 향상
- 색상 변경 시 한 곳(tokens.css)만 수정
- 일관된 디자인 시스템

### 2. 재사용성 증가
- 공통 컴포넌트로 중복 코드 제거
- props로 쉽게 커스터마이징

### 3. 확장성 개선
- 새 페이지 추가가 쉬움
- 타입 안정성 확보

### 4. 협업 효율성
- 디자이너와 토큰 기반으로 소통
- 컴포넌트 재사용으로 생산성 향상

## 🚀 다음 단계

1. **기존 컴포넌트 리팩토링**: 토큰 기반으로 전환
2. **Storybook 추가**: 공통 컴포넌트 문서화
3. **E2E 테스트**: 페이지별 테스트 작성
4. **성능 최적화**: React.memo, useMemo 적용

---

**작성일**: 2025-12-02  
**작성자**: AI Assistant  
**버전**: 1.0.0
