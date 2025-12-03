# Supabase 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 접속

https://supabase.com/dashboard 에 접속하여 `dnhuzjztsujeuiykvlya` 프로젝트를 엽니다.

## 2. SQL 에디터에서 스키마 생성

1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New Query** 클릭
3. `backend/supabase/schema.sql` 파일 내용 전체 복사
4. SQL 에디터에 붙여넣기
5. **Run** 버튼 클릭하여 실행

## 3. 더미 데이터 삽입

1. 다시 **New Query** 클릭
2. `backend/supabase/seed-data.sql` 파일 내용 전체 복사
3. SQL 에디터에 붙여넣기
4. **Run** 버튼 클릭하여 실행

## 4. 테이블 확인

왼쪽 메뉴에서 **Table Editor** 클릭하면 다음 테이블들이 생성되어 있어야 합니다:

- ✅ `campaigns` - 캠페인 정보 (4개 더미 데이터)
- ✅ `users` - 사용자 정보 (3개 더미 데이터)
- ✅ `donations` - 기부 내역 (7개 더미 데이터)
- ✅ `furniture_owned` - 가구 소유 정보
- ✅ `user_badges` - 사용자 뱃지 (3개 더미 데이터)

## 5. 더미 데이터 확인

### Campaigns 테이블
```sql
SELECT
  title,
  goal_amount,
  current_amount,
  deadline,
  CASE
    WHEN deadline < NOW() THEN '마감됨'
    ELSE '진행중'
  END as status,
  CASE
    WHEN current_amount >= goal_amount THEN '달성'
    ELSE '미달성'
  END as achievement
FROM campaigns
ORDER BY deadline;
```

예상 결과:
1. "겨울 의류 지원" - 마감됨 + 달성 ✅
2. "유기견 임시보호소" - 마감됨 + 미달성 ❌
3. "해양 쓰레기 수거" - 진행중 + 달성 ✅
4. "소외계층 아동 교육" - 진행중 + 미달성 ❌

## 6. Frontend 연동 확인

Frontend가 실행 중이라면:
1. 새로고침
2. 캠페인 4개가 보여야 함
3. 기부하면 DB에 저장됨
4. 포인트도 DB에 저장됨

## 트러블슈팅

### RLS (Row Level Security) 오류가 발생하면

```sql
-- 모든 정책 확인
SELECT * FROM pg_policies;

-- 정책이 없다면 schema.sql을 다시 실행
```

### 데이터 초기화가 필요하면

```sql
-- 모든 데이터 삭제
TRUNCATE campaigns, users, donations, furniture_owned, user_badges CASCADE;

-- seed-data.sql 다시 실행
```
