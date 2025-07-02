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

  // Helper function to check if cookies exist
  const hasAuthCookies = (): boolean => {
    try {
      const cookies = document.cookie.split(';');
      return cookies.some(cookie => {
        const [name] = cookie.trim().split('=');
        return name === 'accessToken' || name === 'refreshToken';
      });
    } catch (error) {
      console.error('Error checking cookies:', error);
      return false;
    }
  };

  // Helper function to check auth status from server
  const checkServerAuthStatus = async (): Promise<boolean> => {
    try {
      const status = await authService.checkAuthStatus();
      console.log('🔍 Server auth status:', status);
      return status.hasAccessToken || status.hasRefreshToken;
    } catch (error) {
      console.log('❌ Failed to check server auth status:', error);
      return false;
    }
  };

  // Helper function to attempt token refresh
  const attemptTokenRefresh = async (): Promise<boolean> => {
    try {
      await authService.refreshToken();
      return true;
    } catch (error) {
      console.log('Token refresh failed:', error);
      return false;
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log('🔐 Initializing authentication...');
        
        // Check if there are any auth cookies
        const hasCookies = hasAuthCookies();
        console.log('🍪 Auth cookies found:', hasCookies);
        
        // Also check server-side auth status
        const serverHasCookies = await checkServerAuthStatus();
        console.log('🖥️ Server auth cookies found:', serverHasCookies);
        
        if (!hasCookies && !serverHasCookies) {
          console.log('❌ No auth cookies found - user not authenticated');
          setIsLoading(false);
          return;
        }

        // Try to get user profile
        try {
          console.log('👤 Attempting to get user profile...');
          const userProfile = await authService.getProfile();
          setUser(userProfile);
          console.log('✅ User authenticated successfully:', userProfile.email);
        } catch (error: any) {
          // If it's a 401 error, try to refresh the token
          if (error.message && error.message.includes('Access token required')) {
            console.log('🔄 Access token expired, attempting refresh...');
            const refreshSuccess = await attemptTokenRefresh();
            
            if (refreshSuccess) {
              // Try to get profile again after refresh
              try {
                console.log('🔄 Token refreshed, getting profile again...');
                const userProfile = await authService.getProfile();
                setUser(userProfile);
                console.log('✅ User authenticated after token refresh:', userProfile.email);
              } catch (refreshError) {
                console.log('❌ Failed to get profile after token refresh:', refreshError);
                // Clear any invalid cookies
                await authService.signOut();
              }
            } else {
              console.log('❌ Token refresh failed, user not authenticated');
              // Clear any invalid cookies
              await authService.signOut();
            }
          } else {
            console.error('❌ Failed to get profile:', error);
            // Clear any invalid cookies
            await authService.signOut();
          }
        }
      } catch (error) {
        console.error('❌ Failed to initialize auth:', error);
        // Clear any invalid cookies
        await authService.signOut();
      } finally {
        console.log('🏁 Authentication initialization complete');
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
      // If refresh fails, try token refresh
      const refreshSuccess = await attemptTokenRefresh();
      if (!refreshSuccess) {
        setUser(null);
      } else {
        // Try to get profile again after refresh
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (refreshError) {
          console.error('Failed to get profile after token refresh:', refreshError);
          setUser(null);
        }
      }
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