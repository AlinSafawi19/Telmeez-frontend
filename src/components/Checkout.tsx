import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';
import { countries } from 'countries-list';
import { parsePhoneNumber } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import visa from "../assets/images/visa.png";
import mastercard from "../assets/images/mastercard.png";

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

    const [phoneError, setPhoneError] = useState<string>('');

    const [promoCode, setPromoCode] = useState('');
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const [discount, setDiscount] = useState(0);

    const validatePhoneNumber = (phone: string, countryCode: CountryCode) => {
        try {
            const phoneNumber = parsePhoneNumber(phone, countryCode);
            return phoneNumber.isValid();
        } catch (error) {
            return false;
        }
    };

    const handlePhoneChange = (value: string, country: any) => {
        const countryCode = country.countryCode.toUpperCase() as CountryCode;
        const isValid = validatePhoneNumber(value, countryCode);

        setBillingInfo(prev => ({
            ...prev,
            phone: value
        }));

        if (!isValid) {
            setPhoneError('Please enter a valid phone number');
        } else {
            setPhoneError('');
        }
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

    const validateForm = () => {
        const newErrors: {
            billing?: Partial<BillingInfo>;
            billingAddress?: Partial<BillingAddress>;
            payment?: Partial<PaymentInfo>;
        } = {};

        // Validate billing info
        if (!billingInfo.firstName) newErrors.billing = { ...newErrors.billing, firstName: 'First name is required' };
        if (!billingInfo.lastName) newErrors.billing = { ...newErrors.billing, lastName: 'Last name is required' };
        if (!billingInfo.email) newErrors.billing = { ...newErrors.billing, email: 'Email is required' };
        if (!billingInfo.phone || phoneError) newErrors.billing = { ...newErrors.billing, phone: phoneError || 'Phone number is required' };
        if (!billingInfo.address) newErrors.billing = { ...newErrors.billing, address: 'Address is required' };
        if (!billingInfo.city) newErrors.billing = { ...newErrors.billing, city: 'City is required' };
        if (!billingInfo.state) newErrors.billing = { ...newErrors.billing, state: 'State is required' };
        if (!billingInfo.zipCode) newErrors.billing = { ...newErrors.billing, zipCode: 'ZIP code is required' };
        if (!billingInfo.country) newErrors.billing = { ...newErrors.billing, country: 'Country is required' };
        if (!billingInfo.password) newErrors.billing = { ...newErrors.billing, password: 'Password is required' };
        if (!billingInfo.confirmPassword) newErrors.billing = { ...newErrors.billing, confirmPassword: 'Please confirm your password' };
        if (billingInfo.password && billingInfo.confirmPassword && billingInfo.password !== billingInfo.confirmPassword) {
            newErrors.billing = { ...newErrors.billing, confirmPassword: 'Passwords do not match' };
        }
        if (billingInfo.password && billingInfo.password.length < 8) {
            newErrors.billing = { ...newErrors.billing, password: 'Password must be at least 8 characters long' };
        }

        // Validate billing address if not using same address
        if (!useSameAddress) {
            if (!billingAddress.firstName) newErrors.billingAddress = { ...newErrors.billingAddress, firstName: 'First name is required' };
            if (!billingAddress.lastName) newErrors.billingAddress = { ...newErrors.billingAddress, lastName: 'Last name is required' };
            if (!billingAddress.address) newErrors.billingAddress = { ...newErrors.billingAddress, address: 'Address is required' };
            if (!billingAddress.city) newErrors.billingAddress = { ...newErrors.billingAddress, city: 'City is required' };
            if (!billingAddress.state) newErrors.billingAddress = { ...newErrors.billingAddress, state: 'State is required' };
            if (!billingAddress.zipCode) newErrors.billingAddress = { ...newErrors.billingAddress, zipCode: 'ZIP code is required' };
            if (!billingAddress.country) newErrors.billingAddress = { ...newErrors.billingAddress, country: 'Country is required' };
        }

        // Validate payment info
        if (!paymentInfo.cardNumber) newErrors.payment = { ...newErrors.payment, cardNumber: 'Card number is required' };
        if (!paymentInfo.expiryDate) newErrors.payment = { ...newErrors.payment, expiryDate: 'Expiry date is required' };
        if (!paymentInfo.cvv) newErrors.payment = { ...newErrors.payment, cvv: 'CVV is required' };

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle successful submission
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
        <div className="min-h-screen bg-gray-50 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Billing Information */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={billingInfo.firstName}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.firstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billing?.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={billingInfo.lastName}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.lastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billing?.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.lastName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={billingInfo.email}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billing?.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <PhoneInput
                                            country="lb"
                                            value={billingInfo.phone}
                                            onChange={handlePhoneChange}
                                            inputClass={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            containerClass="phone-input-container"
                                            buttonClass="phone-input-button"
                                            dropdownClass="phone-input-dropdown"
                                        />
                                        {errors.billing?.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Institution Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="institutionName"
                                            name="institutionName"
                                            value={billingInfo.institutionName}
                                            onChange={handleBillingInfoChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={billingInfo.address}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.address ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billing?.address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.address}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="address2"
                                            name="address2"
                                            value={billingInfo.address2}
                                            onChange={handleBillingInfoChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={billingInfo.city}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billing?.city && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            State/Province/Region
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={billingInfo.state}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.state ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billing?.state && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.state}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                            ZIP/Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            value={billingInfo.zipCode}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.zipCode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billing?.zipCode && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.zipCode}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            value={billingInfo.country}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.country ? 'border-red-500' : 'border-gray-300'
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
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.country}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={billingInfo.password}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your password"
                                        />
                                        {errors.billing?.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={billingInfo.confirmPassword}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Confirm your password"
                                        />
                                        {errors.billing?.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.confirmPassword}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={billingInfo.password}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your password"
                                        />
                                        {errors.billing?.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={billingInfo.confirmPassword}
                                            onChange={handleBillingInfoChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billing?.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Confirm your password"
                                        />
                                        {errors.billing?.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing.confirmPassword}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <label className="text-sm font-medium text-gray-700">
                                            Pay with Credit Card
                                        </label>
                                    </div>

                                    <div className="flex space-x-2 mb-4">
                                        <img src={visa} alt="Visa" className="h-8" />
                                        <img src={mastercard} alt="Mastercard" className="h-8" />
                                    </div>
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            name="cardNumber"
                                            value={paymentInfo.cardNumber}
                                            onChange={handlePaymentInfoChange}
                                            placeholder="1234 5678 9012 3456"
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.payment?.cardNumber ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.payment?.cardNumber && (
                                            <p className="mt-1 text-sm text-red-600">{errors.payment.cardNumber}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                id="expiryDate"
                                                name="expiryDate"
                                                value={paymentInfo.expiryDate}
                                                onChange={handlePaymentInfoChange}
                                                placeholder="MM/YY"
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.payment?.expiryDate ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.payment?.expiryDate && (
                                                <p className="mt-1 text-sm text-red-600">{errors.payment.expiryDate}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                name="cvv"
                                                value={paymentInfo.cvv}
                                                onChange={handlePaymentInfoChange}
                                                placeholder="123"
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.payment?.cvv ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.payment?.cvv && (
                                                <p className="mt-1 text-sm text-red-600">{errors.payment.cvv}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Billing Address */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Address</h2>
                                <div className="mb-6">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={useSameAddress}
                                            onChange={handleUseSameAddressChange}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Same as account information</span>
                                    </label>
                                </div>
                                {!useSameAddress && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                                                Country
                                            </label>
                                            <select
                                                id="billingCountry"
                                                name="country"
                                                value={billingAddress.country}
                                                onChange={handleBillingAddressChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.country ? 'border-red-500' : 'border-gray-300'
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
                                                <p className="mt-1 text-sm text-red-600">{errors.billingAddress.country}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                id="billingAddress"
                                                name="address"
                                                value={billingAddress.address}
                                                onChange={handleBillingAddressChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.address ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.billingAddress?.address && (
                                                <p className="mt-1 text-sm text-red-600">{errors.billingAddress.address}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="billingAddress2" className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 2 (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="billingAddress2"
                                                name="address2"
                                                value={billingAddress.address2}
                                                onChange={handleBillingAddressChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                id="billingCity"
                                                name="city"
                                                value={billingAddress.city}
                                                onChange={handleBillingAddressChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.city ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.billingAddress?.city && (
                                                <p className="mt-1 text-sm text-red-600">{errors.billingAddress.city}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">
                                                State/Province/Region
                                            </label>
                                            <input
                                                type="text"
                                                id="billingState"
                                                name="state"
                                                value={billingAddress.state}
                                                onChange={handleBillingAddressChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.state ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.billingAddress?.state && (
                                                <p className="mt-1 text-sm text-red-600">{errors.billingAddress.state}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP/Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                id="billingZipCode"
                                                name="zipCode"
                                                value={billingAddress.zipCode}
                                                onChange={handleBillingAddressChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.billingAddress?.zipCode ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.billingAddress?.zipCode && (
                                                <p className="mt-1 text-sm text-red-600">{errors.billingAddress.zipCode}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
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
                                    {(isAnnual || discount > 0) && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span>Total Savings</span>
                                            <span>{getTotalSavings()}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowPromoInput(!showPromoInput)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
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
                                            <div className="mt-2">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={promoCode}
                                                        onChange={handlePromoCodeChange}
                                                        placeholder="Enter promo code"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleApplyPromo}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                                {promoError && (
                                                    <p className="mt-1 text-sm text-red-600">{promoError}</p>
                                                )}
                                                {promoSuccess && (
                                                    <p className="mt-1 text-sm text-green-600">{promoSuccess}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-semibold text-gray-900">{getTotalPrice()}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 rounded-lg font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Complete Purchase
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 