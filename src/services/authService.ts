const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
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
        throw new Error(data.message || 'Sign in failed');
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
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
        throw new Error(data.message || 'Failed to get profile');
      }

      return data.data;
    } catch (error) {
      console.error('Get profile error:', error);
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