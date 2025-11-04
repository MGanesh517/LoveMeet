import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  bio?: string;
  profileImages?: string[];
  interestedIn?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  distanceRange?: number;
  location?: {
    lat: number;
    lng: number;
  };
  relationshipGoal?: string;
  hobbies?: string[];
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  isComplete: boolean;
}

const UserSchema: Schema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profileImages: {
      type: [String],
      default: [],
    },
    interestedIn: {
      type: String,
      enum: ['male', 'female', 'both'],
    },
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 35 },
    },
    distanceRange: {
      type: Number,
      default: 50,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    relationshipGoal: {
      type: String,
      enum: ['casual', 'serious', 'friendship', 'not-sure'],
    },
    hobbies: {
      type: [String],
      default: [],
    },
    photoURL: String,
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes for better query performance
UserSchema.index({ firebaseUid: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ location: '2dsphere' }); // For geospatial queries

export default mongoose.model<IUser>('User', UserSchema);

