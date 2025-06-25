import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaEnvelope } from 'react-icons/fa';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import logo from '../assets/images/logo.png';
import forgetpasssvvg from '../assets/images/forgotpass-illustration.svg';
import '../Landing.css';
import LoadingOverlay from '../components/LoadingOverlay';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string }>({});
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

    const handleLanguageChange = (langCode: Language) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setCurrentLanguage(langCode);
            // Set document direction based on language
            const direction = getLanguageDirection(langCode);
            document.documentElement.dir = direction;
        }, 500);
        setIsLanguageDropdownOpen(false);
    };

    // Update error messages when language changes
    useEffect(() => {
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: t.header.signin_errors.email_required }));
        }
    }, [currentLanguage, t.header.signin_errors]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({});

        // Validate email
        if (!email) {
            setErrors(prev => ({ ...prev, email: t.header.signin_errors.email_required }));
            return;
        }

        // TODO: Implement password reset request logic
        console.log('Password reset requested for:', email);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-indigo-50 to-white">
            {/* Mobile Header - Only visible on mobile */}
            <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="h-20 w-20 transition-transform cursor-pointer hover:opacity-80"
                        />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none p-2 rounded-lg hover:bg-gray-100 force-white-bg"
                                aria-label="Select language"
                            >
                                <span className="text-sm font-medium">
                                    {LANGUAGES.find(lang => lang.code === currentLanguage)?.label}
                                </span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isLanguageDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`flex items-center w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'bg-transparent'}`}
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
                            onClick={() => navigate('/signin')}
                            className="flex focus:outline-none items-center gap-1 px-3 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-lg hover:bg-gray-100 force-white-bg focus:outline-none"
                            aria-label="Back to sign in"
                        >
                            <FaHome className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:inline">{t.header.back_to_signin}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Left side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="w-full max-w-md mx-auto space-y-6 lg:space-y-8">
                    {/* Desktop Header - Only visible on desktop */}
                    <div className="hidden lg:flex items-center justify-between mb-8">
                        <Link to="/">
                            <img
                                src={logo}
                                alt="Company Logo"
                                className="h-16 w-auto transition-transform cursor-pointer hover:opacity-80"
                            />
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                    className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none"
                                    aria-label="Select language"
                                >
                                    <span className="font-medium">
                                        {LANGUAGES.find(lang => lang.code === currentLanguage)?.label}
                                    </span>
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isLanguageDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none force-white-bg ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'bg-transparent'}`}
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
                                onClick={() => navigate('/signin')}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50 force-white-bg focus:outline-none"
                                aria-label="Back to sign in"
                            >
                                <FaHome className="w-5 h-5" />
                                <span className="text-sm font-medium">{t.header.back_to_signin}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                                {t.header.forgot_password}
                            </h1>
                            <p className="text-gray-600 text-base sm:text-lg">
                                {t.header.forgot_password_desc}
                            </p>
                        </div>

                        {!isSubmitted ? (
                            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                        {t.header.email}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="text"
                                            autoComplete="email"
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 force-white-bg`}
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) {
                                                    setErrors(prev => ({ ...prev, email: undefined }));
                                                }
                                            }}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {t.header.reset_password}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-100">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-green-700 font-medium">
                                    {t.header.password_reset_success}
                                </p>
                                <button
                                    onClick={() => navigate('/signin')}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                                >
                                    {t.header.back_to_signin}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center p-12">
                <div className="max-w-lg w-full space-y-8">
                    <img
                        src={forgetpasssvvg}
                        alt="Forgot Password Illustration"
                        className="w-full h-auto transition-transform duration-300"
                    />
                    <div className="text-center text-white space-y-4">
                        <h2 className="text-2xl font-bold">{t.header.dont_worry}</h2>
                        <p className="text-indigo-100">
                            {t.header.recover_password}
                        </p>
                    </div>
                </div>
            </div>

            {isLoading && (
                <LoadingOverlay isLoading={isLoading} />
            )}
        </div>
    );
};

export default ForgotPassword; 