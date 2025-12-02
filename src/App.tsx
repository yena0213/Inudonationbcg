import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { VillageMain } from './components/VillageMain';
import { OrganizationHouse } from './components/OrganizationHouse';
import { MyHouse } from './components/MyHouse';
import { Inventory } from './components/Inventory';
import { DonationModal } from './components/DonationModal';
import { DonationDetail } from './components/DonationDetail';
import { AuthProvider, useAuth } from './lib/auth-context';
import { Toaster } from './components/ui/sonner';

// Campaign 타입 정의
export interface Campaign {
  id: string;
  organizationName: string;
  title: string;
  description: string;
  category: '동물' | '환경' | '교육';
  goalAmount: number;
  currentAmount: number;
  imageUrl: string;
  houseColor: string;
  organizationAddress?: string;
}

// User 타입 정의
export interface User {
  email: string;
  name?: string;
  walletAddress: string;
  did: string;
  points?: number;
}

// FurnitureItem 타입 정의
export interface FurnitureItem {
  id: string;
  name: string;
  type: 'furniture' | 'decoration' | 'flooring' | 'wallpaper';
  imageUrl: string;
  price: number;
  owned: boolean;
}

// Badge 타입 정의
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: string;
  condition: string;
}

// Donation 타입 정의
export interface Donation {
  id: string;
  campaignId: string;
  campaignName: string;
  organizationName: string;
  amount: number;
  message?: string;
  txHash: string;
  timestamp: string;
  category: string;
}

// 더미 캠페인 데이터
const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    organizationName: '유기견 보호센터',
    title: '유기견들에게 따뜻한 겨울을',
    description: '추운 겨울을 나기 위한 난방비와 사료가 필요합니다. 여러분의 도움이 절실합니다.',
    category: '동물',
    goalAmount: 5000000,
    currentAmount: 3200000,
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
    houseColor: '#FF6B6B',
    organizationAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  },
  {
    id: '2',
    organizationName: '숲 살리기 재단',
    title: '미세먼지 잡는 도심 숲 조성',
    description: '도심 속 녹지 공간을 만들어 시민들에게 쾌적한 환경을 제공하고자 합니다.',
    category: '환경',
    goalAmount: 10000000,
    currentAmount: 7500000,
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    houseColor: '#51CF66',
    organizationAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
  },
  {
    id: '3',
    organizationName: '희망 장학재단',
    title: '꿈을 키우는 교육 후원',
    description: '경제적 어려움을 겪는 학생들에게 교육의 기회를 제공합니다.',
    category: '교육',
    goalAmount: 8000000,
    currentAmount: 4200000,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    houseColor: '#4DABF7',
    organizationAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  },
];

function AppContent() {
  const { user, authenticated, ready } = useAuth();
  const [currentView, setCurrentView] = useState<'village' | 'organization' | 'myhouse' | 'inventory'>('village');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showDonationDetail, setShowDonationDetail] = useState(false);
  const [lastDonation, setLastDonation] = useState<{ amount: number; txHash: string } | null>(null);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700">기부 마을을 ��러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return <LoginScreen />;
  }

  // 핸들러들
  const handleOrganizationClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCurrentView('organization');
  };

  const handleMyHouseClick = () => {
    setCurrentView('myhouse');
  };

  const handleInventoryClick = () => {
    setCurrentView('inventory');
  };

  const handleBackToVillage = () => {
    setCurrentView('village');
    setSelectedCampaign(null);
  };

  const handleOpenDonationModal = () => {
    setShowDonationModal(true);
  };

  const handleDonationConfirm = (amount: number, txHash: string) => {
    setLastDonation({ amount, txHash });
    setShowDonationModal(false);
    setShowDonationDetail(true);
    
    // 캠페인 금액 업데이트 (로컬 상태)
    if (selectedCampaign) {
      const updatedCampaigns = CAMPAIGNS.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, currentAmount: c.currentAmount + amount }
          : c
      );
      const updated = updatedCampaigns.find(c => c.id === selectedCampaign.id);
      if (updated) {
        setSelectedCampaign(updated);
      }
    }
  };

  // 뷰 렌더링
  if (currentView === 'village') {
    return (
      <VillageMain
        campaigns={CAMPAIGNS}
        onOrganizationClick={handleOrganizationClick}
        onMyHouseClick={handleMyHouseClick}
        onInventoryClick={handleInventoryClick}
      />
    );
  }

  if (currentView === 'organization' && selectedCampaign) {
    return (
      <>
        <OrganizationHouse
          campaign={selectedCampaign}
          onBack={handleBackToVillage}
          onDonate={handleOpenDonationModal}
        />
        
        {showDonationModal && (
          <DonationModal
            campaign={selectedCampaign}
            onClose={() => setShowDonationModal(false)}
            onConfirm={handleDonationConfirm}
            userWallet={user.walletAddress}
          />
        )}

        {showDonationDetail && lastDonation && (
          <DonationDetail
            campaign={selectedCampaign}
            amount={lastDonation.amount}
            txHash={lastDonation.txHash}
            onClose={() => {
              setShowDonationDetail(false);
              handleBackToVillage();
            }}
          />
        )}
      </>
    );
  }

  if (currentView === 'myhouse') {
    return (
      <MyHouse
        onBack={handleBackToVillage}
        user={user}
      />
    );
  }

  if (currentView === 'inventory') {
    return (
      <Inventory
        onBack={handleBackToVillage}
        user={user}
      />
    );
  }

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}