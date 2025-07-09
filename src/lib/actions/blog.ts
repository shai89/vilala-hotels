'use server'

import { prisma } from '@/lib/prisma'

export async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      published: article.published,
      publishedAt: article.publishedAt?.toISOString() || null,
      tags: typeof article.tags === 'string' 
        ? JSON.parse(article.tags) 
        : article.tags || [],
      author: article.author ? {
        id: article.author.id,
        name: article.author.name,
        email: article.author.email,
        image: article.author.image
      } : null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export async function getArticleById(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      }
    })

    if (!article) return null

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      published: article.published,
      publishedAt: article.publishedAt?.toISOString() || null,
      tags: typeof article.tags === 'string' 
        ? JSON.parse(article.tags) 
        : article.tags || [],
      author: article.author ? {
        id: article.author.id,
        name: article.author.name,
        email: article.author.email,
        image: article.author.image
      } : null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
      }
    })

    if (!article) return null

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      published: article.published,
      publishedAt: article.publishedAt?.toISOString() || null,
      tags: typeof article.tags === 'string' 
        ? JSON.parse(article.tags) 
        : article.tags || [],
      author: article.author ? {
        id: article.author.id,
        name: article.author.name,
        email: article.author.email,
        image: article.author.image
      } : null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error fetching article by slug:', error)
    return null
  }
}

export async function createArticle(data: any, authorId: string) {
  try {
    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
        tags: JSON.stringify(data.tags || []),
        authorId: authorId
      },
      include: {
        author: true,
      }
    })

    return {
      success: true,
      article: {
        id: newArticle.id,
        title: newArticle.title,
        slug: newArticle.slug,
        content: newArticle.content,
        excerpt: newArticle.excerpt,
        featuredImage: newArticle.featuredImage,
        published: newArticle.published,
        publishedAt: newArticle.publishedAt?.toISOString() || null,
        tags: typeof newArticle.tags === 'string' 
          ? JSON.parse(newArticle.tags) 
          : newArticle.tags || [],
        author: newArticle.author ? {
          id: newArticle.author.id,
          name: newArticle.author.name,
          email: newArticle.author.email,
          image: newArticle.author.image
        } : null,
        createdAt: newArticle.createdAt.toISOString(),
        updatedAt: newArticle.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Error creating article:', error)
    return { success: false, error: 'Failed to create article' }
  }
}

export async function updateArticle(id: string, data: any) {
  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        published: data.published,
        publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt,
        tags: JSON.stringify(data.tags || [])
      },
      include: {
        author: true,
      }
    })

    return {
      success: true,
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        slug: updatedArticle.slug,
        content: updatedArticle.content,
        excerpt: updatedArticle.excerpt,
        featuredImage: updatedArticle.featuredImage,
        published: updatedArticle.published,
        publishedAt: updatedArticle.publishedAt?.toISOString() || null,
        tags: typeof updatedArticle.tags === 'string' 
          ? JSON.parse(updatedArticle.tags) 
          : updatedArticle.tags || [],
        author: updatedArticle.author ? {
          id: updatedArticle.author.id,
          name: updatedArticle.author.name,
          email: updatedArticle.author.email,
          image: updatedArticle.author.image
        } : null,
        createdAt: updatedArticle.createdAt.toISOString(),
        updatedAt: updatedArticle.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Error updating article:', error)
    return { success: false, error: 'Failed to update article' }
  }
}

export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting article:', error)
    return { success: false, error: 'Failed to delete article' }
  }
}

export async function toggleArticlePublished(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id }
    })

    if (!article) {
      return { success: false, error: 'Article not found' }
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        published: !article.published,
        publishedAt: !article.published ? new Date() : article.publishedAt
      },
      include: {
        author: true,
      }
    })

    return {
      success: true,
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        slug: updatedArticle.slug,
        content: updatedArticle.content,
        excerpt: updatedArticle.excerpt,
        featuredImage: updatedArticle.featuredImage,
        published: updatedArticle.published,
        publishedAt: updatedArticle.publishedAt?.toISOString() || null,
        tags: typeof updatedArticle.tags === 'string' 
          ? JSON.parse(updatedArticle.tags) 
          : updatedArticle.tags || [],
        author: updatedArticle.author ? {
          id: updatedArticle.author.id,
          name: updatedArticle.author.name,
          email: updatedArticle.author.email,
          image: updatedArticle.author.image
        } : null,
        createdAt: updatedArticle.createdAt.toISOString(),
        updatedAt: updatedArticle.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Error toggling article published status:', error)
    return { success: false, error: 'Failed to toggle published status' }
  }
}