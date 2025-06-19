import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Subscriber } from '../pages/demo-dashboard/models/Subscriber';
import type { SubscriberPreference } from '../pages/demo-dashboard/models/subscriber_preference';
import type { InstitutionType } from '../pages/demo-dashboard/models/institution_type';
import type { ProfileImage } from '../pages/demo-dashboard/models/profile_image';

// Extended subscriber interface with related data
export interface SubscriberWithDetails extends Subscriber {
    preferences?: SubscriberPreference;
    institutionType?: InstitutionType;
    profileImage?: ProfileImage;
}

interface SubscriberContextType {
    subscriber: SubscriberWithDetails | null;
    isLoading: boolean;
    error: string | null;
    isDemoMode: boolean;
    setDemoMode: (isDemo: boolean) => void;
    updateSubscriber: (updates: Partial<SubscriberWithDetails>) => void;
    fetchSubscriber: (subscriberId: string) => Promise<void>;
    clearSubscriber: () => void;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfileImage: () => void;
    generateNewProfileImage: () => void;
}

const SubscriberContext = createContext<SubscriberContextType | undefined>(undefined);

// More reliable profile image URL
const getProfileImageUrl = (): string => {
    const seed = Math.floor(Math.random() * 1000);
    return `https://randomuser.me/api/portraits/men/${seed % 100}.jpg`; 
};

// Dummy data for demo purposes
const dummySubscriberData: SubscriberWithDetails = {
    id: 'demo-subscriber-001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@demo.edu',
    phone: '+1-555-0123',
    password: 'hashed_password_here',
    institution_name: 'Demo University',
    primary_address: '123 Demo Street',
    secondary_address: 'Suite 456',
    profile_image_id: 'demo-profile-001',
    city: 'Demo City',
    state: 'Demo State',
    zip: '12345',
    country: 'United States',
    subscriber_preference_id: 'demo-pref-001',
    institution_type_id: 'demo-inst-type-001',
    updated_at: new Date(),
    createdAt: new Date('2024-01-01'),
    preferences: {
        id: 'demo-pref-001',
        language: 'en',
        is_auto_renewed: true,
        subscriber_id: 'demo-subscriber-001',
        timezone: 'America/New_York',
        updated_at: new Date(),
        createdAt: new Date('2024-01-01')
    },
    institutionType: {
        id: 'demo-inst-type-001',
        name: 'University'
    },
    profileImage: {
        id: 'demo-profile-001',
        user_id: 'demo-subscriber-001',
        file_name: 'unsplash-profile.jpg',
        file_type: 'image/jpeg',
        file_url: getProfileImageUrl(),
        uploaded_at: new Date(),
        uploaded_by: 'demo-subscriber-001',
        is_active: true
    }
};

export const SubscriberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [subscriber, setSubscriber] = useState<SubscriberWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Initialize demo mode from localStorage
    useEffect(() => {
        const savedDemoMode = localStorage.getItem('demoMode');
        if (savedDemoMode) {
            setIsDemoMode(JSON.parse(savedDemoMode));
        }
    }, []);

    // Save demo mode to localStorage
    useEffect(() => {
        localStorage.setItem('demoMode', JSON.stringify(isDemoMode));
    }, [isDemoMode]);

    const setDemoMode = (isDemo: boolean) => {
        setIsDemoMode(isDemo);
        if (isDemo) {
            // Generate fresh dummy data with new random profile image
            const freshDummyData = {
                ...dummySubscriberData,
                profileImage: {
                    ...dummySubscriberData.profileImage!,
                    file_url: getProfileImageUrl()
                }
            };
            console.log('Setting demo subscriber with profile image:', freshDummyData.profileImage?.file_url);
            setSubscriber(freshDummyData);
            setError(null);
        } else {
            setSubscriber(null);
        }
    };

    const updateSubscriber = (updates: Partial<SubscriberWithDetails>) => {
        if (subscriber) {
            setSubscriber({ ...subscriber, ...updates });
        }
    };

    const fetchSubscriber = async (_subscriberId: string) => {
        if (isDemoMode) {
            setSubscriber(dummySubscriberData);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/subscribers/${subscriberId}`);
            // const data = await response.json();
            // setSubscriber(data);

            // For now, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubscriber(dummySubscriberData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch subscriber');
        } finally {
            setIsLoading(false);
        }
    };

    const clearSubscriber = () => {
        setSubscriber(null);
        setError(null);
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            if (isDemoMode) {
                // Demo login - accept any credentials
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('Demo login successful, setting subscriber:', dummySubscriberData.profileImage?.file_url);
                setSubscriber(dummySubscriberData);
                return true;
            }

            // TODO: Replace with actual login API call
            // const response = await fetch('/api/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();
            // setSubscriber(data.subscriber);
            // return response.ok;

            // For now, simulate login
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (email === 'demo@example.com' && password === 'demo123') {
                setSubscriber(dummySubscriberData);
                return true;
            } else {
                setError('Invalid credentials');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setSubscriber(null);
        setError(null);
        if (isDemoMode) {
            setIsDemoMode(false);
        }
    };

    const updateProfileImage = () => {
        if (subscriber && subscriber.profileImage) {
            const newImageUrl = getProfileImageUrl();
            setSubscriber({
                ...subscriber,
                profileImage: {
                    ...subscriber.profileImage,
                    file_url: newImageUrl
                }
            });
        }
    };

    const generateNewProfileImage = () => {
        if (subscriber) {
            const newImageId = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newImageUrl = getProfileImageUrl();
            setSubscriber({
                ...subscriber,
                profile_image_id: newImageId,
                profileImage: {
                    id: newImageId,
                    user_id: subscriber.id,
                    file_name: `unsplash-profile-${Date.now()}.jpg`,
                    file_type: 'image/jpeg',
                    file_url: newImageUrl,
                    uploaded_at: new Date(),
                    uploaded_by: subscriber.id,
                    is_active: true
                }
            });
        }
    };

    const value: SubscriberContextType = {
        subscriber,
        isLoading,
        error,
        isDemoMode,
        setDemoMode,
        updateSubscriber,
        fetchSubscriber,
        clearSubscriber,
        login,
        logout,
        updateProfileImage,
        generateNewProfileImage
    };

    return (
        <SubscriberContext.Provider value={value}>
            {children}
        </SubscriberContext.Provider>
    );
};

export const useSubscriber = () => {
    const context = useContext(SubscriberContext);
    if (context === undefined) {
        throw new Error('useSubscriber must be used within a SubscriberProvider');
    }
    return context;
}; 