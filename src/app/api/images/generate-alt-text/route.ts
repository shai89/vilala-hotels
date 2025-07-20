import { NextRequest, NextResponse } from 'next/server';
import { generateAltText } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    const altText = await generateAltText(publicId);

    return NextResponse.json({ 
      success: true, 
      altText 
    });

  } catch (error) {
    console.error('Error generating alt text:', error);
    return NextResponse.json({ 
      error: 'Failed to generate alt text',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}