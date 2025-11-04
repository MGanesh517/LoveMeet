import { ref, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from 'firebase/storage';
import { storage } from './config';

const getStorageInstance = (): FirebaseStorage => {
  if (!storage) {
    throw new Error('Firebase Storage not initialized. Please check your environment variables.');
  }
  return storage;
};

/**
 * Upload a single image file to Firebase Storage
 * @param file - File to upload
 * @param userId - User's Firebase UID
 * @param folder - Folder name (default: 'profiles')
 * @returns Promise<string> - Download URL
 */
export const uploadImage = async (
  file: File,
  userId: string,
  folder: string = 'profiles'
): Promise<string> => {
  try {
    const storageInstance = getStorageInstance();
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${userId}/${folder}/${timestamp}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storageInstance, filename);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error: any) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images to Firebase Storage
 * @param files - Array of files to upload
 * @param userId - User's Firebase UID
 * @param folder - Folder name (default: 'profiles')
 * @returns Promise<string[]> - Array of download URLs
 */
export const uploadMultipleImages = async (
  files: File[],
  userId: string,
  folder: string = 'profiles'
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, userId, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error: any) {
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

/**
 * Delete an image from Firebase Storage
 * @param url - Firebase Storage URL to delete
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    const storageInstance = getStorageInstance();
    const storageRef = ref(storageInstance, url);
    await deleteObject(storageRef);
  } catch (error: any) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

