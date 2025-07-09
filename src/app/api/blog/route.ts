import { NextResponse } from 'next/server';
import { getBlogPostsFromCSV } from '@/lib/csvData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let posts = await getBlogPostsFromCSV();

    // Filter by category
    if (category && category !== 'הכל') {
      posts = posts.filter(post => post.category === category);
    }

    // Filter by search term
    if (search) {
      posts = posts.filter(post => 
        post.title.includes(search) ||
        post.excerpt?.includes(search) ||
        post.tags.some((tag: string) => tag.includes(search))
      );
    }

    // Sort by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}