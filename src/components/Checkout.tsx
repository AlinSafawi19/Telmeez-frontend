import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';
import { countries } from 'countries-list';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import visa from "../assets/images/visa.png";
import mastercard from "../assets/images/mastercard.png";
import logo from "../assets/images/logo.png";
import logoarb from "../assets/images/logo_arb.png";
import { FaHome, FaLock, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutProps {
    language?: Language;
}

interface BillingInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    institutionName: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
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
}

interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

type PaymentMethod = 'card';

const Checkout: React.FC<CheckoutProps> = ({
    language = 'en'
}) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const selectedPlan = searchParams.get('plan') || 'standard';
    const isAnnual = searchParams.get('billing') === 'annual';
    const t = translations[currentLanguage || language];
    const isRTL = currentLanguage === 'ar';
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'عربي' },
        { code: 'fr', label: 'Français' }
    ];

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
        setIsScrolling(true);
        setTimeout(() => {
            setIsScrolling(false);
            setCurrentLanguage(langCode);
            if (langCode === 'ar') {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
        }, 500);
        setIsLanguageDropdownOpen(false);
    };

    // Convert countries object to array and sort by name
    const countryOptions = Object.entries(countries)
        .map(([code, country]) => ({
            code,
            name: country.name
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const [currentStep, setCurrentStep] = useState(1);
    const [billingInfo, setBillingInfo] = useState<BillingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        institutionName: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'LB',
        password: '',
        confirmPassword: ''
    });

    const [billingAddress, setBillingAddress] = useState<BillingAddress>({
        address: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'LB'
    });

    const [useSameAddress, setUseSameAddress] = useState(true);

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState<{
        billing?: Partial<BillingInfo>;
        billingAddress?: Partial<BillingAddress>;
        payment?: Partial<PaymentInfo>;
    }>({});

    const [promoCode, setPromoCode] = useState('');
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const [discount, setDiscount] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

    const handlePhoneChange = (value: string) => {
        setBillingInfo(prev => ({
            ...prev,
            phone: value
        }));
    };

    const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors.billing?.[name as keyof BillingInfo]) {
            setErrors(prev => ({
                ...prev,
                billing: {
                    ...prev.billing,
                    [name]: undefined
                }
            }));
        }
    };

    const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUseSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setUseSameAddress(checked);
        if (checked) {
            // Copy values from billingInfo when toggled on
            setBillingAddress({
                address: billingInfo.address,
                address2: billingInfo.address2,
                city: billingInfo.city,
                state: billingInfo.state,
                zipCode: billingInfo.zipCode,
                country: billingInfo.country
            });
            // Clear any billing address errors since we're using billing info
            setErrors(prev => ({
                ...prev,
                billingAddress: undefined
            }));
        } else {
            // Clear billing address fields when toggled off
            setBillingAddress({
                address: '',
                address2: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            });
        }
    };

    const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            // Remove all non-digit characters
            const digitsOnly = value.replace(/\D/g, '');
            // Format as XXXX XXXX XXXX XXXX
            formattedValue = digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
            // Limit to 16 digits
            if (digitsOnly.length > 16) {
                formattedValue = formattedValue.slice(0, 19); // 16 digits + 3 spaces
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
            // Only allow digits, max 4
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setPaymentInfo(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // CVV instant validation
        if (name === 'cvv') {
            if (!/^\d{3,4}$/.test(formattedValue)) {
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
    };

    const validateCardNumber = (cardNumber: string): boolean => {
        // Remove spaces and non-digit characters
        const digitsOnly = cardNumber.replace(/\D/g, '');
        // Check if it's exactly 16 digits
        if (digitsOnly.length !== 16) return false;

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

    const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPromoCode(e.target.value);
        setPromoError('');
        setPromoSuccess('');
    };

    const handleApplyPromo = () => {
        // Test promo codes
        const testPromoCodes = {
            'TEST10': 0.10, // 10% discount
            'TEST20': 0.20, // 20% discount
            'TEST30': 0.30, // 30% discount
            'TEST50': 0.50  // 50% discount
        } as const;

        if (!promoCode.trim()) {
            setPromoError('Please enter a promo code');
            setPromoSuccess('');
            return;
        }

        const discountPercentage = testPromoCodes[promoCode.toUpperCase() as keyof typeof testPromoCodes];

        if (discountPercentage) {
            setPromoSuccess(`Promo code applied successfully! ${discountPercentage * 100}% discount applied.`);
            setPromoError('');
            setDiscount(discountPercentage);
            setPromoCode(''); // Clear the input
        } else {
            setPromoError('Invalid promo code');
            setPromoSuccess('');
            setDiscount(0);
        }
    };

    const handleNextStep = () => {
        console.log('handleNextStep called, current step:', currentStep);

        // Validate current step before proceeding
        if (currentStep === 1) {
            const billingErrors: Partial<BillingInfo> = {};

            // Required fields validation
            if (!billingInfo.firstName.trim()) {
                billingErrors.firstName = t.checkout.validation.required;
            }
            if (!billingInfo.lastName.trim()) {
                billingErrors.lastName = t.checkout.validation.required;
            }
            if (!billingInfo.email.trim()) {
                billingErrors.email = t.checkout.validation.required;
            } else {
                // Email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(billingInfo.email)) {
                    billingErrors.email = t.checkout.validation.invalid_email;
                }
            }
            if (!billingInfo.phone.trim()) {
                billingErrors.phone = t.checkout.validation.required;
            }
            if (!billingInfo.address.trim()) {
                billingErrors.address = t.checkout.validation.required;
            }
            if (!billingInfo.city.trim()) {
                billingErrors.city = t.checkout.validation.required;
            }
            if (!billingInfo.state.trim()) {
                billingErrors.state = t.checkout.validation.required;
            }
            if (!billingInfo.zipCode.trim()) {
                billingErrors.zipCode = t.checkout.validation.required;
            }
            if (!billingInfo.country) {
                billingErrors.country = t.checkout.validation.required;
            }
            if (!billingInfo.password.trim()) {
                billingErrors.password = t.checkout.validation.required;
            } else if (billingInfo.password.length < 8) {
                billingErrors.password = t.checkout.validation.password_length;
            }
            if (!billingInfo.confirmPassword.trim()) {
                billingErrors.confirmPassword = t.checkout.validation.required;
            } else if (billingInfo.password !== billingInfo.confirmPassword) {
                billingErrors.confirmPassword = t.checkout.validation.password_mismatch;
            }

            if (Object.keys(billingErrors).length > 0) {
                setErrors(prev => ({
                    ...prev,
                    billing: billingErrors
                }));
                return;
            }
        } else if (currentStep === 2) {
            const paymentErrors: Partial<PaymentInfo> = {};

            // Card number validation
            if (!paymentInfo.cardNumber.trim()) {
                paymentErrors.cardNumber = t.checkout.validation.required;
            } else if (!validateCardNumber(paymentInfo.cardNumber)) {
                paymentErrors.cardNumber = t.checkout.validation.invalid_card;
            }

            // Expiry date validation
            if (!paymentInfo.expiryDate.trim()) {
                paymentErrors.expiryDate = t.checkout.validation.required;
            } else if (!validateExpiryDate(paymentInfo.expiryDate)) {
                paymentErrors.expiryDate = t.checkout.validation.invalid_expiry;
            }

            // CVV validation
            if (!paymentInfo.cvv.trim()) {
                paymentErrors.cvv = t.checkout.validation.required;
            } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
                paymentErrors.cvv = t.checkout.validation.invalid_cvv;
            }

            if (Object.keys(paymentErrors).length > 0) {
                setErrors(prev => ({
                    ...prev,
                    payment: paymentErrors
                }));
                return;
            }
        }

        if (currentStep < 3) {
            setCurrentStep(prev => {
                console.log('Setting step to:', prev + 1);
                return prev + 1;
            });
        }
    };

    const handleStepSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted, current step:', currentStep);

        if (currentStep < 3) {
            handleNextStep();
        } else {
            // Validate billing address only on final submission
            if (!useSameAddress) {
                const billingAddressErrors: Partial<BillingAddress> = {};

                if (!billingAddress.address.trim()) {
                    billingAddressErrors.address = t.checkout.validation.required;
                }
                if (!billingAddress.city.trim()) {
                    billingAddressErrors.city = t.checkout.validation.required;
                }
                if (!billingAddress.state.trim()) {
                    billingAddressErrors.state = t.checkout.validation.required;
                }
                if (!billingAddress.zipCode.trim()) {
                    billingAddressErrors.zipCode = t.checkout.validation.required;
                }
                if (!billingAddress.country) {
                    billingAddressErrors.country = t.checkout.validation.required;
                }

                if (Object.keys(billingAddressErrors).length > 0) {
                    setErrors(prev => ({
                        ...prev,
                        billingAddress: billingAddressErrors
                    }));
                    return;
                }
            }

            // Clear any existing billing address errors since validation passed
            setErrors(prev => ({
                ...prev,
                billingAddress: undefined
            }));

            // Handle final submission
            console.log('Form submitted:', { billingInfo, paymentInfo, billingAddress });
            // Navigate to success page or handle the submission
        }
    };

    const handleBackStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const getPlanPrice = () => {
        const plan = t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans];
        const price = isAnnual ? plan.annual_price : plan.monthly_price;
        const priceValue = parseFloat(price.replace(/[^0-9.-]+/g, ''));
        return `$${priceValue.toFixed(2)}`;
    };

    const getTotalSavings = () => {
        const plan = t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans];
        const annualPrice = parseFloat(plan.annual_price.replace(/[^0-9.-]+/g, ''));
        let savings = 0;

        if (isAnnual) {
            savings = annualPrice * 0.20; // 20% of the annual price
        }

        // Add promo code savings if exists
        if (discount > 0) {
            const price = isAnnual ? annualPrice * 0.80 : annualPrice;
            savings += price * discount;
        }

        return `$${savings.toFixed(2)}`;
    };

    const getTotalPrice = () => {
        const plan = t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans];
        const price = isAnnual ? plan.annual_price : plan.monthly_price;
        const priceValue = parseFloat(price.replace(/[^0-9.-]+/g, ''));
        let finalPrice = priceValue;

        if (isAnnual) {
            finalPrice = priceValue * 0.80; // 80% of the annual price (20% discount)
        }

        // Apply promo code discount if exists
        if (discount > 0) {
            finalPrice = finalPrice * (1 - discount);
        }

        return `$${finalPrice.toFixed(2)}`;
    };

    const handlePaymentMethodChange = (method: PaymentMethod) => {
        setPaymentMethod(method);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                    <img
                        src={currentLanguage === 'ar' ? logoarb : logo}
                        alt="Company Logo"
                        className="h-16 w-auto transition-transform hover:scale-105"
                    />
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            {t.checkout.title}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {t.checkout.subtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none"
                                aria-label="Select language"
                            >
                                <span className="font-medium">
                                    {languages.find(lang => lang.code === currentLanguage)?.label}
                                </span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isLanguageDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code as Language)}
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
                            onClick={() => navigate('/')}
                            className="group focus:outline-none flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50"
                            aria-label="Back to home"
                        >
                            <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">{t.header.back_to_home}</span>
                        </button>
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

                <form onSubmit={handleStepSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Progress Steps */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${currentStep >= 1
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <FaLock className="w-5 h-5" />
                                    </div>
                                    <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium transition-colors duration-300 ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'
                                        }`}>{t.checkout.account_info.title}</span>
                                </div>
                                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                    }`}></div>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${currentStep >= 2
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <FaCreditCard className="w-5 h-5" />
                                    </div>
                                    <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium transition-colors duration-300 ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'
                                        }`}>{t.checkout.payment_details.title}</span>
                                </div>
                                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${currentStep >= 3 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                    }`}></div>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${currentStep >= 3
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <FaMapMarkerAlt className="w-5 h-5" />
                                    </div>
                                    <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium transition-colors duration-300 ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'
                                        }`}>{t.checkout.billing_address.title}</span>
                                </div>
                            </div>
                        </div>

                        {/* Show only current step content */}
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    {/* Account Information Section */}
                                    <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-2xl font-semibold text-gray-900">{t.checkout.account_info.title}</h2>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.first_name} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={billingInfo.firstName}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.firstName ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.billing?.firstName && (
                                                    <p className="text-sm text-red-600">{errors.billing.firstName}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.last_name}<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={billingInfo.lastName}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.lastName ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.billing?.lastName && (
                                                    <p className="text-sm text-red-600">{errors.billing.lastName}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.email} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={billingInfo.email}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.email ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.billing?.email && (
                                                    <p className="text-sm text-red-600">{errors.billing.email}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.phone} <span className="text-red-500">*</span>
                                                </label>
                                                <PhoneInput
                                                    country="lb"
                                                    value={billingInfo.phone}
                                                    onChange={handlePhoneChange}
                                                    inputClass={`w-full px-4 py-3 ${isRTL ? 'text-right pr-12' : ''} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.phone ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    buttonClass={`${isRTL ? 'rounded-l-none' : 'rounded-r-none'}`}
                                                    inputStyle={{
                                                        height: '50px',
                                                        width: '100%',
                                                        fontSize: '1rem',
                                                        borderRadius: '0.75rem !important',
                                                        borderColor: errors.billing?.phone ? '#EF4444' : '#D1D5DB'
                                                    }}
                                                    buttonStyle={{
                                                        borderTopRightRadius: '0.75rem',
                                                        borderBottomRightRadius: '0.75rem',
                                                        borderTopLeftRadius: '0',
                                                        borderBottomLeftRadius: '0',
                                                        borderColor: errors.billing?.phone ? '#EF4444' : '#D1D5DB'
                                                    }}
                                                    containerClass={isRTL ? 'rtl-phone-input' : ''}
                                                />

                                                {errors.billing?.phone && (
                                                    <p className="text-sm text-red-600">{errors.billing.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
                                                {t.checkout.account_info.fields.institution}
                                            </label>
                                            <input
                                                type="text"
                                                id="institutionName"
                                                name="institutionName"
                                                value={billingInfo.institutionName}
                                                onChange={handleBillingInfoChange}
                                                className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.institutionName ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                {t.checkout.account_info.fields.address1} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={billingInfo.address}
                                                onChange={handleBillingInfoChange}
                                                className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.address ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.billing?.address && (
                                                <p className="text-sm text-red-600">{errors.billing.address}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                                                {t.checkout.account_info.fields.address2}
                                            </label>
                                            <input
                                                type="text"
                                                id="address2"
                                                name="address2"
                                                value={billingInfo.address2}
                                                onChange={handleBillingInfoChange}
                                                className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.address2 ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.country} <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    value={billingInfo.country}
                                                    onChange={handleBillingInfoChange}
                                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.country ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                >
                                                    <option value="">Select a country</option>
                                                    {countryOptions.map(({ code, name }) => (
                                                        <option key={code} value={code}>
                                                            {name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.billing?.country && (
                                                    <p className="text-sm text-red-600">{errors.billing.country}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.city} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={billingInfo.city}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.city ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.billing?.city && (
                                                    <p className="text-sm text-red-600">{errors.billing.city}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.state} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    value={billingInfo.state}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.state ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.billing?.state && (
                                                    <p className="text-sm text-red-600">{errors.billing.state}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.zip} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="zipCode"
                                                    name="zipCode"
                                                    value={billingInfo.zipCode}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.zipCode ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.billing?.zipCode && (
                                                    <p className="text-sm text-red-600">{errors.billing.zipCode}</p>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600"> {t.checkout.account_info.fields.passmsg}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.password} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    value={billingInfo.password}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.password ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder={t.checkout.account_info.fields.password_placeholder}
                                                />
                                                {errors.billing?.password && (
                                                    <p className="text-sm text-red-600">{errors.billing.password}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                                    {t.checkout.account_info.fields.confirmpass} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={billingInfo.confirmPassword}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.billing?.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder={t.checkout.account_info.fields.password_confirm_placeholder}
                                                />
                                                {errors.billing?.confirmPassword && (
                                                    <p className="text-sm text-red-600">{errors.billing.confirmPassword}</p>
                                                )}
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
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    {/* Payment Information Section */}
                                    <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-2xl font-semibold text-gray-900"> {t.checkout.payment_details.section_title}</h2>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        {/* Payment Method Selection */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900">{t.checkout.payment_details.section_subtitle}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handlePaymentMethodChange('card')}
                                                    className={`focus:outline-none p-4 rounded-xl border-2 transition-all duration-300 ${paymentMethod === 'card'
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                        <div className={`p-2 rounded-full ${paymentMethod === 'card' ? 'bg-blue-600' : 'bg-gray-100'
                                                            }`}>
                                                            <FaCreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-white' : 'text-gray-600'
                                                                }`} />
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="font-medium text-gray-900">{t.checkout.payment_details.payment_types.card.name}</h4>
                                                            <p className="text-sm text-gray-500">{t.checkout.payment_details.payment_types.card.desc}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {paymentMethod === 'card' ? (
                                            <>
                                                <div className="flex items-center space-x-4 mb-6">
                                                    <img src={visa} alt="Visa" className="h-8 transition-transform hover:scale-110" />
                                                    <img src={mastercard} alt="Mastercard" className="h-8 transition-transform hover:scale-110" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                                        {t.checkout.payment_details.payment_types.card.card_nb} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="cardNumber"
                                                        name="cardNumber"
                                                        value={paymentInfo.cardNumber}
                                                        onChange={handlePaymentInfoChange}
                                                        placeholder="1234 5678 9012 3456"
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.payment?.cardNumber ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    />
                                                    {errors.payment?.cardNumber && (
                                                        <p className="text-sm text-red-600">{errors.payment.cardNumber}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                                            {t.checkout.payment_details.payment_types.card.expiration} <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="expiryDate"
                                                            name="expiryDate"
                                                            value={paymentInfo.expiryDate}
                                                            onChange={handlePaymentInfoChange}
                                                            placeholder="MM/YY"
                                                            className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.payment?.expiryDate ? 'border-red-500' : 'border-gray-300'
                                                                }`}
                                                        />
                                                        {errors.payment?.expiryDate && (
                                                            <p className="text-sm text-red-600">{errors.payment.expiryDate}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                                            {t.checkout.payment_details.payment_types.card.cvv} <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="cvv"
                                                            name="cvv"
                                                            value={paymentInfo.cvv}
                                                            onChange={handlePaymentInfoChange}
                                                            placeholder="123"
                                                            className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.payment?.cvv ? 'border-red-500' : 'border-gray-300'
                                                                }`}
                                                        />
                                                        {errors.payment?.cvv && (
                                                            <p className="text-sm text-red-600">{errors.payment.cvv}</p>
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

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    {/* Billing Address Section */}
                                    <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-2xl font-semibold text-gray-900">{t.checkout.billing_address.title}</h2>
                                    </div>
                                    <div className="p-8">
                                        <div className="mb-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={useSameAddress}
                                                    onChange={handleUseSameAddressChange}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                                                    {t.checkout.billing_address.checbox}
                                                </span>
                                            </label>
                                        </div>

                                        {!useSameAddress && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700">
                                                        {t.checkout.account_info.fields.country} <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="billingCountry"
                                                        name="country"
                                                        value={billingAddress.country}
                                                        onChange={handleBillingAddressChange}
                                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.country ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    >
                                                        <option value="">Select a country</option>
                                                        {countryOptions.map(({ code, name }) => (
                                                            <option key={code} value={code}>
                                                                {name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.billingAddress?.country && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.country}</p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
                                                        {t.checkout.account_info.fields.address1}  <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingAddress"
                                                        name="address"
                                                        value={billingAddress.address}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.address ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    />
                                                    {errors.billingAddress?.address && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.address}</p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label htmlFor="billingAddress2" className="block text-sm font-medium text-gray-700">
                                                        {t.checkout.account_info.fields.address2}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingAddress2"
                                                        name="address2"
                                                        value={billingAddress.address2}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.address2 ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">
                                                        {t.checkout.account_info.fields.city}  <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingCity"
                                                        name="city"
                                                        value={billingAddress.city}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.city ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    />
                                                    {errors.billingAddress?.city && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.city}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">
                                                        {t.checkout.account_info.fields.state}  <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingState"
                                                        name="state"
                                                        value={billingAddress.state}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.state ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    />
                                                    {errors.billingAddress?.state && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.state}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700">
                                                        {t.checkout.account_info.fields.zip}  <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingZipCode"
                                                        name="zipCode"
                                                        value={billingAddress.zipCode}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.zipCode ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    />
                                                    {errors.billingAddress?.zipCode && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.zipCode}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
                            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h2 className="text-2xl font-semibold text-gray-900">{t.checkout.summary.title} </h2>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">{t.checkout.summary.plan}</span>
                                        <span className="font-medium text-gray-900">{t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans].name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">{t.checkout.summary.billing_period}</span>
                                        <span className="font-medium text-gray-900">{isAnnual ? t.checkout.summary.annual : t.checkout.summary.monthly}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">{t.checkout.summary.price}</span>
                                        <span className="font-medium text-gray-900">{getPlanPrice()}</span>
                                    </div>
                                </div>

                                {/* Free Trial Banner */}
                                {selectedPlan === 'starter' && (
                                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-100">
                                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                                            <div className="absolute inset-0 bg-blue-200 opacity-20 rounded-full"></div>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center mb-3">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="ml-3 text-lg font-semibold text-blue-900">{t.checkout.summary.free_trial.title}</h3>
                                            </div>
                                            <p className="text-blue-800 mb-4">
                                                {t.checkout.summary.free_trial.subtitle1} {isAnnual ? t.checkout.summary.free_trial.subtitle2 : t.checkout.summary.free_trial.subtitle3} {t.checkout.summary.free_trial.subtitle4}
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-start text-sm text-blue-700">
                                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{t.checkout.summary.free_trial.note1}</span>
                                                </div>
                                                <div className="flex items-start text-sm text-blue-700">
                                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{t.checkout.summary.free_trial.note2}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Plan Features */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.checkout.summary.plan_features}</h3>
                                    <ul className="space-y-3">
                                        {t.pricing.plans[selectedPlan as keyof typeof t.pricing.plans].features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mr-2 text-green-500 mt-1">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Annual Savings */}
                                {isAnnual && (
                                    <div className="flex justify-between items-center text-green-600 bg-green-50 p-4 rounded-xl">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>{t.checkout.summary.annual_saving} (20%)</span>
                                        </div>
                                        <span className="font-medium">{getTotalSavings()}</span>
                                    </div>
                                )}

                                {(discount > 0) && (
                                    <div className="flex justify-between items-center text-green-600 bg-green-50 p-4 rounded-xl">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>{t.checkout.summary.promo_code_savings}</span>
                                        </div>
                                        <span className="font-medium">{getTotalSavings()}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowPromoInput(!showPromoInput)}
                                        className="focus:outline-none text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                                    >
                                        {showPromoInput ? t.checkout.summary.hide_promo : t.checkout.summary.add_promo}
                                        <svg
                                            className={`ml-1 h-4 w-4 transform transition-transform ${showPromoInput ? 'rotate-180' : ''}`}
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
                                                    placeholder={t.checkout.summary.add_promo_placeholder}
                                                    className="focus:outline-none flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyPromo}
                                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                                                >
                                                    {t.checkout.summary.apply}
                                                </button>
                                            </div>
                                            {promoError && (
                                                <p className="mt-2 text-sm text-red-600">{promoError}</p>
                                            )}
                                            {promoSuccess && (
                                                <p className="mt-2 text-sm text-green-600">{promoSuccess}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg font-semibold text-gray-900">{t.checkout.summary.total}</span>
                                        <span className="text-2xl font-bold text-gray-900">{getTotalPrice()}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={handleBackStep}
                                                    className="w-full py-4 px-6 rounded-xl font-semibold text-base bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm"
                                                >
                                                    {t.checkout.summary.back}
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                className="w-full py-4 px-6 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                                            >
                                                {currentStep < 3 ? t.checkout.summary.continue : t.checkout.summary.activate}
                                            </button>
                                        </div>
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