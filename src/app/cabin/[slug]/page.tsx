import { getCabins } from '@/lib/actions/cabins';
import { notFound } from 'next/navigation';
import { CabinDetailClient } from './cabin-detail-client';

interface CabinPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CabinPageProps) {
  const resolvedParams = await params;
  const cabins = await getCabins();
  const cabin = cabins.find(c => c.slug === resolvedParams.slug);
  
  if (!cabin) {
    return {
      title: 'צימר לא נמצא | Vilala',
      description: 'הצימר שחיפשת לא נמצא במערכת שלנו',
    };
  }

  const coverImage = cabin.images.find(img => img.is_cover) || cabin.images[0];

  return {
    title: `${cabin.name} | Vilala - צימרים מדהימים`,
    description: cabin.description || `${cabin.name} ב${cabin.city}, ${cabin.region}. הזמן עכשיו!`,
    keywords: `${cabin.name}, צימר, ${cabin.city}, ${cabin.region}, נופש, הזמנה`,
    openGraph: {
      title: `${cabin.name} | Vilala`,
      description: cabin.description || `${cabin.name} ב${cabin.city}, ${cabin.region}`,
      images: coverImage ? [{
        url: coverImage.url,
        width: coverImage.width,
        height: coverImage.height,
        alt: coverImage.alt || cabin.name,
      }] : [],
      type: 'website',
      locale: 'he_IL'
    }
  };
}

export default async function CabinDetailPage({ params }: CabinPageProps) {
  const resolvedParams = await params;
  const cabins = await getCabins();
  const cabin = cabins.find(c => c.slug === resolvedParams.slug);
  
  if (!cabin) {
    notFound();
  }

  return <CabinDetailClient cabin={cabin} />;
}