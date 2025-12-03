import { MyHouse } from '../components/MyHouse';
import { useAuth } from '../lib/auth-context';

interface MyHousePageProps {
  onBack: () => void;
}

export function MyHousePage({ onBack }: MyHousePageProps) {
  const { user } = useAuth();
  return <MyHouse user={user} onBack={onBack} />;
}
