import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody } from './Card';

const regions = [
  {
    name: 'גליל עליון',
    description: 'נופים מרהיבים וטבע פראי',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: 12
  },
  {
    name: 'מדבר יהודה',
    description: 'שקט מדברי וחוויה ייחודית',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: 8
  },
  {
    name: 'הכרמל',
    description: 'יערות ירוקים ואוויר צח',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: 15
  },
  {
    name: 'רמת הגולן',
    description: 'פסטורליה הרים',
    image: 'https://images.unsplash.com/photo-1464822759844-d150baec0151?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: 6
  },
  {
    name: 'מרכז',
    description: 'קרוב לכל מקום',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: 9
  },
  {
    name: 'דרום',
    description: 'אקזוטיקה מדברית',
    image: 'https://images.unsplash.com/photo-1616628188540-925618239969?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: 7
  }
];

export function RegionHighlights() {
  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            אזורים
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            בחר את האזור הרצוי מבין האזורים הפופולריים שלנו וגלה מקומות מדהימים בכל רחבי הארץ
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <Link
              key={region.name}
              href={`/cabins?region=${encodeURIComponent(region.name)}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <figure className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{region.name}</h3>
                      <p className="text-sm opacity-90">{region.description}</p>
                    </div>
                  </div>
                </figure>
                <CardBody className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-content/70">
                      {region.count} מקומות זמינים
                    </span>
                    <div className="text-primary font-medium">
                      בדוק &larr;
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}