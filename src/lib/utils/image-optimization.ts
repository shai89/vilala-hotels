// Shared image optimization utility for both client and server
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  variant?: 'thumbnail' | 'card' | 'medium' | 'large' | 'hero';
  dpr?: number;
}

export const IMAGE_VARIANTS = {
  thumbnail: { w: 150, h: 150, c: 'fill' },
  card: { w: 400, h: 300, c: 'fill' },
  medium: { w: 800, h: 600, c: 'fill' },
  large: { w: 1200, h: 900, c: 'fill' },
  hero: { w: 1920, h: 1080, c: 'fill' },
} as const;

export function getOptimizedImageUrl(
  publicId: string,
  options: ImageOptimizationOptions = {},
  cloudName?: string
): string {
  const transformations = [];
  
  // Use predefined variant if specified
  if (options.variant && IMAGE_VARIANTS[options.variant]) {
    const variant = IMAGE_VARIANTS[options.variant];
    transformations.push(`w_${variant.w},h_${variant.h},c_${variant.c}`);
  } else if (options.width || options.height) {
    transformations.push(`w_${options.width || 'auto'},h_${options.height || 'auto'},c_fill`);
  }
  
  // Add quality optimization
  transformations.push(`q_${options.quality || 'auto:best'}`);
  
  // Add format optimization
  transformations.push(`f_${options.format || 'auto'}`);
  
  // Add DPR for responsive images
  if (options.dpr) {
    transformations.push(`dpr_${options.dpr}`);
  }
  
  const transformationString = transformations.length > 0 ? `/${transformations.join(',')}` : '';
  
  // Use the provided cloud name or fall back to environment variable
  const cloudinaryCloudName = cloudName || 
    (typeof window !== 'undefined' 
      ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
      : process.env.CLOUDINARY_CLOUD_NAME);
  
  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload${transformationString}/${publicId}`;
}