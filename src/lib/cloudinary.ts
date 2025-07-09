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
}

export async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder: options.folder || 'vilala-cabins',
      public_id: options.public_id,
      transformation: options.transformation,
      resource_type: 'auto',
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
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

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  const transformations = [];
  
  if (options.width || options.height) {
    transformations.push(`w_${options.width || 'auto'},h_${options.height || 'auto'},c_fill`);
  }
  
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  if (options.format) {
    transformations.push(`f_${options.format}`);
  }
  
  const transformationString = transformations.length > 0 ? `/${transformations.join(',')}` : '';
  
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload${transformationString}/${publicId}`;
}

export default cloudinary;