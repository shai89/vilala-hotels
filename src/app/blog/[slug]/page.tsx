import { getArticleBySlug } from '@/lib/actions/blog';
import { notFound } from 'next/navigation';
import { ArticleDetailClient } from './article-detail-client';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);
  
  if (!article || !article.published) {
    return {
      title: 'מאמר לא נמצא | Vilala Blog',
      description: 'המאמר שחיפשת לא נמצא במערכת שלנו',
    };
  }

  return {
    title: `${article.title} | Vilala Blog`,
    description: article.excerpt || article.title,
    keywords: article.tags.join(', '),
    openGraph: {
      title: `${article.title} | Vilala Blog`,
      description: article.excerpt || article.title,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: 'article',
      locale: 'he_IL',
      publishedTime: article.publishedAt || article.createdAt,
      authors: article.author?.name ? [article.author.name] : undefined,
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article || !article.published) {
    notFound();
  }

  return <ArticleDetailClient article={article} />;
}