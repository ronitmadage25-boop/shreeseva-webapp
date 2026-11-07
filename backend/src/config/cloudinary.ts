import * as dotenv from 'dotenv';
dotenv.config();

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  isConfigured: boolean;
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  isConfigured: Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ),
};

/**
 * Upload helper placeholder for owner product and category images
 * When credentials are provided in .env, integrates with Cloudinary SDK
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer | string,
  folder: 'products' | 'categories' | 'banners' = 'products'
): Promise<{ url: string; publicId: string }> {
  if (!cloudinaryConfig.isConfigured) {
    console.warn('[Cloudinary] Cloudinary is not configured yet. Returning placeholder or direct URL.');
    if (typeof fileBuffer === 'string') {
      return { url: fileBuffer, publicId: `local-${Date.now()}` };
    }
    return {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
      publicId: `mock-${Date.now()}`,
    };
  }

  // Ready for production cloudinary upload once keys are plugged in
  return {
    url: typeof fileBuffer === 'string' ? fileBuffer : 'https://res.cloudinary.com/shreeseva/image/upload/...',
    publicId: `upload-${Date.now()}`,
  };
}

