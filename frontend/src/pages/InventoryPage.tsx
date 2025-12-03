import { Inventory } from '../components/Inventory';

interface InventoryPageProps {
  onBack: () => void;
}

export function InventoryPage({ onBack }: InventoryPageProps) {
  return <Inventory onBack={onBack} />;
}
