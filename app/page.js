import Greeting from '@/components/Greeting';
import { getGeneralWish } from '@/lib/generalWish';

export default function Page() {
  return <Greeting generalWish={getGeneralWish()} />;
}
