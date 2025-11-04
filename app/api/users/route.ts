import { NextRequest, NextResponse } from 'next/server';
import clientPromise, { isMongoDBConfigured } from '@/lib/mongodb/db';
import { UserProfile } from '@/lib/mongodb/models/User';

export async function GET(request: NextRequest) {
  try {
    if (!isMongoDBConfigured()) {
      return NextResponse.json(
        { error: 'MongoDB not configured. Please add MONGODB_URI to .env.local' },
        { status: 503 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(
        { error: 'MongoDB connection failed' },
        { status: 503 }
      );
    }

    const db = client.db('lovemeet');
    
    const searchParams = request.nextUrl.searchParams;
    const firebaseUid = searchParams.get('firebaseUid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'firebaseUid is required' },
        { status: 400 }
      );
    }

    const user = await db.collection('users').findOne({ firebaseUid });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isMongoDBConfigured()) {
      return NextResponse.json(
        { error: 'MongoDB not configured. Please add MONGODB_URI to .env.local' },
        { status: 503 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(
        { error: 'MongoDB connection failed' },
        { status: 503 }
      );
    }

    const db = client.db('lovemeet');
    
    const body: UserProfile = await request.json();
    
    if (!body.firebaseUid) {
      return NextResponse.json(
        { error: 'firebaseUid is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      firebaseUid: body.firebaseUid 
    });

    if (existingUser) {
      // Update existing user
      const result = await db.collection('users').updateOne(
        { firebaseUid: body.firebaseUid },
        { 
          $set: {
            ...body,
            updatedAt: new Date(),
          }
        }
      );
      
      const updatedUser = await db.collection('users').findOne({ 
        firebaseUid: body.firebaseUid 
      });
      
      return NextResponse.json({
        message: 'User updated successfully',
        user: updatedUser,
      });
    } else {
      // Create new user
      const newUser = {
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
        isComplete: false,
      };
      
      const result = await db.collection('users').insertOne(newUser);
      
      const createdUser = await db.collection('users').findOne({ 
        _id: result.insertedId 
      });
      
      return NextResponse.json({
        message: 'User created successfully',
        user: createdUser,
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isMongoDBConfigured()) {
      return NextResponse.json(
        { error: 'MongoDB not configured. Please add MONGODB_URI to .env.local' },
        { status: 503 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(
        { error: 'MongoDB connection failed' },
        { status: 503 }
      );
    }

    const db = client.db('lovemeet');
    
    const body: Partial<UserProfile> = await request.json();
    
    if (!body.firebaseUid) {
      return NextResponse.json(
        { error: 'firebaseUid is required' },
        { status: 400 }
      );
    }

    const result = await db.collection('users').updateOne(
      { firebaseUid: body.firebaseUid },
      { 
        $set: {
          ...body,
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await db.collection('users').findOne({ 
      firebaseUid: body.firebaseUid 
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

