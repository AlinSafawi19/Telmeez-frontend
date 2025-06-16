import React, { useState } from 'react';
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
    firstName: string;
    lastName: string;
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

const Checkout: React.FC<CheckoutProps> = ({
    language = 'en'
}) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const selectedPlan = searchParams.get('plan') || 'standard';
    const isAnnual = searchParams.get('billing') === 'annual';
    const t = translations[language].pricing;
    const isRTL = language === 'ar';

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
        firstName: '',
        lastName: '',
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
            setBillingAddress({
                firstName: billingInfo.firstName,
                lastName: billingInfo.lastName,
                address: billingInfo.address,
                address2: billingInfo.address2,
                city: billingInfo.city,
                state: billingInfo.state,
                zipCode: billingInfo.zipCode,
                country: billingInfo.country
            });
        }
    };

    const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentInfo(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors.payment?.[name as keyof PaymentInfo]) {
            setErrors(prev => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    [name]: undefined
                }
            }));
        }
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
        if (currentStep < 3) {
            setCurrentStep(prev => {
                console.log('Setting step to:', prev + 1);
                return prev + 1;
            });
        }
    };

    const handleBackStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleStepSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted, current step:', currentStep);
        if (currentStep < 3) {
            handleNextStep();
        } else {
            // Handle final submission
            console.log('Form submitted:', { billingInfo, paymentInfo });
            // Navigate to success page or handle the submission
        }
    };

    const getPlanPrice = () => {
        const plan = t.plans[selectedPlan as keyof typeof t.plans];
        const price = isAnnual ? plan.annual_price : plan.monthly_price;
        const priceValue = parseFloat(price.replace(/[^0-9.-]+/g, ''));
        return `$${priceValue.toFixed(2)}`;
    };

    const getTotalSavings = () => {
        const plan = t.plans[selectedPlan as keyof typeof t.plans];
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
        const plan = t.plans[selectedPlan as keyof typeof t.plans];
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
                            Complete Your Purchase
                        </h1>
                        <p className="text-lg text-gray-600">
                            You're just a few steps away from getting started
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="group focus:outline-none flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50"
                        aria-label="Back to home"
                    >
                        <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </button>
                </div>

                <form onSubmit={handleStepSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Progress Steps */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                        currentStep >= 1 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110' 
                                            : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        <FaLock className="w-5 h-5" />
                                    </div>
                                    <span className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                                        currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'
                                    }`}>Account Information</span>
                                </div>
                                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                                    currentStep >= 2 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                }`}></div>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                        currentStep >= 2 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110' 
                                            : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        <FaCreditCard className="w-5 h-5" />
                                    </div>
                                    <span className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                                        currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'
                                    }`}>Payment Details</span>
                                </div>
                                <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                                    currentStep >= 3 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                }`}></div>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                        currentStep >= 3 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110' 
                                            : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        <FaMapMarkerAlt className="w-5 h-5" />
                                    </div>
                                    <span className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                                        currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'
                                    }`}>Billing Address</span>
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
                                        <h2 className="text-2xl font-semibold text-gray-900">Account Information</h2>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                    First Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={billingInfo.firstName}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.firstName ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors.billing?.firstName && (
                                                    <p className="text-sm text-red-600">{errors.billing.firstName}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                    Last Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={billingInfo.lastName}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.lastName ? 'border-red-500' : 'border-gray-300'
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
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={billingInfo.email}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.email ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors.billing?.email && (
                                                    <p className="text-sm text-red-600">{errors.billing.email}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <PhoneInput
                                                    country="lb"
                                                    value={billingInfo.phone}
                                                    onChange={handlePhoneChange}
                                                    inputClass={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.phone ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    containerClass="phone-input-container w-full"
                                                    buttonClass="phone-input-button !h-[50px] !min-h-[50px] !rounded-l-xl !border-r-0"
                                                    dropdownClass="phone-input-dropdown"
                                                    inputStyle={{
                                                        height: '50px',
                                                        width: '100%',
                                                        fontSize: '1rem',
                                                        borderRadius: '0.75rem',
                                                        borderLeft: 'none'
                                                    }}
                                                    buttonStyle={{
                                                        borderTopRightRadius: '0',
                                                        borderBottomRightRadius: '0',
                                                        borderTopLeftRadius: '0.75rem',
                                                        borderBottomLeftRadius: '0.75rem'
                                                    }}
                                                />
                                                {errors.billing?.phone && (
                                                    <p className="text-sm text-red-600">{errors.billing.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
                                                Institution Name
                                            </label>
                                            <input
                                                type="text"
                                                id="institutionName"
                                                name="institutionName"
                                                value={billingInfo.institutionName}
                                                onChange={handleBillingInfoChange}
                                                className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                    errors.billing?.institutionName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                Address Line 1 <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={billingInfo.address}
                                                onChange={handleBillingInfoChange}
                                                className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                    errors.billing?.address ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.billing?.address && (
                                                <p className="text-sm text-red-600">{errors.billing.address}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                id="address2"
                                                name="address2"
                                                value={billingInfo.address2}
                                                onChange={handleBillingInfoChange}
                                                className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                    errors.billing?.address2 ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                    Country <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    value={billingInfo.country}
                                                    onChange={handleBillingInfoChange}
                                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                        errors.billing?.country ? 'border-red-500' : 'border-gray-300'
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
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={billingInfo.city}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.city ? 'border-red-500' : 'border-gray-300'
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
                                                    State/Province/Region <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    value={billingInfo.state}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.state ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors.billing?.state && (
                                                    <p className="text-sm text-red-600">{errors.billing.state}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                                    ZIP/Postal Code <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="zipCode"
                                                    name="zipCode"
                                                    value={billingInfo.zipCode}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.zipCode ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors.billing?.zipCode && (
                                                    <p className="text-sm text-red-600">{errors.billing.zipCode}</p>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600">These credentials will be used to log in to your account</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    Password <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    value={billingInfo.password}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.password ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Create a password"
                                                />
                                                {errors.billing?.password && (
                                                    <p className="text-sm text-red-600">{errors.billing.password}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                                    Confirm Password <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={billingInfo.confirmPassword}
                                                    onChange={handleBillingInfoChange}
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.billing?.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Confirm your password"
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
                                        <h2 className="text-2xl font-semibold text-gray-900">Payment Information</h2>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center space-x-4 mb-6">
                                            <img src={visa} alt="Visa" className="h-8 transition-transform hover:scale-110" />
                                            <img src={mastercard} alt="Mastercard" className="h-8 transition-transform hover:scale-110" />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                                Card Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={paymentInfo.cardNumber}
                                                onChange={handlePaymentInfoChange}
                                                placeholder="1234 5678 9012 3456"
                                                className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                    errors.payment?.cardNumber ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.payment?.cardNumber && (
                                                <p className="text-sm text-red-600">{errors.payment.cardNumber}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                                    Expiry Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    value={paymentInfo.expiryDate}
                                                    onChange={handlePaymentInfoChange}
                                                    placeholder="MM/YY"
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.payment?.expiryDate ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors.payment?.expiryDate && (
                                                    <p className="text-sm text-red-600">{errors.payment.expiryDate}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                                    CVV <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="cvv"
                                                    name="cvv"
                                                    value={paymentInfo.cvv}
                                                    onChange={handlePaymentInfoChange}
                                                    placeholder="123"
                                                    className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                                        errors.payment?.cvv ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors.payment?.cvv && (
                                                    <p className="text-sm text-red-600">{errors.payment.cvv}</p>
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
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    {/* Billing Address Section */}
                                    <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <h2 className="text-2xl font-semibold text-gray-900">Billing Address</h2>
                                    </div>
                                    <div className="p-8">
                                        <div className="mb-6">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={useSameAddress}
                                                    onChange={handleUseSameAddressChange}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Use same address as account information</span>
                                            </label>
                                        </div>

                                        {!useSameAddress && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700">
                                                        Country <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="billingCountry"
                                                        name="country"
                                                        value={billingAddress.country}
                                                        onChange={handleBillingAddressChange}
                                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                            errors.billingAddress?.country ? 'border-red-500' : 'border-gray-300'
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
                                                        Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingAddress"
                                                        name="address"
                                                        value={billingAddress.address}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                            errors.billingAddress?.address ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {errors.billingAddress?.address && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.address}</p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label htmlFor="billingAddress2" className="block text-sm font-medium text-gray-700">
                                                        Address Line 2
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingAddress2"
                                                        name="address2"
                                                        value={billingAddress.address2}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                            errors.billingAddress?.address2 ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">
                                                        City <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingCity"
                                                        name="city"
                                                        value={billingAddress.city}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                            errors.billingAddress?.city ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {errors.billingAddress?.city && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.city}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">
                                                        State/Province/Region <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingState"
                                                        name="state"
                                                        value={billingAddress.state}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                            errors.billingAddress?.state ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {errors.billingAddress?.state && (
                                                        <p className="text-sm text-red-600">{errors.billingAddress.state}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700">
                                                        ZIP/Postal Code <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="billingZipCode"
                                                        name="zipCode"
                                                        value={billingAddress.zipCode}
                                                        onChange={handleBillingAddressChange}
                                                        className={`focus:outline-none w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                            errors.billingAddress?.zipCode ? 'border-red-500' : 'border-gray-300'
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
                                <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Plan</span>
                                        <span className="font-medium text-gray-900">{t.plans[selectedPlan as keyof typeof t.plans].name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Billing Period</span>
                                        <span className="font-medium text-gray-900">{isAnnual ? 'Annual' : 'Monthly'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Price</span>
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
                                                <h3 className="ml-3 text-lg font-semibold text-blue-900">Free Trial Available!</h3>
                                            </div>
                                            <p className="text-blue-800 mb-4">
                                                Start with a {isAnnual ? '30-day' : '7-day'} free trial. Your card will be charged after the trial period.
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-start text-sm text-blue-700">
                                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Cancel anytime during the trial to avoid charges</span>
                                                </div>
                                                <div className="flex items-start text-sm text-blue-700">
                                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Continue using all features until the trial ends, even after cancellation</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Plan Features */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
                                    <ul className="space-y-3">
                                        {t.plans[selectedPlan as keyof typeof t.plans].features.map((feature, index) => (
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
                                            <span>Annual Savings (20%)</span>
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
                                            <span>Promo Code Savings</span>
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
                                        {showPromoInput ? 'Hide Promo Code' : 'Add Promo Code'}
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
                                                    placeholder="Enter promo code"
                                                    className="focus:outline-none flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyPromo}
                                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                                                >
                                                    Apply
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
                                        <span className="text-lg font-semibold text-gray-900">Final Total Amount</span>
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
                                                    Back
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                className="w-full py-4 px-6 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                                            >
                                                {currentStep < 3 ? 'Continue' : 'Activate'}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-center text-gray-500">
                                        By completing your purchase, you agree to our Terms of Service, Privacy Policy, and Refund Policy.
                                    </p>
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