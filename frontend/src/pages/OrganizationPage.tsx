import { useState } from 'react';
import { OrganizationHouse } from '../components/OrganizationHouse';
import { DonationModal } from '../components/DonationModal';
import { DonationDetail } from '../components/DonationDetail';
import { Campaign } from '../types';
import { useAuth } from '../lib/auth-context';
import { saveDonation, increaseCampaignAmount, increaseUserPoints, getOrCreateUser } from '../lib/supabase-api';
import { krwToEth } from '../lib/contract';

interface OrganizationPageProps {
  campaign: Campaign;
  onBack: () => void;
  onDonationComplete?: (amount: number) => void;
}

export function OrganizationPage({ 
  campaign, 
  onBack,
  onDonationComplete 
}: OrganizationPageProps) {
  const { user } = useAuth();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showDonationDetail, setShowDonationDetail] = useState(false);
  const [lastDonation, setLastDonation] = useState<{ amount: number; txHash: string; certificateUrl?: string } | null>(null);

  const handleOpenDonationModal = () => {
    setShowDonationModal(true);
  };

  const handleDonationConfirm = async (amount: number, txHash: string, certificateUrl?: string) => {
    try {
      // 사용자 확인 또는 생성
      if (user) {
        await getOrCreateUser(user.walletAddress, {
          email: user.email,
          name: user.name,
          did: user.did,
          walletType: user.walletType,
          isOrganization: user.isOrganization,
        });

        // KRW를 ETH로 변환
        const ethAmount = parseFloat(krwToEth(amount));

        // DB에 기부 내역 저장
        await saveDonation({
          campaignId: campaign.id,
          donorAddress: user.walletAddress,
          amount: ethAmount,
          message: '',
          txHash,
          category: campaign.category,
          certificateUrl,
        });

        // 캠페인 금액 증가
        await increaseCampaignAmount(campaign.id, ethAmount);

        // 사용자 포인트 증가
        await increaseUserPoints(user.walletAddress, amount);

        console.log('✅ 기부 내역이 DB에 저장되었습니다.');
      }
    } catch (error) {
      console.error('Failed to save donation to DB:', error);
    }

    setLastDonation({ amount, txHash, certificateUrl });
    setShowDonationModal(false);
    setShowDonationDetail(true);

    if (onDonationComplete) {
      onDonationComplete(amount);
    }
  };

  if (!user) return null;

  return (
    <>
      <OrganizationHouse
        campaign={campaign}
        onBack={onBack}
        onDonate={handleOpenDonationModal}
      />
      
      {showDonationModal && (
        <DonationModal
          campaign={campaign}
          onClose={() => setShowDonationModal(false)}
          onConfirm={handleDonationConfirm}
          userWallet={user.walletAddress}
        />
      )}

      {showDonationDetail && lastDonation && (
        <DonationDetail
          campaignName={campaign.title}
          organizationName={campaign.organizationName}
          amount={lastDonation.amount}
          txHash={lastDonation.txHash}
          certificateUrl={lastDonation.certificateUrl}
          onClose={() => {
            setShowDonationDetail(false);
            setLastDonation(null);
          }}
        />
      )}
    </>
  );
}
