import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resource_type: string;
  created_at: string;
  etag: string;
  version: number;
  version_id: string;
  signature: string;
  quality_score?: number;
}

export interface ImageQualityRules {
  minWidth: number;
  minHeight: number;
  maxFileSize: number; // in bytes
  allowedFormats: string[];
  minQualityScore: number;
  autoReject: boolean;
  autoEnhance: boolean;
}

export const DEFAULT_QUALITY_RULES: ImageQualityRules = {
  minWidth: 800,
  minHeight: 600,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  minQualityScore: 0.7,
  autoReject: false,
  autoEnhance: true,
};

export interface ImageVariants {
  thumbnail: { w: number; h: number; c: string };
  card: { w: number; h: number; c: string };
  medium: { w: number; h: number; c: string };
  large: { w: number; h: number; c: string };
  hero: { w: number; h: number; c: string };
}

export const IMAGE_VARIANTS: ImageVariants = {
  thumbnail: { w: 150, h: 150, c: 'fill' },
  card: { w: 400, h: 300, c: 'fill' },
  medium: { w: 800, h: 600, c: 'fill' },
  large: { w: 1200, h: 900, c: 'fill' },
  hero: { w: 1920, h: 1080, c: 'fill' },
};

export async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
    entityType?: 'cabin' | 'room';
    qualityRules?: ImageQualityRules;
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    const rules = options.qualityRules || DEFAULT_QUALITY_RULES;
    
    // Base transformations for quality and optimization
    const baseTransformations = [
      { quality: 'auto:best' },
      { fetch_format: 'auto' },
      { dpr: 'auto' },
    ];

    // Add auto-enhancement if enabled
    if (rules.autoEnhance) {
      baseTransformations.push(
        { effect: 'auto_contrast' },
        { effect: 'auto_color' },
        { effect: 'sharpen:50' }
      );
    }

    // Combine with custom transformations
    const finalTransformations = options.transformation 
      ? [...baseTransformations, ...options.transformation]
      : baseTransformations;

    const result = await cloudinary.uploader.upload(file as string, {
      folder: options.folder || `vilala-${options.entityType || 'images'}`,
      public_id: options.public_id,
      transformation: finalTransformations,
      resource_type: 'auto',
      quality_analysis: true,
      accessibility_analysis: true,
      colors: true,
      phash: true,
      responsive_breakpoints: [
        {
          create_derived: true,
          bytes_step: 20000,
          min_width: 200,
          max_width: 1920,
          transformation: { quality: 'auto:best' }
        }
      ]
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      resource_type: result.resource_type,
      created_at: result.created_at,
      etag: result.etag,
      version: result.version,
      version_id: result.version_id,
      signature: result.signature,
      quality_score: result.quality_score,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

// Re-export the shared utility
export { getOptimizedImageUrl } from '@/lib/utils/image-optimization';

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestedImprovements: string[];
}

export function validateImage(
  file: File | Buffer,
  metadata: { width: number; height: number; format: string; size: number },
  rules: ImageQualityRules = DEFAULT_QUALITY_RULES
): ImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestedImprovements: string[] = [];

  // Check file size
  if (metadata.size > rules.maxFileSize) {
    errors.push(`File size (${Math.round(metadata.size / 1024 / 1024)}MB) exceeds maximum (${Math.round(rules.maxFileSize / 1024 / 1024)}MB)`);
  }

  // Check format
  if (!rules.allowedFormats.includes(metadata.format.toLowerCase())) {
    errors.push(`Format ${metadata.format} is not allowed. Allowed formats: ${rules.allowedFormats.join(', ')}`);
  }

  // Check dimensions
  if (metadata.width < rules.minWidth) {
    errors.push(`Image width (${metadata.width}px) is below minimum (${rules.minWidth}px)`);
  }
  if (metadata.height < rules.minHeight) {
    errors.push(`Image height (${metadata.height}px) is below minimum (${rules.minHeight}px)`);
  }

  // Check aspect ratio
  const aspectRatio = metadata.width / metadata.height;
  if (aspectRatio < 1.2) {
    warnings.push('Image is quite tall - consider using a more landscape-oriented image');
  }
  if (aspectRatio > 2.0) {
    warnings.push('Image is very wide - consider using a more balanced aspect ratio');
  }

  // Suggest improvements
  if (metadata.format.toLowerCase() === 'png' && metadata.size > 1024 * 1024) {
    suggestedImprovements.push('Consider using JPEG format for better compression');
  }
  
  if (metadata.width > 1920 || metadata.height > 1080) {
    suggestedImprovements.push('Consider resizing to maximum 1920x1080 for better performance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestedImprovements,
  };
}

export async function generateAltText(publicId: string): Promise<string> {
  try {
    // Use Cloudinary's AI to generate alt text
    const result = await cloudinary.api.resource(publicId, {
      colors: true,
      accessibility_analysis: true,
      quality_analysis: true,
    });

    // Basic alt text generation based on analysis
    let altText = '';
    
    if (result.accessibility_analysis?.colorblind_accessibility_analysis) {
      altText += 'Property image showing ';
    }
    
    if (result.colors && result.colors.length > 0) {
      const dominantColor = result.colors[0][0];
      altText += `${dominantColor} tones, `;
    }
    
    altText += 'vacation rental accommodation';
    
    return altText;
  } catch (error) {
    console.error('Error generating alt text:', error);
    return 'Property image';
  }
}

export function generateResponsiveImageSrcSet(publicId: string, sizes: number[]): string {
  const srcSet = sizes.map(size => {
    const url = getOptimizedImageUrl(publicId, { width: size, quality: 'auto:best' });
    return `${url} ${size}w`;
  }).join(', ');
  
  return srcSet;
}

export function generateImageSEOData(image: {
  publicId: string;
  altText?: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
}) {
  const imageUrl = getOptimizedImageUrl(image.publicId, { 
    width: image.width, 
    height: image.height 
  });
  
  return {
    '@type': 'ImageObject',
    contentUrl: imageUrl,
    url: imageUrl,
    width: image.width,
    height: image.height,
    name: image.title || image.altText || 'Property image',
    description: image.description || image.altText || 'Vacation rental property image',
    encodingFormat: 'image/jpeg',
  };
}

export default cloudinary;