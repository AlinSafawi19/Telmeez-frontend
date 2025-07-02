const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
  language?: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      institutionName?: string;
      role: {
        _id: string;
        role: string;
      };
      isActive: boolean;
      createdAt: string;
    };
  };
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institutionName?: string;
  role: {
    _id: string;
    role: string;
  };
  isActive: boolean;
  subscriptions?: any[];
  createdAt: string;
}

class AuthService {
  // Sign in user
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Pass the full error response so frontend can extract error_code
        throw new Error(JSON.stringify({
          message: data.message || 'Sign in failed',
          error_code: data.error_code,
          status: response.status
        }));
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Forgot password - Request password reset
  async forgotPassword(request: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        // Pass the full error response so frontend can extract error_code
        throw new Error(JSON.stringify({
          message: data.message || 'Failed to send password reset email',
          error_code: data.error_code,
          status: response.status
        }));
      }

      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Verify password reset code
  async verifyResetCode(request: VerifyResetCodeRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      return data;
    } catch (error) {
      console.error('Verify reset code error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(request: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        // For 401 errors, throw a specific error that can be handled gracefully
        if (response.status === 401) {
          throw new Error('Access token required');
        }
        throw new Error(data.message || 'Failed to get profile');
      }

      return data.data;
    } catch (error) {
      // Don't log 401 errors as they are expected for unauthenticated users
      if (error instanceof Error && error.message === 'Access token required') {
        throw error; // Re-throw without logging
      }
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh token');
      }

      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Check authentication status (for debugging)
  async checkAuthStatus(): Promise<{ hasAccessToken: boolean; hasRefreshToken: boolean; cookies: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check auth status');
      }

      return data;
    } catch (error) {
      console.error('Check auth status error:', error);
      throw error;
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    // Since we're using cookies, we can't easily check authentication status
    // without making a request. We'll rely on the backend to handle this.
    return true; // This will be checked by making actual API calls
  }

  // Get current token (not used with cookie-based auth)
  getToken(): string | null {
    return null;
  }

  // Set token (not used with cookie-based auth)
  /*setToken(token: string): void {
    // Not used with cookie-based authentication
  }*/
}

export const authService = new AuthService();
export default authService; 