-- Seed data for Donation Village
-- Test campaigns with various states

-- Sample campaigns (4 different scenarios)

-- Campaign 1: 마감 지남 + 목표 달성 O
INSERT INTO campaigns (
  id,
  organization_name,
  title,
  description,
  category,
  goal_amount,
  current_amount,
  image_url,
  house_color,
  organization_address,
  deadline,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '따뜻한손길재단',
  '겨울 의류 지원 캠페인 (완료)',
  '독거 어르신들을 위한 겨울 의류를 지원합니다. 목표 금액을 초과 달성하였습니다!',
  'Community',
  1.5,
  2.0,
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6',
  '#4ECDC4',
  '0x1111111111111111111111111111111111111111',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '40 days'
) ON CONFLICT (id) DO NOTHING;

-- Campaign 2: 마감 안지남 + 목표 달성 O
INSERT INTO campaigns (
  id,
  organization_name,
  title,
  description,
  category,
  goal_amount,
  current_amount,
  image_url,
  house_color,
  organization_address,
  deadline,
  created_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '바다사랑협회',
  '해양 쓰레기 수거 프로젝트',
  '깨끗한 바다를 위한 해양 쓰레기 수거 프로젝트입니다. 목표 금액을 달성했지만 계속 모금 중입니다!',
  'Environment',
  2.0,
  2.5,
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
  '#95E1D3',
  '0x2222222222222222222222222222222222222222',
  NOW() + INTERVAL '20 days',
  NOW() - INTERVAL '10 days'
) ON CONFLICT (id) DO NOTHING;

-- Campaign 3: 마감 안지남 + 목표 미달성
INSERT INTO campaigns (
  id,
  organization_name,
  title,
  description,
  category,
  goal_amount,
  current_amount,
  image_url,
  house_color,
  organization_address,
  deadline,
  created_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '꿈나무교육센터',
  '소외계층 아동 교육 지원',
  '소외계층 아동들의 교육을 위한 도서 및 교구를 지원합니다. 여러분의 도움이 필요합니다!',
  'Education',
  3.0,
  1.2,
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
  '#FFE66D',
  '0x3333333333333333333333333333333333333333',
  NOW() + INTERVAL '30 days',
  NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

-- Campaign 4: 마감 지남 + 목표 미달성
INSERT INTO campaigns (
  id,
  organization_name,
  title,
  description,
  category,
  goal_amount,
  current_amount,
  image_url,
  house_color,
  organization_address,
  deadline,
  created_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  '유기동물보호센터',
  '유기견 임시보호소 운영비',
  '유기견들의 건강한 보호를 위한 운영비 모금입니다. 아쉽게도 목표 금액에 미달했습니다.',
  'Animal',
  2.5,
  1.0,
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
  '#FF6B6B',
  '0x4444444444444444444444444444444444444444',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '35 days'
) ON CONFLICT (id) DO NOTHING;

-- Sample users
INSERT INTO users (
  id,
  email,
  name,
  wallet_address,
  did,
  wallet_type,
  is_organization,
  points
) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'donor@example.com',
    '김기부',
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'did:ethr:421614:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'embedded',
    false,
    150
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'org@example.com',
    '따뜻한손길재단',
    '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'did:ethr:421614:0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'embedded',
    true,
    0
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'user2@example.com',
    '이나눔',
    '0xcccccccccccccccccccccccccccccccccccccccc',
    'did:ethr:421614:0xcccccccccccccccccccccccccccccccccccccccc',
    'embedded',
    false,
    80
  )
ON CONFLICT (id) DO NOTHING;

-- Sample donations
INSERT INTO donations (
  campaign_id,
  user_id,
  donor_email,
  donor_name,
  donor_wallet,
  amount,
  transaction_hash,
  message,
  created_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'donor@example.com',
    '김기부',
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    0.5,
    '0xabcdef1111111111111111111111111111111111111111111111111111111111',
    '어르신들이 따뜻한 겨울 보내세요!',
    NOW() - INTERVAL '25 days'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'user2@example.com',
    '이나눔',
    '0xcccccccccccccccccccccccccccccccccccccccc',
    1.5,
    '0xabcdef2222222222222222222222222222222222222222222222222222222222',
    '좋은 일에 사용되길 바랍니다',
    NOW() - INTERVAL '20 days'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'donor@example.com',
    '김기부',
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    1.0,
    '0xabcdef3333333333333333333333333333333333333333333333333333333333',
    '깨끗한 바다를 위해!',
    NOW() - INTERVAL '8 days'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'user2@example.com',
    '이나눔',
    '0xcccccccccccccccccccccccccccccccccccccccc',
    1.5,
    '0xabcdef4444444444444444444444444444444444444444444444444444444444',
    '환경 보호 응원합니다',
    NOW() - INTERVAL '5 days'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'donor@example.com',
    '김기부',
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    0.7,
    '0xabcdef5555555555555555555555555555555555555555555555555555555555',
    '아이들의 밝은 미래를 응원합니다',
    NOW() - INTERVAL '3 days'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'user2@example.com',
    '이나눔',
    '0xcccccccccccccccccccccccccccccccccccccccc',
    0.5,
    '0xabcdef6666666666666666666666666666666666666666666666666666666666',
    '교육은 미래입니다',
    NOW() - INTERVAL '1 day'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'donor@example.com',
    '김기부',
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    1.0,
    '0xabcdef7777777777777777777777777777777777777777777777777777777777',
    '유기동물도 소중한 생명입니다',
    NOW() - INTERVAL '20 days'
  )
ON CONFLICT (transaction_hash) DO NOTHING;

-- Sample badges
INSERT INTO user_badges (user_id, badge_type) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'first_donation'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'generous_donor'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'first_donation')
ON CONFLICT (user_id, badge_type) DO NOTHING;
