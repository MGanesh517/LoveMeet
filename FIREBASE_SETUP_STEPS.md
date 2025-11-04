# Firebase Setup Steps for LoveMeet

## ✅ What You've Provided:
- Project Name: LoveMeet
- Project ID: lovemeet-1200b
- Project Number: 574921770145
- Web API Key: AIzaSyCQ9L9IMFnKA4Oo9ZhWKDDNh18Kly3IOEI

## 🔍 What You Still Need:

### 1. Get Your App ID (Required)

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **LoveMeet**
3. Click the **⚙️ Settings icon** (top left) > **Project settings**
4. Scroll down to **"Your apps"** section
5. If you don't see a web app, click **"Add app"** > Select **Web icon** `</>`
6. Register your app:
   - **App nickname**: LoveMeet Web (or leave default)
   - **Firebase Hosting**: Skip for now (optional)
7. Copy the **App ID** (looks like: `1:574921770145:web:abc123def456`)
8. Replace `YOUR_APP_ID_HERE` in `.env.local` with your actual App ID

**The config will look like this in Firebase Console:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCQ9L9IMFnKA4Oo9ZhWKDDNh18Kly3IOEI",
  authDomain: "lovemeet-1200b.firebaseapp.com",
  projectId: "lovemeet-1200b",
  storageBucket: "lovemeet-1200b.appspot.com",
  messagingSenderId: "574921770145",
  appId: "1:574921770145:web:abc123def456"  // ← This is what you need
};
```

---

## 🔐 Step 2: Enable Authentication Methods

### Enable Email/Password:
1. Go to **Authentication** > **Get started** (if first time)
2. Click on **Sign-in method** tab
3. Click on **Email/Password**
4. **Enable** the first toggle (Email/Password)
5. Click **Save**

### Enable Google Sign-In:
1. In **Authentication** > **Sign-in method**
2. Click on **Google**
3. **Enable** it
4. Click **Save** (no additional setup needed)

### Enable GitHub Sign-In:
1. In **Authentication** > **Sign-in method**
2. Click on **GitHub**
3. **Enable** it
4. You need to create a GitHub OAuth App first:

#### Create GitHub OAuth App:
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** > **New OAuth App**
3. Fill in:
   - **Application name**: LoveMeet
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: 
     - Development: `http://localhost:3000`
     - Production: Your production URL later
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**
6. Go back to Firebase Console > Authentication > Sign-in method > GitHub
7. Paste **Client ID** and **Client Secret**
8. Click **Save**

---

## 📊 Step 3: Enable Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a **location** (choose closest to your users)
5. Click **Enable**

**Update Firestore Rules:**
1. Go to **Firestore Database** > **Rules** tab
2. Replace with:
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
3. Click **Publish**

---

## 📁 Step 4: Enable Storage (for Profile Images)

1. Go to **Storage** in Firebase Console
2. Click **Get started**
3. Choose **Start in test mode** (for development)
4. Select a **location** (same as Firestore)
5. Click **Done**

**Update Storage Rules:**
1. Go to **Storage** > **Rules** tab
2. Replace with:
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
3. Click **Publish**

---

## ✅ Step 5: Verify Your Setup

1. Make sure `.env.local` has all values filled:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCQ9L9IMFnKA4Oo9ZhWKDDNh18Kly3IOEI
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lovemeet-1200b.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=lovemeet-1200b
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lovemeet-1200b.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=574921770145
   NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id_here
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Test authentication:
   - Try signing up with email/password
   - Try signing in with Google
   - Try signing in with GitHub

---

## 📝 Quick Checklist

- [ ] Get App ID from Firebase Console
- [ ] Add App ID to `.env.local`
- [ ] Enable Email/Password authentication
- [ ] Enable Google authentication
- [ ] Enable GitHub authentication (create OAuth app first)
- [ ] Enable Firestore Database
- [ ] Set Firestore security rules
- [ ] Enable Storage
- [ ] Set Storage security rules
- [ ] Test authentication

---

## 🆘 Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Make sure authentication methods are enabled
4. Check Firestore and Storage are enabled

Once you have the App ID, just replace it in `.env.local` and you're ready to go! 🚀

