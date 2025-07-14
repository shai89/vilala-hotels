import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user first
  const adminUser = await prisma.user.create({
    data: {
      id: '686ae4e4f4151a2192a2e334',
      name: 'Shai Abraham',
      email: 'shaiabrh@gmail.com',
      role: 'admin',
      emailVerified: new Date()
    }
  })

  console.log('✅ Created admin user')

  // Create owners
  const owners = await prisma.owner.createMany({
    data: [
      {
        id: '686ae668691217d7a6e73164',
        businessName: 'צימרי גליל רוז',
        contactPhone: '050-1234567',
        contactEmail: 'info@galilrose.co.il',
        address: 'כפר ורדים, גליל עליון',
        city: 'כפר ורדים',
        region: 'גליל עליון',
        description: 'מתחם צימרים רומנטי בגליל עליון עם נוף מרהיב לכנרת',
        website: 'https://galilrose.co.il',
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        createdById: '686ae4e4f4151a2192a2e334',
        createdBy: 'shaiabrh@gmail.com',
        isSample: true
      },
      {
        id: '686ae668691217d7a6e73165',
        businessName: 'צימרי הכרמל הירוק',
        contactPhone: '054-7654321',
        contactEmail: 'contact@carmelgreen.co.il',
        address: 'זכרון יעקב, הכרמל',
        city: 'זכרון יעקב',
        region: 'הכרמל',
        description: 'צימרים יוקרתיים ביער הכרמל עם בריכה פרטית',
        website: 'https://carmelgreen.co.il',
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        createdById: '686ae4e4f4151a2192a2e334',
        createdBy: 'shaiabrh@gmail.com',
        isSample: true
      },
      {
        id: '686ae668691217d7a6e73166',
        businessName: 'נווה מדבר - צימרי יוקרה',
        contactPhone: '052-9876543',
        contactEmail: 'info@nevemidbar.co.il',
        address: 'מצפה רמון, מדבר יהודה',
        city: 'מצפה רמון',
        region: 'מדבר יהודה',
        description: 'צימרי בוטיק במדבר עם נוף מרהיב למכתש רמון',
        website: 'https://nevemidbar.co.il',
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        createdById: '686ae4e4f4151a2192a2e334',
        createdBy: 'shaiabrh@gmail.com',
        isSample: true
      }
    ]
  })

  console.log(`✅ Created ${owners.count} owners`)

  // Create cabins
  const cabins = await prisma.cabin.createMany({
    data: [
      {
        id: '686ae668691217d7a6e73168',
        name: 'וילה רומנטית עם נוף לכנרת',
        slug: 'villa-romantic-kinneret-view',
        description: 'צימר יוקרתי עם נוף מרהיב לכנרת, בריכה פרטית ועיצוב מדהים. מקום מושלם לזוגות המחפשים חוויה רומנטית ובלתי נשכחת בגליל העליון.',
        ownerId: '686ae668691217d7a6e73164',
        address: 'כפר ורדים 15, גליל עליון',
        city: 'כפר ורדים',
        region: 'גליל עליון',
        coordinates: { lat: 32.9742, lng: 35.5731 },
        amenities: JSON.stringify(['בריכה פרטית', 'ג\'קוזי', 'Wi-Fi', 'חניה', 'מטבח מלא', 'מרפסת']),
        images: JSON.stringify([
          { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'צימר עם נוף לכנרת', is_cover: true },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'בריכה פרטית', is_cover: false },
          { url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'חדר שינה', is_cover: false }
        ]),
        rules: 'אין עישון, אין חיות מחמד, שקט לילי אחרי 22:00',
        checkInTime: '16:00',
        checkOutTime: '11:00',
        status: 'active',
        priority: 0,
        seoTitle: 'וילה רומנטית עם נוף לכנרת | צימרי גליל רוז',
        seoDescription: 'צימר יוקרתי עם נוף מרהיב לכנרת, בריכה פרטית וג\'קוזי. הזמינו עכשיו לחופשה רומנטית בגליל העליון.',
        featured: true,
        rating: 4.8,
        maxGuests: 4,
        createdById: '686ae4e4f4151a2192a2e334',
        createdBy: 'shaiabrh@gmail.com',
        isSample: true
      },
      {
        id: '686ae668691217d7a6e73169',
        name: 'צימר יער הכרמל',
        slug: 'carmel-forest-cabin',
        description: 'צימר קסום בלב יער הכרמל, מוקף בטבע פראי ושקט מוחלט. כולל בריכה, סאונה וכל מה שצריך לחופשה מרגיעה.',
        ownerId: '686ae668691217d7a6e73165',
        address: 'זכרון יעקב, רחוב היער 8',
        city: 'זכרון יעקב',
        region: 'הכרמל',
        coordinates: { lat: 32.5698, lng: 34.954 },
        amenities: JSON.stringify(['בריכה', 'סאונה', 'Wi-Fi', 'חניה', 'מטבח', 'גריל']),
        images: JSON.stringify([
          { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'צימר ביער', is_cover: true },
          { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'נוף יער', is_cover: false }
        ]),
        rules: 'אין עישון, מותר עם חיות מחמד בתיאום מראש',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        status: 'active',
        priority: 1,
        seoTitle: 'צימר יער הכרמל - חופשה בטבע | צימרי הכרמל הירוק',
        seoDescription: 'צימר קסום בלב יער הכרמל עם בריכה וסאונה. חוויה מושלמת בטבע עם שקט וגינה.',
        featured: true,
        rating: 4.6,
        maxGuests: 6,
        createdById: '686ae4e4f4151a2192a2e334',
        createdBy: 'shaiabrh@gmail.com',
        isSample: true
      },
      {
        id: '686ae668691217d7a6e7316a',
        name: 'נווה מדבר - צימר יוקרה',
        slug: 'neve-midbar-luxury',
        description: 'צימר בוטיק במדבר עם נוף מרהיב למכתש רמון. עיצוב מדברי יוקרתי עם כל הפינוקים - ג\'קוזי, בריכה ומרפסת פנורמית.',
        ownerId: '686ae668691217d7a6e73166',
        address: 'מצפה רמון, רחוב המכתש 12',
        city: 'מצפה רמון',
        region: 'מדבר יהודה',
        coordinates: { lat: 30.6103, lng: 34.8013 },
        amenities: JSON.stringify(['נוף מכתש', 'ג\'קוזי', 'בריכה', 'Wi-Fi', 'מטבח', 'מרפסת פנורמית']),
        images: JSON.stringify([
          { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'צימר במדבר', is_cover: true },
          { url: 'https://images.unsplash.com/photo-1464822759844-d150baec0151?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'נוף מכתש', is_cover: false }
        ]),
        rules: 'אין עישון, אין חיות מחמד, מומלץ לילדים מעל 12',
        checkInTime: '16:00',
        checkOutTime: '11:00',
        status: 'active',
        priority: 1,
        seoTitle: 'נווה מדבר - צימר יוקרה עם נוף מכתש | מצפה רמון',
        seoDescription: 'צימר בוטיק במדבר עם נוף מרהיב למכתש רמון, ג\'קוזי ובריכה. חוויה מדברית יוקרתית ובלתי נשכחת.',
        featured: true,
        rating: 4.9,
        maxGuests: 2,
        createdById: '686ae4e4f4151a2192a2e334',
        createdBy: 'shaiabrh@gmail.com',
        isSample: true
      }
    ]
  })

  console.log(`✅ Created ${cabins.count} cabins`)

  // Create articles
  const articles = await prisma.article.createMany({
    data: [
      {
        id: '686bf97350ab587abe5ec0d6',
        title: 'הצימרים המומלצים ביותר בצפון לחופשה רומנטית',
        slug: 'top-cabins-north-romantic-getaway',
        content: '<p>הצפון הירוק של ישראל מציע אינספור אפשרויות לחופשה זוגית בלתי נשכחת. בין הרים ירוקים, נחלים זורמים ואווירה פסטורלית, מסתתרים צימרים יוקרתיים המיועדים במיוחד לזוגות.</p><h3>וילה בגליל: יוקרה וטבע</h3><p>וילה מפוארת עם בריכה פרטית מחוממת וג\'קוזי ספא חיצוני. המקום מציע ארוחות בוקר עשירות ועיצוב מודרני.</p>',
        excerpt: 'מחפשים את המקום המושלם לחופשה זוגית? גלו את הצימרים הכי רומנטיים ויוקרתיים בצפון הארץ.',
        featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=60',
        published: true,
        publishedAt: new Date('2024-05-20T10:00:00Z'),
        tags: JSON.stringify(['חופשה רומנטית', 'צימרים יוקרתיים', 'צפון']),
        authorId: '686ae4e4f4151a2192a2e334'
      },
      {
        id: '686bf97350ab587abe5ec0d7',
        title: 'חופשה משפחתית מושלמת: צימרים מומלצים עם אטרקציות לילדים',
        slug: 'family-friendly-cabins-with-attractions',
        content: '<p>תכנון חופשה משפחתית יכול להיות אתגר. צריך למצוא מקום שיתאים גם למבוגרים וגם לילדים.</p><ul><li>מתחמי צימרים עם בריכות גדולות</li><li>קרבה למסלולי טיול</li><li>פינות חי וחוות</li></ul>',
        excerpt: 'מתכננים חופשה עם הילדים? קבלו רשימה של צימרים ידידותיים למשפחות עם בריכות ופינות משחקים.',
        featuredImage: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=60',
        published: true,
        publishedAt: new Date('2024-05-15T12:00:00Z'),
        tags: JSON.stringify(['חופשה משפחתית', 'אטרקציות לילדים', 'צימרים למשפחות']),
        authorId: '686ae4e4f4151a2192a2e334'
      },
      {
        id: '686bf97350ab587abe5ec0d8',
        title: 'הסודות של הדרום: צימרים קסומים במדבר',
        slug: 'magical-desert-cabins-south',
        content: '<p>הדרום המדברי של ישראל הוא לא רק נופים צהובים. הוא מציע שקט, שלווה וחוויה רוחנית שאין שני לה.</p><h3>אירוח אקולוגי בערבה</h3><p>בקתות בוץ שנבנו בשיטות בנייה ירוקות.</p>',
        excerpt: 'גלו את הקסם הנסתר של המדבר. צימרים מבודדים, נופים עוצרי נשימה ושקט אינסופי.',
        featuredImage: 'https://images.unsplash.com/photo-1616628188540-925618239969?auto=format&fit=crop&w=800&q=60',
        published: true,
        publishedAt: new Date('2024-05-10T09:00:00Z'),
        tags: JSON.stringify(['מדבר', 'חופשה בדרום', 'שקט ושלווה']),
        authorId: '686ae4e4f4151a2192a2e334'
      }
    ]
  })

  console.log(`✅ Created ${articles.count} articles`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })