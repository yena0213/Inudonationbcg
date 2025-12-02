import { useState } from 'react';
import { OrganizationHouse } from '../components/OrganizationHouse';
import { DonationModal } from '../components/DonationModal';
import { DonationDetail } from '../components/DonationDetail';
import { Campaign } from '../types';
import { useAuth } from '../lib/auth-context';

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
  const [lastDonation, setLastDonation] = useState<{ amount: number; txHash: string } | null>(null);

  const handleOpenDonationModal = () => {
    setShowDonationModal(true);
  };

  const handleDonationConfirm = (amount: number, txHash: string) => {
    setLastDonation({ amount, txHash });
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
          onClose={() => {
            setShowDonationDetail(false);
            setLastDonation(null);
          }}
        />
      )}
    </>
  );
}
