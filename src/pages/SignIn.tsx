import React, { useState } from 'react';
import signinsvg from '../assets/images/signin-illustration.svg';
import logo from '../assets/images/logo.png';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const t = translations[currentLanguage];

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'عربي' },
        { code: 'fr', label: 'Français' }
    ];

    const handleLanguageChange = (langCode: Language) => {
        setCurrentLanguage(langCode);
        setIsLanguageDropdownOpen(false);
        // Update document direction for RTL languages
        if (langCode === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement sign in logic
        console.log('Sign in attempt with:', { email, password });
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
                <div className="flex flex-col items-start">
                    <div className="flex justify-between items-center w-full">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="h-24 w-auto"
                        />
                        <div className="relative">
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
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 text-gray-600 hover:text-indigo-600 transition-colors mb-4 focus:outline-none"
                        aria-label="Back to home"
                    >
                        <FaHome className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-md w-full space-y-8">
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
                                    />
                                    <label htmlFor="remember-me" className={`${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'} block text-sm text-gray-900`}>
                                        {t.header.remember_me}
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        {t.header.forgot_password}
                                    </a>
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
        </div>
    );
};

export default SignIn; 