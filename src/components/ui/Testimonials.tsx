import { Card, CardBody } from './Card';

const testimonials = [
  {
    id: 1,
    name: 'דני לוי',
    location: 'תל אביב',
    rating: 5,
    text: 'חוויה מדהימה! הצימר היה מושלם והשירות מצוין. בהחלט נחזור שוב.',
    avatar: 'https://i.pravatar.cc/100?img=1'
  },
  {
    id: 2,
    name: 'רוני כהן',
    location: 'חיפה',
    rating: 5,
    text: 'המקום הכי יפה שהיינו בו! האווירה רומנטית והנוף עוצר נשימה.',
    avatar: 'https://i.pravatar.cc/100?img=2'
  },
  {
    id: 3,
    name: 'מירי אברהם',
    location: 'ירושלים',
    rating: 5,
    text: 'שירות מעולה וצימר מתוחזק בצורה מושלמת. מומלץ בחום!',
    avatar: 'https://i.pravatar.cc/100?img=3'
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            מה אומרים עלינו
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            אלפי אורחים מרוצים חוו חופשות בלתי נשכחות באמצעות הפלטפורמה שלנו
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="text-center">
              <CardBody className="p-6">
                <div className="avatar mb-4">
                  <div className="w-16 h-16 rounded-full mx-auto">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="rounded-full"
                    />
                  </div>
                </div>
                
                <div className="rating rating-sm mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i}
                      className={`text-yellow-400 ${i < testimonial.rating ? 'opacity-100' : 'opacity-30'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                <p className="text-base-content/80 mb-4 italic">
                  &quot;{testimonial.text}&quot;
                </p>
                
                <div>
                  <div className="font-semibold text-base-content">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-base-content/70">
                    {testimonial.location}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}