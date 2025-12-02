import { useState } from 'react';
import { ArrowLeft, Award, History, Wallet, ExternalLink } from 'lucide-react';
import type { User, Badge, Donation } from '../App';
import { DonationDetail } from './DonationDetail';

interface InventoryProps {
  user: User | null;
  onBack: () => void;
}

// Arbitrum L2 블록체인 탐색기 URL
const ARBISCAN_URL = 'https://arbiscan.io/tx/';

// Mock 데이터 체크 (실제 트랜잭션 해시는 0x로 시작하고 66자)
const isMockTransaction = (txHash: string) => {
  return txHash.includes('...') || txHash.length < 66;
};

const openBlockExplorer = (txHash: string, e: React.MouseEvent) => {
  e.stopPropagation(); // 카드 클릭 이벤트 방지
  
  if (isMockTransaction(txHash)) {
    alert('⚠️ 개발 모드: Mock 데이터입니다.\n\n실제 블록체인 연동을 위해서는:\n1. Hardhat으로 스마트 컨트랙트를 Arbitrum L2에 배포\n2. 환경 변수 설정\n3. /lib/api.ts에서 ENABLE_BACKEND = true로 변경\n\n그러면 실제 트랜잭션 해시가 생성되어 Arbiscan에서 확인 가능합니다.');
    return;
  }
  
  window.open(`${ARBISCAN_URL}${txHash}`, '_blank', 'noopener,noreferrer');
};

