# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "LoveMeet")
   - Enable Google Analytics (optional)
   - Create project

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Enable the following sign-in methods:
   - **Email/Password** (Enable)
   - **Google** (Enable)
   - **GitHub** (Enable)

### For Google OAuth:
- No additional setup needed (Firebase handles it)

### For GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: LoveMeet (or your app name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: 
     - Development: `http://localhost:3000`
     - Production: Your production URL
4. Copy the **Client ID** and **Client Secret**
5. In Firebase Console:
   - Go to Authentication > Sign-in method
   - Click on GitHub
   - Enter Client ID and Client Secret
   - Save

## Step 3: Get Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click on **Web icon** `</>` to add a web app
4. Register app (you can skip hosting setup)
5. Copy the config object

## Step 4: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 5: Set Up Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location (closest to your users)
5. Enable it

## Step 6: Set Up Storage (for profile images)

1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Start in **test mode** (for development)
4. Choose a location (same as Firestore)
5. Enable it

## Step 7: Set Up Firestore Rules (Important!)

Go to **Firestore Database** > **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow read, write: if request.auth != null;
    }
    
    // Likes collection
    match /likes/{likeId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 8: Set Up Storage Rules

Go to **Storage** > **Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 9: Test the Integration

1. Start your development server: `npm run dev`
2. Try signing up with email/password
3. Try signing in with Google
4. Try signing in with GitHub
5. Check Firebase Console to see users being created

## Troubleshooting

### GitHub OAuth not working?
- Make sure callback URL matches exactly in GitHub OAuth settings
- Check that Client ID and Secret are correct in Firebase
- Verify the redirect URL in Firebase matches your app URL

### Email/Password not working?
- Check that Email/Password is enabled in Firebase Authentication
- Verify environment variables are set correctly

### Firestore errors?
- Make sure Firestore is enabled
- Check that rules allow authenticated users to read/write

## Next Steps

After Firebase is set up:
1. ✅ Authentication is working
2. ⏭️ Profile data will be saved to Firestore
3. ⏭️ Profile images will be uploaded to Storage
4. ⏭️ Matches and likes will be stored in Firestore

