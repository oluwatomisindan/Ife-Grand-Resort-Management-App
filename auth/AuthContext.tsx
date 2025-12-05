import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../src/auth/authService';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token) {
        try {
          // First, restore user from localStorage for immediate display
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
          
          // Then verify with server and update if needed
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      // Backend generates the UUID, so we don't need to pass it
      const data = await authService.register(name, email, password);
      // Auto-login after successful registration
      setCurrentUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    }
  };

  const signOut = () => {
    authService.logout();
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
