import { VillageMain } from '../components/VillageMain';
import { Campaign } from '../types';

interface VillagePageProps {
  campaigns: Campaign[];
  onOrganizationClick: (campaign: Campaign) => void;
  onMyHouseClick: () => void;
  onInventoryClick: () => void;
  onAdminClick?: () => void;
  isOrganization?: boolean;
}

export function VillagePage({
  campaigns,
  onOrganizationClick,
  onMyHouseClick,
  onInventoryClick,
  onAdminClick,
  isOrganization,
}: VillagePageProps) {
  return (
    <VillageMain
      campaigns={campaigns}
      onOrganizationClick={onOrganizationClick}
      onMyHouseClick={onMyHouseClick}
      onInventoryClick={onInventoryClick}
      onAdminClick={onAdminClick}
      isOrganization={isOrganization}
    />
  );
}
