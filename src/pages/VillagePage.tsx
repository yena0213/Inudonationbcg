import { VillageMain } from '../components/VillageMain';
import { Campaign } from '../types';

interface VillagePageProps {
  campaigns: Campaign[];
  onOrganizationClick: (campaign: Campaign) => void;
  onMyHouseClick: () => void;
  onInventoryClick: () => void;
}

export function VillagePage({
  campaigns,
  onOrganizationClick,
  onMyHouseClick,
  onInventoryClick,
}: VillagePageProps) {
  return (
    <VillageMain
      campaigns={campaigns}
      onOrganizationClick={onOrganizationClick}
      onMyHouseClick={onMyHouseClick}
      onInventoryClick={onInventoryClick}
    />
  );
}
