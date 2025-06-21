import { useState, useEffect, useMemo, useRef } from 'react';
import SubscriberDashboardLayout from './SubscriberDashboardLayout';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";
import Select2 from '../../../components/Select2';
import { useUser } from '../../../contexts/UserContext';
import { translations } from '../../../translations';
import { useLanguage } from '../../../contexts/LanguageContext';
//import type { Language } from '../../../translations';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import AvatarModal from '../../../components/AvatarModal';

import {
    UserCircleIcon,
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
    CameraIcon,
    CheckIcon,
    KeyIcon,
    CalendarIcon,
    StarIcon,
    MapPinIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

const Account: React.FC = () => {
    const { subscriber, error, updateSubscriber } = useUser();
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage];
    const isRTL = currentLanguage === 'ar';

    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showCustomCountryInput, setShowCustomCountryInput] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [hasProfileImageChanged, setHasProfileImageChanged] = useState(false);
    const [isImageDeleted, setIsImageDeleted] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Add refs for smooth scrolling
    const profileSectionRef = useRef<HTMLDivElement>(null);
    const securitySectionRef = useRef<HTMLDivElement>(null);
    const addressSectionRef = useRef<HTMLDivElement>(null);

    // Form states
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '',
        phone: '',
        institution: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        customCountry: ''
    });

    // Separate data for personal and address info
    const [personalData, setPersonalData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        institution: '',
        countryCode: ''
    });

    const [addressData, setAddressData] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        customCountry: ''
    });

    // Original data for change detection
    const [originalPersonalData, setOriginalPersonalData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        institution: '',
        countryCode: ''
    });

    const [originalAddressData, setOriginalAddressData] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        customCountry: ''
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Validation states
    const [personalValidation, setPersonalValidation] = useState({
        firstName: { isValid: true, message: '' },
        lastName: { isValid: true, message: '' },
        email: { isValid: true, message: '' },
        phone: { isValid: true, message: '' }
    });

    const [addressValidation, setAddressValidation] = useState({
        address1: { isValid: true, message: '' },
        city: { isValid: true, message: '' },
        state: { isValid: true, message: '' },
        zip: { isValid: true, message: '' },
        country: { isValid: true, message: '' },
        customCountry: { isValid: true, message: '' }
    });

    // Country options from translations - memoized to prevent recreation
    const countryOptions = useMemo(() => [
        ...Object.entries(t.countries).map(([value, label], index) => ({
            value: index + 1,
            label,
            countryCode: value
        })),
        { value: 999, label: 'Other', countryCode: 'other' }
    ], [t.countries]);

    // Create a mapping for country codes to Select2 values
    const countryCodeToValue = useMemo(() => {
        const mapping: { [key: string]: number } = {};
        countryOptions.forEach((option) => {
            if (option.countryCode) {
                mapping[option.countryCode] = option.value;
            }
        });
        return mapping;
    }, [countryOptions]);

    // Create a mapping for Select2 values to country codes
    const valueToCountryCode = useMemo(() => {
        const mapping: { [key: number]: string } = {};
        countryOptions.forEach((option) => {
            if (option.countryCode) {
                mapping[option.value] = option.countryCode;
            }
        });
        return mapping;
    }, [countryOptions]);

    // Functions to check if data has changed
    const hasPersonalDataChanged = useMemo(() => {
        return (
            personalData.firstName !== originalPersonalData.firstName ||
            personalData.lastName !== originalPersonalData.lastName ||
            personalData.email !== originalPersonalData.email ||
            personalData.phone !== originalPersonalData.phone ||
            personalData.institution !== originalPersonalData.institution ||
            personalData.countryCode !== originalPersonalData.countryCode
        );
    }, [personalData, originalPersonalData]);

    const hasAddressDataChanged = useMemo(() => {
        return (
            addressData.address1 !== originalAddressData.address1 ||
            addressData.address2 !== originalAddressData.address2 ||
            addressData.city !== originalAddressData.city ||
            addressData.state !== originalAddressData.state ||
            addressData.zip !== originalAddressData.zip ||
            addressData.country !== originalAddressData.country ||
            addressData.customCountry !== originalAddressData.customCountry
        );
    }, [addressData, originalAddressData]);

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePersonalData = (): boolean => {
        const newValidation = {
            firstName: { isValid: true, message: '' },
            lastName: { isValid: true, message: '' },
            email: { isValid: true, message: '' },
            phone: { isValid: true, message: '' }
        };

        // Validate first name
        if (!personalData.firstName.trim()) {
            newValidation.firstName = { isValid: false, message: 'First name is required' };
        } else if (personalData.firstName.trim().length < 2) {
            newValidation.firstName = { isValid: false, message: 'First name must be at least 2 characters' };
        }

        // Validate last name
        if (!personalData.lastName.trim()) {
            newValidation.lastName = { isValid: false, message: 'Last name is required' };
        } else if (personalData.lastName.trim().length < 2) {
            newValidation.lastName = { isValid: false, message: 'Last name must be at least 2 characters' };
        }

        // Validate email
        if (!personalData.email.trim()) {
            newValidation.email = { isValid: false, message: 'Email is required' };
        } else if (!validateEmail(personalData.email.trim())) {
            newValidation.email = { isValid: false, message: 'Please enter a valid email address' };
        }

        // Validate phone
        if (!personalData.phone.trim()) {
            newValidation.phone = { isValid: false, message: 'Phone number is required' };
        }

        setPersonalValidation(newValidation);

        // Return true if all validations pass
        return Object.values(newValidation).every(validation => validation.isValid);
    };

    const validateAddressData = (): boolean => {
        const newValidation = {
            address1: { isValid: true, message: '' },
            city: { isValid: true, message: '' },
            state: { isValid: true, message: '' },
            zip: { isValid: true, message: '' },
            country: { isValid: true, message: '' },
            customCountry: { isValid: true, message: '' }
        };

        // Validate address line 1
        if (!addressData.address1.trim()) {
            newValidation.address1 = { isValid: false, message: 'Address line 1 is required' };
        }

        // Validate city
        if (!addressData.city.trim()) {
            newValidation.city = { isValid: false, message: 'City is required' };
        }

        // Validate state/province
        if (!addressData.state.trim()) {
            newValidation.state = { isValid: false, message: 'State/Province is required' };
        }

        // Validate ZIP/Postal code
        if (!addressData.zip.trim()) {
            newValidation.zip = { isValid: false, message: 'ZIP/Postal code is required' };
        }

        // Validate country
        if (!addressData.country) {
            newValidation.country = { isValid: false, message: 'Country is required' };
        }

        // Validate custom country if "other" is selected
        if (addressData.country === 'other' && !addressData.customCountry.trim()) {
            newValidation.customCountry = { isValid: false, message: 'Please enter your country' };
        }

        setAddressValidation(newValidation);

        // Return true if all validations pass
        return Object.values(newValidation).every(validation => validation.isValid);
    };

    // Debug logging
    useEffect(() => {
        console.log('Account component state:', {
            subscriber: subscriber,
            error: error,
            profileData: profileData
        });
    }, [subscriber, error, profileData]);

    // Add a flag to track if data has been initially loaded
    const [isInitialized, setIsInitialized] = useState(false);

    // Update profile data when subscriber data changes
    useEffect(() => {
        setIsScrolling(true);
        console.log('Account component - subscriber data changed:', subscriber);
        if (subscriber && !isInitialized) {
            const userCountry = subscriber.user?.country || 'lebanon'; // Default to Lebanon if no country
            console.log('User country from data:', userCountry);

            const newProfileData = {
                firstName: subscriber.user?.first_name || '',
                lastName: subscriber.user?.last_name || '',
                email: subscriber.user?.email || '',
                phone: subscriber.user?.phone || '',
                institution: subscriber.institution_name || '',
                address1: subscriber.user?.primary_address || '',
                address2: subscriber.user?.secondary_address || '',
                city: subscriber.user?.city || '',
                state: subscriber.user?.state || '',
                zip: subscriber.user?.zip || '',
                countryCode: subscriber.user?.country_code || '',
                country: userCountry,
                customCountry: ''
            };

            setProfileData(newProfileData);

            // Set separate personal data
            const newPersonalData = {
                firstName: subscriber.user?.first_name || '',
                lastName: subscriber.user?.last_name || '',
                email: subscriber.user?.email || '',
                phone: subscriber.user?.phone || '',
                institution: subscriber.institution_name || '',
                countryCode: subscriber.user?.country_code || ''
            };

            const newAddressData = {
                address1: subscriber.user?.primary_address || '',
                address2: subscriber.user?.secondary_address || '',
                city: subscriber.user?.city || '',
                state: subscriber.user?.state || '',
                zip: subscriber.user?.zip || '',
                country: userCountry,
                customCountry: ''
            };

            setPersonalData(newPersonalData);
            setAddressData(newAddressData);

            // Set original data for change detection
            setOriginalPersonalData(newPersonalData);
            setOriginalAddressData(newAddressData);

            // Check if the country exists in our options
            const countryExists = Object.keys(t.countries).includes(String(userCountry));
            console.log('Country exists in options:', countryExists, 'Available options:', Object.keys(t.countries));

            if (!countryExists && userCountry && String(userCountry) !== 'lebanon') {
                // If country doesn't exist in options, set it as custom
                const updatedAddressData = {
                    ...newAddressData,
                    country: 'other',
                    customCountry: userCountry
                };
                setProfileData(prev => ({
                    ...prev,
                    country: 'other',
                    customCountry: userCountry
                }));
                setAddressData(updatedAddressData);
                setOriginalAddressData(updatedAddressData);
                setShowCustomCountryInput(true);
            }

            // Mark as initialized to prevent future overwrites
            setIsInitialized(true);

            console.log('Account component - profile data updated:', {
                firstName: subscriber.user?.first_name || '',
                lastName: subscriber.user?.last_name || '',
                email: subscriber.user?.email || '',
                phone: subscriber.user?.phone || '',
                institution: subscriber.institution_name || '',
                address1: subscriber.user?.primary_address || '',
                address2: subscriber.user?.secondary_address || '',
                city: subscriber.user?.city || '',
                state: subscriber.user?.state || '',
                zip: subscriber.user?.zip || '',
                country: userCountry,
                customCountry: ''
            });
        }

        // Set loading to false when we have subscriber data or when there's an error
        if (subscriber || error) {
            setIsScrolling(false);
        }

    }, [subscriber, isInitialized, error]); // Added error to dependencies

    // Set up custom country input visibility based on saved data
    useEffect(() => {
        if (profileData.country === 'other') {
            setShowCustomCountryInput(true);
        }
    }, [profileData.country]);

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon, color: 'text-blue-500' },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon, color: 'text-red-500' },
        { id: 'address', name: 'Address', icon: MapPinIcon, color: 'text-green-500' },
    ];

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);

        // Smooth scroll to the appropriate section
        setTimeout(() => {
            switch (tabId) {
                case 'profile':
                    smoothScrollTo(profileSectionRef.current);
                    break;
                case 'security':
                    smoothScrollTo(securitySectionRef.current);
                    break;
                case 'address':
                    smoothScrollTo(addressSectionRef.current);
                    break;
            }
        }, 100);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
                setHasProfileImageChanged(true);
                setIsImageDeleted(false);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add function to handle image removal
    const handleRemoveImage = () => {
        setPreviewImage(null);
        setHasProfileImageChanged(true);
        setIsImageDeleted(true);
    };

    // Add function to handle canceling changes
    const handleCancelChanges = () => {
        setPreviewImage(null);
        setHasProfileImageChanged(false);
        setIsImageDeleted(false);
        setPersonalData(originalPersonalData);
        setAddressData(originalAddressData);
    };

    // Add function to handle avatar creation
    const handleCreateAvatar = () => {
        setIsAvatarModalOpen(true);
    };

    const handleAvatarSelected = (avatarUrl: string) => {
        setPreviewImage(avatarUrl);
        setHasProfileImageChanged(true);
        setIsImageDeleted(false);
        setIsAvatarModalOpen(false);
    };

    // Save personal information function
    const handleSavePersonal = async () => {
        // Validate data first
        if (!validatePersonalData()) {
            return;
        }

        // Show scroll loader
        setIsScrolling(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update the user context with new personal data
            if (subscriber) {
                const updatedSubscriber = {
                    ...subscriber,
                    user: {
                        ...subscriber.user!,
                        first_name: personalData.firstName,
                        last_name: personalData.lastName,
                        email: personalData.email,
                        phone: personalData.phone,
                        country_code: personalData.countryCode
                    },
                    institution_name: personalData.institution
                };

                // Handle profile image changes
                if (hasProfileImageChanged) {
                    if (isImageDeleted) {
                        // Remove profile image from context
                        updatedSubscriber.user!.profile_image_id = '';
                        updatedSubscriber.profileImage = undefined;
                    } else if (previewImage) {
                        // Add new profile image to context
                        const newImageId = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        updatedSubscriber.user!.profile_image_id = newImageId;
                        updatedSubscriber.profileImage = {
                            id: newImageId,
                            user_id: subscriber.id,
                            file_name: `profile-${Date.now()}.jpg`,
                            file_type: 'image/jpeg',
                            file_url: previewImage,
                            uploaded_at: new Date(),
                            uploaded_by: subscriber.id,
                            is_active: true
                        };
                    }
                }

                // Update the context
                updateSubscriber(updatedSubscriber);
            }

            // Update original data after successful save
            setOriginalPersonalData(personalData);

            // Clear profile image change flag and preview after successful save
            if (hasProfileImageChanged) {
                setHasProfileImageChanged(false);
                setPreviewImage(null);
                setIsImageDeleted(false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: 'There was an error saving your personal information. Please try again.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            // Hide scroll loader after a short delay
            setTimeout(() => setIsScrolling(false), 500);
        }
    };

    // Save address function
    const handleSaveAddress = async () => {
        // Validate data first
        if (!validateAddressData()) {
            return;
        }

        // Show scroll loader
        setIsScrolling(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update the user context with new address data
            if (subscriber) {
                const updatedSubscriber = {
                    ...subscriber,
                    user: {
                        ...subscriber.user!,
                        primary_address: addressData.address1,
                        secondary_address: addressData.address2,
                        city: addressData.city,
                        state: addressData.state,
                        zip: addressData.zip,
                        country: addressData.country === 'other' ? addressData.customCountry : addressData.country
                    }
                };

                // Update the context
                updateSubscriber(updatedSubscriber);
            }

            // Update original data after successful save
            setOriginalAddressData(addressData);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: 'There was an error saving your address. Please try again.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            // Hide scroll loader after a short delay
            setTimeout(() => setIsScrolling(false), 500);
        }
    };

    // Handle personal data changes
    const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonalData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error for this field when user starts typing
        if (personalValidation[name as keyof typeof personalValidation]?.isValid === false) {
            setPersonalValidation(prev => ({
                ...prev,
                [name]: { isValid: true, message: '' }
            }));
        }
    };

    // Handle address data changes
    const handleAddressDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error for this field when user starts typing
        if (addressValidation[name as keyof typeof addressValidation]?.isValid === false) {
            setAddressValidation(prev => ({
                ...prev,
                [name]: { isValid: true, message: '' }
            }));
        }
    };

    // Handle address country change
    const handleAddressCountryChange = (selectedValue: number) => {
        if (selectedValue === 999) {
            setShowCustomCountryInput(true);
            setAddressData(prev => ({ ...prev, country: 'other' }));
        } else {
            setShowCustomCountryInput(false);
            setAddressData(prev => ({ ...prev, country: valueToCountryCode[selectedValue] }));
        }

        // Clear validation error for country when user makes a selection
        if (addressValidation.country.isValid === false) {
            setAddressValidation(prev => ({
                ...prev,
                country: { isValid: true, message: '' }
            }));
        }
    };

    // Handle address custom country change
    const handleAddressCustomCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressData(prev => ({ ...prev, customCountry: e.target.value }));

        // Clear validation error for custom country when user starts typing
        if (addressValidation.customCountry.isValid === false) {
            setAddressValidation(prev => ({
                ...prev,
                customCountry: { isValid: true, message: '' }
            }));
        }
    };

    // Handle phone change for PhoneInput
    const handlePhoneChange = (value: string) => {
        setPersonalData(prev => ({
            ...prev,
            phone: value
        }));

        // Clear validation error for phone when user starts typing
        if (personalValidation.phone.isValid === false) {
            setPersonalValidation(prev => ({
                ...prev,
                phone: { isValid: true, message: '' }
            }));
        }
    };

    // Map country codes to PhoneInput country codes
    const getPhoneInputCountry = (countryCode: string): string => {
        const countryMap: { [key: string]: string } = {
            'us': 'us',
            'gb': 'gb',
            'ca': 'ca',
            'au': 'au',
            'de': 'de',
            'fr': 'fr',
            'it': 'it',
            'es': 'es',
            'nl': 'nl',
            'be': 'be',
            'ch': 'ch',
            'at': 'at',
            'se': 'se',
            'no': 'no',
            'dk': 'dk',
            'fi': 'fi',
            'pl': 'pl',
            'cz': 'cz',
            'hu': 'hu',
            'ro': 'ro',
            'bg': 'bg',
            'hr': 'hr',
            'si': 'si',
            'sk': 'sk',
            'ee': 'ee',
            'lv': 'lv',
            'lt': 'lt',
            'pt': 'pt',
            'ie': 'ie',
            'gr': 'gr',
            'cy': 'cy',
            'mt': 'mt',
            'lu': 'lu',
            'li': 'li',
            'mc': 'mc',
            'sm': 'sm',
            'va': 'va',
            'ad': 'ad',
            'and': 'ad',
            'al': 'al',
            'ba': 'ba',
            'me': 'me',
            'mk': 'mk',
            'rs': 'rs',
            'xk': 'xk',
            'ua': 'ua',
            'by': 'by',
            'md': 'md',
            'ru': 'ru',
            'kz': 'kz',
            'uz': 'uz',
            'kg': 'kg',
            'tj': 'tj',
            'tm': 'tm',
            'az': 'az',
            'ge': 'ge',
            'am': 'am',
            'tr': 'tr',
            'il': 'il',
            'jo': 'jo',
            'lb': 'lb',
            'sy': 'sy',
            'iq': 'iq',
            'ir': 'ir',
            'kw': 'kw',
            'sa': 'sa',
            'ye': 'ye',
            'om': 'om',
            'ae': 'ae',
            'qa': 'qa',
            'bh': 'bh',
            'eg': 'eg',
            'ly': 'ly',
            'tn': 'tn',
            'dz': 'dz',
            'ma': 'ma',
            'mr': 'mr',
            'ml': 'ml',
            'ne': 'ne',
            'td': 'td',
            'sd': 'sd',
            'er': 'er',
            'dj': 'dj',
            'so': 'so',
            'et': 'et',
            'ke': 'ke',
            'ug': 'ug',
            'tz': 'tz',
            'rw': 'rw',
            'bi': 'bi',
            'mw': 'mw',
            'zm': 'zm',
            'zw': 'zw',
            'bw': 'bw',
            'na': 'na',
            'sz': 'sz',
            'ls': 'ls',
            'za': 'za',
            'mg': 'mg',
            'mu': 'mu',
            'km': 'km',
            'sc': 'sc',
            'com': 'km',
            're': 're',
            'yt': 'yt',
            'mz': 'mz',
            'ao': 'ao',
            'cg': 'cg',
            'cd': 'cd',
            'ga': 'ga',
            'gq': 'gq',
            'cm': 'cm',
            'cf': 'cf',
            'st': 'st',
            'ng': 'ng',
            'gh': 'gh',
            'ci': 'ci',
            'bf': 'bf',
            'sn': 'sn',
            'gm': 'gm',
            'gn': 'gn',
            'gw': 'gw',
            'sl': 'sl',
            'lr': 'lr',
            'tg': 'tg',
            'bj': 'bj',
            'cv': 'cv'
        };

        return countryMap[countryCode.toLowerCase()] || 'us';
    };

    // Password strength checker
    const checkPasswordStrength = (password: string) => {
        let score = 0;
        const feedback: string[] = [];

        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('At least 8 characters');
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include lowercase letters');
        }

        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include uppercase letters');
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include numbers');
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include special characters');
        }

        if (password.length >= 12) {
            score += 1;
        }

        return { score, feedback, strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong' };
    };

    const getPasswordStrengthColor = (strength: string) => {
        switch (strength) {
            case 'weak': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'strong': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const getPasswordStrengthBg = (strength: string) => {
        switch (strength) {
            case 'weak': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'strong': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getPasswordStrengthWidth = (score: number) => {
        const percentage = Math.min((score / 6) * 100, 100);
        if (percentage <= 16) return 'w-[16%]';
        if (percentage <= 33) return 'w-[33%]';
        if (percentage <= 50) return 'w-[50%]';
        if (percentage <= 66) return 'w-[66%]';
        if (percentage <= 83) return 'w-[83%]';
        return 'w-full';
    };

    const passwordStrength = checkPasswordStrength(securityData.newPassword);

    // Add smooth scroll function with loading state
    const smoothScrollTo = (element: HTMLElement | null) => {
        if (element) {
            setIsScrolling(true);
            element.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => setIsScrolling(false), 1000);
        }
    };

    const handlePasswordChange = async () => {
        if (securityData.newPassword !== securityData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'New password and confirm password do not match.'
            });
            return;
        }

        // Show scroll loader
        setIsScrolling(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Note: In a real application, passwords should be handled securely
            // and typically not stored in the user context. This is just for demo purposes.
            if (subscriber) {
                const updatedSubscriber = {
                    ...subscriber,
                    user: {
                        ...subscriber.user!,
                        // In a real app, you would update a last_password_change timestamp
                        // or handle password changes through a separate secure endpoint
                        updatedAt: new Date()
                    }
                };

                // Update the context
                updateSubscriber(updatedSubscriber);
            }

            setSecurityData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Password Change Failed',
                text: 'There was an error changing your password. Please try again.'
            });
        } finally {
            // Hide scroll loader after a short delay
            setTimeout(() => setIsScrolling(false), 500);
        }
    };

    const renderProfileTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                {!isImageDeleted && previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : !isImageDeleted && subscriber?.profileImage?.file_url ? (
                                    <img src={subscriber.profileImage.file_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-2xl font-bold">
                                        {subscriber?.user?.first_name?.[0]}{subscriber?.user?.last_name?.[0]}
                                    </span>
                                )}
                            </div>
                            {/* New image indicator */}
                            {hasProfileImageChanged && (
                                <div className={`absolute -top-1 -right-1 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse ${isImageDeleted ? 'bg-red-500' : 'bg-blue-500'
                                    }`}>
                                    {isImageDeleted ? 'Deleted' : 'New'}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {subscriber?.user?.first_name} {subscriber?.user?.last_name}
                            </h2>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <CalendarIcon className="w-4 h-4 mr-1" />
                                    Member since {new Date(subscriber?.createdAt || '').toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                    <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                                    {subscriber?.roles?.find(role => role.id === subscriber?.user?.role_id)?.name || 'Unknown Role'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Image Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-image-upload"
                            aria-label="Upload profile image"
                        />
                        <label
                            htmlFor="profile-image-upload"
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-medium text-sm"
                        >
                            <CameraIcon className="w-4 h-4 mr-2" />
                            Change Photo
                        </label>
                    </div>
                    {(subscriber?.profileImage?.file_url || previewImage || isImageDeleted) && (
                        <button
                            onClick={handleRemoveImage}
                            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm focus:outline-none border-none"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove Photo
                        </button>
                    )}
                                        <button
                        onClick={handleCreateAvatar}
                        className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm focus:outline-none border-none"
                    >
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        Create Avatar
                    </button>
                </div>

                {/* Image Upload Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>Supported formats:</strong> JPG, PNG, GIF (Max 5MB)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <strong>Recommended size:</strong> 400x400 pixels or larger
                    </p>
                    {hasProfileImageChanged && (
                        <p className={`text-sm font-medium mt-2 ${isImageDeleted ? 'text-red-600' : 'text-blue-600'
                            }`}>
                            {isImageDeleted ? '🗑️ Profile image deleted - ready to save' : '📸 New profile image ready to save'}
                        </p>
                    )}
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={personalData.firstName}
                            onChange={handlePersonalDataChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${personalValidation.firstName.isValid
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            placeholder="Enter first name"
                        />
                        {!personalValidation.firstName.isValid && (
                            <p className="mt-1 text-sm text-red-600">{personalValidation.firstName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={personalData.lastName}
                            onChange={handlePersonalDataChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${personalValidation.lastName.isValid
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            placeholder="Enter last name"
                        />
                        {!personalValidation.lastName.isValid && (
                            <p className="mt-1 text-sm text-red-600">{personalValidation.lastName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={personalData.email}
                            onChange={handlePersonalDataChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${personalValidation.email.isValid
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            placeholder="Enter email address"
                        />
                        {!personalValidation.email.isValid && (
                            <p className="mt-1 text-sm text-red-600">{personalValidation.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <PhoneInput
                            country={getPhoneInputCountry(subscriber?.user?.country_code || 'us')}
                            value={personalData.phone}
                            onChange={handlePhoneChange}
                            inputClass={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 transition-all duration-300 ${personalValidation.phone.isValid
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            buttonClass={`${isRTL ? 'rounded-l-none' : 'rounded-r-none'} border-r-0`}
                            inputStyle={{
                                height: '38px',
                                width: '100%',
                                fontSize: '0.875rem',
                                borderRadius: '0.75rem !important',
                                borderColor: personalValidation.phone.isValid ? '#D1D5DB' : '#EF4444',
                                backgroundColor: 'white'
                            }}
                            buttonStyle={{
                                height: '38px',
                                borderTopRightRadius: '0.75rem',
                                borderBottomRightRadius: '0.75rem',
                                borderTopLeftRadius: '0',
                                borderBottomLeftRadius: '0',
                                borderColor: personalValidation.phone.isValid ? '#D1D5DB' : '#EF4444',
                                backgroundColor: 'white'
                            }}
                            containerClass={`${isRTL ? 'rtl-phone-input' : ''} focus-within:ring-2 transition-all duration-300 ${personalValidation.phone.isValid
                                ? 'focus-within:ring-blue-500 focus-within:border-blue-500'
                                : 'focus-within:ring-red-500 focus-within:border-red-500'
                                }`}
                            dropdownStyle={{
                                borderRadius: '0.75rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                zIndex: 50
                            }}
                            searchStyle={{
                                height: '36px',
                                fontSize: '0.875rem',
                                borderRadius: '0.5rem',
                                borderColor: '#D1D5DB'
                            }}
                            countryCodeEditable={true}
                            placeholder="Enter phone number"
                        />
                        {!personalValidation.phone.isValid && (
                            <p className="mt-1 text-sm text-red-600">{personalValidation.phone.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                        <input
                            type="text"
                            name="institution"
                            value={personalData.institution}
                            onChange={handlePersonalDataChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter institution name"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                    {(hasPersonalDataChanged || hasProfileImageChanged) && (
                        <button
                            onClick={handleCancelChanges}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSavePersonal}
                        disabled={!hasPersonalDataChanged && !hasProfileImageChanged}
                        className={`px-4 py-2 rounded-md transition-colors focus:outline-none ${(hasPersonalDataChanged || hasProfileImageChanged)
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-none'
                            }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderSecurityTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Password Security Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="text-lg font-semibold text-blue-900 mb-2">Password Security Tips</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                    <span>Use at least 8 characters</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                    <span>Mix uppercase and lowercase letters</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                    <span>Include numbers and symbols</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                                    <span>Avoid common words or phrases</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                                    <span>Don't use personal information</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                                    <span>Never share your password</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <KeyIcon className="w-5 h-5 mr-2 text-red-500" />
                    Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={securityData.currentPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none border-none bg-transparent"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none border-none bg-transparent"
                                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                            >
                                {showNewPassword ? (
                                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {securityData.newPassword && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                                    <span className={`text-sm font-semibold ${getPasswordStrengthColor(passwordStrength.strength)}`}>
                                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBg(passwordStrength.strength)} ${getPasswordStrengthWidth(passwordStrength.score)}`}
                                    ></div>
                                </div>

                                {/* Password Requirements */}
                                <div className="mt-3 space-y-1">
                                    {passwordStrength.feedback.map((requirement, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${passwordStrength.score >= index + 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className="text-xs text-gray-600">{requirement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 transition-colors ${securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : securityData.confirmPassword && securityData.newPassword === securityData.confirmPassword
                                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none border-none bg-transparent"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>

                        {/* Password Match Indicator */}
                        {securityData.confirmPassword && (
                            <div className="mt-2 flex items-center space-x-2">
                                {securityData.newPassword === securityData.confirmPassword ? (
                                    <>
                                        <CheckIcon className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-green-600">Passwords match</span>
                                    </>
                                ) : (
                                    <>
                                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                                        <span className="text-sm text-red-600">Passwords do not match</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Security Notes */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Security Recommendations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Change your password regularly (every 3-6 months)</li>
                        <li>• Use a unique password for each account</li>
                        <li>• Consider using a password manager for better security</li>
                        <li>• Enable two-factor authentication if available</li>
                        <li>• Never write down passwords or share them via email/text</li>
                    </ul>
                </div>

                <button
                    onClick={handlePasswordChange}
                    disabled={!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword || securityData.newPassword !== securityData.confirmPassword || passwordStrength.strength === 'weak'}
                    className={`mt-4 px-4 py-2 rounded-md transition-colors focus:outline-none border-none ${!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword || securityData.newPassword !== securityData.confirmPassword || passwordStrength.strength === 'weak'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                >
                    Change Password
                </button>
            </div>
        </motion.div>
    );

    const renderAddressTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MapPinIcon className="w-5 h-5 mr-2 text-green-500" />
                        Address Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={addressData.city}
                            onChange={handleAddressDataChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${addressValidation.city.isValid
                                ? 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            placeholder="Enter city"
                        />
                        {!addressValidation.city.isValid && (
                            <p className="mt-1 text-sm text-red-600">{addressValidation.city.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={addressData.state}
                            onChange={handleAddressDataChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${addressValidation.state.isValid
                                ? 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            placeholder="Enter state or province"
                        />
                        {!addressValidation.state.isValid && (
                            <p className="mt-1 text-sm text-red-600">{addressValidation.state.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="zip"
                            value={addressData.zip}
                            onChange={handleAddressDataChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${addressValidation.zip.isValid
                                ? 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            placeholder="Enter ZIP or postal code"
                        />
                        {!addressValidation.zip.isValid && (
                            <p className="mt-1 text-sm text-red-600">{addressValidation.zip.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <Select2
                            options={countryOptions}
                            value={countryCodeToValue[addressData.country] || undefined}
                            onChange={handleAddressCountryChange}
                            placeholder="Select your country"
                            isSearchable={true}
                            className=""
                        />
                        {!addressValidation.country.isValid && (
                            <p className="mt-1 text-sm text-red-600">{addressValidation.country.message}</p>
                        )}
                        {showCustomCountryInput && (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="customCountry"
                                    value={addressData.customCountry}
                                    onChange={handleAddressCustomCountryChange}
                                    placeholder="Enter your country"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${addressValidation.customCountry.isValid
                                        ? 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                        : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        }`}
                                />
                                {!addressValidation.customCountry.isValid && (
                                    <p className="mt-1 text-sm text-red-600">{addressValidation.customCountry.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address1"
                            value={addressData.address1}
                            onChange={handleAddressDataChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${addressValidation.address1.isValid
                                ? 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                }`}
                            placeholder="Enter primary address"
                        />
                        {!addressValidation.address1.isValid && (
                            <p className="mt-1 text-sm text-red-600">{addressValidation.address1.message}</p>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                        <input
                            type="text"
                            name="address2"
                            value={addressData.address2}
                            onChange={handleAddressDataChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="Enter secondary address (optional)"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                    {hasAddressDataChanged && (
                        <button
                            onClick={() => {
                                setAddressData(originalAddressData);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSaveAddress}
                        disabled={!hasAddressDataChanged}
                        className={`px-4 py-2 rounded-md transition-colors focus:outline-none border-none ${hasAddressDataChanged
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-none'
                            }`}
                    >
                        Save Address
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <SubscriberDashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your profile, security, and preferences</p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error loading account data</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    <nav className="flex relative">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex-1 flex items-center justify-center py-4 px-6 bg-transparent focus:outline-none font-medium text-sm transition-all duration-300 border-none relative group ${activeTab === tab.id
                                    ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform scale-105'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <tab.icon className={`w-5 h-5 transition-all duration-300 ${activeTab === tab.id
                                        ? 'text-white transform scale-110'
                                        : tab.color
                                        }`} />
                                    <span className="font-semibold">{tab.name}</span>
                                </div>

                                {/* Animated underline for active tab */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                {/* Hover effect for inactive tabs */}
                                {activeTab !== tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-200 transition-all duration-300" />
                                )}

                                {/* Glow effect for active tab */}
                                {activeTab === tab.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-sm" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[600px]">
                    {activeTab === 'profile' && (
                        <div ref={profileSectionRef}>
                            {renderProfileTab()}
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div ref={securitySectionRef}>
                            {renderSecurityTab()}
                        </div>
                    )}
                    {activeTab === 'address' && (
                        <div ref={addressSectionRef}>
                            {renderAddressTab()}
                        </div>
                    )}
                </div>
            </div>

            {/* Add loading overlay for smooth scrolling */}
            {isScrolling && (
                <div className="fixed inset-0 bg-black bg-opacity-10 z-40 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}

            <AvatarModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onSelect={handleAvatarSelected}
            />
        </SubscriberDashboardLayout>
    );
};

export default Account; 