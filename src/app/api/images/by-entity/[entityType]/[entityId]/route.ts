import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  try {
    const { entityType, entityId } = await params;

    if (!['cabin', 'room'].includes(entityType)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    const images = await prisma.image.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: [
        { isCover: 'desc' }, // Cover images first
        { sortOrder: 'asc' },
      ],
    });

    return NextResponse.json({ success: true, images });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}