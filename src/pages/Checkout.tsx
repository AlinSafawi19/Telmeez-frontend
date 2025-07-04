import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import Select from 'react-select';
import visa from "../assets/images/visa.png";
import mastercard from "../assets/images/mastercard.png";
import amex from "../assets/images/amex.png";
import logo from "../assets/images/logo.png";
import { FaHome, FaLock, FaCreditCard, FaMapMarkerAlt, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonLoader from '../components/ButtonLoader';
import '../Landing.css';

interface AccountInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    institutionName: string;
    password: string;
    confirmPassword: string;
}

interface BillingAddress {
    address: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    customCountry: string;
}

interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

interface AddOn {
    id: string;
    name: string;
    price: number;
    quantity: number;
    maxQuantity?: number;
}

interface Plan {
    _id: string;
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
}

type PayBy = 'card';

const Checkout: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const selectedPlan = searchParams.get('plan') || 'standard';
    const isAnnual = searchParams.get('billing') === 'annual';
    const t = translations[currentLanguage];
    const isRTL = currentLanguage === 'ar';
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [apiErrorKey, setApiErrorKey] = useState('');
    const [isUserAlreadyExists, setIsUserAlreadyExists] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Input refs for navigation
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const institutionNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const cardNumberRef = useRef<HTMLInputElement>(null);
    const expiryDateRef = useRef<HTMLInputElement>(null);
    const cvvRef = useRef<HTMLInputElement>(null);
    const billingCountryRef = useRef<HTMLInputElement>(null);
    const billingCustomCountryRef = useRef<HTMLInputElement>(null);
    const billingAddressRef = useRef<HTMLInputElement>(null);
    const billingAddress2Ref = useRef<HTMLInputElement>(null);
    const billingCityRef = useRef<HTMLInputElement>(null);
    const billingStateRef = useRef<HTMLInputElement>(null);
    const billingZipCodeRef = useRef<HTMLInputElement>(null);

    // Email verification state
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState('');

    // State for email verification celebration
    const [showEmailVerifiedCelebration, setShowEmailVerifiedCelebration] = useState(false);

    // Track if email is verified
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Add state to track if user has manually navigated back
    const [hasNavigatedBack, setHasNavigatedBack] = useState(false);

    // Add state to track when we're actually advancing to step 2
    const [isAdvancingToStep2, setIsAdvancingToStep2] = useState(false);

    // Add resend code functionality states
    const [resendTimer, setResendTimer] = useState(0);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [showTroubleshooting, setShowTroubleshooting] = useState(false);
    const [verificationAttempts, setVerificationAttempts] = useState(0);
    const [codeExpired, setCodeExpired] = useState(false);
    const [initialCodeSent, setInitialCodeSent] = useState(false);

    // Loading states
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isApplyingPromoCode, setIsApplyingPromoCode] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);

    // Function to handle Enter key navigation within current step
    const handleStepNavigation = (e: React.KeyboardEvent, nextInputRef: React.RefObject<HTMLInputElement | null> | null) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            // If there's a next input in the same step, focus it
            if (nextInputRef?.current) {
                nextInputRef.current.focus();
            } else {
                // If no next input in current step, move to next step
                handleNextStep();
            }
        }
    };

    // Fetch plans from backend on component mount
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('/api/checkout/plans', {
                    headers: {
                        'Accept-Language': currentLanguage
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setPlans(data.data);
                    // Plans data loaded successfully
                }
            } catch (error) {
                // Silently handle error without logging to console
            }
        };

        fetchPlans();
    }, [currentLanguage]);

    // Helper function to get plan ID
    const getPlanId = (planName: string): string => {
        const plan = plans.find(p => p.name.toLowerCase() === planName.toLowerCase());
        return plan?._id || '';
    };

    const countryOptions = [
        ...Object.entries(t.countries).map(([value, label]) => ({
            value,
            label
        })),
        { value: 'other', label: t.checkout.account_info.fields.other_country }
    ];

    // Add-ons configuration
    const addOnsConfig = {
        starter: {
            admin: { price: 1.5, maxQuantity: 10 },
            teacher: { price: 0.75, maxQuantity: 50 },
            student: { price: 0.10, maxQuantity: 500 },
            parent: { price: 0.05, maxQuantity: 250 },
            storage: { price: 5.0, maxQuantity: 50 } // $5 per 10GB
        },
        standard: {
            admin: { price: 1.5, maxQuantity: 20 },
            teacher: { price: 0.75, maxQuantity: 200 },
            student: { price: 0.10, maxQuantity: 2000 },
            parent: { price: 0.05, maxQuantity: 1000 },
            storage: { price: 5.0, maxQuantity: 100 } // $5 per 10GB
        }
    };

    // Initialize add-ons state
    const [addOns, setAddOns] = useState<AddOn[]>(() => {
        return getDefaultAddOns();
    });

    function getDefaultAddOns(): AddOn[] {
        if (selectedPlan === 'enterprise') return [];

        const config = addOnsConfig[selectedPlan as keyof typeof addOnsConfig];
        return [
            { id: 'admin', name: 'Admin', price: config.admin.price, quantity: 0, maxQuantity: config.admin.maxQuantity },
            { id: 'teacher', name: 'Teacher', price: config.teacher.price, quantity: 0, maxQuantity: config.teacher.maxQuantity },
            { id: 'student', name: 'Student', price: config.student.price, quantity: 0, maxQuantity: config.student.maxQuantity },
            { id: 'parent', name: 'Parent', price: config.parent.price, quantity: 0, maxQuantity: config.parent.maxQuantity },
            { id: 'storage', name: 'Storage', price: config.storage.price, quantity: 0, maxQuantity: config.storage.maxQuantity }
        ];
    }

    // Initialize all state with saved values if available
    const [currentStep, setCurrentStep] = useState(() => {
        return 1;
    });

    const [billingInfo, setBillingInfo] = useState<AccountInfo>(() => {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            institutionName: '',
            password: '',
            confirmPassword: '',
            country: 'lebanon',
            customCountry: ''
        };
    });

    const [billingAddress, setBillingAddress] = useState<BillingAddress>(() => {
        return {
            address: '',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'lebanon',
            customCountry: ''
        };
    });

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(() => {
        return {
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        };
    });

    const [showBillingCustomCountryInput, setShowBillingCustomCountryInput] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [promoErrorKey, setPromoErrorKey] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoCodeApplied, setPromoCodeApplied] = useState(false);
    const [payBy, setPayBy] = useState<PayBy>('card');
    const [detectedCardType, setDetectedCardType] = useState<string>('');
    const [isAddOnsExpanded, setIsAddOnsExpanded] = useState(() => {
        return false;
    });

    // Add state for recommendation visibility
    const [showStandardRecommendation, setShowStandardRecommendation] = useState(true);
    const [showEnterpriseRecommendation, setShowEnterpriseRecommendation] = useState(true);

    const [errors, setErrors] = useState<{
        billing?: Partial<Record<keyof AccountInfo, string>>;
        billingAddress?: Partial<Record<keyof BillingAddress, string>>;
        payment?: Partial<Record<keyof PaymentInfo, string>>;
    }>({});

    // Function to get translated error message from key
    const getTranslatedError = (errorKey: string): string => {
        if (!errorKey) return '';

        // Handle server errors
        if (errorKey.startsWith('server_')) {
            const serverErrorKey = errorKey.replace('server_', '');
            return (t.checkout.server_errors as any)[serverErrorKey] || errorKey;
        }

        // Handle validation errors
        return getErrorMessage(errorKey);
    };

    // Get translated error messages
    const apiError = getTranslatedError(apiErrorKey);
    const promoError = getTranslatedError(promoErrorKey);

    // Add-ons handlers
    const handleAddOnQuantityChange = (addOnId: string, newQuantity: number) => {
        setAddOns(prev => prev.map(addOn =>
            addOn.id === addOnId
                ? { ...addOn, quantity: Math.max(0, Math.min(newQuantity, addOn.maxQuantity || 999)) }
                : addOn
        ));
    };

    const getAddOnsTotal = () => {
        return addOns.reduce((total, addOn) => total + (addOn.price * addOn.quantity), 0);
    };

    const getAddOnsTotalFormatted = () => {
        const total = getAddOnsTotal();
        return `$${total.toFixed(2)}`;
    };

    const hasAddOns = () => {
        return addOns.some(addOn => addOn.quantity > 0);
    };

    // Card type detection functions
    const getCardTypeFromNumber = (cardNumber: string): string => {
        const cleanNumber = cardNumber.replace(/\s/g, '');

        // Visa: starts with 4
        if (cleanNumber.startsWith('4')) {
            return 'visa';
        }

        // Mastercard: starts with 5
        if (cleanNumber.startsWith('5')) {
            return 'mastercard';
        }

        // American Express: starts with 3, followed by 4 or 7
        if (cleanNumber.startsWith('3')) {
            const secondDigit = cleanNumber.charAt(1);
            if (secondDigit === '4' || secondDigit === '7') {
                return 'amex';
            }
        }

        return '';
    };


    const getCardNumberFormat = (cardType: string): string => {
        switch (cardType) {
            case 'amex':
                return 'XXXX XXXXXX XXXXX'; // 15 digits: 4-6-5 format
            case 'visa':
            case 'mastercard':
            default:
                return 'XXXX XXXX XXXX XXXX'; // 16 digits: 4-4-4-4 format
        }
    };

    const getCardNumberMaxLength = (cardType: string): number => {
        switch (cardType) {
            case 'amex':
                return 15;
            case 'visa':
            case 'mastercard':
            default:
                return 16;
        }
    };

    const getCVVMaxLength = (cardType: string): number => {
        switch (cardType) {
            case 'amex':
                return 4;
            case 'visa':
            case 'mastercard':
            default:
                return 3;
        }
    };

    const formatCardNumber = (value: string, cardType: string): string => {
        const digitsOnly = value.replace(/\D/g, '');

        if (cardType === 'amex') {
            // American Express format: XXXX XXXXXX XXXXX
            if (digitsOnly.length <= 4) {
                return digitsOnly;
            } else if (digitsOnly.length <= 10) {
                return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4)}`;
            } else {
                return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 10)} ${digitsOnly.slice(10, 15)}`;
            }
        } else {
            // Visa/Mastercard format: XXXX XXXX XXXX XXXX
            return digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
        }
    };

    // Clear detected card type when card number is cleared
    useEffect(() => {
        if (!paymentInfo.cardNumber.trim()) {
            setDetectedCardType('');
        }
    }, [paymentInfo.cardNumber]);

    // Auto-send verification code when reaching step 2, but only if not already verified
    useEffect(() => {
        if (currentStep === 2 && !isEmailVerified && !hasNavigatedBack && isAdvancingToStep2) {
            handleSendVerificationCode();
            setIsAdvancingToStep2(false); // Reset the flag after sending
        }
    }, [currentStep, isEmailVerified, hasNavigatedBack, isAdvancingToStep2]);

    // Function to send verification code
    const handleSendVerificationCode = async () => {
        try {
            setVerificationError('');
            setCodeExpired(false);
            setResendSuccess(false);

            const response = await fetch('/api/checkout/send-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLanguage
                },
                body: JSON.stringify({
                    email: billingInfo.email
                }),
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            const data = await response.json();

            if (!data.success) {
                if (data.message === 'User with this email already exists. Please use a different email or try signing in.') {
                    setIsUserAlreadyExists(true);
                    setCurrentStep(1);
                    return;
                }
                setVerificationError(data.message || 'Failed to send verification code');
            } else {
                // Start timer for resend functionality
                setResendTimer(60); // 60 seconds
                setInitialCodeSent(true);
                setVerificationAttempts(0);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                setVerificationError('Request timeout. Please try again.');
            } else {
                setVerificationError('Failed to send verification code. Please try again.');
            }
        } finally {
        }
    };

    // Function to resend verification code
    const handleResendCode = async () => {
        if (resendTimer > 0) return; // Prevent resend if timer is active

        try {
            setVerificationError('');
            setCodeExpired(false);
            setResendSuccess(false);

            const response = await fetch('/api/checkout/send-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLanguage
                },
                body: JSON.stringify({
                    email: billingInfo.email
                }),
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            const data = await response.json();

            if (data.success) {
                setResendTimer(60); // 60 seconds
                setResendSuccess(true);
                setVerificationAttempts(0);
                setVerificationCode(''); // Clear previous code
            } else {
                setVerificationError(data.message || 'Failed to resend verification code');
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                setVerificationError('Request timeout. Please try again.');
            } else {
                setVerificationError('Failed to resend verification code. Please try again.');
            }
        } finally {
        }
    };

    // Timer effect for resend functionality
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [resendTimer]);

    // Auto-expire code after 10 minutes
    useEffect(() => {
        if (currentStep === 2 && !isEmailVerified && !hasNavigatedBack) {
            const expireTimer = setTimeout(() => {
                setCodeExpired(true);
            }, 10 * 60 * 1000); // 10 minutes

            return () => clearTimeout(expireTimer);
        }
    }, [currentStep, isEmailVerified, hasNavigatedBack]);

    // Handler for the single verification code input
    const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setVerificationCode(value);
        if (verificationError) setVerificationError('');
    };

    const handleVerifyCode = async () => {
        try {
            setIsVerifyingCode(true);
            setVerificationError('');
            if (verificationCode.length !== 6) {
                setVerificationError(t.checkout.verify_email.please_enter_the_complete_6_digit_code);
                return;
            }

            if (codeExpired) {
                setVerificationError(t.checkout.verify_email.code_expired_description);
                return;
            }

            const response = await fetch('/api/checkout/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLanguage
                },
                body: JSON.stringify({
                    email: billingInfo.email,
                    code: verificationCode
                }),
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            const data = await response.json();

            if (data.success) {
                setIsEmailVerified(true);
                setShowEmailVerifiedCelebration(true);
                setCodeExpired(false);
                setResendTimer(0);
            } else {
                setVerificationAttempts(prev => prev + 1);
                setVerificationError(t.checkout.verify_email.invalid_verification_code);

                // Show troubleshooting after 3 failed attempts
                if (verificationAttempts >= 2) {
                    setShowTroubleshooting(true);
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                setVerificationError(t.checkout.verify_email.request_timeout);
            } else {
                setVerificationError(t.checkout.verify_email.failed_to_verify_code);
            }
        } finally {
            setIsVerifyingCode(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageChange = (langCode: Language) => {
        setTimeout(() => {
            setCurrentLanguage(langCode);
            const direction = getLanguageDirection(langCode);
            document.documentElement.dir = direction;
        }, 500);
        setIsLanguageDropdownOpen(false);
    };

    const getErrorMessage = (errorKey: string) => {
        switch (errorKey) {
            case 'required':
                return t.checkout.validation.required;
            case 'invalid_email':
                return t.checkout.validation.invalid_email;
            case 'password_length':
                return t.checkout.validation.password_length;
            case 'password_mismatch':
                return t.checkout.validation.password_mismatch;
            case 'first_name_length':
                return t.checkout.validation.first_name_length;
            case 'last_name_length':
                return t.checkout.validation.last_name_length;
            case 'invalid_phone':
                return t.checkout.validation.invalid_phone;
            case 'invalid_card':
                return t.checkout.validation.invalid_card;
            case 'invalid_expiry':
                return t.checkout.validation.invalid_expiry;
            case 'invalid_cvv':
                return t.checkout.validation.invalid_cvv;
            default:
                return errorKey;
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingInfo(prev => ({
            ...prev,
            phone: e.target.value
        }));
        // Clear error when user types
        if (errors.billing?.phone) {
            setErrors(prev => ({
                ...prev,
                billing: {
                    ...prev.billing,
                    phone: undefined
                }
            }));
        }
    };

    const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors.billing?.[name as keyof AccountInfo]) {
            setErrors(prev => ({
                ...prev,
                billing: {
                    ...prev.billing,
                    [name]: undefined
                }
            }));
        }
        // Clear API error when user starts typing
        if (apiErrorKey) {
            setApiErrorKey('');
        }
    };

    const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingAddress(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific error when user types in the corresponding field
        if (errors.billingAddress?.[name as keyof BillingAddress]) {
            setErrors(prev => ({
                ...prev,
                billingAddress: {
                    ...prev.billingAddress,
                    [name]: undefined
                }
            }));
        }

        // Clear API error when user starts typing
        if (apiErrorKey) {
            setApiErrorKey('');
        }
    };

    const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            // Remove all non-digit characters
            const digitsOnly = value.replace(/\D/g, '');

            // Detect card type
            const cardType = getCardTypeFromNumber(digitsOnly);
            setDetectedCardType(cardType);

            // Format based on card type
            formattedValue = formatCardNumber(digitsOnly, cardType);

            // Limit to max length for detected card type
            const maxLength = getCardNumberMaxLength(cardType);
            if (digitsOnly.length > maxLength) {
                formattedValue = formatCardNumber(digitsOnly.slice(0, maxLength), cardType);
            }
        } else if (name === 'expiryDate') {
            // Remove all non-digit characters
            const digitsOnly = value.replace(/\D/g, '');
            // Format as MM/YY
            if (digitsOnly.length > 0) {
                const month = digitsOnly.slice(0, 2);
                const year = digitsOnly.slice(2, 4);

                // Validate month (01-12)
                const monthNum = parseInt(month);
                if (monthNum > 12) {
                    formattedValue = '12';
                } else if (monthNum < 1 && month.length === 2) {
                    formattedValue = '01';
                } else {
                    formattedValue = month;
                }

                if (digitsOnly.length > 2) {
                    formattedValue += '/' + year;
                }
            }
        } else if (name === 'cvv') {
            // Only allow digits, max length depends on card type
            const maxLength = getCVVMaxLength(detectedCardType);
            formattedValue = value.replace(/\D/g, '').slice(0, maxLength);
        }

        setPaymentInfo(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // CVV instant validation
        if (name === 'cvv') {
            const maxLength = getCVVMaxLength(detectedCardType);
            const minLength = detectedCardType === 'amex' ? 4 : 3;
            if (!new RegExp(`^\\d{${minLength},${maxLength}}$`).test(formattedValue)) {
                setErrors(prev => ({
                    ...prev,
                    payment: {
                        ...prev.payment,
                        cvv: t.checkout.validation.invalid_cvv
                    }
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    payment: {
                        ...prev.payment,
                        cvv: undefined
                    }
                }));
            }
        } else if (errors.payment?.[name as keyof PaymentInfo]) {
            setErrors(prev => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    [name]: undefined
                }
            }));
        }

        // Clear API error when user starts typing
        if (apiErrorKey) {
            setApiErrorKey('');
        }
    };

    const validateCardNumber = (cardNumber: string): boolean => {
        // Remove spaces and non-digit characters
        const digitsOnly = cardNumber.replace(/\D/g, '');

        // Check if it's a valid length for the detected card type
        const cardType = getCardTypeFromNumber(digitsOnly);
        const expectedLength = getCardNumberMaxLength(cardType);

        // For unknown card types, allow 13-19 digits (standard range)
        if (!cardType) {
            if (digitsOnly.length < 13 || digitsOnly.length > 19) return false;
        } else {
            // For known card types, check exact length
            if (digitsOnly.length !== expectedLength) return false;
        }

        // Luhn algorithm for card number validation
        let sum = 0;
        let isEven = false;

        // Loop through values starting from the rightmost digit
        for (let i = digitsOnly.length - 1; i >= 0; i--) {
            let digit = parseInt(digitsOnly[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    const validateExpiryDate = (expiryDate: string): boolean => {
        // Check format MM/YY
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;

        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        // Check if month is valid (1-12)
        if (monthNum < 1 || monthNum > 12) return false;

        // Check if date is in the future
        if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
            return false;
        }

        return true;
    };

    const validatePhoneNumber = (phone: string): boolean => {
        // Remove all non-digit characters except + for international format
        const cleanPhone = phone.replace(/[^\d+]/g, '');

        // Check if it starts with + (international format)
        if (cleanPhone.startsWith('+')) {
            // International format: +[country code][number] (minimum 8 digits total)
            const digitsOnly = cleanPhone.substring(1).replace(/\D/g, '');
            return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        } else {
            // Local format: just digits (minimum 7 digits)
            const digitsOnly = cleanPhone.replace(/\D/g, '');
            return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        }
    };

    const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPromoCode(e.target.value);
        setPromoErrorKey('');
        setApiErrorKey('');
    };

    const handleApplyPromo = async () => {
        // Clear previous errors
        setPromoErrorKey('');
        setApiErrorKey('');

        // Validate promo code is not empty
        if (!promoCode.trim()) {
            setPromoErrorKey('server_promo_code_required');
            return;
        }

        // Validate email is provided (required for promo code validation)
        if (!billingInfo.email.trim()) {
            setPromoErrorKey('server_email_required_for_promo');
            return;
        }

        try {
            setIsApplyingPromoCode(true);
            const response = await fetch('/api/checkout/validate-promo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLanguage
                },
                body: JSON.stringify({
                    promoCode: promoCode.trim(),
                    email: billingInfo.email.trim(),
                    planId: getPlanId(selectedPlan),
                    billingCycle: isAnnual ? 'annual' : 'monthly',
                    addOns: addOns
                        .filter(addOn => addOn.quantity > 0)
                        .map(addOn => ({
                            type: addOn.id as 'admin' | 'teacher' | 'student' | 'parent' | 'storage',
                            quantity: addOn.quantity,
                            price: addOn.price
                        })),
                    totalAmount: getTotalPriceBeforePromo()
                }),
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            const data = await response.json();

            if (data.success) {
                // Apply the promo code
                setPromoCodeApplied(true);
                setDiscount(data.data.discount / 100); // Convert percentage to decimal
                setPromoErrorKey(''); // Clear any existing errors

                // Promo code applied successfully
            } else {
                // Handle different types of promo code errors
                if (data.message === 'Promo code is required') {
                    setPromoErrorKey('server_promo_code_required');
                } else if (data.message === 'Invalid or inactive promo code') {
                    setPromoErrorKey('server_invalid_promo_code');
                } else if (data.message === 'Promo code is not yet valid') {
                    setPromoErrorKey('server_promo_code_not_valid_yet');
                } else if (data.message === 'Promo code has expired') {
                    setPromoErrorKey('server_promo_code_expired');
                } else if (data.message === 'This promo code is only valid for first-time users') {
                    setPromoErrorKey('server_promo_code_first_time_only');
                } else if (data.message === 'Email is required to validate first-time user promo code') {
                    setPromoErrorKey('server_email_required_for_promo');
                } else if (data.message === 'An error occurred while validating promo code') {
                    setPromoErrorKey('server_validation_error');
                } else {
                    setPromoErrorKey('server_general_error');
                }
            }
        } catch (error: any) {

            if (error.name === 'AbortError') {
                setPromoErrorKey('server_timeout_error');
            } else {
                setPromoErrorKey('server_general_error');
            }
        } finally {
            setIsApplyingPromoCode(false);
        }
    };

    const handlePromoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApplyPromo();
        }
    };

    const handleNextStep = () => {
        // Validate current step before proceeding
        if (currentStep === 1) {
            const billingErrors: Partial<Record<keyof AccountInfo, string>> = {};

            // Required fields validation
            if (!billingInfo.firstName.trim()) {
                billingErrors.firstName = 'required';
            } else if (billingInfo.firstName.trim().length < 2) {
                billingErrors.firstName = 'first_name_length';
            }
            if (!billingInfo.lastName.trim()) {
                billingErrors.lastName = 'required';
            } else if (billingInfo.lastName.trim().length < 2) {
                billingErrors.lastName = 'last_name_length';
            }
            if (!billingInfo.email.trim()) {
                billingErrors.email = 'required';
            } else {
                // Email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(billingInfo.email)) {
                    billingErrors.email = 'invalid_email';
                }
            }
            if (!billingInfo.phone.trim()) {
                billingErrors.phone = 'required';
            } else if (!validatePhoneNumber(billingInfo.phone)) {
                billingErrors.phone = 'invalid_phone';
            }
            if (!billingInfo.password.trim()) {
                billingErrors.password = 'required';
            } else if (billingInfo.password.length < 8) {
                billingErrors.password = 'password_length';
            }
            if (!billingInfo.confirmPassword.trim()) {
                billingErrors.confirmPassword = 'required';
            } else if (billingInfo.password !== billingInfo.confirmPassword) {
                billingErrors.confirmPassword = 'password_mismatch';
            }

            if (Object.keys(billingErrors).length > 0) {
                setErrors(prev => ({
                    ...prev,
                    billing: billingErrors
                }));
                return;
            }
        } else if (currentStep === 2) {
            // Step 2 is email verification - require verification before proceeding
            if (!isEmailVerified) {
                setVerificationError(t.checkout.verify_email.please_verify_your_email_first);
                return;
            }
        } else if (currentStep === 3) {
            const paymentErrors: Partial<Record<keyof PaymentInfo, string>> = {};

            // Card number validation
            if (!paymentInfo.cardNumber.trim()) {
                paymentErrors.cardNumber = 'required';
            } else if (!validateCardNumber(paymentInfo.cardNumber)) {
                paymentErrors.cardNumber = 'invalid_card';
            }

            // Expiry date validation
            if (!paymentInfo.expiryDate.trim()) {
                paymentErrors.expiryDate = 'required';
            } else if (!validateExpiryDate(paymentInfo.expiryDate)) {
                paymentErrors.expiryDate = 'invalid_expiry';
            }

            // CVV validation
            if (!paymentInfo.cvv.trim()) {
                paymentErrors.cvv = 'required';
            } else {
                const cardType = getCardTypeFromNumber(paymentInfo.cardNumber);
                const minLength = cardType === 'amex' ? 4 : 3;
                const maxLength = getCVVMaxLength(cardType);
                if (!new RegExp(`^\\d{${minLength},${maxLength}}$`).test(paymentInfo.cvv)) {
                    paymentErrors.cvv = 'invalid_cvv';
                }
            }

            if (Object.keys(paymentErrors).length > 0) {
                setErrors(prev => ({
                    ...prev,
                    payment: paymentErrors
                }));
                return;
            }
        } else if (currentStep === 4) {
            const billingAddressErrors: Partial<Record<keyof BillingAddress, string>> = {};

            if (!billingAddress.address.trim()) {
                billingAddressErrors.address = t.checkout.validation.required;
            } else if (billingAddress.address.trim().length < 5) {
                billingAddressErrors.address = t.checkout.validation.address_length;
            }
            if (!billingAddress.city.trim()) {
                billingAddressErrors.city = t.checkout.validation.required;
            } else if (billingAddress.city.trim().length < 2) {
                billingAddressErrors.city = t.checkout.validation.city_length;
            }
            if (!billingAddress.state.trim()) {
                billingAddressErrors.state = t.checkout.validation.required;
            }
            if (!billingAddress.zipCode.trim()) {
                billingAddressErrors.zipCode = t.checkout.validation.required;
            } else if (billingAddress.zipCode.trim().length < 3) {
                billingAddressErrors.zipCode = t.checkout.validation.zip_code_length;
            }
            if (!billingAddress.country) {
                billingAddressErrors.country = t.checkout.validation.required;
            } else if (billingAddress.country === 'other' && !billingAddress.customCountry.trim()) {
                billingAddressErrors.customCountry = t.checkout.validation.required;
            }

            if (Object.keys(billingAddressErrors).length > 0) {
                setErrors(prev => ({
                    ...prev,
                    billingAddress: billingAddressErrors
                }));
                return;
            }

            // Clear any existing billing address errors since validation passed
            setErrors(prev => ({
                ...prev,
                billingAddress: undefined
            }));
        }

        if (currentStep < 4) {
            // Reset the hasNavigatedBack flag when manually advancing
            if (currentStep === 2) {
                setHasNavigatedBack(false);
            }

            // Set flag when advancing from step 1 to step 2
            if (currentStep === 1) {
                setIsAdvancingToStep2(true);
            }

            setCurrentStep(prev => {
                return prev + 1;
            });
            // Clear API error when moving to next step
            if (apiErrorKey) {
                setApiErrorKey('');
            }
        }
    };

    const handleStepSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep < 4) {
            handleNextStep();
        } else if (currentStep === 4) {
            // Call handleFinalCheckout when on step 4
            await handleFinalCheckout();
        }
    };

    const getPlanPrice = () => {
        const plan = t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans];
        const monthlyPrice = parseFloat(plan.monthly_price.replace(/[^0-9.-]+/g, ''));

        if (isAnnual) {
            // Show original annual price (no discount)
            const annualPrice = monthlyPrice * 12;
            return `$${annualPrice.toFixed(2)}`;
        } else {
            return `$${monthlyPrice.toFixed(2)}`;
        }
    };

    const getTotalSavings = () => {
        const plan = t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans];
        const monthlyPrice = parseFloat(plan.monthly_price.replace(/[^0-9.-]+/g, ''));
        let annualSavings = 0;
        let promoCodeSavings = 0;

        // Calculate base plan price (with annual discount if applicable)
        let basePlanPrice = 0;
        if (isAnnual) {
            // Calculate annual savings: full annual price - discounted annual price
            const fullAnnualPrice = monthlyPrice * 12; // $49 × 12 = $588
            const discountedAnnualPrice = monthlyPrice * 12 * 0.8; // $49 × 12 × 0.8 = $470.40
            annualSavings = fullAnnualPrice - discountedAnnualPrice; // $588 - $470.40 = $117.60
            basePlanPrice = discountedAnnualPrice;
        } else {
            basePlanPrice = monthlyPrice;
        }

        // Add add-ons cost to get total amount before promo code
        const addOnsCost = getAddOnsTotal();
        const totalAmountBeforePromo = basePlanPrice + addOnsCost;

        // Calculate promo code savings on the total amount (plan + add-ons) - now dynamic
        if (promoCodeApplied && discount > 0) {
            promoCodeSavings = totalAmountBeforePromo * discount;
        }

        return {
            annualSavings: annualSavings,
            promoCodeSavings: promoCodeSavings,
            totalSavings: annualSavings + promoCodeSavings
        };
    };

    const getTotalPriceBeforePromo = () => {
        const plan = t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans];
        const monthlyPrice = parseFloat(plan.monthly_price.replace(/[^0-9.-]+/g, ''));
        let finalPrice = 0;

        if (isAnnual) {
            // Calculate discounted annual price
            finalPrice = monthlyPrice * 12 * 0.8; // $49 × 12 × 0.8 = $470.40
        } else {
            finalPrice = monthlyPrice; // $49
        }

        // Add add-ons cost
        const addOnsCost = getAddOnsTotal();
        finalPrice += addOnsCost;

        return finalPrice;
    };

    const getTotalPrice = () => {
        const plan = t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans];
        const monthlyPrice = parseFloat(plan.monthly_price.replace(/[^0-9.-]+/g, ''));
        let finalPrice = 0;

        if (isAnnual) {
            // Calculate discounted annual price
            finalPrice = monthlyPrice * 12 * 0.8; // $49 × 12 × 0.8 = $470.40
        } else {
            finalPrice = monthlyPrice; // $49
        }

        // Add add-ons cost
        const addOnsCost = getAddOnsTotal();
        finalPrice += addOnsCost;

        // Apply promo code discount if exists - now dynamic
        if (promoCodeApplied && discount > 0) {
            finalPrice = finalPrice * (1 - discount);
        }

        return `$${finalPrice.toFixed(2)}`;
    };

    const handleFinalCheckout = async () => {
        // Validate billing address before proceeding
        const billingAddressErrors: Partial<Record<keyof BillingAddress, string>> = {};

        if (!billingAddress.address.trim()) {
            billingAddressErrors.address = t.checkout.validation.required;
        } else if (billingAddress.address.trim().length < 5) {
            billingAddressErrors.address = t.checkout.validation.address_length;
        }
        if (!billingAddress.city.trim()) {
            billingAddressErrors.city = t.checkout.validation.required;
        } else if (billingAddress.city.trim().length < 2) {
            billingAddressErrors.city = t.checkout.validation.city_length;
        }
        if (!billingAddress.state.trim()) {
            billingAddressErrors.state = t.checkout.validation.required;
        }
        if (!billingAddress.zipCode.trim()) {
            billingAddressErrors.zipCode = t.checkout.validation.required;
        } else if (billingAddress.zipCode.trim().length < 3) {
            billingAddressErrors.zipCode = t.checkout.validation.zip_code_length;
        }
        if (!billingAddress.country) {
            billingAddressErrors.country = t.checkout.validation.required;
        } else if (billingAddress.country === 'other' && !billingAddress.customCountry.trim()) {
            billingAddressErrors.customCountry = t.checkout.validation.required;
        }

        if (Object.keys(billingAddressErrors).length > 0) {
            setErrors(prev => ({
                ...prev,
                billingAddress: billingAddressErrors
            }));

            // Scroll to error message
            setTimeout(() => {
                const errorElement = document.getElementById('checkout-error');
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return;
        }

        try {
            setIsCheckingOut(true);
            setApiErrorKey('');

            const planId = getPlanId(selectedPlan);
            if (!planId) {
                return;
            }

            const totalAmountBeforePromo = getTotalPriceBeforePromo();

            const checkoutData = {
                firstName: billingInfo.firstName,
                lastName: billingInfo.lastName,
                email: billingInfo.email,
                phone: billingInfo.phone,
                institutionName: billingInfo.institutionName,
                password: billingInfo.password,
                billingAddress: {
                    address: billingAddress.address,
                    address2: billingAddress.address2,
                    city: billingAddress.city,
                    state: billingAddress.state,
                    zipCode: billingAddress.zipCode,
                    country: billingAddress.country,
                    customCountry: billingAddress.customCountry
                },
                paymentInfo: {
                    cardNumber: paymentInfo.cardNumber,
                    expiryDate: paymentInfo.expiryDate,
                    cvv: paymentInfo.cvv
                },
                planId: planId,
                billingCycle: isAnnual ? 'annual' : 'monthly',
                addOns: addOns
                    .filter(addOn => addOn.quantity > 0)
                    .map(addOn => ({
                        type: addOn.id as 'admin' | 'teacher' | 'student' | 'parent' | 'storage',
                        quantity: addOn.quantity,
                        price: addOn.price
                    })),
                totalAmount: totalAmountBeforePromo,
                promoCode: promoCodeApplied ? 'WELCOME10' : undefined,
                discount: promoCodeApplied ? discount * 100 : undefined,
                paymentMethod: payBy
            };

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLanguage
                },
                body: JSON.stringify(checkoutData),
                signal: AbortSignal.timeout(30000) // 30 second timeout
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to superadmin dashboard instead of success page
                navigate('/overview', {
                    state: {
                        user: data.data.user,
                        subscription: data.data.subscription
                    }
                });
            } else {
                // Handle different types of server errors
                // Removed unused errorMessage variable - using error keys directly

                // Check if this is a user already exists error
                if (data.message === 'User with this email already exists. Please use a different email or try signing in.') {
                    setIsUserAlreadyExists(true);
                    setApiErrorKey('');
                    return;
                }

                // Map backend error messages to translation keys for specific errors
                if (data.message === 'Missing required fields') {
                    setApiErrorKey('server_missing_required_fields');
                } else if (data.message === 'Invalid plan selected') {
                    setApiErrorKey('server_invalid_plan');
                } else if (data.message === 'An error occurred during checkout') {
                    setApiErrorKey('server_checkout_error');
                } else if (data.message === 'Promo code is required') {
                    setPromoErrorKey('server_promo_code_required');
                } else if (data.message === 'Invalid or inactive promo code') {
                    setPromoErrorKey('server_invalid_promo_code');
                } else if (data.message === 'Promo code is not yet valid') {
                    setPromoErrorKey('server_promo_code_not_valid_yet');
                } else if (data.message === 'Promo code has expired') {
                    setPromoErrorKey('server_promo_code_expired');
                } else if (data.message === 'This promo code is only valid for first-time users') {
                    setPromoErrorKey('server_promo_code_first_time_only');
                } else if (data.message === 'Email is required to validate first-time user promo code') {
                    setPromoErrorKey('server_email_required_for_promo');
                } else if (data.message === 'An error occurred while validating promo code') {
                    setPromoErrorKey('server_validation_error');
                } else if (data.message === 'An error occurred during checkout') {
                    setPromoErrorKey('server_general_error');
                } else if (data.message === 'Super Admin role not found in system') {
                    setApiErrorKey('server_super_admin_role_not_found');
                } else {
                    setPromoErrorKey('server_general_error');
                }

                // Handle validation errors from backend
                if (data.errors && Array.isArray(data.errors)) {
                    const validationErrors: {
                        billing?: Partial<Record<keyof AccountInfo, string>>;
                        billingAddress?: Partial<Record<keyof BillingAddress, string>>;
                        payment?: Partial<Record<keyof PaymentInfo, string>>;
                    } = {};

                    data.errors.forEach((error: string) => {
                        // Map backend validation errors to frontend field errors
                        if (error.includes('First name')) {
                            if (!validationErrors.billing) validationErrors.billing = {};
                            validationErrors.billing.firstName = 'required';
                        } else if (error.includes('Last name')) {
                            if (!validationErrors.billing) validationErrors.billing = {};
                            validationErrors.billing.lastName = 'required';
                        } else if (error.includes('Valid email') || error.includes('email')) {
                            if (!validationErrors.billing) validationErrors.billing = {};
                            validationErrors.billing.email = 'invalid_email';
                        } else if (error.includes('phone')) {
                            if (!validationErrors.billing) validationErrors.billing = {};
                            validationErrors.billing.phone = 'required';
                        } else if (error.includes('Password')) {
                            if (!validationErrors.billing) validationErrors.billing = {};
                            validationErrors.billing.password = 'password_length';
                        } else if (error.includes('Valid billing address') || error.includes('address')) {
                            if (!validationErrors.billingAddress) validationErrors.billingAddress = {};
                            validationErrors.billingAddress.address = t.checkout.validation.required;
                        } else if (error.includes('City')) {
                            if (!validationErrors.billingAddress) validationErrors.billingAddress = {};
                            validationErrors.billingAddress.city = t.checkout.validation.required;
                        } else if (error.includes('State')) {
                            if (!validationErrors.billingAddress) validationErrors.billingAddress = {};
                            validationErrors.billingAddress.state = t.checkout.validation.required;
                        } else if (error.includes('ZIP code') || error.includes('zip')) {
                            if (!validationErrors.billingAddress) validationErrors.billingAddress = {};
                            validationErrors.billingAddress.zipCode = t.checkout.validation.required;
                        } else if (error.includes('Country')) {
                            if (!validationErrors.billingAddress) validationErrors.billingAddress = {};
                            validationErrors.billingAddress.country = t.checkout.validation.required;
                        } else if (error.includes('card number')) {
                            if (!validationErrors.payment) validationErrors.payment = {};
                            validationErrors.payment.cardNumber = 'invalid_card';
                        } else if (error.includes('expiry date')) {
                            if (!validationErrors.payment) validationErrors.payment = {};
                            validationErrors.payment.expiryDate = 'invalid_expiry';
                        } else if (error.includes('CVV')) {
                            if (!validationErrors.payment) validationErrors.payment = {};
                            validationErrors.payment.cvv = 'invalid_cvv';
                        }
                    });

                    // Set the validation errors and navigate to the appropriate step
                    if (Object.keys(validationErrors).length > 0) {
                        setErrors(validationErrors);

                        // Navigate to the appropriate step based on which errors occurred
                        if (validationErrors.billing) {
                            setCurrentStep(1);
                        } else if (validationErrors.payment) {
                            setCurrentStep(3);
                        } else if (validationErrors.billingAddress) {
                            setCurrentStep(4);
                        }

                        // Scroll to error message
                        setTimeout(() => {
                            const errorElement = document.getElementById('checkout-error');
                            if (errorElement) {
                                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }, 100);
                        return;
                    }
                }

                // If we reach here, set a fallback error
                setApiErrorKey('server_general_error');

                // Scroll to error message
                setTimeout(() => {
                    const errorElement = document.getElementById('checkout-error');
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        } catch (error: any) {
            setApiErrorKey('server_general_error');

            // Scroll to error message
            setTimeout(() => {
                const errorElement = document.getElementById('checkout-error');
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleBackStep = () => {
        if (currentStep > 1) {
            // If going back from step 3 to step 2, set the flag to prevent auto-advance
            if (currentStep === 3) {
                setHasNavigatedBack(true);
            }
            setCurrentStep(prev => prev - 1);
            // Clear API error when going back
            if (apiErrorKey) {
                setApiErrorKey('');
            }
        }
    };

    // Calculate if Standard plan recommendation should be shown
    const shouldShowStandardRecommendation = () => {
        if (selectedPlan !== 'starter') return false;
        if (!showStandardRecommendation) return false;

        const starterBasePrice = 49; // $49/month
        const addOnsCost = getAddOnsTotal();
        const totalCost = starterBasePrice + addOnsCost;

        return totalCost >= 70; // Show recommendation when total reaches $70+
    };

    const getStandardUpgradeSavings = () => {
        const starterBasePrice = 49;
        const addOnsCost = getAddOnsTotal();
        const currentTotal = starterBasePrice + addOnsCost;
        const standardPrice = 99;

        return {
            currentTotal: currentTotal,
            standardPrice: standardPrice,
            priceDifference: standardPrice - currentTotal,
            percentageSavings: ((currentTotal - standardPrice) / currentTotal * 100).toFixed(0)
        };
    };

    const handleUpgradeToStandard = () => {
        // Clear add-ons since Standard plan includes more users by default
        setAddOns(getDefaultAddOns());

        // Collapse the add-ons section
        setIsAddOnsExpanded(false);

        // Navigate to checkout with Standard plan
        navigate(`/checkout?plan=standard&billing=${isAnnual ? 'annual' : 'monthly'}`);
    };

    // Calculate if Enterprise plan recommendation should be shown
    const shouldShowEnterpriseRecommendation = () => {
        if (selectedPlan !== 'standard') return false;
        if (!showEnterpriseRecommendation) return false;

        const standardBasePrice = 99; // $99/month
        const addOnsCost = getAddOnsTotal();
        const totalCost = standardBasePrice + addOnsCost;

        return totalCost >= 180; // Show recommendation when total reaches $180+
    };

    const getEnterpriseUpgradeSavings = () => {
        const standardBasePrice = 99;
        const addOnsCost = getAddOnsTotal();
        const currentTotal = standardBasePrice + addOnsCost;
        const enterprisePrice = 299;

        return {
            currentTotal: currentTotal,
            enterprisePrice: enterprisePrice,
            priceDifference: enterprisePrice - currentTotal,
            percentageSavings: ((currentTotal - enterprisePrice) / currentTotal * 100).toFixed(0)
        };
    };

    const handleUpgradeToEnterprise = () => {
        // Clear add-ons since Enterprise plan includes unlimited users
        setAddOns(getDefaultAddOns());

        // Collapse the add-ons section
        setIsAddOnsExpanded(false);

        // Navigate to checkout with Enterprise plan
        navigate(`/checkout?plan=enterprise&billing=${isAnnual ? 'annual' : 'monthly'}`);
    };

    const handlePayByChange = (payBy: PayBy) => {
        setPayBy(payBy);
    };

    const handleCountryChange = (selectedOption: any, isBillingAddress: boolean = false) => {
        if (selectedOption.value === 'other') {
            if (isBillingAddress) {
                setShowBillingCustomCountryInput(true);
                setBillingAddress(prev => ({ ...prev, country: 'other' }));
                // Clear country error when user selects a country
                if (errors.billingAddress?.country) {
                    setErrors(prev => ({
                        ...prev,
                        billingAddress: {
                            ...prev.billingAddress,
                            country: undefined
                        }
                    }));
                }
            } else {
                // For AccountInfo, just set the country to 'other' without showing custom input
                setBillingInfo(prev => ({ ...prev, country: 'other' }));
            }
        } else {
            if (isBillingAddress) {
                setShowBillingCustomCountryInput(false);
                setBillingAddress(prev => ({ ...prev, country: selectedOption.value }));
                // Clear country error when user selects a country
                if (errors.billingAddress?.country) {
                    setErrors(prev => ({
                        ...prev,
                        billingAddress: {
                            ...prev.billingAddress,
                            country: undefined
                        }
                    }));
                }
            } else {
                setBillingInfo(prev => ({ ...prev, country: selectedOption.value }));
            }
        }
    };

    const handleCustomCountryChange = (e: React.ChangeEvent<HTMLInputElement>, isBillingAddress: boolean = false) => {
        const value = e.target.value;
        if (isBillingAddress) {
            setBillingAddress(prev => ({ ...prev, customCountry: value }));
            // Clear custom country error when user types
            if (errors.billingAddress?.customCountry) {
                setErrors(prev => ({
                    ...prev,
                    billingAddress: {
                        ...prev.billingAddress,
                        customCountry: undefined
                    }
                }));
            }
        } else {
            setBillingInfo(prev => ({ ...prev, customCountry: value }));
        }
    };

    const handleSignIn = () => {
        // Navigate to sign in page with email pre-filled
        navigate('/signin', {
            state: {
                email: billingInfo.email
            }
        });
    };

    const handleTryAnotherEmail = () => {
        // Clear the user already exists error
        setIsUserAlreadyExists(false);
        setApiErrorKey('');

        // Go to step 1 and focus on email input
        setCurrentStep(1);

        // Clear the email field
        setBillingInfo(prev => ({
            ...prev,
            email: ''
        }));

        // Focus on email input after a short delay to ensure the step is rendered
        setTimeout(() => {
            if (emailRef.current) {
                emailRef.current.focus();
            }
        }, 100);
    };

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: '42px',
            height: '42px',
            borderRadius: '0.75rem',
            borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
            '&:hover': {
                borderColor: '#3B82F6'
            },
            backgroundColor: 'white',
            fontSize: '0.875rem',
            padding: '0.25rem 0.5rem'
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
            color: state.isSelected ? 'white' : '#1F2937',
            fontSize: '0.875rem',
            padding: '0.5rem 0.75rem',
            '&:hover': {
                backgroundColor: state.isSelected ? '#3B82F6' : '#EFF6FF'
            }
        }),
        menu: (base: any) => ({
            ...base,
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 50
        }),
        input: (base: any) => ({
            ...base,
            margin: 0,
            padding: 0,
            fontSize: '0.875rem'
        }),
        valueContainer: (base: any) => ({
            ...base,
            padding: 0,
            margin: 0
        }),
        singleValue: (base: any) => ({
            ...base,
            fontSize: '0.875rem',
            color: '#1F2937'
        }),
        placeholder: (base: any) => ({
            ...base,
            fontSize: '0.875rem',
            color: '#6B7280'
        })
    };

    useEffect(() => {
        if (isEmailVerified && currentStep === 2 && !hasNavigatedBack) {
            handleNextStep();
        }
    }, [isEmailVerified, currentStep, hasNavigatedBack]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 sm:gap-y-4 mb-8">
                    <Link to="/" className="transition-transform hover:scale-105 order-1">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="h-16 w-16 sm:h-20 sm:w-20"
                        />
                    </Link>
                    <div className="w-full sm:w-auto max-w-2xl text-center order-3 sm:order-none">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            {t.checkout.title}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {t.checkout.subtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 order-2 sm:order-none">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type='button'
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none force-white-bg"
                                aria-label="Select language"
                            >
                                <span className="font-medium">
                                    {LANGUAGES.find(lang => lang.code === currentLanguage)?.label}
                                </span>
                                <svg className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isLanguageDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            type='button'
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'bg-transparent'}`}
                                        >
                                            <span>{lang.label}</span>
                                            {currentLanguage === lang.code && (
                                                <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type='button'
                            onClick={() => navigate('/')}
                            className="group focus:outline-none flex items-center gap-2 px-3 sm:px-6 py-3 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50 force-white-bg"
                            aria-label="Back to home"
                        >
                            <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline text-sm font-medium">{t.header.back_to_home}</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleStepSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Progress Steps */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${currentStep >= 1
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <FaLock className="w-4 h-4" />
                                    </div>
                                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xs font-medium transition-colors duration-300 ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'
                                        } hidden sm:inline`}>{t.checkout.account_info.title}</span>
                                </div>
                                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                    }`}></div>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${currentStep >= 2
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xs font-medium transition-colors duration-300 ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'
                                        } hidden sm:inline`}>{t.checkout.verify_email.title}</span>
                                </div>
                                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${currentStep >= 3 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                    }`}></div>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${currentStep >= 3
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <FaCreditCard className="w-4 h-4" />
                                    </div>
                                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xs font-medium transition-colors duration-300 ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'
                                        } hidden sm:inline`}>{t.checkout.payment_details.title}</span>
                                </div>
                                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${currentStep >= 4 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                    }`}></div>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${currentStep >= 4
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <FaMapMarkerAlt className="w-4 h-4" />
                                    </div>
                                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xs font-medium transition-colors duration-300 ${currentStep >= 4 ? 'text-gray-900' : 'text-gray-400'
                                        } hidden sm:inline`}>{t.checkout.billing_address.title}</span>
                                </div>
                            </div>
                        </div>


                        {/* Global Error Display - Positioned at the top for better visibility */}
                        <AnimatePresence>
                            {apiError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    id="checkout-error"
                                    className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl shadow-lg overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-red-700 mb-4 leading-relaxed">
                                                    {apiError}
                                                </p>
                                                <div className="bg-red-50 border-none">
                                                    <p className="text-xs text-red-700 mb-2">
                                                        {t.checkout.validation.need_help}
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-2 text-xs">
                                                        <a
                                                            href="mailto:support@telmeez.com"
                                                            className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            <svg className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            contact@telmeezlb.com
                                                        </a>
                                                        <a
                                                            href="tel:+9611234567"
                                                            className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            <svg className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            +961 1 234 567
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setApiErrorKey('')}
                                                className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:shadow-lg hover:scale-110 active:scale-95 border border-red-200 hover:border-red-300"
                                                aria-label="Close error message"
                                            >
                                                <span className="text-red-700 text-lg font-bold transition-transform duration-300 hover:rotate-90">
                                                    <FaTimes />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* User Already Exists Error Display */}
                        <AnimatePresence>
                            {isUserAlreadyExists && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    id="user-exists-error"
                                    className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-xl shadow-lg overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-orange-900 mb-2">
                                                    {t.checkout.server_errors.user_already_exists}
                                                </h3>
                                                <p className="text-xs text-orange-700 mb-4">
                                                    {t.checkout.user_exists_actions.support_message}
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleSignIn}
                                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                                                    >
                                                        {t.checkout.user_exists_actions.sign_in}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleTryAnotherEmail}
                                                        className="flex-1 px-4 py-2 bg-white text-orange-700 border border-orange-300 rounded-lg text-sm font-semibold hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
                                                    >
                                                        {t.checkout.user_exists_actions.try_another_email}
                                                    </button>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-orange-200">
                                                    <p className="text-xs text-orange-600 mb-2">
                                                        {t.checkout.user_exists_actions.support_message}
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-2 text-xs">
                                                        <a
                                                            href="mailto:contact@telmeezlb.com"
                                                            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                                                        >
                                                            <svg className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            contact@telmeezlb.com
                                                        </a>
                                                        <a
                                                            href="tel:+9611234567"
                                                            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                                                        >
                                                            <svg className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            +961 1 234 567
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setIsUserAlreadyExists(false)}
                                                className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:shadow-lg hover:scale-110 active:scale-95 border border-orange-200 hover:border-orange-300"
                                                aria-label="Close error message"
                                            >
                                                <span className="text-orange-700 text-lg font-bold transition-transform duration-300 hover:rotate-90">
                                                    <FaTimes />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Show only current step content */}
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl shadow-lg p-6 mb-6"
                                >
                                    {/* Account Information Section */}
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-lg font-semibold text-gray-900">{t.checkout.account_info.title}</h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.first_name} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={billingInfo.firstName}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billing?.firstName ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={firstNameRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, lastNameRef)}
                                                />
                                                {errors.billing?.firstName && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billing.firstName)}</p>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.last_name}<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={billingInfo.lastName}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billing?.lastName ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={lastNameRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, emailRef)}
                                                />
                                                {errors.billing?.lastName && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billing.lastName)}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.email} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="email"
                                                    name="email"
                                                    value={billingInfo.email}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billing?.email ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={emailRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, phoneRef)}
                                                />
                                                {errors.billing?.email && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billing.email)}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {t.checkout.account_info.fields.email_verification_note}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label htmlFor="phone" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.phone} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    name="phone"
                                                    value={billingInfo.phone}
                                                    onChange={handlePhoneChange}
                                                    placeholder="+961 70 123 456"
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billing?.phone ? 'border-red-500' : 'border-gray-300'}`}
                                                    ref={phoneRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, institutionNameRef)}
                                                />

                                                {errors.billing?.phone && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billing.phone)}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="institutionName" className="block text-xs font-medium text-gray-700">
                                                {t.checkout.account_info.fields.institution}
                                            </label>
                                            <input
                                                type="text"
                                                id="institutionName"
                                                name="institutionName"
                                                value={billingInfo.institutionName}
                                                onChange={handleBillingInfoChange}
                                                className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billing?.institutionName ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                ref={institutionNameRef}
                                                onKeyDown={(e) => handleStepNavigation(e, passwordRef)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.password} <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        name="password"
                                                        value={billingInfo.password}
                                                        onChange={handleBillingInfoChange}
                                                        className={`focus:outline-none w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billing?.password ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder={t.checkout.account_info.fields.password_placeholder}
                                                        ref={passwordRef}
                                                        onKeyDown={(e) => handleStepNavigation(e, confirmPasswordRef)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none bg-transparent border-none"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? (
                                                            <FaEyeSlash className="w-4 h-4" />
                                                        ) : (
                                                            <FaEye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.billing?.password && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billing.password)}</p>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.confirmpass} <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        value={billingInfo.confirmPassword}
                                                        onChange={handleBillingInfoChange}
                                                        className={`focus:outline-none w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billing?.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder={t.checkout.account_info.fields.password_confirm_placeholder}
                                                        ref={confirmPasswordRef}
                                                        onKeyDown={(e) => handleStepNavigation(e, cardNumberRef)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none bg-transparent border-none"
                                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <FaEyeSlash className="w-4 h-4" />
                                                        ) : (
                                                            <FaEye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.billing?.confirmPassword && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billing.confirmPassword)}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Login Credentials Note */}
                                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                                            <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900 mb-1">
                                                        {t.checkout.account_info.fields.login_credentials_title}
                                                    </p>
                                                    <p className="text-xs text-blue-700">
                                                        {t.checkout.account_info.fields.login_credentials_note}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl shadow-lg p-6 mb-6"
                                >
                                    {/* Email Verification Section */}
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-lg font-semibold text-gray-900">{t.checkout.verify_email.section_title}</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            <div className="text-center">
                                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {t.checkout.verify_email.section_subtitle}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {t.checkout.verify_email.description}
                                                </p>

                                                {/* Email Display */}
                                                <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                                                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-blue-900">{billingInfo.email}</span>
                                                </div>
                                            </div>

                                            <div className="max-w-md mx-auto space-y-4">
                                                {showEmailVerifiedCelebration ? (
                                                    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-xl shadow-xl relative z-20">
                                                        {/* Confetti animation placeholder (replace with Confetti component if available) */}
                                                        <div className="absolute inset-0 pointer-events-none z-10">
                                                            {/* You can use a confetti library here, or a simple SVG effect */}
                                                            <svg width="100%" height="100%" viewBox="0 0 400 200" className="w-full h-full">
                                                                <circle cx="50" cy="50" r="6" fill="#34d399" />
                                                                <circle cx="120" cy="80" r="5" fill="#fbbf24" />
                                                                <circle cx="200" cy="40" r="7" fill="#60a5fa" />
                                                                <circle cx="300" cy="100" r="6" fill="#f472b6" />
                                                                <circle cx="350" cy="60" r="5" fill="#f87171" />
                                                                <circle cx="180" cy="120" r="4" fill="#a78bfa" />
                                                            </svg>
                                                        </div>
                                                        {/* Success SVG */}
                                                        <svg className="w-20 h-20 text-green-500 z-20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#d1fae5" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" stroke="#10b981" />
                                                        </svg>
                                                        <h3 className="text-2xl font-bold text-green-700 z-20">{t.checkout.verify_email.email_verified}</h3>
                                                        <p className="text-md text-green-600 z-20">{t.checkout.verify_email.email_verified_description}</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {/* Code Input */}
                                                        <div className="space-y-2">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <input
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    pattern="[0-9]*"
                                                                    maxLength={6}
                                                                    value={verificationCode}
                                                                    onChange={handleVerificationCodeChange}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            handleVerifyCode();
                                                                        }
                                                                    }}
                                                                    className={`w-48 h-12 text-center text-lg font-bold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${verificationError ? 'border-red-500 bg-red-50' : codeExpired ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'} force-white-bg`}
                                                                    placeholder="Enter 6-digit code"
                                                                    aria-label="Verification code"
                                                                    disabled={codeExpired}
                                                                />
                                                                <ButtonLoader
                                                                    type="button"
                                                                    onClick={handleVerifyCode}
                                                                    disabled={verificationCode.length !== 6 || codeExpired}
                                                                    isLoading={isVerifyingCode}
                                                                    className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {t.checkout.verify_email.verify_code}
                                                                </ButtonLoader>
                                                            </div>
                                                        </div>

                                                        {/* Resend Code Section */}
                                                        <div className="text-center space-y-3">
                                                            <div className="text-sm text-gray-600 min-h-[32px] flex items-center justify-center">
                                                                {resendTimer > 0 ? (
                                                                    <span className="text-gray-600">
                                                                        {t.checkout.verify_email.resend_available_in} <span className="text-blue-600 font-bold">{resendTimer} {t.checkout.verify_email.seconds}</span>
                                                                    </span>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-gray-600">
                                                                            {t.checkout.verify_email.didnt_receive_title}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={handleResendCode}
                                                                            disabled={resendTimer > 0}
                                                                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none transition-colors p-0 m-0 border-none bg-transparent"
                                                                        >
                                                                            {t.checkout.verify_email.resend_code}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {resendSuccess && initialCodeSent && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 shadow-sm"
                                                                >
                                                                    <div className="flex items-center justify-center">
                                                                        <div className="flex-shrink-0">
                                                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <p className="text-sm font-medium text-green-800">
                                                                                {t.checkout.verify_email.new_code_sent}
                                                                            </p>
                                                                            <p className="text-xs text-green-600">
                                                                                {t.checkout.verify_email.check_email_inbox}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>

                                                        {/* Error Messages */}
                                                        {verificationError && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3"
                                                            >
                                                                {verificationError}
                                                            </motion.div>
                                                        )}

                                                        {/* Code Expired Message */}
                                                        {codeExpired && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-sm text-orange-600 text-center bg-orange-50 border border-orange-200 rounded-lg p-3"
                                                            >
                                                                <div className="flex items-center justify-center mb-2">
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    {t.checkout.verify_email.code_expired}
                                                                </div>
                                                                <p>{t.checkout.verify_email.code_expired_description}</p>
                                                            </motion.div>
                                                        )}

                                                        {/* Troubleshooting Section */}
                                                        {showTroubleshooting ? (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                                                            >
                                                                <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                                                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    {t.checkout.verify_email.need_help}
                                                                </h4>

                                                                <div className="space-y-2 text-sm text-gray-700">
                                                                    <div className="flex items-start">
                                                                        <span className="text-blue-600 font-medium mr-2">1.</span>
                                                                        <span>{t.checkout.verify_email.help_text}</span>
                                                                    </div>
                                                                    <div className="flex items-start">
                                                                        <span className="text-blue-600 font-medium mr-2">2.</span>
                                                                        <span>{t.checkout.verify_email.help_text_2}</span>
                                                                    </div>
                                                                    <div className="flex items-start">
                                                                        <span className="text-blue-600 font-medium mr-2">3.</span>
                                                                        <span>{t.checkout.verify_email.help_text_3}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="pt-3 border-t border-gray-200">
                                                                    <p className="text-xs text-gray-600 mb-2">
                                                                        {t.checkout.verify_email.still_having_issues}
                                                                    </p>
                                                                    <div className="flex flex-col sm:flex-row gap-2 text-xs">
                                                                        <a
                                                                            href="mailto:contact@telmeezlb.com"
                                                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                                                                        >
                                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                            </svg>
                                                                            contact@telmeezlb.com
                                                                        </a>
                                                                        <a
                                                                            href="tel:+9611234567"
                                                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                                                                        >
                                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                            </svg>
                                                                            +961 1 234 567
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ) : (
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                <div className="flex items-start">
                                                                    <div className="flex-shrink-0">
                                                                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                                                                            {t.checkout.verify_email.need_help}
                                                                        </h4>
                                                                        <p className="text-xs text-blue-700 mb-2">
                                                                            {t.checkout.verify_email.help_text_2}
                                                                        </p>
                                                                        <div className="flex flex-col sm:flex-row gap-2 text-xs">
                                                                            <a
                                                                                href="mailto:contact@telmeezlb.com"
                                                                                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                                                                            >
                                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                                </svg>
                                                                                contact@telmeezlb.com
                                                                            </a>
                                                                            <a
                                                                                href="tel:+9611234567"
                                                                                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                                                                            >
                                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                                </svg>
                                                                                +961 1 234 567
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl shadow-lg p-6 mb-6"
                                >
                                    {/* Billing Address Section */}
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-lg font-semibold text-gray-900">{t.checkout.billing_address.title}</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="billingCountry" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.country} <span className="text-red-500">*</span>
                                                </label>
                                                <Select
                                                    id="billingCountry"
                                                    value={countryOptions.find(option => option.value === billingAddress.country)}
                                                    onChange={(option) => handleCountryChange(option, true)}
                                                    options={countryOptions}
                                                    styles={customSelectStyles}
                                                    placeholder={t.checkout.account_info.fields.select_country}
                                                    isSearchable
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                />
                                                {showBillingCustomCountryInput && (
                                                    <input
                                                        type="text"
                                                        id="billingCustomCountry"
                                                        name="customCountry"
                                                        value={billingAddress.customCountry}
                                                        onChange={(e) => handleCustomCountryChange(e, true)}
                                                        placeholder={t.checkout.account_info.fields.enter_country || "Enter your country"}
                                                        className={`mt-2 focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.billingAddress?.customCountry ? 'border-red-500' : 'border-gray-300'}`}
                                                        ref={billingCustomCountryRef}
                                                        onKeyDown={(e) => handleStepNavigation(e, billingAddressRef)}
                                                    />
                                                )}
                                                {errors.billingAddress?.country && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billingAddress.country)}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label htmlFor="billingAddress" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.address1}  <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="billingAddress"
                                                    name="address"
                                                    value={billingAddress.address}
                                                    onChange={handleBillingAddressChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 force-white-bg ${errors.billingAddress?.address ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={billingAddressRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, billingAddress2Ref)}
                                                />
                                                {errors.billingAddress?.address && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billingAddress.address)}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label htmlFor="billingAddress2" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.address2}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="billingAddress2"
                                                    name="address2"
                                                    value={billingAddress.address2}
                                                    onChange={handleBillingAddressChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 force-white-bg ${errors.billingAddress?.address2 ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={billingAddress2Ref}
                                                    onKeyDown={(e) => handleStepNavigation(e, billingCityRef)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="billingCity" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.city}  <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="billingCity"
                                                    name="city"
                                                    value={billingAddress.city}
                                                    onChange={handleBillingAddressChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 force-white-bg ${errors.billingAddress?.city ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={billingCityRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, billingStateRef)}
                                                />
                                                {errors.billingAddress?.city && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billingAddress.city)}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="billingState" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.state}  <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="billingState"
                                                    name="state"
                                                    value={billingAddress.state}
                                                    onChange={handleBillingAddressChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 force-white-bg ${errors.billingAddress?.state ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={billingStateRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, billingZipCodeRef)}
                                                />
                                                {errors.billingAddress?.state && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billingAddress.state)}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="billingZipCode" className="block text-xs font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.zip}  <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="billingZipCode"
                                                    name="zipCode"
                                                    value={billingAddress.zipCode}
                                                    onChange={handleBillingAddressChange}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 force-white-bg ${errors.billingAddress?.zipCode ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    ref={billingZipCodeRef}
                                                    onKeyDown={(e) => handleStepNavigation(e, null)}
                                                />
                                                {errors.billingAddress?.zipCode && (
                                                    <p className="text-xs text-red-600">{getErrorMessage(errors.billingAddress.zipCode)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl shadow-lg p-6 mb-6"
                                >
                                    {/* Payment Information Section */}
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-lg font-semibold text-gray-900"> {t.checkout.payment_details.section_title}</h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {/* Payment Method Selection */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-medium text-gray-900">{t.checkout.payment_details.section_subtitle}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handlePayByChange('card')}
                                                    className={`focus:outline-none p-4 rounded-xl border-2 transition-all duration-300 ${payBy === 'card'
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-200'
                                                        }`}
                                                >
                                                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                                        <div className={`p-2 rounded-full ${payBy === 'card' ? 'bg-blue-600' : 'bg-gray-100'
                                                            }`}>
                                                            <FaCreditCard className={`w-6 h-6 ${payBy === 'card' ? 'text-white' : 'text-gray-600'
                                                                }`} />
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="font-medium text-gray-900">{t.checkout.payment_details.payment_types.card.name}</h4>
                                                            <p className="text-xs text-gray-500">{t.checkout.payment_details.payment_types.card.desc}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {payBy === 'card' ? (
                                            <>
                                                <div className={`flex items-center justify-center sm:justify-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} mb-6`}>
                                                    <img src={visa} alt="Visa" className="h-8 transition-transform hover:scale-110" />
                                                    <img src={mastercard} alt="Mastercard" className="h-8 transition-transform hover:scale-110" />
                                                    <img src={amex} alt="Amex" className="h-8 transition-transform hover:scale-110" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor="cardNumber" className="block text-xs font-medium text-gray-700">
                                                        {t.checkout.payment_details.payment_types.card.card_nb} <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            id="cardNumber"
                                                            name="cardNumber"
                                                            value={paymentInfo.cardNumber}
                                                            onChange={handlePaymentInfoChange}
                                                            placeholder={detectedCardType ? getCardNumberFormat(detectedCardType) : "1234 5678 9012 3456"}
                                                            dir="ltr"
                                                            className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.payment?.cardNumber ? 'border-red-500' : 'border-gray-300'} ${isRTL ? 'text-right' : ''}`}
                                                            ref={cardNumberRef}
                                                            onKeyDown={(e) => handleStepNavigation(e, expiryDateRef)}
                                                        />
                                                        {detectedCardType && (
                                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                                                                    <span className="text-white font-bold text-xs">
                                                                        {detectedCardType === 'visa' ? 'VISA' :
                                                                            detectedCardType === 'mastercard' ? 'MC' :
                                                                                detectedCardType === 'amex' ? 'AMEX' : 'CARD'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {errors.payment?.cardNumber && (
                                                        <p className="text-xs text-red-600">{getErrorMessage(errors.payment.cardNumber || '')}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="expiryDate" className="block text-xs font-medium text-gray-700">
                                                            {t.checkout.payment_details.payment_types.card.expiration} <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="expiryDate"
                                                            name="expiryDate"
                                                            value={paymentInfo.expiryDate}
                                                            onChange={handlePaymentInfoChange}
                                                            placeholder="MM/YY"
                                                            className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.payment?.expiryDate ? 'border-red-500' : 'border-gray-300'
                                                                }`}
                                                            ref={expiryDateRef}
                                                            onKeyDown={(e) => handleStepNavigation(e, cvvRef)}
                                                        />
                                                        {errors.payment?.expiryDate && (
                                                            <p className="text-xs text-red-600">{getErrorMessage(errors.payment.expiryDate)}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="cvv" className="block text-xs font-medium text-gray-700">
                                                            {t.checkout.payment_details.payment_types.card.cvv} <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="cvv"
                                                            name="cvv"
                                                            value={paymentInfo.cvv}
                                                            onChange={handlePaymentInfoChange}
                                                            placeholder={detectedCardType === 'amex' ? '1234' : '123'}
                                                            className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 force-white-bg ${errors.payment?.cvv ? 'border-red-500' : 'border-gray-300'
                                                                }`}
                                                            ref={cvvRef}
                                                            onKeyDown={(e) => handleStepNavigation(e, billingCountryRef)}
                                                        />
                                                        {errors.payment?.cvv && (
                                                            <p className="text-xs text-red-600">{getErrorMessage(errors.payment.cvv)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            null
                                        )}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h2 className="text-lg font-semibold text-gray-900">{t.checkout.summary.title} </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{t.checkout.summary.plan}</span>
                                        <span className="text-sm font-medium text-gray-900">{t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans].name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{t.checkout.summary.billing_period}</span>
                                        <span className="text-sm font-medium text-gray-900">{isAnnual ? t.checkout.summary.annual : t.checkout.summary.monthly}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{t.checkout.summary.price}</span>
                                        <span className="text-sm font-medium text-gray-900">{getPlanPrice()}</span>
                                    </div>

                                    {/* Plan Features/Limits */}
                                    <div className="border-t border-gray-100 pt-3">
                                        <h4 className="text-xs font-medium text-gray-700 mb-2">{t.checkout.summary.plan_features}</h4>
                                        <div className="space-y-1">
                                            {t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans].features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-xs text-gray-600">
                                                    <svg className={`w-3 h-3 text-green-500 ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                            {/* Add Storage Information */}
                                            <div className="flex items-center text-xs text-gray-600">
                                                <svg className={`w-3 h-3 text-green-500 ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span>{t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans].max_storage} {t.checkout.summary.storage}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add-ons Section - Only for Starter and Standard plans */}
                                    {(selectedPlan === 'starter' || selectedPlan === 'standard') && (
                                        <div className="border-t border-gray-100 pt-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddOnsExpanded(!isAddOnsExpanded)}
                                                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none transition-colors"
                                                    aria-label={isAddOnsExpanded ? "Collapse add-ons" : "Expand add-ons"}
                                                >
                                                    {t.checkout.summary.add_ons.title}
                                                    <svg
                                                        className={`${isRTL ? 'mr-1' : 'ml-1'} h-3 w-3 transform transition-transform ${isAddOnsExpanded ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Show add-ons details when expanded */}
                                            {isAddOnsExpanded && (
                                                <div className="space-y-3 mb-3">
                                                    {addOns.filter(a => a.id !== 'storage').map((addOn: AddOn) => (
                                                        <div key={addOn.id} className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-medium text-gray-700">
                                                                        {addOn.id === 'storage'
                                                                            ? `${t.checkout.summary.add_ons[addOn.id as keyof typeof t.checkout.summary.add_ons] || addOn.name} (10GB)`
                                                                            : t.checkout.summary.add_ons[addOn.id as keyof typeof t.checkout.summary.add_ons] || addOn.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        ${addOn.price.toFixed(2)}
                                                                        {addOn.id === 'storage' ? '/10GB' : t.checkout.summary.add_ons.per_user}
                                                                    </span>
                                                                </div>
                                                                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAddOnQuantityChange(addOn.id, addOn.quantity - 1)}
                                                                        disabled={addOn.quantity === 0}
                                                                        className="quantity-button w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                                        aria-label={`Decrease ${addOn.name} quantity`}
                                                                    >
                                                                        <svg className="w-3 h-3" viewBox="0 0 24 24">
                                                                            <rect x="4" y="11" width="16" height="2" fill="#6B7280" />
                                                                        </svg>
                                                                    </button>
                                                                    <span className="text-xs font-medium text-gray-900 min-w-[2rem] text-center">
                                                                        {addOn.id === 'storage' ? `${addOn.quantity * 10}GB` : addOn.quantity}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAddOnQuantityChange(addOn.id, addOn.quantity + 1)}
                                                                        disabled={addOn.quantity >= (addOn.maxQuantity || 999)}
                                                                        className="quantity-button w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                                        aria-label={`Increase ${addOn.name} quantity`}
                                                                    >
                                                                        <svg className="w-3 h-3" viewBox="0 0 24 24">
                                                                            <rect x="11" y="4" width="2" height="16" fill="#6B7280" />
                                                                            <rect x="4" y="11" width="16" height="2" fill="#6B7280" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className={`text-right ${isRTL ? 'mr-3' : 'ml-3'}`}>
                                                                <span className="text-xs font-medium text-gray-900">
                                                                    ${(addOn.price * addOn.quantity).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {isAddOnsExpanded && addOns.find(a => a.id === 'storage') && (
                                                <div className="border-t border-gray-100 pt-3 mt-3">
                                                    {(() => {
                                                        const storageAddOn = addOns.find(a => a.id === 'storage')!;
                                                        return (
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-xs font-medium text-gray-700">
                                                                            {`${t.checkout.summary.add_ons.storage || 'Storage'} (10GB)`}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            ${storageAddOn.price.toFixed(2)}/10GB
                                                                        </span>
                                                                    </div>
                                                                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAddOnQuantityChange(storageAddOn.id, storageAddOn.quantity - 1)}
                                                                            disabled={storageAddOn.quantity === 0}
                                                                            className="quantity-button w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                                            aria-label={`Decrease ${storageAddOn.name} quantity`}
                                                                        >
                                                                            <svg className="w-3 h-3" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" fill="#6B7280" /></svg>
                                                                        </button>
                                                                        <span className="text-xs font-medium text-gray-900 min-w-[2rem] text-center">
                                                                            {`${storageAddOn.quantity * 10}GB`}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAddOnQuantityChange(storageAddOn.id, storageAddOn.quantity + 1)}
                                                                            disabled={storageAddOn.quantity >= (storageAddOn.maxQuantity || 999)}
                                                                            className="quantity-button w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                                            aria-label={`Increase ${storageAddOn.name} quantity`}
                                                                        >
                                                                            <svg className="w-3 h-3" viewBox="0 0 24 24"><rect x="11" y="4" width="2" height="16" fill="#6B7280" /><rect x="4" y="11" width="16" height="2" fill="#6B7280" /></svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className={`text-right ${isRTL ? 'mr-3' : 'ml-3'}`}>
                                                                    <span className="text-xs font-medium text-gray-900">
                                                                        ${(storageAddOn.price * storageAddOn.quantity).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Standard Plan Recommendation - Only for Starter plan when add-ons reach threshold */}
                                    <AnimatePresence>
                                        {shouldShowStandardRecommendation() && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="border-t border-gray-100 pt-3"
                                            >
                                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-200">
                                                    {/* Close Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowStandardRecommendation(false)}
                                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:shadow-lg hover:scale-110 active:scale-95 border border-green-200 hover:border-green-300 z-10"
                                                        aria-label="Close recommendation"
                                                    >
                                                        <span className="text-green-700 text-sm font-bold transition-transform duration-300 hover:rotate-90">
                                                            <FaTimes />
                                                        </span>
                                                    </button>

                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-semibold text-green-900">
                                                                    {t.checkout.summary.recommendation.standard.title}
                                                                </h3>
                                                                <p className="text-xs text-green-700">
                                                                    {t.checkout.summary.recommendation.standard.desc1} ${getStandardUpgradeSavings().currentTotal.toFixed(2)}/{t.checkout.summary.recommendation.standard.month} {t.checkout.summary.recommendation.standard.desc2}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {t.checkout.summary.recommendation.standard.save1} ${getStandardUpgradeSavings().priceDifference.toFixed(2)}/{t.checkout.summary.recommendation.standard.save2}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mb-3">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-gray-600">{t.checkout.summary.recommendation.standard.current}</span>
                                                            <span className="font-medium text-gray-900">${getStandardUpgradeSavings().currentTotal.toFixed(2)}{t.checkout.summary.recommendation.standard.save2}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-gray-600">{t.checkout.summary.recommendation.standard.plan_recommended}</span>
                                                            <span className="font-medium text-gray-900">${getStandardUpgradeSavings().standardPrice}{t.checkout.summary.recommendation.standard.save2}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs font-semibold text-green-700">
                                                            <span>{t.checkout.summary.recommendation.standard.you_save}</span>
                                                            <span>-${getStandardUpgradeSavings().priceDifference.toFixed(2)}{t.checkout.summary.recommendation.standard.save2} ({getStandardUpgradeSavings().percentageSavings}%)</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-xs text-green-800 font-medium">
                                                            {t.checkout.summary.recommendation.standard.plan_includes}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-1 text-xs text-green-700">
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.standard.admin_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.standard.teacher_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.standard.student_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.standard.parent_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center col-span-2">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.standard.storage_included}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={handleUpgradeToStandard}
                                                        className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
                                                    >
                                                        {t.checkout.summary.recommendation.standard.upgrade_to_standard}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Enterprise Plan Recommendation - Only for Standard plan when add-ons reach threshold */}
                                    <AnimatePresence>
                                        {shouldShowEnterpriseRecommendation() && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="border-t border-gray-100 pt-3"
                                            >
                                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                                                    {/* Close Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowEnterpriseRecommendation(false)}
                                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-lg hover:scale-110 active:scale-95 border border-blue-200 hover:border-blue-300 z-10"
                                                        aria-label="Close recommendation"
                                                    >
                                                        <span className="text-blue-700 text-sm font-bold transition-transform duration-300 hover:rotate-90">
                                                            <FaTimes />
                                                        </span>
                                                    </button>

                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center rtl:ml-4">
                                                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-semibold text-blue-900">
                                                                    {t.checkout.summary.recommendation.enterprise.title}
                                                                </h3>
                                                                <p className="text-xs text-blue-700">
                                                                    {t.checkout.summary.recommendation.enterprise.desc1} ${getEnterpriseUpgradeSavings().currentTotal.toFixed(2)}{t.checkout.summary.recommendation.enterprise.month} {t.checkout.summary.recommendation.enterprise.desc2}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {t.checkout.summary.recommendation.enterprise.save1} ${getEnterpriseUpgradeSavings().priceDifference.toFixed(2)}{t.checkout.summary.recommendation.enterprise.save2}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mb-3">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-gray-600">{t.checkout.summary.recommendation.enterprise.current}</span>
                                                            <span className="font-medium text-gray-900">${getEnterpriseUpgradeSavings().currentTotal.toFixed(2)}{t.checkout.summary.recommendation.enterprise.save2}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-gray-600">{t.checkout.summary.recommendation.enterprise.plan_recommended}</span>
                                                            <span className="font-medium text-gray-900">${getEnterpriseUpgradeSavings().enterprisePrice}{t.checkout.summary.recommendation.enterprise.save2}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs font-semibold text-green-700">
                                                            <span>{t.checkout.summary.recommendation.enterprise.you_save}</span>
                                                            <span>-${getEnterpriseUpgradeSavings().priceDifference.toFixed(2)}{t.checkout.summary.recommendation.enterprise.save2} ({getEnterpriseUpgradeSavings().percentageSavings}%)</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-xs text-green-800 font-medium">
                                                            {t.checkout.summary.recommendation.enterprise.plan_includes}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-1 text-xs text-green-700">
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.enterprise.admin_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.enterprise.teacher_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.enterprise.student_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.enterprise.parent_accounts}</span>
                                                            </div>
                                                            <div className="flex items-center col-span-2">
                                                                <svg className={`w-3 h-3 text-green-600 ${isRTL ? 'ml-1' : 'mr-1'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>{t.checkout.summary.recommendation.enterprise.storage_included}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={handleUpgradeToEnterprise}
                                                        className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                                                    >
                                                        {t.checkout.summary.recommendation.enterprise.upgrade_to_enterprise}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>

                                {/* Free Trial Banner */}
                                {selectedPlan === 'starter' && (
                                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                                        <div className="flex items-center justify-between">
                                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center rtl:ml-4">
                                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-blue-900">
                                                        {isAnnual ? t.checkout.summary.free_trial.thirty_days : t.checkout.summary.free_trial.seven_days}
                                                    </h3>
                                                    <p className="text-xs text-blue-700">{t.checkout.summary.free_trial.try_before_you_buy}</p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {isAnnual ? t.checkout.summary.free_trial.thirty_days_badge : t.checkout.summary.free_trial.seven_days_badge}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-b border-gray-200 pt-2 pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPromoInput(!showPromoInput)}
                                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 focus:outline-none transition-colors"
                                        aria-label={showPromoInput ? "Hide promo code input" : "Show promo code input"}
                                    >
                                        {showPromoInput ? t.checkout.summary.hide_promo : t.checkout.summary.add_promo}
                                        <svg
                                            className={`${isRTL ? 'mr-1' : 'ml-1'} h-4 w-4 transform transition-transform ${showPromoInput ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {showPromoInput && (
                                        <div className="mt-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={promoCode}
                                                    onChange={handlePromoCodeChange}
                                                    onKeyDown={handlePromoKeyDown}
                                                    placeholder={t.checkout.summary.add_promo_placeholder}
                                                    className={`focus:outline-none w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 force-white-bg ${errors.billingAddress?.zipCode ? 'border-red-500' : 'border-gray-300'
                                                        }`} />
                                                <ButtonLoader
                                                    type="button"
                                                    onClick={handleApplyPromo}
                                                    isLoading={isApplyingPromoCode}
                                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                                                >
                                                    {t.checkout.summary.apply}
                                                </ButtonLoader>
                                            </div>
                                            {promoError && (
                                                <p className="mt-2 text-sm text-red-600">{promoError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {hasAddOns() && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{t.checkout.summary.add_ons.total}</span>
                                        <span className="text-sm font-medium text-gray-900">+${getAddOnsTotalFormatted()}</span>
                                    </div>
                                )}
                                <AnimatePresence>
                                    {promoCodeApplied && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-green-800">{t.checkout.summary.promo_code_savings}</p>
                                                        <p className="text-xs text-green-600">{t.checkout.summary.promo_code_savings_applied}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-green-600">-${getTotalSavings().promoCodeSavings.toFixed(2)}</span>
                                                    <p className="text-xs text-green-600">{t.checkout.summary.promo_code_savings_saved}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPromoCodeApplied(false);
                                                        setDiscount(0);
                                                    }}
                                                    className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:shadow-lg hover:scale-110 active:scale-95 border border-green-200 hover:border-green-300 ml-2"
                                                    aria-label="Remove promo code"
                                                >
                                                    <span className="text-green-700 text-sm font-bold transition-transform duration-300 hover:rotate-90">
                                                        <FaTimes />
                                                    </span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="border-t border-gray-200 pt-4">
                                    {isAnnual && (
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">{t.checkout.summary.annual_saving}</span>
                                            <span className="text-sm font-medium text-green-600">-${getTotalSavings().annualSavings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {promoCodeApplied && (
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">{t.checkout.summary.promo_code_savings}</span>
                                            <span className="text-sm font-medium text-green-600">-${getTotalSavings().promoCodeSavings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-gray-900">{t.checkout.summary.total_savings}</span>
                                        <span className="text-sm font-bold text-green-600">-${getTotalSavings().totalSavings.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-base font-semibold text-gray-900">{t.checkout.summary.total}</span>
                                        <span className="text-xl font-bold text-gray-900">{getTotalPrice()}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={handleBackStep}
                                                    className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm"
                                                >
                                                    {t.checkout.summary.back}
                                                </button>
                                            )}
                                            <ButtonLoader
                                                type="submit"
                                                isLoading={isCheckingOut}
                                                className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {currentStep === 4 ? t.checkout.summary.activate : t.checkout.summary.continue}
                                            </ButtonLoader>
                                        </div>
                                        <p className="text-xs text-gray-500 text-center mt-3">
                                            {t.checkout.legal.by_continuing} {' '}
                                            <a href="#" className="text-blue-600 hover:text-blue-700 underline">{t.checkout.legal.terms}</a> {t.and}{' '}
                                            <a href="#" className="text-blue-600 hover:text-blue-700 underline">{t.checkout.legal.privacy}</a>.{' '}
                                            {t.checkout.legal.payment_secured_with} {' '}
                                            <a href="#" className="text-blue-600 hover:text-blue-700 underline">{t.checkout.legal.pci}</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout; 