import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './pages/LoginPage';
import { VillagePage } from './pages/VillagePage';
import { OrganizationPage } from './pages/OrganizationPage';
import { MyHousePage } from './pages/MyHousePage';
import { InventoryPage } from './pages/InventoryPage';
import { CAMPAIGNS } from './data/campaigns';
import { Campaign } from './types';

type View = 'village' | 'organization' | 'myhouse' | 'inventory';

function AppContent() {
  const { user, authenticated, ready } = useAuth();
  const [currentView, setCurrentView] = useState<View>('village');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);

  // 로딩 상태
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))' 
        }}
      >
        <div className="text-center animate-fade-in">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: 'var(--color-brand-primary)',
              borderTopColor: 'transparent'
            }}
          />
          <p style={{ color: 'var(--color-brand-secondary)' }}>
            기부 마을을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!authenticated || !user) {
    return <LoginPage />;
  }

  // 네비게이션 핸들러들
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

  const handleDonationComplete = (amount: number) => {
    // 캠페인 금액 업데이트 (로컬 상태)
    if (selectedCampaign) {
      const updatedCampaigns = campaigns.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, currentAmount: c.currentAmount + amount }
          : c
      );
      setCampaigns(updatedCampaigns);
      
      const updated = updatedCampaigns.find(c => c.id === selectedCampaign.id);
      if (updated) {
        setSelectedCampaign(updated);
      }
    }
  };

  // 뷰 렌더링
  return (
    <>
      {currentView === 'village' && (
        <VillagePage
          campaigns={campaigns}
          onOrganizationClick={handleOrganizationClick}
          onMyHouseClick={handleMyHouseClick}
          onInventoryClick={handleInventoryClick}
        />
      )}

      {currentView === 'organization' && selectedCampaign && (
        <OrganizationPage
          campaign={selectedCampaign}
          onBack={handleBackToVillage}
          onDonationComplete={handleDonationComplete}
        />
      )}

      {currentView === 'myhouse' && (
        <MyHousePage onBack={handleBackToVillage} />
      )}

      {currentView === 'inventory' && (
        <InventoryPage onBack={handleBackToVillage} />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
