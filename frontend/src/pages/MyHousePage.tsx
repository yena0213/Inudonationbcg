import { MyHouse } from '../components/MyHouse';

interface MyHousePageProps {
  onBack: () => void;
}

export function MyHousePage({ onBack }: MyHousePageProps) {
  return <MyHouse onBack={onBack} />;
}
