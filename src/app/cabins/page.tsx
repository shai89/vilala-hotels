import { getCabins } from '@/lib/actions/cabins';
import { CabinsClient } from './cabins-client';

export const metadata = {
  title: 'כל הצימרים | Vilala - צימרים מדהימים בכל רחבי הארץ',
  description: 'עיין בכל הצימרים שלנו. מצא את הצימר המושלם עבורך - רומנטי, משפחתי, יוקרתי. חפש לפי מיקום, מחיר ומתקנים.',
  keywords: 'צימרים, נופש, הזמנה, רומנטי, משפחתי, גליל, כרמל, דרום, מדבר יהודה, מחיר, מתקנים',
};

interface CabinsPageProps {
  searchParams: Promise<{
    location?: string;
    guests?: string;
    checkin?: string;
    checkout?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
    region?: string;
    type?: string;
  }>;
}

export default async function CabinsPage({ searchParams }: CabinsPageProps) {
  const allCabins = await getCabins();
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <CabinsClient 
        initialCabins={allCabins}
        initialSearchParams={resolvedSearchParams}
      />
    </div>
  );
}