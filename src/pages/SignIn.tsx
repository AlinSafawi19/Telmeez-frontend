import React, { useState, useEffect, useRef } from 'react';
import signinsvg from '../assets/images/signin-illustration.svg';
import logo from '../assets/images/logo.png';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import logoarb from '../assets/images/logo_arb.png';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage];
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Load saved credentials if they exist and user has given consent
    useEffect(() => {
        const cookieConsent = localStorage.getItem('cookieConsent');
        const hasConsent = cookieConsent ? JSON.parse(cookieConsent).necessary : false;

        if (hasConsent) {
            const savedEmail = localStorage.getItem('rememberedEmail');
            if (savedEmail) {
                setEmail(savedEmail);
                setRememberMe(true);
            }
        }
    }, []);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'عربي' },
        { code: 'fr', label: 'Français' }
    ];

    const handleLanguageChange = (langCode: Language) => {
        setIsScrolling(true);
        setTimeout(() => {
            setIsScrolling(false);
            setCurrentLanguage(langCode);
            // Here you would typically also update the document direction for RTL languages
            if (langCode === 'ar') {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
        }, 500);
        setIsLanguageDropdownOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save email if remember me is checked and user has given consent
        const cookieConsent = localStorage.getItem('cookieConsent');
        const hasConsent = cookieConsent ? JSON.parse(cookieConsent).necessary : false;

        if (rememberMe && hasConsent) {
            localStorage.setItem('rememberedEmail', email);
        } else if (!rememberMe) {
            localStorage.removeItem('rememberedEmail');
        }
    };

    const handleCreateAccount = () => {
        navigate('/');
        // Use setTimeout to ensure the navigation completes before scrolling
        setTimeout(() => {
            const pricingSection = document.querySelector('[data-section="pricing"]');
            if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left side - Sign in form */}
            <div className="w-1/2 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-md w-full space-y-8">
                        <div className="flex items-center justify-between mb-8">
                            <img
                                src={currentLanguage === 'ar' ? logoarb : logo}
                                alt="Company Logo"
                                className="h-16 w-auto transition-transform"
                            />
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
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50"
                                    aria-label="Back to sign in"
                                >
                                    <FaHome className="w-5 h-5" />
                                    <span className="text-sm font-medium">{t.header.back_to_home}</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                {t.header.signin}
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                {t.header.not_member}{' '}
                                <button
                                    onClick={handleCreateAccount}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition-colors duration-200 border-0 bg-transparent p-0"
                                >
                                    {t.header.register}
                                </button>
                            </p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="email-address" className="sr-only">
                                        {t.header.email}
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder={t.header.email}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        {t.header.password}
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder={t.header.password}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="remember-me" className={`${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'} block text-sm text-gray-900`}>
                                        {t.header.remember_me}
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <button
                                        onClick={() => navigate('/forgot-password')}
                                        className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition-colors duration-200 border-0 bg-transparent p-0"
                                    >
                                        {t.header.forgot_password}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {t.header.signin}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="w-1/2 bg-indigo-600 flex items-center justify-center">
                <img
                    src={signinsvg}
                    alt="Sign in illustration"
                    className="max-w-lg w-full"
                />
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
        </div>
    );
};

export default SignIn; 