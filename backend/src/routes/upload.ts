import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadImages } from '../services/storageService';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 6, // Maximum 6 files
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Error handler for multer
const handleMulterError = (err: any, req: Request, res: Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 6 files' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field' });
    }
    return res.status(400).json({ error: 'Upload error', details: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
  next();
};

// Upload multiple images
router.post('/images', upload.array('images', 6), handleMulterError, async (req: Request, res: Response) => {
  try {
    console.log('Upload request received:', {
      body: req.body,
      filesCount: req.files ? (req.files as Express.Multer.File[]).length : 0,
    });

    const { userId } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    console.log(`Uploading ${files.length} images for user: ${userId}`);

    // Upload images to Firebase Storage
    const imageUrls = await uploadImages(files, userId, 'profiles');

    console.log(`Successfully uploaded ${imageUrls.length} images`);

    res.json({
      message: 'Images uploaded successfully',
      imageUrls,
      count: imageUrls.length,
    });
  } catch (error: any) {
    console.error('Error uploading images:', error);
    res.status(500).json({ 
      error: 'Failed to upload images', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Upload single image
router.post('/image', upload.single('image'), handleMulterError, async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Upload image to Firebase Storage
    const imageUrls = await uploadImages([file], userId, 'profiles');

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrls[0],
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

export default router;

