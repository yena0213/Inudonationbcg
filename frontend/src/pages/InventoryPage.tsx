import { Inventory } from '../components/Inventory';
import { useAuth } from '../lib/auth-context';

interface InventoryPageProps {
  onBack: () => void;
}

export function InventoryPage({ onBack }: InventoryPageProps) {
  const { user } = useAuth();
  return <Inventory user={user} onBack={onBack} />;
}
