import { storage } from '../config/firebase';
import { randomBytes } from 'crypto';

// Simple UUID-like generator
function generateId(): string {
  return randomBytes(16).toString('hex');
}

export const uploadImages = async (
  files: Express.Multer.File[],
  userId: string,
  folder: string = 'profiles'
): Promise<string[]> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }

    const bucket = storage.bucket();
    const uploadPromises = files.map(async (file) => {
      const timestamp = Date.now();
      const filename = `${userId}/${folder}/${timestamp}_${generateId()}_${file.originalname}`;
      const fileRef = bucket.file(filename);

      // Upload file
      await fileRef.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
            metadata: {
              firebaseStorageDownloadTokens: generateId(),
            },
          },
      });

      // Make file publicly accessible
      await fileRef.makePublic();

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

      return publicUrl;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error: any) {
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }

    const bucket = storage.bucket();
    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts.slice(urlParts.indexOf(bucket.name) + 1).join('/');
    const fileRef = bucket.file(filename);

    await fileRef.delete();
  } catch (error: any) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

