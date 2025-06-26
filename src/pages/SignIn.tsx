import React, { useState, useEffect, useRef } from 'react';
import signinsvg from '../assets/images/signin-illustration.svg';
import logo from '../assets/images/logo.png';
import { FaHome } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import '../Landing.css';
import LoadingOverlay from '../components/LoadingOverlay';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage].header;
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
            setErrors(prev => ({ ...prev, email: t.signin_errors.email_required }));
        }
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: t.signin_errors.password_required }));
        }
    }, [currentLanguage, t.signin_errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({});

        // Validate email
        if (!email) {
            setErrors(prev => ({ ...prev, email: t.signin_errors.email_required }));
            return;
        }

        // Validate password
        if (!password) {
            setErrors(prev => ({ ...prev, password: t.signin_errors.password_required }));
            return;
        }
    };

    const handleCreateAccount = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
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
                            onClick={() => navigate('/')}
                            className="flex focus:outline-none items-center gap-1 px-3 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-lg hover:bg-gray-100 force-white-bg"
                            aria-label="Back to home"
                        >
                            <FaHome className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:inline">{t.back_to_home}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Left side - Sign in form */}
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
                                    type='button'
                                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                    className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none force-white-bg"
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
                                                type='button'
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none force-white-bg${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'bg-transparent'}`}
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
                                className="flex focus:outline-none items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50 force-white-bg"
                                aria-label="Back to sign in"
                            >
                                <FaHome className="w-5 h-5" />
                                <span className="text-sm font-medium">{t.back_to_home}</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                            {t.signin}
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            {t.not_member}{' '}
                            <button
                                type='button'
                                onClick={handleCreateAccount}
                                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition-colors duration-200 border-0 bg-transparent p-0"
                            >
                                {t.register}
                            </button>
                        </p>
                    </div>

                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.email}
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    className={`appearance-none relative block w-full px-3 py-3 border rounded-lg force-white-bg ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base`}
                                    placeholder={t.email}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) {
                                            setErrors(prev => ({ ...prev, email: undefined }));
                                        }
                                    }}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.password}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className={`appearance-none relative block w-full px-3 py-3 border rounded-lg force-white-bg ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base`}
                                    placeholder={t.password}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) {
                                            setErrors(prev => ({ ...prev, password: undefined }));
                                        }
                                    }}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded force-white-bg"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className={`${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'} block text-sm text-gray-900`}>
                                    {t.remember_me}
                                </label>
                            </div>

                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition-colors duration-200 border-0 bg-transparent p-0"
                                >
                                    {t.forgot_password}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                {t.signin}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side - Image (hidden on mobile, visible on desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center">
                <img
                    src={signinsvg}
                    alt="Sign in illustration"
                    className="max-w-lg w-full"
                />
            </div>

            {isLoading && (
                <LoadingOverlay isLoading={isLoading} />
            )}
        </div>
    );
};

export default SignIn; 