export function Inventory({ user, onBack }: InventoryProps) {
  const [activeTab, setActiveTab] = useState<'donations' | 'badges' | 'points'>('donations');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // 모든 뱃지 정의 (획득 여부와 관계없이)
  const allBadges: Badge[] = [
    {
      id: 'first-donor',
      name: '첫 기부',
      description: '첫 번째 기부를 완료했어요',
      imageUrl: '🌱',
      tier: 'bronze',
      unlockedAt: user && user.points >= 1000 ? '2024-01-15' : undefined
    },
    {
      id: 'warm-heart',
      name: '따뜻한 마음',
      description: '누적 기부 10만원 달성',
      imageUrl: '❤️',
      tier: 'silver',
      unlockedAt: user && user.points >= 10000 ? '2024-02-01' : undefined
    },
    {
      id: 'angel',
      name: '기부 천사',
      description: '누적 기부 50만원 달성',
      imageUrl: '😇',
      tier: 'gold',
      unlockedAt: user && user.points >= 50000 ? '2024-03-10' : undefined
    },
    {
      id: 'hero',
      name: '기부 영웅',
      description: '누적 기부 100만원 달성',
      imageUrl: '🦸',
      tier: 'platinum',
      unlockedAt: user && user.points >= 100000 ? undefined : undefined
    },
    {
      id: 'environment',
      name: '환경 지키미',
      description: '환경 분야에 3회 기부',
      imageUrl: '🌳',
      tier: 'special',
      unlockedAt: undefined
    },
    {
      id: 'education',
      name: '교육 후원자',
      description: '교육 분야에 5회 기부',
      imageUrl: '📚',
      tier: 'special',
      unlockedAt: undefined
    },
    {
      id: 'animal',
      name: '동물 친구',
      description: '동물 분야에 5회 기부',
      imageUrl: '🐾',
      tier: 'special',
      unlockedAt: undefined
    },
    {
      id: 'consistent',
      name: '꾸준한 기부자',
      description: '3개월 연속 기부',
      imageUrl: '⭐',
      tier: 'gold',
      unlockedAt: undefined
    },
  ];

  // Mock donations data
  const mockDonations: Donation[] = [
    {
      id: 'd1',
      campaignId: 'camp1',
      campaignTitle: '겨울나기 따뜻한 보금자리 만들기',
      organizationName: '숲속동물보호센터',
      amount: 30000,
      txHash: '0xabcd1234...5678',
      timestamp: '2025-11-28T10:30:00',
      status: 'success'
    },
    {
      id: 'd2',
      campaignId: 'camp2',
      campaignTitle: '사막화 방지 나무 심기 프로젝트',
      organizationName: '초록나무재단',
      amount: 50000,
      txHash: '0x9876fedc...4321',
      timestamp: '2025-11-25T14:20:00',
      status: 'success'
    }
  ];

  const [donations] = useState<Donation[]>(mockDonations);
  const [badges] = useState<Badge[]>(allBadges);

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const lockedBadges = badges.filter(b => !b.unlockedAt);
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  // Show donation detail if selected
  if (selectedDonation) {
    return (
      <DonationDetail 
        donation={selectedDonation} 
        onBack={() => setSelectedDonation(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          마을로 돌아가기
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
              🎒
            </div>
            <div className="flex-1">
              <h1 className="text-blue-800 mb-1">내 가방</h1>
              <p className="text-blue-600">기부 내역과 뱃지를 확인하세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-green-200">
          <p className="text-green-600 text-sm mb-1">총 기부 금액</p>
          <p className="text-green-800">{totalDonated.toLocaleString()}원</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-purple-200">
          <p className="text-purple-600 text-sm mb-1">기부 횟수</p>
          <p className="text-purple-800">{donations.length}회</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-yellow-200">
          <p className="text-yellow-600 text-sm mb-1">획득한 뱃지</p>
          <p className="text-yellow-800">{unlockedBadges.length}개</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-2 border-2 border-blue-200 flex gap-2">
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'donations'
                ? 'bg-blue-400 text-white'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <History className="w-5 h-5" />
            기부 내역
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'badges'
                ? 'bg-blue-400 text-white'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <Award className="w-5 h-5" />
            뱃지
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'points'
                ? 'bg-blue-400 text-white'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <Wallet className="w-5 h-5" />
            포인트
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'donations' && (
          <div>
            {/* Development Mode Banner */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 border-2 border-orange-300 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-orange-800 font-semibold mb-1">개발 모드 (Mock 데이터)</p>
                  <p className="text-orange-700 text-sm">
                    현재는 테스트 데이터를 사용 중입니다. 실제 블록체인 연동을 위해서는 스마트 컨트랙트를 Arbitrum L2에 배포해야 합니다.
                  </p>
                  <p className="text-orange-600 text-xs mt-2">
                    📝 /lib/api.ts에서 ENABLE_BACKEND = true로 변경하면 실제 트랜잭션 사용
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-200">
              <h3 className="text-blue-800 mb-4">기부 내역</h3>
              
              {donations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-blue-700 mb-2">아직 기부 내역이 없어요</p>
                  <p className="text-blue-600 text-sm">마을의 집들을 방문해보세요!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <button
                      key={donation.id}
                      onClick={() => setSelectedDonation(donation)}
                      className="w-full bg-blue-50 rounded-2xl p-4 border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-blue-800 mb-1">{donation.campaignTitle}</p>
                          <p className="text-blue-600 text-sm">{donation.organizationName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-800">{donation.amount.toLocaleString()}원</p>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs mt-1">
                            완료
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-blue-600 text-xs mb-1">트랜잭션 해시</p>
                        <p className="text-blue-500 text-xs font-mono break-all cursor-pointer" onClick={(e) => openBlockExplorer(donation.txHash, e)}>
                          {donation.txHash}
                        </p>
                        <p className="text-blue-500 text-xs mt-1">
                          {new Date(donation.timestamp).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      <div className="flex items-center justify-end mt-2 text-blue-500 text-xs">
                        돈의 흐름 보기 →
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <p className="text-green-800 text-sm mb-2">🔗 블록체인 투명성</p>
                <p className="text-green-700 text-sm">
                  모든 기부 내역은 블록체인에 영구 기록되며,
                  공개 탐색기에서 누구나 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Unlocked badges */}
            {unlockedBadges.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-200">
                <h3 className="text-yellow-800 mb-4">획득한 뱃지 ✨</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {unlockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center border-2 border-yellow-300"
                    >
                      <div className="text-5xl mb-2">{badge.imageUrl}</div>
                      <p className="text-yellow-800 mb-1">{badge.name}</p>
                      <p className="text-yellow-600 text-xs mb-2">{badge.description}</p>
                      <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-xs">
                        {badge.tier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked badges */}
            {lockedBadges.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                <h3 className="text-gray-700 mb-4">획득 가능한 뱃지 🔒</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-gray-50 rounded-2xl p-4 text-center border-2 border-gray-200 opacity-60"
                    >
                      <div className="text-5xl mb-2 grayscale">{badge.imageUrl}</div>
                      <p className="text-gray-700 mb-1">{badge.name}</p>
                      <p className="text-gray-600 text-xs mb-2">{badge.description}</p>
                      <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs">
                        잠김
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-4 border-2 border-purple-200">
              <p className="text-purple-800 text-sm mb-2">🎖️ 뱃지 획득 방법</p>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• 기부 금액과 횟수에 따라 자동으로 획득돼요</li>
                <li>• 획득한 뱃지는 내 집에 전시할 수 있어요</li>
                <li>• 더 높은 티어의 뱃지에 도전해보세요!</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-200">
            <h3 className="text-blue-800 mb-4">내 포인트 정보</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
                <p className="text-blue-700 mb-2">지갑 주소</p>
                <p className="text-blue-600 text-sm font-mono break-all bg-white p-3 rounded-xl">
                  {user?.walletAddress}
                </p>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                <p className="text-green-700 mb-2">보유 포인트</p>
                <p className="text-green-800">{user?.points.toLocaleString() || 0} P</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                <p className="text-purple-700 mb-2">네트워크</p>
                <p className="text-purple-800">Layer 2 (Arbitrum)</p>
                <p className="text-purple-600 text-sm mt-1">
                  빠르고 저렴한 트랜잭션 비용
                </p>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200">
                <p className="text-yellow-800 text-sm mb-2">💡 지갑 정보</p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• 이메일 로그인으로 자동 생성된 지갑이에요</li>
                  <li>• 메타마스크 설치 없이 사용 가능해요</li>
                  <li>• 모든 기부는 블록체인에 기록돼요</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}