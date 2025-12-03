# 🚀 실제 운영 환경 전환 완료!

## ✅ 완료된 작업

### 1. Supabase DB 활성화
- ✅ 테이블 스키마 작성 (`backend/supabase/schema.sql`)
- ✅ 더미 데이터 준비 (`backend/supabase/seed-data.sql`)
- ✅ RLS (Row Level Security) 설정
- ✅ 인덱스 최적화

### 2. Frontend → Supabase 연동
- ✅ Supabase API 클라이언트 작성 (`frontend/src/lib/supabase-api.ts`)
- ✅ 캠페인 CRUD 작업을 DB와 연결
- ✅ 기부 내역 DB 저장
- ✅ 사용자 포인트 DB 저장
- ✅ localStorage 의존성 제거

### 3. 데이터 영속성 확보
- ✅ 새로고침해도 데이터 유지
- ✅ 관리자가 생성한 캠페인 DB에 저장
- ✅ 기부 내역 DB에 저장 (블록체인 + DB 이중 저장)
- ✅ 사용자 포인트 DB에 저장

### 4. 더미 데이터 (4가지 케이스)
1. ✅ **마감 지남 + 목표 달성 O** - 겨울 의류 지원 캠페인
2. ✅ **마감 안지남 + 목표 달성 O** - 해양 쓰레기 수거 프로젝트
3. ✅ **마감 안지남 + 목표 달성 X** - 소외계층 아동 교육 지원
4. ✅ **마감 지남 + 목표 달성 X** - 유기견 임시보호소 운영비

---

## 📋 Supabase DB 설정 방법

### Step 1: Supabase 접속
https://supabase.com/dashboard/project/dnhuzjztsujeuiykvlya

### Step 2: SQL 에디터 열기
왼쪽 메뉴 → **SQL Editor** 클릭 → **New Query** 클릭

### Step 3: 테이블 생성
1. `backend/supabase/schema.sql` 파일 열기
2. 전체 내용 복사
3. SQL 에디터에 붙여넣기
4. **Run** 버튼 클릭

### Step 4: 더미 데이터 삽입
1. 다시 **New Query** 클릭
2. `backend/supabase/seed-data.sql` 파일 열기
3. 전체 내용 복사
4. SQL 에디터에 붙여넣기
5. **Run** 버튼 클릭

### Step 5: 확인
왼쪽 메뉴 → **Table Editor** 클릭

다음 테이블들이 보여야 합니다:
- ✅ `campaigns` (4개)
- ✅ `users` (3개)
- ✅ `donations` (7개)
- ✅ `furniture_owned`
- ✅ `user_badges` (3개)

---

## 🎯 작동 방식

### 1. 캠페인 조회
```
사용자 접속 → Frontend
           ↓
    getAllCampaigns() 호출
           ↓
    Supabase DB에서 캠페인 조회
           ↓
    4개 캠페인 표시
```

### 2. 기부 프로세스
```
사용자 기부 버튼 클릭
           ↓
    블록체인에 트랜잭션 전송 (Arbitrum)
           ↓
    트랜잭션 성공
           ↓
    Supabase DB에 저장
           ├─ donations 테이블 (기부 내역)
           ├─ campaigns 테이블 (금액 증가)
           └─ users 테이블 (포인트 증가)
           ↓
    사용자에게 완료 알림
```

### 3. 관리자 캠페인 생성
```
관리자 로그인 (isOrganization = true)
           ↓
    관리자 대시보드 → 기부 폼 작성
           ↓
    createCampaign() 호출
           ↓
    Supabase DB에 저장
           ↓
    즉시 화면에 반영
```

### 4. 캠페인 수정/삭제
```
관리자 → 기부 리스트 관리
           ↓
    카드 클릭 → 상세 팝업
           ↓
    수정 or 삭제 버튼 클릭
           ↓
    Supabase DB 업데이트
           ↓
    즉시 화면에 반영
```

---

## 🧪 테스트 방법

