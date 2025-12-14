import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './pages/LoginPage';
import { VillagePage } from './pages/VillagePage';
import { OrganizationPage } from './pages/OrganizationPage';
import { MyHousePage } from './pages/MyHousePage';
import { InventoryPage } from './pages/InventoryPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { getAllCampaigns, createCampaign, deleteCampaign, updateCampaign } from './lib/supabase-api';
import { Campaign } from './types';

type View = 'village' | 'organization' | 'myhouse' | 'inventory' | 'admin';

function AppContent() {
  const { user, authenticated, ready } = useAuth();
  const [currentView, setCurrentView] = useState<View>('village');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // 캠페인이 마감되었는지 확인하는 함수
  const isCampaignExpired = (campaign: Campaign): boolean => {
    if (!campaign.deadline) return false;
    return new Date(campaign.deadline) < new Date();
  };

  // Supabase에서 캠페인 데이터 로드
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const data = await getAllCampaigns();
        // 마감되지 않은 캠페인만 필터링
        const activeCampaigns = data.filter(campaign => !isCampaignExpired(campaign));
        setCampaigns(activeCampaigns);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
        setCampaigns([]); // 에러 발생 시 빈 배열
      } finally {
        setLoading(false);
      }
    };

    if (ready && authenticated) {
      loadCampaigns();
    } else if (ready) {
      // ready이지만 authenticated가 아니면 loading 해제
      setLoading(false);
    }
  }, [ready, authenticated]);

  // 로딩 상태
  if (!ready || loading) {
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

  const handleAdminClick = () => {
    setCurrentView('admin');
  };

  const handleBackToVillage = () => {
    setCurrentView('village');
    setSelectedCampaign(null);
  };

  const handleCampaignCreate = async (campaign: Campaign) => {
    try {
      const newCampaign = await createCampaign(campaign);
      setCampaigns((prev) => [newCampaign, ...prev]);
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('캠페인 생성에 실패했습니다.');
    }
  };

  const handleCampaignDelete = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      alert('캠페인 삭제에 실패했습니다.');
    }
  };

  const handleCampaignUpdate = async (campaignId: string, updates: Partial<Campaign>) => {
    try {
      const updated = await updateCampaign(campaignId, updates);
      setCampaigns((prev) => prev.map((c) => (c.id === campaignId ? updated : c)));
    } catch (error) {
      console.error('Failed to update campaign:', error);
      alert('캠페인 수정에 실패했습니다.');
    }
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
          onAdminClick={handleAdminClick}
          isOrganization={!!user?.isOrganization}
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

      {currentView === 'admin' && user?.isOrganization && (
        <AdminDashboard
          onBack={handleBackToVillage}
          campaigns={campaigns}
          onCampaignCreate={handleCampaignCreate}
          onCampaignDelete={handleCampaignDelete}
          onCampaignUpdate={handleCampaignUpdate}
        />
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
