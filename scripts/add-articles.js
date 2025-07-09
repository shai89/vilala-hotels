const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function addArticles() {
  try {
    // Create 2 additional articles with images
    const articles = await prisma.article.createMany({
      data: [
        {
          title: 'המדריך השלם לבחירת צימר מושלם לחופשה רומנטית',
          slug: 'guide-romantic-cabin-selection',
          content: '<h2>איך לבחור צימר רומנטי מושלם?</h2><p>בחירת צימר לחופשה רומנטית היא אמנות שדורשת תשומת לב לפרטים. בואו נעבור על הנקודות החשובות ביותר:</p><h3>1. מיקום אינטימי</h3><p>חפשו מיקום שקט ומבודד, רחוק מההמולה. הגליל העליון והכרמל מציעים נופים עוצרי נשימה ושקט מוחלט.</p><h3>2. מתקנים רומנטיים</h3><p>בריכה פרטית, ג\'קוזי, אח, ונוף יפה - אלה המרכיבים הכי חשובים לחופשה רומנטית בלתי נשכחת.</p><h3>3. פרטיות מלאה</h3><p>וודאו שהצימר מציע פרטיות מלאה - בריכה פרטית, חצר מגודרת, ואין שכנים קרובים.</p><p>זכרו, הפרטים הקטנים הם שיוצרים את החוויה הגדולה!</p>',
          excerpt: 'המדריך המקיף לבחירת צימר רומנטי מושלם - כל מה שצריך לדעת על מיקום, מתקנים ופרטיות',
          featuredImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
          published: true,
          publishedAt: new Date('2024-01-15'),
          tags: JSON.stringify(['רומנטי', 'זוגות', 'טיפים', 'מדריך']),
          authorId: 'user_admin'
        },
        {
          title: 'צימרים עם בריכות פרטיות - האופציות הטובות ביותר בצפון',
          slug: 'private-pool-cabins-north',
          content: '<h2>צימרים עם בריכות פרטיות בצפון</h2><p>בריכה פרטית היא חלום של כל מי שמחפש חופשה מושלמת. הנה המקומות הטובים ביותר בצפון:</p><h3>גליל עליון</h3><p>האזור המומלץ ביותר לצימרים עם בריכות פרטיות. כאן תמצאו שילוב מושלם של נוף הרים, אוויר צח, ובריכות מחוממות.</p><h3>כרמל</h3><p>היער הכרמל מציע חוויה ייחודת - בריכות פרטיות בתוך היער, עם ריחות של אורנים ושקט מוחלט.</p><h3>הגולן</h3><p>נופי הגולן המרהיבים משולבים עם בריכות פרטיות נוצרים חוויה בלתי נשכחת.</p><h3>טיפים לבחירת צימר עם בריכה</h3><ul><li>וודאו שהבריכה מחוממת בחורף</li><li>בדקו את גודל הבריכה - מינימום 3X6 מטר</li><li>שאלו על שעות פעילות הבריכה</li><li>בדקו אם יש תאורה לשימוש בערב</li></ul>',
          excerpt: 'סקירה מקיפה של הצימרים הטובים ביותר עם בריכות פרטיות בצפון הארץ, כולל טיפים לבחירה נכונה',
          featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
          published: true,
          publishedAt: new Date('2024-01-10'),
          tags: JSON.stringify(['בריכות', 'צפון', 'משפחות', 'יוקרה']),
          authorId: 'user_admin'
        }
      ]
    });

    console.log('✅ Added articles:', articles.count);

    // Check cabin data
    const cabins = await prisma.cabin.findMany({
      include: {
        rooms: true
      }
    });

    console.log('📊 Current cabins:', cabins.length);
    console.log('⭐ Featured cabins:', cabins.filter(c => c.featured).length);
    
    // Make sure we have some featured cabins
    if (cabins.filter(c => c.featured).length < 2) {
      await prisma.cabin.updateMany({
        where: {
          id: {
            in: cabins.slice(0, 3).map(c => c.id)
          }
        },
        data: {
          featured: true
        }
      });
      console.log('✅ Updated cabins to be featured');
    }

    // Show featured cabins
    const featuredCabins = await prisma.cabin.findMany({
      where: { featured: true },
      include: {
        rooms: true
      }
    });

    console.log('🏠 Featured cabins:');
    featuredCabins.forEach(cabin => {
      const images = JSON.parse(cabin.images || '[]');
      console.log(`- ${cabin.name} (${images.length} images, ${cabin.rooms.length} rooms)`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addArticles();