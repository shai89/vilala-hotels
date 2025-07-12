import { NextResponse } from 'next/server';
import { getCabinBySlug } from '@/lib/csvData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const cabin = await getCabinBySlug(resolvedParams.slug);

    if (!cabin) {
      return NextResponse.json({ error: 'Cabin not found' }, { status: 404 });
    }

    return NextResponse.json(cabin);
  } catch (error) {
    console.error('Error fetching cabin:', error);
    return NextResponse.json({ error: 'Failed to fetch cabin' }, { status: 500 });
  }
}