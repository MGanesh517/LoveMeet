import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Helper to check if Firebase is initialized
const getAuthInstance = () => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Please check your environment variables.');
  }
  return auth;
};

const getDbInstance = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Please check your environment variables.');
  }
  return db;
};

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// GitHub Auth Provider
const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  prompt: 'select_account',
});

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;

    // Update user profile with name
    await updateProfile(user, {
      displayName: name,
    });

    // Get ID token and store in localStorage
    const token = await getIdToken(user);
    storeAuthToken(token);

    // Create user document in Firestore
    await setDoc(doc(dbInstance, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      createdAt: serverTimestamp(),
      isComplete: false,
    });

    // Also save to MongoDB via API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lovemeet-backend.onrender.com';
      await fetch(`${backendUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name: name,
          isComplete: false,
        }),
      });
    } catch (mongoError) {
      console.error('Failed to save to MongoDB:', mongoError);
      // Don't throw - Firebase auth succeeded
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const authInstance = getAuthInstance();
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;
    
    // Get ID token and store in localStorage
    const token = await getIdToken(user);
    storeAuthToken(token);
    
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();
    const result = await signInWithPopup(authInstance, googleProvider);
    const user = result.user;

    // Get ID token and store in localStorage
    const token = await getIdToken(user);
    storeAuthToken(token);

    // Create or update user document in Firestore
    const userRef = doc(dbInstance, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'User',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        isComplete: false,
      });
    }

    // Also save to MongoDB via API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lovemeet-backend.onrender.com';
      await fetch(`${backendUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name: user.displayName || 'User',
          photoURL: user.photoURL,
          isComplete: false,
        }),
      });
    } catch (mongoError) {
      console.error('Failed to save to MongoDB:', mongoError);
      // Don't throw - Firebase auth succeeded
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// Sign in with GitHub
export const signInWithGitHub = async (): Promise<User> => {
  try {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();
    const result = await signInWithPopup(authInstance, githubProvider);
    const user = result.user;

    // Get ID token and store in localStorage
    const token = await getIdToken(user);
    storeAuthToken(token);

    // Create or update user document in Firestore
    const userRef = doc(dbInstance, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'User',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        isComplete: false,
      });
    }

    // Also save to MongoDB via API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lovemeet-backend.onrender.com';
      await fetch(`${backendUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name: user.displayName || 'User',
          photoURL: user.photoURL,
          isComplete: false,
        }),
      });
    } catch (mongoError) {
      console.error('Failed to save to MongoDB:', mongoError);
      // Don't throw - Firebase auth succeeded
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with GitHub');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    await signOut(authInstance);
    removeAuthToken();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Check if user is authenticated (from localStorage)
export const checkAuthStatus = async (): Promise<User | null> => {
  if (typeof window === 'undefined') return null;
  
  const authInstance = getAuthInstance();
  const token = getAuthToken();
  
  if (!token) return null;
  
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      unsubscribe();
      if (user) {
        // Refresh token
        getIdToken(user, true).then((newToken) => {
          storeAuthToken(newToken);
        });
      } else {
        removeAuthToken();
      }
      resolve(user);
    });
  });
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    await sendPasswordResetEmail(authInstance, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth?.currentUser || null;
};

// Store auth token in localStorage
export const storeAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('firebase_auth_token', token);
  }
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('firebase_auth_token');
  }
  return null;
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('firebase_auth_token');
  }
};

