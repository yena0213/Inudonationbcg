-- Reset Database - 기존 테이블 삭제 후 재생성
-- ⚠️ 주의: 모든 데이터가 삭제됩니다!

-- 1. 기존 테이블 삭제 (의존성 순서대로)
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS furniture_owned CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. 트리거 함수 삭제
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  wallet_address TEXT UNIQUE NOT NULL,
  did TEXT UNIQUE NOT NULL,
  wallet_type TEXT CHECK (wallet_type IN ('embedded', 'metamask')),
  is_organization BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Campaigns 테이블
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  goal_amount DECIMAL(18, 6) NOT NULL,
  current_amount DECIMAL(18, 6) DEFAULT 0,
  image_url TEXT,
  house_color TEXT DEFAULT '#FF6B6B',
  organization_address TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Donations 테이블
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  donor_email TEXT NOT NULL,
  donor_name TEXT,
  donor_wallet TEXT NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  transaction_hash TEXT UNIQUE NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Furniture owned 테이블
CREATE TABLE furniture_owned (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  furniture_type TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, furniture_type)
);

-- 8. User badges 테이블
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- 9. 인덱스 생성
CREATE INDEX idx_campaigns_deadline ON campaigns(deadline);
CREATE INDEX idx_campaigns_created ON campaigns(created_at DESC);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_created ON donations(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet ON users(wallet_address);

-- 10. RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture_owned ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- 11. RLS 정책 (모두 public access)
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Campaigns are viewable by everyone" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Anyone can create campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update campaigns" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete campaigns" ON campaigns FOR DELETE USING (true);

CREATE POLICY "Donations are viewable by everyone" ON donations FOR SELECT USING (true);
CREATE POLICY "Anyone can create donations" ON donations FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own furniture" ON furniture_owned FOR SELECT USING (true);
CREATE POLICY "Users can add own furniture" ON furniture_owned FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Users can earn badges" ON user_badges FOR INSERT WITH CHECK (true);

-- 12. Updated_at 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ✅ 테이블 재생성 완료!
