import { Hero } from '@/components/ui/Hero';
import { FeaturedCabins } from '@/components/cabin/FeaturedCabins';
import { RegionHighlights } from '@/components/ui/RegionHighlights';
import { Testimonials } from '@/components/ui/Testimonials';
import { getCabins } from '@/lib/actions/cabins';

export const metadata = {
  title: 'Vilala - צימרים מדהימים בכל רחבי הארץ',
  description: 'גלה את הצימרים הכי יפים בישראל. צימרים רומנטיים, צימרים משפחתיים ונופש מושלם בכל איזור. הזמן עכשיו!',
  keywords: 'צימרים, נופש, רומנטי, משפחתי, גליל, כרמל, דרום, מדבר יהודה',
  openGraph: {
    title: 'Vilala - צימרים מדהימים בכל רחבי הארץ',
    description: 'גלה את הצימרים הכי יפים בישראל. הזמן עכשיו!',
    type: 'website',
    locale: 'he_IL'
  }
};

async function getFeaturedCabins() {
  try {
    const cabins = await getCabins();
    return cabins.filter(cabin => cabin.featured).slice(0, 6);
  } catch (error) {
    console.error('Error fetching featured cabins:', error);
    return [];
  }
}

export default async function Home() {
  const featuredCabins = await getFeaturedCabins();

  return (
    <div>
      <Hero />
      <FeaturedCabins cabins={featuredCabins} />
      <RegionHighlights />
      <Testimonials />
    </div>
  );
}