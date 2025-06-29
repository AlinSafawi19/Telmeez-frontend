import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { UserProfile, SignInCredentials } from '../services/authService';
import { clearRememberMePreference } from '../utils/Functions';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if there are any auth cookies before making the request
        const cookies = document.cookie.split(';');
        const hasAuthCookies = cookies.some(cookie => 
          cookie.trim().startsWith('accessToken=') || 
          cookie.trim().startsWith('refreshToken=')
        );

        if (!hasAuthCookies) {
          // No auth cookies, user is definitely not authenticated
          console.log('No auth cookies found - user not authenticated');
          setIsLoading(false);
          return;
        }

        const userProfile = await authService.getProfile();
        setUser(userProfile);
      } catch (error: any) {
        // Check if it's a 401 error (not authenticated) - this is expected
        if (error.message && error.message.includes('Access token required')) {
          // User is not authenticated, which is fine - no need to log error
          console.log('User not authenticated - this is expected for new visitors');
        } else {
          // Log other unexpected errors
          console.error('Failed to initialize auth:', error);
        }
        // User is not authenticated, which is fine
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.signIn(credentials);
      setUser(response.data.user);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      // Clear remember me preference when signing out
      clearRememberMePreference();
    }
  };

  const refreshUser = async () => {
    try {
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 