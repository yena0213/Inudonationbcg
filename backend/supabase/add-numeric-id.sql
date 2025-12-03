-- Add numeric_id to campaigns table for smart contract compatibility
-- UUID는 데이터베이스용, numeric_id는 블록체인용

-- 1. numeric_id 컬럼 추가 (SERIAL 타입 - 자동 증가)
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS numeric_id SERIAL UNIQUE;

-- 2. 기존 데이터에 numeric_id 할당 (이미 있다면)
-- 자동으로 1, 2, 3, ... 순으로 할당됨

-- 3. numeric_id에 인덱스 생성 (빠른 조회)
CREATE INDEX IF NOT EXISTS idx_campaigns_numeric_id ON campaigns(numeric_id);

-- 확인용 쿼리
-- SELECT id, numeric_id, title FROM campaigns ORDER BY numeric_id;
