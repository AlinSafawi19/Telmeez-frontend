import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import Swal from 'sweetalert2';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'superadmin' | 'schooladmin' | 'teacher' | 'parent' | 'student';
    profileImage?: string;
    subscriptionPlan: 'Starter' | 'Standard' | 'Enterprise';
    isEmailVerified: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    preferences: {
        language: 'en' | 'ar' | 'fr';
    };
    profile: {
        phone?: string;
        address?: string;
        bio?: string;
        timezone?: string;
    };
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface UserContextType {
    user: User | null;
    authState: AuthState;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (userData: Omit<User, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt' | 'isEmailVerified'>) => Promise<boolean>;
    updateProfile: (profileData: Partial<User['profile']>) => Promise<void>;
    updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    resetPassword: (email: string) => Promise<boolean>;
    verifyEmail: (token: string) => Promise<boolean>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    // Check for existing session on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    // In a real app, you would validate the token with your backend
                    // For demo purposes, initialize with a default user
                    const defaultUser: User = {
                        id: '1',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                        role: 'superadmin',
                        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                        subscriptionPlan: 'Standard',
                        isEmailVerified: true,
                        lastLogin: new Date(),
                        createdAt: new Date('2024-01-01'),
                        updatedAt: new Date(),
                        preferences: {
                            language: 'en'
                        },
                        profile: {
                            phone: '+1234567890',
                            address: '123 Main St, City, Country',
                            bio: 'Experienced administrator with 5+ years in education management.',
                            timezone: 'America/New_York'
                        }
                    };
                    setUser(defaultUser);
                    setAuthState(prev => ({ ...prev, isAuthenticated: true, isLoading: false }));
                } else {
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setAuthState(prev => ({ 
                    ...prev, 
                    isLoading: false, 
                    error: 'Failed to check authentication status' 
                }));
            }
        };

        checkAuthStatus();
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock authentication logic
            if (email === 'john@example.com' && password === 'password') {
                const mockUser: User = {
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    role: 'superadmin',
                    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    subscriptionPlan: 'Standard',
                    isEmailVerified: true,
                    lastLogin: new Date(),
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date(),
                    preferences: {
                        language: 'en'
                    },
                    profile: {
                        phone: '+1234567890',
                        address: '123 Main St, City, Country',
                        bio: 'Experienced administrator with 5+ years in education management.',
                        timezone: 'America/New_York'
                    }
                };
                
                // Store token in localStorage
                localStorage.setItem('authToken', 'mock-jwt-token');
                localStorage.setItem('user', JSON.stringify(mockUser));
                
                setUser(mockUser);
                setAuthState(prev => ({ 
                    ...prev, 
                    isAuthenticated: true, 
                    isLoading: false 
                }));
                
                return true;
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setAuthState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: errorMessage 
            }));
            return false;
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            // Clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Reset state
            setUser(null);
            setAuthState(prev => ({ 
                ...prev, 
                isAuthenticated: false, 
                error: null 
            }));
            
            // Show success message
            await Swal.fire({
                title: 'Logged out successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-xl shadow-lg'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, []);

    const register = useCallback(async (userData: Omit<User, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt' | 'isEmailVerified'>): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newUser: User = {
                ...userData,
                id: Date.now().toString(),
                lastLogin: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                isEmailVerified: false
            };
            
            // In a real app, you would send this to your backend
            console.log('Registering user:', newUser);
            
            setAuthState(prev => ({ ...prev, isLoading: false }));
            
            // Show success message
            await Swal.fire({
                title: 'Registration successful!',
                text: 'Please check your email to verify your account.',
                icon: 'success',
                confirmButtonColor: '#4F46E5',
                customClass: {
                    popup: 'rounded-xl shadow-lg'
                }
            });
            
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setAuthState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: errorMessage 
            }));
            return false;
        }
    }, []);

    const updateProfile = useCallback(async (profileData: Partial<User['profile']>): Promise<void> => {
        if (!user) return;
        
        try {
            const updatedUser = {
                ...user,
                profile: { ...user.profile, ...profileData },
                updatedAt: new Date()
            };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Show success message
            await Swal.fire({
                title: 'Profile updated successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-xl shadow-lg'
                }
            });
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }, [user]);

    const updatePreferences = useCallback(async (preferences: Partial<User['preferences']>): Promise<void> => {
        if (!user) return;
        
        try {
            const updatedUser = {
                ...user,
                preferences: { ...user.preferences, ...preferences },
                updatedAt: new Date()
            };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Preferences update error:', error);
            throw error;
        }
    }, [user]);

    const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
        try {
            // Simulate password change
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, you would validate current password and update with new password
            console.log('Changing password from', currentPassword, 'to', newPassword);
            
            await Swal.fire({
                title: 'Password changed successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-xl shadow-lg'
                }
            });
            
            return true;
        } catch (error) {
            console.error('Password change error:', error);
            return false;
        }
    }, []);

    const resetPassword = useCallback(async (email: string): Promise<boolean> => {
        try {
            // Simulate password reset
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Sending password reset email to:', email);
            
            await Swal.fire({
                title: 'Password reset email sent',
                text: 'Please check your email for instructions to reset your password.',
                icon: 'success',
                confirmButtonColor: '#4F46E5',
                customClass: {
                    popup: 'rounded-xl shadow-lg'
                }
            });
            
            return true;
        } catch (error) {
            console.error('Password reset error:', error);
            return false;
        }
    }, []);

    const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
        try {
            // Simulate email verification
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (user) {
                const updatedUser = { ...user, isEmailVerified: true, updatedAt: new Date() };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            
            return true;
        } catch (error) {
            console.error('Email verification error:', error);
            return false;
        }
    }, [user]);

    const refreshUser = useCallback(async (): Promise<void> => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('User refresh error:', error);
        }
    }, []);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    const value: UserContextType = {
        user,
        authState,
        login,
        logout,
        register,
        updateProfile,
        updatePreferences,
        changePassword,
        resetPassword,
        verifyEmail,
        refreshUser,
        clearError
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 