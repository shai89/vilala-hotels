import { getArticles } from '@/lib/actions/blog'
import { BlogClient } from './blog-client'

export const metadata = {
  title: 'מאמרים וטיפים לנופש | Vilala Blog',
  description: 'מאמרים מעניינים על צימרים, טיפים לחופשה, מקומות מומלצים ועוד. הבלוג של Vilala עם כל מה שאתם צריכים לדעת על נופש בארץ.',
  keywords: 'בלוג, מאמרים, טיפים, נופש, צימרים, חופשה, מקומות מומלצים, ישראל',
  openGraph: {
    title: 'מאמרים וטיפים לנופש | Vilala Blog',
    description: 'מאמרים מעניינים על צימרים, טיפים לחופשה, מקומות מומלצים ועוד',
    type: 'website',
    locale: 'he_IL'
  }
}

export default async function BlogPage() {
  const articles = await getArticles()
  
  // Filter only published articles for public view
  const publishedArticles = articles.filter(article => article.published)

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogClient articles={publishedArticles} />
    </div>
  )
}