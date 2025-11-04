import { ObjectId } from 'mongodb';

export interface UserProfile {
  _id?: ObjectId;
  firebaseUid: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  bio?: string;
  profileImages?: string[]; // Firebase Storage URLs
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
  photoURL?: string; // From Google/GitHub
  createdAt?: Date;
  updatedAt?: Date;
  isComplete?: boolean;
}

export interface UserDocument extends UserProfile {
  _id: ObjectId;
}

