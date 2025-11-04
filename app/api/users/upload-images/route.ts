import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleImages } from '@/lib/firebase/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const userId = formData.get('userId') as string;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Upload images to Firebase Storage
    const imageUrls = await uploadMultipleImages(files, userId, 'profiles');

    return NextResponse.json({
      message: 'Images uploaded successfully',
      imageUrls,
    });
  } catch (error: any) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images', details: error.message },
      { status: 500 }
    );
  }
}

