import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Subscriber } from '../pages/demo-dashboard/models/Subscriber';
import type { ProfileImage } from '../pages/demo-dashboard/models/profile_image';
import type { Payment } from '../pages/demo-dashboard/models/payment';
import type { PaymentMethod } from '../pages/demo-dashboard/models/payment_method';
import type { Plan } from '../pages/demo-dashboard/models/plan';
import type { PaymentStatus } from '../pages/demo-dashboard/models/payment_status';
import type { BillingAddress } from '../pages/demo-dashboard/models/billing_address';
import type { User } from '../pages/demo-dashboard/models/user';
import type { UserPreference } from '../pages/demo-dashboard/models/user_preference';
import type { Role } from '../pages/demo-dashboard/models/role';
import type { CardType } from '../pages/demo-dashboard/models/card_type';

// Extended user interface with related data
export interface UserWithDetails extends Subscriber {
    preferences?: UserPreference;
    profileImage?: ProfileImage;
    payment?: Payment;
    paymentMethod?: PaymentMethod;
    plan?: Plan;
    paymentStatus?: PaymentStatus;
    billingAddress?: BillingAddress;
    user?: User;
    role?: Role;
    cardType?: CardType;
}

interface UserContextType {
    subscriber: UserWithDetails | null;
    isLoading: boolean;
    error: string | null;
    isDemoMode: boolean;
    setDemoMode: (isDemo: boolean) => void;
    updateSubscriber: (updates: Partial<UserWithDetails>) => void;
    fetchSubscriber: (subscriberId: string) => Promise<void>;
    clearSubscriber: () => void;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfileImage: () => void;
    generateNewProfileImage: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// More reliable profile image URL
const getProfileImageUrl = (): string => {
    const seed = Math.floor(Math.random() * 1000);
    return `https://randomuser.me/api/portraits/men/${seed % 100}.jpg`;
};

// Dummy data for demo purposes
const dummySubscriberData: UserWithDetails = {
    id: 'demo-subscriber-001',
    last_payment_id: 'pay_001',
    institution_name: 'Demo University',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
        id: 'demo-user-001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@demo.edu',
        country_code: 'us',
        phone: '+15550123',
        password: 'hashed_password_here',
        subscriber_id: 'demo-subscriber-001',
        user_status_id: 'status_001',
        role_id: 'role_001',
        department_id: 'dept_001',
        course_id: 'course_001',
        user_preference_id: 'pref_001',
        is_online: true,
        is_verified: true,
        last_login: new Date(),
        primary_address: '123 Demo Street',
        secondary_address: 'Suite 456',
        city: 'Demo City',
        state: 'Demo State',
        zip: '12345',
        country: 'United States',
        profile_image_id: 'demo-profile-001',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'demo-user-001',
        updatedBy: 'demo-user-001'
    },
    preferences: {
        id: 'demo-pref-001',
        language: 'en',
        user_id: 'demo-user-001',
        timezone: 'America/New_York',
        updatedAt: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01')
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
    },
    payment: {
        id: "pay_001",
        payment_method_id: "pm_001",
        plan_id: "plan_001",
        final_price: "760.00",
        next_payment_date: new Date("2025-07-20"),
        payment_status_id: 'status_001',
        promo_code_id: '',
        subscriber_id: 'demo-subscriber-001',
        billing_address_id: 'addr_001',
        createdAt: new Date("2025-06-20")
    },
    paymentMethod: {
        id: "pm_001",
        card_number: "1234567890123456",
        expiry_month: 12,
        expiry_year: 2025,
        cvv: "123",
        subscriber_id: "demo-subscriber-001",
        card_type_id: "card_type_001",
        is_default: true,
        updated_at: new Date(),
        createdAt: new Date("2025-06-20")
    },
    cardType: {
        id: "card_type_001",
        name: "Visa",
        createdAt: new Date("2025-06-20"),
        updatedAt: new Date("2025-06-20")
    },
    plan: {
        id: "plan_001",
        name: "Standard Plan",
        price: "950",
        description: "Perfect for growing educational institutions",
        is_annual: true,
        discount: 20,
        free_trial_days: 0,
        max_admin: 10,
        max_teacher: 150,
        max_student: 1500,
        max_parent: 750,
        createdAt: new Date("2025-06-20"),
        updatedAt: new Date("2025-06-20")
    },
    paymentStatus: {
        id: "status_001",
        name: "Completed",
        createdAt: new Date("2025-06-20"),
        updated_at: new Date("2025-06-20"),
    },
    billingAddress: {
        id: "addr_001",
        subscriber_id: 'demo-subscriber-001',
        primary_address: '123 Demo Street',
        secondary_address: 'Suite 456',
        city: 'Demo City',
        state: 'Demo State',
        zip: '12345',
        country: 'United States',
        createdAt: new Date("2025-06-20"),
        updatedAt: new Date("2025-06-20"),
    },
    role: {
        id: "role_001",
        name: "SuperAdmin",
        createdAt: new Date("2025-06-20"),
        updatedAt: new Date("2025-06-20"),
    }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState<UserWithDetails | null>(null);
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
            setLoggedInUser(freshDummyData);
            setError(null);
        } else {
            setLoggedInUser(null);
        }
    };

    const updateSubscriber = (updates: Partial<UserWithDetails>) => {
        if (loggedInUser) {
            setLoggedInUser({ ...loggedInUser, ...updates });
        }
    };

    const fetchSubscriber = async (_subscriberId: string) => {
        if (isDemoMode) {
            setLoggedInUser(dummySubscriberData);
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
            setLoggedInUser(dummySubscriberData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch subscriber');
        } finally {
            setIsLoading(false);
        }
    };

    const clearSubscriber = () => {
        setLoggedInUser(null);
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
                setLoggedInUser(dummySubscriberData);
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
                setLoggedInUser(dummySubscriberData);
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
        setLoggedInUser(null);
        setError(null);
        if (isDemoMode) {
            setIsDemoMode(false);
        }
    };

    const updateProfileImage = () => {
        if (loggedInUser && loggedInUser.profileImage) {
            const newImageUrl = getProfileImageUrl();
            setLoggedInUser({
                ...loggedInUser,
                profileImage: {
                    ...loggedInUser.profileImage,
                    file_url: newImageUrl
                }
            });
        }
    };

    const generateNewProfileImage = () => {
        if (loggedInUser) {
            const newImageId = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newImageUrl = getProfileImageUrl();
            setLoggedInUser({
                ...loggedInUser,
                user: {
                    ...loggedInUser.user!,
                    profile_image_id: newImageId
                },
                profileImage: {
                    id: newImageId,
                    user_id: loggedInUser.id,
                    file_name: `unsplash-profile-${Date.now()}.jpg`,
                    file_type: 'image/jpeg',
                    file_url: newImageUrl,
                    uploaded_at: new Date(),
                    uploaded_by: loggedInUser.id,
                    is_active: true
                }
            });
        }
    };

    const value: UserContextType = {
        subscriber: loggedInUser,
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
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 