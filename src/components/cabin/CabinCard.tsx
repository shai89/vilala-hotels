import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, getCoverImage } from '@/lib/utils';

import { ImageObject } from '@/types';

interface CabinCardProps {
  cabin: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    city: string | null;
    region: string | null;
    images: ImageObject[];
    featured: boolean;
    rooms: {
      pricePerNight: number;
    }[];
    reviews: {
      rating: number;
    }[];
    _count: {
      reviews: number;
    };
  };
}

export function CabinCard({ cabin }: CabinCardProps) {
  const coverImageObj = cabin.images.find(img => img.is_cover) || cabin.images[0];
  const coverImage = getCoverImage(cabin.images);
  const minPrice = Math.min(...cabin.rooms.map(room => room.pricePerNight));
  const averageRating = cabin.reviews.length > 0 
    ? cabin.reviews.reduce((sum, review) => sum + review.rating, 0) / cabin.reviews.length
    : 0;

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <figure className="relative h-48 overflow-hidden rounded-t-lg">
        {cabin.featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="badge badge-secondary">מומלץ</div>
          </div>
        )}
        <Image
          src={coverImage}
          alt={coverImageObj?.alt || cabin.name}
          title={coverImageObj?.title || cabin.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </figure>
      
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-base-content line-clamp-1">
              {cabin.name}
            </h3>
            <p className="text-sm text-base-content/70">
              {cabin.city && cabin.region ? `${cabin.city}, ${cabin.region}` : cabin.region}
            </p>
          </div>
          
          {averageRating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <div className="rating rating-sm">
                <span className="text-yellow-400">★</span>
              </div>
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-base-content/70">({cabin._count.reviews})</span>
            </div>
          )}
        </div>
        
        {cabin.description && (
          <p className="text-sm text-base-content/80 mb-3 line-clamp-2">
            {cabin.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatPrice(minPrice)}
            </div>
            <div className="text-xs text-base-content/70">לילה</div>
          </div>
          
          <Link href={`/cabins/${cabin.slug}`}>
            <Button size="sm" variant="primary">
              פרטים
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}