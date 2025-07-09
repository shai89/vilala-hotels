import { getArticleById } from '@/lib/actions/blog';
import { EditArticleClient } from './edit-article-client';
import { notFound } from 'next/navigation';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const resolvedParams = await params;
  const article = await getArticleById(resolvedParams.id);
  
  if (!article) {
    notFound();
  }

  return <EditArticleClient article={article} />;
}