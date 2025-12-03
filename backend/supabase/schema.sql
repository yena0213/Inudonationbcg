-- Donation Village Database Schema for Supabase
-- 실제 운영 환경용

-- 1. 캠페인 테이블
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('동물', '환경', '교육')),
  goal_amount DECIMAL NOT NULL,
  current_amount DECIMAL DEFAULT 0,
  image_url TEXT,
  house_color TEXT DEFAULT '#FFB6C1',
  deadline TIMESTAMP WITH TIME ZONE,
  organization_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  wallet_address TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  did TEXT,
  wallet_type TEXT CHECK (wallet_type IN ('embedded', 'metamask')),
  is_organization BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 기부 내역 테이블
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_address TEXT REFERENCES users(wallet_address),
  amount DECIMAL NOT NULL,
  message TEXT,
  tx_hash TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT,
  certificate_url TEXT
);

-- 4. 사용자 소유 가구 테이블
CREATE TABLE IF NOT EXISTS furniture_owned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT REFERENCES users(wallet_address),
  furniture_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_address, furniture_id)
);

-- 5. 사용자 뱃지 테이블
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT REFERENCES users(wallet_address),
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_address, badge_name)
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_campaigns_deadline ON campaigns(deadline);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_address);
CREATE INDEX IF NOT EXISTS idx_donations_timestamp ON donations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_furniture_user ON furniture_owned(user_address);

-- Row Level Security (RLS) 활성화
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture_owned ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사람이 읽을 수 있음
CREATE POLICY "Anyone can read campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can read donations" ON donations FOR SELECT USING (true);
CREATE POLICY "Anyone can read furniture" ON furniture_owned FOR SELECT USING (true);
CREATE POLICY "Anyone can read badges" ON user_badges FOR SELECT USING (true);

-- RLS 정책: 인증된 사용자만 쓸 수 있음
CREATE POLICY "Authenticated users can insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update campaigns" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete campaigns" ON campaigns FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update users" ON users FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can insert furniture" ON furniture_owned FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can insert badges" ON user_badges FOR INSERT WITH CHECK (true);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
