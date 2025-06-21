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
import type { Department } from '../pages/demo-dashboard/models/department';
import type { UserStatus } from '../pages/demo-dashboard/models/user_status';
import type { Course } from '../pages/demo-dashboard/models/course';
import type { Parent } from '../pages/demo-dashboard/models/parent';
import type { Student } from '../pages/demo-dashboard/models/student';
import type { Teacher } from '../pages/demo-dashboard/models/teacher';

// Extended user interface with related data
export interface UserWithDetails extends Subscriber {
    preferences?: UserPreference;
    profileImage?: ProfileImage;
    payment?: Payment;
    payments?: Payment[];
    paymentMethods?: PaymentMethod[];
    plans?: Plan[];
    paymentStatuses?: PaymentStatus[];
    billingAddress?: BillingAddress;
    user?: User;
    cardTypes?: CardType[];
    admins?: User[];
    roles?: Role[];
    departments?: Department[];
    user_statuses?: UserStatus[];
    adminPreferences?: UserPreference[];
    adminProfileImages?: ProfileImage[];
    parents?: User[];
    students?: User[];
    teachers?: User[];
    parentPreferences?: UserPreference[];
    studentPreferences?: UserPreference[];
    teacherPreferences?: UserPreference[];
    parentProfileImages?: ProfileImage[];
    studentProfileImages?: ProfileImage[];
    teacherProfileImages?: ProfileImage[];
    courses?: Course[];
    parentDetails?: Parent[];
    studentDetails?: Student[];
    teacherDetails?: Teacher[];
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
    is_active: true,
    recurrence: 'annually',
    is_auto_renew: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
        id: 'demo-user-001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@demo.edu',
        country_code: 'lb',
        phone: '+96170650000',
        password: 'hashed_password_here',
        subscriber_id: 'demo-subscriber-001',
        user_status_id: 'status_001',
        role_id: 'role_001',
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
        timezone: 'Asia/Beirut',
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
    payments: [
        {
            id: "pay_001",
            payment_method_id: "pm_001",
            plan_id: "plan_002",
            final_price: "760.00",
            next_payment_date: new Date("2025-07-20"),
            payment_status_id: 'status_001',
            promo_code_id: '',
            subscriber_id: 'demo-subscriber-001',
            billing_address_id: 'addr_001',
            createdAt: new Date("2025-06-20")
        },
        {
            id: "pay_002",
            payment_method_id: "pm_001",
            plan_id: "plan_001",
            final_price: "760.00",
            next_payment_date: new Date("2025-05-20"),
            payment_status_id: 'status_001',
            promo_code_id: 'PROMO20',
            subscriber_id: 'demo-subscriber-001',
            billing_address_id: 'addr_001',
            createdAt: new Date("2025-05-20")
        },
        {
            id: "pay_003",
            payment_method_id: "pm_002",
            plan_id: "plan_002",
            final_price: "1200.00",
            next_payment_date: new Date("2025-04-20"),
            payment_status_id: 'status_001',
            promo_code_id: '',
            subscriber_id: 'demo-subscriber-001',
            billing_address_id: 'addr_002',
            createdAt: new Date("2025-04-20")
        },
        {
            id: "pay_004",
            payment_method_id: "pm_001",
            plan_id: "plan_001",
            final_price: "950.00",
            next_payment_date: new Date("2025-03-20"),
            payment_status_id: 'status_002',
            promo_code_id: '',
            subscriber_id: 'demo-subscriber-001',
            billing_address_id: 'addr_001',
            createdAt: new Date("2025-03-20")
        },
        {
            id: "pay_005",
            payment_method_id: "pm_003",
            plan_id: "plan_003",
            final_price: "1500.00",
            next_payment_date: new Date("2025-02-20"),
            payment_status_id: 'status_003',
            promo_code_id: 'WELCOME50',
            subscriber_id: 'demo-subscriber-001',
            billing_address_id: 'addr_003',
            createdAt: new Date("2025-02-20")
        }
    ],
    paymentMethods: [
        {
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
        {
            id: "pm_002",
            card_number: "9876543210987654",
            expiry_month: 8,
            expiry_year: 2026,
            cvv: "456",
            subscriber_id: "demo-subscriber-001",
            card_type_id: "card_type_002",
            is_default: false,
            updated_at: new Date(),
            createdAt: new Date("2025-05-15")
        },
        {
            id: "pm_003",
            card_number: "5555666677778888",
            expiry_month: 3,
            expiry_year: 2024,
            cvv: "789",
            subscriber_id: "demo-subscriber-001",
            card_type_id: "card_type_001",
            is_default: false,
            updated_at: new Date(),
            createdAt: new Date("2025-02-10")
        }
    ],
    cardTypes: [
        {
            id: "card_type_001",
            name: "Visa",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20")
        },
        {
            id: "card_type_002",
            name: "Mastercard",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20")
        },
        {
            id: "card_type_003",
            name: "American Express",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20")
        }
    ],
    plans: [
        {
            id: "plan_001",
            name: "Starter Plan",
            pricepermonth: "49",
            description: "Perfect for tutoring centers and small schools",
            discountperyear: 25,
            max_admin: 3,
            max_teacher: 25,
            max_student: 250,
            max_parent: 125,
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20")
        },
        {
            id: "plan_002",
            name: "Standard Plan",
            pricepermonth: "99",
            description: "Perfect for growing educational institutions",
            discountperyear: 20,
            max_admin: 10,
            max_teacher: 150,
            max_student: 1500,
            max_parent: 750,
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20")
        },
        {
            id: "plan_003",
            name: "Enterprise Plan",
            pricepermonth: "299",
            description: "For institutions big in size and high in demands",
            discountperyear: 20,
            max_admin: null,
            max_teacher: null,
            max_student: null,
            max_parent: null,
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20")
        }
    ],
    paymentStatuses: [
        {
            id: "status_001",
            name: "Completed",
            createdAt: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        },
        {
            id: "status_002",
            name: "Failed",
            createdAt: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        },
        {
            id: "status_003",
            name: "Pending",
            createdAt: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        },
        {
            id: "status_004",
            name: "Refunded",
            createdAt: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        },
        {
            id: "status_005",
            name: "Cancelled",
            createdAt: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        }
    ],
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
    roles: [
        {
            id: "role_001",
            name: "SuperAdmin",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
        },
        {
            id: "role_002",
            name: "Admin",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
        },
        {
            id: "role_003",
            name: "Teacher",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
        },
        {
            id: "role_004",
            name: "Student",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
        },
        {
            id: "role_005",
            name: "Parent",
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
        },
    ],
    departments: [
        {
            id: "dept_001",
            name: "Department 1",
            description: "Department 1 description",
            created_by: 'demo-user-001',
            updated_by: 'demo-user-001',
            is_active: true,
            is_deleted: false,
            is_archived: false,
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
            head_of_department_id: 'demo-user-002'
        },
        {
            id: "dept_002",
            name: "Department 2",
            description: "Department 2 description",
            created_by: 'demo-user-001',
            updated_by: 'demo-user-001',
            is_active: true,
            is_deleted: false,
            is_archived: false,
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
            head_of_department_id: 'demo-user-003'
        },
    ],
    courses: [
        {
            id: "course_001",
            name: "Course 1",
            description: "Course 1 description",
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
            teacher_id: 'demo-user-011'
        },
        {
            id: "course_002",
            name: "Course 2",
            description: "Course 2 description",
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
            teacher_id: 'demo-user-012'
        },
        {
            id: "course_003",
            name: "Course 3",
            description: "Course 3 description",
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
            teacher_id: 'demo-user-013'
        }
    ],
    user_statuses: [
        {
            id: 'status_001',
            name: 'Active',
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        },
        {
            id: 'status_002',
            name: 'Inactive',
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        },
        {
            id: 'status_003',
            name: 'Pending',
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20"),
        }
    ],
    admins: [
        {
            id: 'demo-user-002',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane.doe@demo.edu',
            country_code: 'lb',
            phone: '+96170200000',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_002',
            role_id: 'role_002',
            user_preference_id: 'pref_003',
            is_online: false,
            is_verified: true,
            last_login: new Date(),
            primary_address: '',
            secondary_address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            profile_image_id: 'demo-profile-002',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-001',
            updatedBy: ''
        },
        {
            id: 'demo-user-003',
            first_name: 'Sara',
            last_name: 'Miller',
            email: 'sara.miller@demo.edu',
            country_code: 'lb',
            phone: '+96170244444',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_003',
            role_id: 'role_002',
            user_preference_id: 'pref_003',
            is_online: true,
            is_verified: true,
            last_login: new Date(),
            primary_address: '',
            secondary_address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            profile_image_id: 'demo-profile-003',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-001',
            updatedBy: ''
        },
        {
            id: 'demo-user-004',
            first_name: 'Dana',
            last_name: 'Smith',
            email: 'dana.smith@demo.edu',
            country_code: 'lb',
            phone: '+96170255555',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_001',
            role_id: 'role_002',
            user_preference_id: 'pref_004',
            is_online: true,
            is_verified: true,
            last_login: new Date(),
            primary_address: '',
            secondary_address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            profile_image_id: '',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-001',
            updatedBy: ''
        }
    ],
    adminPreferences: [
        {
            id: 'pref_002',
            language: 'en',
            user_id: 'demo-user-002',
            timezone: 'Asia/Beirut',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_003',
            language: 'ar',
            user_id: 'demo-user-003',
            timezone: 'Asia/Beirut',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_004',
            language: 'en',
            user_id: 'demo-user-004',
            timezone: 'Europe/London',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        }
    ],
    adminProfileImages: [
        {
            id: 'demo-profile-002',
            user_id: 'demo-user-002',
            file_name: 'jane-doe-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/women/25.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-002',
            is_active: true
        },
        {
            id: 'demo-profile-003',
            user_id: 'demo-user-003',
            file_name: 'sara-miller-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/women/42.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-003',
            is_active: true
        }
    ],
    parents: [
        {
            id: 'demo-user-005',
            first_name: 'Michael',
            last_name: 'Johnson',
            email: 'michael.johnson@demo.edu',
            country_code: 'lb',
            phone: '+96170300000',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_001',
            role_id: 'role_005',
            user_preference_id: 'pref_005',
            is_online: false,
            is_verified: true,
            last_login: new Date('2024-12-15'),
            primary_address: '456 Parent Street',
            secondary_address: 'Apt 789',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-005',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-002',
            updatedBy: 'demo-user-002'
        },
        {
            id: 'demo-user-006',
            first_name: 'Sarah',
            last_name: 'Williams',
            email: 'sarah.williams@demo.edu',
            country_code: 'lb',
            phone: '+96170311111',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_001',
            role_id: 'role_005',
            user_preference_id: 'pref_006',
            is_online: true,
            is_verified: true,
            last_login: new Date(),
            primary_address: '789 Family Ave',
            secondary_address: 'Unit 101',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-006',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-003',
            updatedBy: 'demo-user-003'
        },
        {
            id: 'demo-user-007',
            first_name: 'David',
            last_name: 'Brown',
            email: 'david.brown@demo.edu',
            country_code: 'lb',
            phone: '+96170322222',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_002',
            role_id: 'role_005',
            user_preference_id: 'pref_007',
            is_online: false,
            is_verified: true,
            last_login: new Date('2024-12-10'),
            primary_address: '321 Parent Lane',
            secondary_address: 'Suite 202',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-007',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-004',
            updatedBy: 'demo-user-004'
        }
    ],
    students: [
        {
            id: 'demo-user-008',
            first_name: 'Emma',
            last_name: 'Johnson',
            email: 'emma.johnson@demo.edu',
            country_code: 'lb',
            phone: '+96170400000',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_001',
            role_id: 'role_004',
            user_preference_id: 'pref_008',
            is_online: true,
            is_verified: true,
            last_login: new Date(),
            primary_address: '456 Student Street',
            secondary_address: 'Dorm 101',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-008',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-002',
            updatedBy: 'demo-user-002'
        },
        {
            id: 'demo-user-009',
            first_name: 'Alex',
            last_name: 'Williams',
            email: 'alex.williams@demo.edu',
            country_code: 'lb',
            phone: '+96170411111',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_001',
            role_id: 'role_004',
            user_preference_id: 'pref_009',
            is_online: false,
            is_verified: true,
            last_login: new Date('2024-12-18'),
            primary_address: '789 Student Ave',
            secondary_address: 'Dorm 202',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-009',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-003',
            updatedBy: 'demo-user-003'
        },
        {
            id: 'demo-user-010',
            first_name: 'Sophia',
            last_name: 'Brown',
            email: 'sophia.brown@demo.edu',
            country_code: 'lb',
            phone: '+96170422222',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_003',
            role_id: 'role_004',
            user_preference_id: 'pref_010',
            is_online: true,
            is_verified: false,
            last_login: new Date(),
            primary_address: '321 Student Lane',
            secondary_address: 'Dorm 303',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-010',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-004',
            updatedBy: 'demo-user-004'
        }
    ],
    teachers: [
        {
            id: 'demo-user-011',
            first_name: 'Dr. Robert',
            last_name: 'Wilson',
            email: 'robert.wilson@demo.edu',
            country_code: 'lb',
            phone: '+96170500000',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_001',
            role_id: 'role_003',
            user_preference_id: 'pref_011',
            is_online: true,
            is_verified: true,
            last_login: new Date(),
            primary_address: '456 Teacher Street',
            secondary_address: 'Office 101',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-011',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-002',
            updatedBy: 'demo-user-002'
        },
        {
            id: 'demo-user-012',
            first_name: 'Prof. Lisa',
            last_name: 'Garcia',
            email: 'lisa.garcia@demo.edu',
            country_code: 'lb',
            phone: '+96170511111',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_001',
            role_id: 'role_003',
            user_preference_id: 'pref_012',
            is_online: false,
            is_verified: true,
            last_login: new Date('2024-12-16'),
            primary_address: '789 Teacher Ave',
            secondary_address: 'Office 202',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-012',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-003',
            updatedBy: 'demo-user-003'
        },
        {
            id: 'demo-user-013',
            first_name: 'Dr. James',
            last_name: 'Taylor',
            email: 'james.taylor@demo.edu',
            country_code: 'lb',
            phone: '+96170522222',
            password: 'hashed_password_here',
            subscriber_id: 'demo-subscriber-001',
            user_status_id: 'status_002',
            role_id: 'role_003',
            user_preference_id: 'pref_013',
            is_online: true,
            is_verified: true,
            last_login: new Date(),
            primary_address: '321 Teacher Lane',
            secondary_address: 'Office 303',
            city: 'Demo City',
            state: 'Demo State',
            zip: '12345',
            country: 'United States',
            profile_image_id: 'demo-profile-013',
            createdAt: new Date("2025-06-20"),
            updatedAt: new Date("2025-06-20"),
            createdBy: 'demo-user-004',
            updatedBy: 'demo-user-004'
        }
    ],
    parentPreferences: [
        {
            id: 'pref_005',
            language: 'en',
            user_id: 'demo-user-005',
            timezone: 'Asia/Beirut',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_006',
            language: 'en',
            user_id: 'demo-user-006',
            timezone: 'America/Chicago',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_007',
            language: 'ar',
            user_id: 'demo-user-007',
            timezone: 'Asia/Beirut',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        }
    ],
    studentPreferences: [
        {
            id: 'pref_008',
            language: 'en',
            user_id: 'demo-user-008',
            timezone: 'Asia/Beirut',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_009',
            language: 'en',
            user_id: 'demo-user-009',
            timezone: 'America/Los_Angeles',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_010',
            language: 'fr',
            user_id: 'demo-user-010',
            timezone: 'Europe/Paris',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        }
    ],
    teacherPreferences: [
        {
            id: 'pref_011',
            language: 'en',
            user_id: 'demo-user-011',
            timezone: 'Asia/Beirut',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_012',
            language: 'es',
            user_id: 'demo-user-012',
            timezone: 'America/Mexico_City',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        },
        {
            id: 'pref_013',
            language: 'en',
            user_id: 'demo-user-013',
            timezone: 'Europe/London',
            updatedAt: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01')
        }
    ],
    parentProfileImages: [
        {
            id: 'demo-profile-005',
            user_id: 'demo-user-005',
            file_name: 'michael-johnson-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/men/35.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-005',
            is_active: true
        },
        {
            id: 'demo-profile-006',
            user_id: 'demo-user-006',
            file_name: 'sarah-williams-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/women/55.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-006',
            is_active: true
        },
        {
            id: 'demo-profile-007',
            user_id: 'demo-user-007',
            file_name: 'david-brown-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/men/75.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-007',
            is_active: true
        }
    ],
    studentProfileImages: [
        {
            id: 'demo-profile-008',
            user_id: 'demo-user-008',
            file_name: 'emma-johnson-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/women/15.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-008',
            is_active: true
        },
        {
            id: 'demo-profile-009',
            user_id: 'demo-user-009',
            file_name: 'alex-williams-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/men/45.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-009',
            is_active: true
        },
        {
            id: 'demo-profile-010',
            user_id: 'demo-user-010',
            file_name: 'sophia-brown-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/women/85.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-010',
            is_active: true
        }
    ],
    teacherProfileImages: [
        {
            id: 'demo-profile-011',
            user_id: 'demo-user-011',
            file_name: 'robert-wilson-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/men/65.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-011',
            is_active: true
        },
        {
            id: 'demo-profile-012',
            user_id: 'demo-user-012',
            file_name: 'lisa-garcia-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/women/95.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-012',
            is_active: true
        },
        {
            id: 'demo-profile-013',
            user_id: 'demo-user-013',
            file_name: 'james-taylor-profile.jpg',
            file_type: 'image/jpeg',
            file_url: 'https://randomuser.me/api/portraits/men/85.jpg',
            uploaded_at: new Date(),
            uploaded_by: 'demo-user-013',
            is_active: true
        }
    ],
    parentDetails: [
        {
            id: 'parent-detail-001',
            user_id: 'demo-user-005', // Michael Johnson (Parent)
            student_id: 'demo-user-008', // Emma Johnson (Student)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'parent-detail-002',
            user_id: 'demo-user-006', // Sarah Williams (Parent)
            student_id: 'demo-user-009', // Alex Williams (Student)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'parent-detail-003',
            user_id: 'demo-user-007', // David Brown (Parent)
            student_id: 'demo-user-010', // Sophia Brown (Student)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'parent-detail-004',
            user_id: 'demo-user-005', // Michael Johnson (Parent) - has another child
            student_id: 'demo-user-009', // Alex Williams (Student) - step-child
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'parent-detail-005',
            user_id: 'demo-user-006', // Sarah Williams (Parent) - has another child
            student_id: 'demo-user-010', // Sophia Brown (Student) - step-child
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        }
    ],
    studentDetails: [
        {
            id: 'student-detail-001',
            user_id: 'demo-user-008', // Emma Johnson (Student)
            course_id: 'course_001', // Course 1 - taught by Dr. Robert Wilson
            parent_id: 'demo-user-005', // Michael Johnson (Parent)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'student-detail-002',
            user_id: 'demo-user-008', // Emma Johnson (Student) - taking multiple courses
            course_id: 'course_002', // Course 2 - taught by Prof. Lisa Garcia
            parent_id: 'demo-user-005', // Michael Johnson (Parent)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'student-detail-003',
            user_id: 'demo-user-009', // Alex Williams (Student)
            course_id: 'course_002', // Course 2 - taught by Prof. Lisa Garcia
            parent_id: 'demo-user-006', // Sarah Williams (Parent)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'student-detail-004',
            user_id: 'demo-user-009', // Alex Williams (Student) - taking multiple courses
            course_id: 'course_003', // Course 3 - taught by Dr. James Taylor
            parent_id: 'demo-user-006', // Sarah Williams (Parent)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'student-detail-005',
            user_id: 'demo-user-010', // Sophia Brown (Student)
            course_id: 'course_001', // Course 1 - taught by Dr. Robert Wilson
            parent_id: 'demo-user-007', // David Brown (Parent)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'student-detail-006',
            user_id: 'demo-user-010', // Sophia Brown (Student) - taking multiple courses
            course_id: 'course_003', // Course 3 - taught by Dr. James Taylor
            parent_id: 'demo-user-007', // David Brown (Parent)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        }
    ],
    teacherDetails: [
        {
            id: 'teacher-detail-001',
            user_id: 'demo-user-011', // Dr. Robert Wilson (Teacher)
            department_id: 'dept_001', // Department 1
            course_id: 'course_001', // Course 1
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'teacher-detail-002',
            user_id: 'demo-user-012', // Prof. Lisa Garcia (Teacher)
            department_id: 'dept_001', // Department 1
            course_id: 'course_002', // Course 2
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'teacher-detail-003',
            user_id: 'demo-user-013', // Dr. James Taylor (Teacher)
            department_id: 'dept_002', // Department 2
            course_id: 'course_003', // Course 3
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'teacher-detail-004',
            user_id: 'demo-user-011', // Dr. Robert Wilson (Teacher) - teaching multiple courses
            department_id: 'dept_001', // Department 1
            course_id: 'course_002', // Course 2 (additional course)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        },
        {
            id: 'teacher-detail-005',
            user_id: 'demo-user-012', // Prof. Lisa Garcia (Teacher) - teaching multiple courses
            department_id: 'dept_002', // Department 2 (cross-department)
            course_id: 'course_003', // Course 3 (additional course)
            created_at: new Date("2025-06-20"),
            updated_at: new Date("2025-06-20")
        }
    ]
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