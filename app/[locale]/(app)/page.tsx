import { Button } from '@/components/ui/button';
import {useTranslations} from 'next-intl';


export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1>{t('title')}</h1>
      <Button variant="default">Deneme</Button>
    </div>
  );
}
{/* <div className="min-h-screen flex items-center justify-center">
      <h1>{t('title')}</h1>
      <Button variant="default">Deneme</Button>
    </div> */}