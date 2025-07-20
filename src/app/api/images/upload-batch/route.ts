import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  uploadToCloudinary, 
  validateImage, 
  generateAltText,
  DEFAULT_QUALITY_RULES,
  type ImageQualityRules 
} from '@/lib/cloudinary';

interface UploadResult {
  success: boolean;
  image?: any;
  error?: string;
  filename?: string;
  validation?: {
    warnings: string[];
    suggestions: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const entityType = formData.get('entityType') as string;
    const entityId = formData.get('entityId') as string;
    const customRules = formData.get('qualityRules') as string;

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Entity type and ID are required' }, { status: 400 });
    }

    if (!['cabin', 'room'].includes(entityType)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    // Parse custom quality rules if provided
    const qualityRules: ImageQualityRules = customRules 
      ? { ...DEFAULT_QUALITY_RULES, ...JSON.parse(customRules) }
      : DEFAULT_QUALITY_RULES;

    // Get all files from form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Get the starting sort order
    const lastImage = await prisma.image.findFirst({
      where: { entityType, entityId },
      orderBy: { sortOrder: 'desc' },
    });
    let sortOrder = (lastImage?.sortOrder || 0) + 1;

    const results: UploadResult[] = [];

    // Process each file
    for (const file of files) {
      try {
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

        // Validate image before upload
        const validation = validateImage(buffer, metadata, qualityRules);
        
        if (!validation.isValid && qualityRules.autoReject) {
          results.push({
            success: false,
            error: 'Image quality validation failed',
            filename: file.name,
            validation: {
              warnings: validation.warnings,
              suggestions: validation.suggestedImprovements,
            },
          });
          continue;
        }

        // Convert buffer to base64 for Cloudinary
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary with quality enhancements
        const cloudinaryResult = await uploadToCloudinary(base64, {
          entityType: entityType as 'cabin' | 'room',
          qualityRules,
          folder: `vilala-${entityType}s`,
        });

        // Generate alt text
        const altText = await generateAltText(cloudinaryResult.public_id);

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
            altText,
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            description: null,
            isCover: false, // Batch uploads don't set cover images
            sortOrder,
            entityType,
            entityId,
            qualityScore: cloudinaryResult.quality_score || null,
            isProcessed: true,
            processingStatus: 'completed',
            createdBy: 'system', // TODO: Get from auth session
          },
        });

        results.push({
          success: true,
          image: savedImage,
          filename: file.name,
          validation: {
            warnings: validation.warnings,
            suggestions: validation.suggestedImprovements,
          },
        });

        sortOrder++;

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          filename: file.name,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      results,
      summary: {
        total: files.length,
        successful: successCount,
        failed: errorCount,
      },
    });

  } catch (error) {
    console.error('Batch upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to process batch upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}