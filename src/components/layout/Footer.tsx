import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* צימרים לפי אזור */}
          <div>
            <h3 className="font-semibold text-lg mb-4">צימרים לפי אזור</h3>
            <div className="space-y-2">
              <Link href="/cabins?region=גליל עליון" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים בגליל העליון
              </Link>
              <Link href="/cabins?region=גליל תחתון" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים בגליל התחתון
              </Link>
              <Link href="/cabins?region=הכרמל" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים בכרמל
              </Link>
              <Link href="/cabins?region=מרכז" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים במרכז
              </Link>
              <Link href="/cabins?region=דרום" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים בדרום
              </Link>
              <Link href="/cabins?region=הגולן" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים ברמת הגולן
              </Link>
            </div>
          </div>

          {/* צימרים לפי מתקנים */}
          <div>
            <h3 className="font-semibold text-lg mb-4">צימרים לפי מתקנים</h3>
            <div className="space-y-2">
              <Link href="/cabins?amenities=בריכה פרטית" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים עם בריכה פרטית
              </Link>
              <Link href="/cabins?amenities=ג'קוזי" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים עם ג'קוזי
              </Link>
              <Link href="/cabins?amenities=סאונה" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים עם סאונה
              </Link>
              <Link href="/cabins?amenities=מרפסת" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים עם מרפסת
              </Link>
              <Link href="/cabins?amenities=מטבח מלא" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים עם מטבח מלא
              </Link>
              <Link href="/cabins?amenities=חניה" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים עם חניה
              </Link>
            </div>
          </div>

          {/* צימרים לפי סוג */}
          <div>
            <h3 className="font-semibold text-lg mb-4">צימרים לפי סוג</h3>
            <div className="space-y-2">
              <Link href="/cabins?guests=2" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים רומנטיים לזוגות
              </Link>
              <Link href="/cabins?guests=4" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים משפחתיים
              </Link>
              <Link href="/cabins?guests=6" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים לקבוצות
              </Link>
              <Link href="/cabins?minPrice=1000" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים יוקרתיים
              </Link>
              <Link href="/cabins?maxPrice=500" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צימרים חסכוניים
              </Link>
              <Link href="/cabins" className="block text-gray-300 hover:text-white text-sm transition-colors">
                כל הצימרים
              </Link>
            </div>
          </div>

          {/* מידע ויצירת קשר */}
          <div>
            <h3 className="font-semibold text-lg mb-4">מידע ויצירת קשר</h3>
            <div className="space-y-2">
              <Link href="/blog" className="block text-gray-300 hover:text-white text-sm transition-colors">
                בלוג וטיפים
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white text-sm transition-colors">
                צור קשר
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white text-sm transition-colors">
                אודות
              </Link>
              <Link href="/privacy" className="block text-gray-300 hover:text-white text-sm transition-colors">
                מדיניות פרטיות
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white text-sm transition-colors">
                תנאי שירות
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold text-white mb-2">Vilala</div>
              <p className="text-sm text-gray-400">
                המקום הטוב ביותר למצוא צימרים בישראל
              </p>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Vilala. כל הזכויות שמורות
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}