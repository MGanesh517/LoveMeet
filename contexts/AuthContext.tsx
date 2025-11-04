'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Check localStorage for existing token
    const checkAuth = async () => {
      if (!auth) {
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('firebase_auth_token');
        if (token) {
          // Token exists, Firebase will auto-authenticate
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              // Refresh token
              const { getIdToken } = await import('firebase/auth');
              getIdToken(user, true).then((newToken) => {
                localStorage.setItem('firebase_auth_token', newToken);
              });
            }
            setUser(user);
            setLoading(false);
            unsubscribe();
          });
        } else {
          // No token, check auth state normally
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
          });
          return () => unsubscribe();
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

