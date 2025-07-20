import Image from 'next/image';
import Link from 'next/link';

interface FeaturedCabinsProps {
  cabins: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    city: string | null;
    region: string | null;
    images: {
      url: string;
      alt: string;
      is_cover: boolean;
    }[];
    featured: boolean;
    rating: number;
    rooms: {
      id: string;
      pricePerNight: number;
    }[];
  }[];
}

export function FeaturedCabins({ cabins }: FeaturedCabinsProps) {
  if (!cabins || cabins.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">מקומות מומלצים</h2>
          <p className="text-gray-600">עדיין לא הוספנו מקומות מומלצים. חזרו בקרוב!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            מקומות מומלצים
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            גלו את המקומות הפופולריים והמומלצים ביותר שלנו - מקומות מיוחדים שיעניקו לכם חוויה בלתי נשכחת
          </p>
        </div>
        
        {/* Featured Cabins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cabins.map((cabin, index) => {
            const coverImage = cabin.images.find(img => img.is_cover) || cabin.images[0];
            const minPrice = cabin.rooms.length > 0 
              ? Math.min(...cabin.rooms.map(room => room.pricePerNight))
              : 0;
            
            return (
              <Link key={cabin.id} href={`/cabin/${cabin.slug}`} className="block group cursor-pointer">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={coverImage?.url || '/placeholder-cabin.jpg'}
                      alt={cabin.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Rating */}
                    {cabin.rating > 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">
                            {cabin.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {index === 0 ? 'הכי מומלץ' : index === 1 ? 'יוקרתי' : 'פופולרי'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                      {cabin.name}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{cabin.city}, {cabin.region}</span>
                    </div>

                    {cabin.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {cabin.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          ₪{minPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          ללילה
                        </span>
                      </div>
                      <div className="text-purple-600 font-medium group-hover:text-purple-700">
                        הזמן עכשיו →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/cabins"
            className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            צפה בכל המקומות
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}