### 1. 캠페인 조회 테스트
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 localhost:3002 접속
# → 4개 캠페인이 보여야 함
```

### 2. 기부 테스트
1. 로그인 (이메일 입력)
2. 캠페인 클릭
3. 기부하기 버튼 클릭
4. 금액 입력 → 기부 완료
5. **Supabase 확인:**
   - `donations` 테이블에 새 행 추가됨
   - `campaigns` 테이블의 `current_amount` 증가
   - `users` 테이블의 `points` 증가

### 3. 관리자 기능 테스트
1. 로그인 시 "기업/단체 관리자" 체크
2. 마을 화면 → 관리자 버튼 클릭
3. **기부 폼 작성**
   - 새 캠페인 생성
   - Supabase `campaigns` 테이블에 저장 확인
4. **기부 리스트 관리**
   - 캠페인 수정/삭제
   - DB 반영 확인

---

## 📊 데이터 저장 위치

| 데이터 | 저장 위치 | 설명 |
|--------|----------|------|
| 기부 트랜잭션 | ✅ Blockchain + DB | 이중 저장으로 투명성 확보 |
| 캠페인 정보 | ✅ Supabase DB | 관리자가 생성/수정/삭제 |
| 사용자 정보 | ✅ Supabase DB | 자동 생성 및 업데이트 |
| 포인트 | ✅ Supabase DB | 기부 시 자동 증가 |
| 기부 내역 | ✅ Supabase DB | 모든 기부 영구 기록 |
| 가구 소유 | ✅ Supabase DB | 포인트로 구매 시 저장 |
| 뱃지 | ✅ Supabase DB | 자동 부여 |

---

## 🎨 더미 데이터 상세

### 캠페인 1: 마감 지남 + 목표 달성
- 제목: 겨울 의류 지원 캠페인 (완료)
- 목표: 1.5 ETH
- 현재: 2.0 ETH (달성률 133%)
- 마감: 10일 전

### 캠페인 2: 마감 안지남 + 목표 달성
- 제목: 해양 쓰레기 수거 프로젝트
- 목표: 2.0 ETH
- 현재: 2.5 ETH (달성률 125%)
- 마감: 20일 후

### 캠페인 3: 마감 안지남 + 목표 미달성
- 제목: 소외계층 아동 교육 지원
- 목표: 3.0 ETH
- 현재: 1.2 ETH (달성률 40%)
- 마감: 30일 후

### 캠페인 4: 마감 지남 + 목표 미달성
- 제목: 유기견 임시보호소 운영비
- 목표: 2.5 ETH
- 현재: 1.0 ETH (달성률 40%)
- 마감: 5일 전

---

## 🐛 트러블슈팅

### 문제: 캠페인이 안 보여요
**해결:**
1. Supabase SQL 에디터에서 `schema.sql` 실행 확인
2. `seed-data.sql` 실행 확인
3. 브라우저 콘솔에서 에러 확인

### 문제: 기부가 DB에 저장 안 돼요
**해결:**
1. `.env` 파일에 `VITE_ENABLE_BACKEND=true` 있는지 확인
2. Supabase RLS 정책 확인
3. 브라우저 콘솔에서 에러 로그 확인

### 문제: RLS 오류 발생
**해결:**
```sql
-- SQL Editor에서 실행
SELECT * FROM pg_policies;

-- 정책이 없으면 schema.sql 다시 실행
```

---

## 🚀 배포

### Vercel 재배포
```bash
git add .
git commit -m "Enable Supabase production mode"
git push

# Vercel이 자동으로 감지하고 재배포
```

### 환경 변수 설정 (Vercel)
Vercel Dashboard → Settings → Environment Variables

```
VITE_SUPABASE_PROJECT_ID=dnhuzjztsujeuiykvlya
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_CONTRACT_ADDRESS=0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1
VITE_ENABLE_BACKEND=true
```

---

## ✨ 이제 가능한 것들

1. ✅ **새로고침해도 데이터 유지**
2. ✅ **관리자가 실시간으로 캠페인 생성/수정/삭제**
3. ✅ **기부 내역 영구 저장**
4. ✅ **포인트 시스템 작동**
5. ✅ **투명한 기부 내역 추적**
6. ✅ **블록체인 + DB 이중 저장으로 신뢰성 확보**

---

## 📞 문의

질문이 있으면 언제든지 물어보세요! 🎉
