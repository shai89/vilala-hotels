import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary, generateAltText } from '@/lib/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, image });

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { altText, title, description, isCover, sortOrder } = body;

    // Check if image exists
    const existingImage = await prisma.image.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // If setting as cover image, unset other cover images for this entity
    if (isCover && !existingImage.isCover) {
      await prisma.image.updateMany({
        where: {
          entityType: existingImage.entityType,
          entityId: existingImage.entityId,
          isCover: true,
        },
        data: {
          isCover: false,
        },
      });
    }

    // Update image
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        altText: altText !== undefined ? altText : existingImage.altText,
        title: title !== undefined ? title : existingImage.title,
        description: description !== undefined ? description : existingImage.description,
        isCover: isCover !== undefined ? isCover : existingImage.isCover,
        sortOrder: sortOrder !== undefined ? sortOrder : existingImage.sortOrder,
      },
    });

    return NextResponse.json({ success: true, image: updatedImage });

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ 
      error: 'Failed to update image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get image data before deletion
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(image.publicId);
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}