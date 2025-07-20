import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  uploadToCloudinary, 
  validateImage, 
  generateAltText,
  DEFAULT_QUALITY_RULES,
  type ImageQualityRules 
} from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityType = formData.get('entityType') as string;
    const entityId = formData.get('entityId') as string;
    const altText = formData.get('altText') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isCover = formData.get('isCover') === 'true';
    const customRules = formData.get('qualityRules') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Entity type and ID are required' }, { status: 400 });
    }

    if (!['cabin', 'room'].includes(entityType)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get image metadata
    const metadata = {
      width: 0, // Will be filled by Cloudinary
      height: 0, // Will be filled by Cloudinary
      format: file.type.split('/')[1] || 'unknown',
      size: buffer.length,
    };

    // Parse custom quality rules if provided
    const qualityRules: ImageQualityRules = customRules 
      ? { ...DEFAULT_QUALITY_RULES, ...JSON.parse(customRules) }
      : DEFAULT_QUALITY_RULES;

    // Validate image before upload
    const validation = validateImage(buffer, metadata, qualityRules);
    
    if (!validation.isValid && qualityRules.autoReject) {
      return NextResponse.json({ 
        error: 'Image quality validation failed',
        details: validation.errors,
        warnings: validation.warnings,
        suggestions: validation.suggestedImprovements
      }, { status: 400 });
    }

    // Convert buffer to base64 for Cloudinary
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary with quality enhancements
    const cloudinaryResult = await uploadToCloudinary(base64, {
      entityType: entityType as 'cabin' | 'room',
      qualityRules,
      folder: `vilala-${entityType}s`,
    });

    // Generate alt text if not provided
    const finalAltText = altText || await generateAltText(cloudinaryResult.public_id);

    // If this is a cover image, unset other cover images for this entity
    if (isCover) {
      await prisma.image.updateMany({
        where: {
          entityType,
          entityId,
          isCover: true,
        },
        data: {
          isCover: false,
        },
      });
    }

    // Get the next sort order
    const lastImage = await prisma.image.findFirst({
      where: { entityType, entityId },
      orderBy: { sortOrder: 'desc' },
    });
    const sortOrder = (lastImage?.sortOrder || 0) + 1;

    // Save to database
    const savedImage = await prisma.image.create({
      data: {
        publicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        originalUrl: cloudinaryResult.secure_url,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
        size: cloudinaryResult.bytes,
        altText: finalAltText,
        title: title || null,
        description: description || null,
        isCover,
        sortOrder,
        entityType,
        entityId,
        qualityScore: cloudinaryResult.quality_score || null,
        isProcessed: true,
        processingStatus: 'completed',
        createdBy: 'system', // TODO: Get from auth session
      },
    });

    return NextResponse.json({
      success: true,
      image: savedImage,
      validation: {
        warnings: validation.warnings,
        suggestions: validation.suggestedImprovements,
      },
      cloudinaryData: {
        publicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        qualityScore: cloudinaryResult.quality_score,
      },
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}