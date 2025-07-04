import React, { useState, useEffect, useRef } from 'react';
import signinsvg from '../assets/images/signin-illustration.svg';
import logo from '../assets/images/logo.png';
import { FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import { getRememberMePreference, setRememberMePreference } from '../utils/Functions';
import '../Landing.css';
import LoadingOverlay from '../components/LoadingOverlay';
import ButtonLoader from '../components/ButtonLoader';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        // Load remember me preference from localStorage
        return getRememberMePreference();
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string; errorCode?: string }>({});
    const navigate = useNavigate();
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const { signIn, isAuthenticated } = useAuth();
    const t = translations[currentLanguage].header;
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/overview');
        }
    }, [isAuthenticated, navigate]);

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
        if (errors.errorCode && !errors.general) {
            // Only set general error if it's not already set (for lockout errors)
            let errorMsg = t.signin_errors.general_error || 'An error occurred during sign in. Please try again.';
            switch (errors.errorCode) {
                case 'EMAIL_REQUIRED':
                    errorMsg = t.signin_errors.email_required;
                    break;
                case 'PASSWORD_REQUIRED':
                    errorMsg = t.signin_errors.password_required;
                    break;
                case 'INVALID_CREDENTIALS':
                    errorMsg = t.signin_errors.invalid_credentials;
                    break;
                case 'ACCOUNT_DEACTIVATED':
                    errorMsg = t.signin_errors.account_deactivated;
                    break;
                case 'ACCOUNT_LOCKED':
                    errorMsg = t.signin_errors.account_locked;
                    break;
                case 'IP_LOCKED':
                    errorMsg = t.signin_errors.ip_locked;
                    break;
                case 'RATE_LIMIT_EXCEEDED':
                    errorMsg = t.signin_errors.rate_limit_exceeded;
                    break;
                case 'USER_ROLE_NOT_FOUND':
                    errorMsg = t.signin_errors.general_error;
                    break;
                default:
                    errorMsg = t.signin_errors.general_error;
            }
            setErrors(prev => ({ ...prev, general: errorMsg }));
        }

        // Re-translate lockout messages when language changes
        if (errors.errorCode && errors.general &&
            (errors.errorCode === 'ACCOUNT_LOCKED' || errors.errorCode === 'IP_LOCKED' || errors.errorCode === 'RATE_LIMIT_EXCEEDED')) {
            // Extract time from current message
            const timeMatch = errors.general.match(/(\d+)\s*minutes?/i);
            if (timeMatch) {
                const timeValue = timeMatch[1];
                const translatedMessage = translateLockoutMessage(`dummy message with ${timeValue} minutes`, errors.errorCode);
                setErrors(prev => ({ ...prev, general: translatedMessage }));
            }
        }
    }, [currentLanguage, t.signin_errors, errors.errorCode]);

    const handleSubmit = async (e: React.FormEvent) => {
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

        // Attempt to sign in
        try {
            setIsSigningIn(true);
            await signIn({ email, password, rememberMe });

            // The remember me functionality is handled by the backend through cookie expiry times
            // When rememberMe is true, cookies have longer expiry (7 days for access, 30 days for refresh)
            // When rememberMe is false, cookies have shorter expiry (1 hour for access, 7 days for refresh)

            // Navigate to dashboard on success
            navigate('/overview');
        } catch (error: any) {
            console.error('Sign in error:', error);
            let errorCode = 'INTERNAL_SERVER_ERROR';
            let backendMessage = '';

            if (error && error.message) {
                // Try to parse error_code from backend response
                try {
                    const parsed = JSON.parse(error.message);
                    if (parsed && parsed.error_code) {
                        errorCode = parsed.error_code;
                        backendMessage = parsed.message || '';
                    }
                } catch {
                    // Fallback to string matching if not JSON
                    if (error.message.includes('Invalid email or password')) {
                        errorCode = 'INVALID_CREDENTIALS';
                    } else if (error.message.includes('Account is deactivated')) {
                        errorCode = 'ACCOUNT_DEACTIVATED';
                    }
                }
            }

            setErrors(prev => ({
                ...prev,
                general: '', // Will be set by useEffect
                errorCode: errorCode
            }));

            // For lockout errors, show the backend message directly (includes time)
            if (errorCode === 'ACCOUNT_LOCKED' || errorCode === 'IP_LOCKED' || errorCode === 'RATE_LIMIT_EXCEEDED') {
                const translatedMessage = translateLockoutMessage(backendMessage, errorCode);
                setErrors(prev => ({
                    ...prev,
                    general: translatedMessage || 'Account temporarily locked. Please try again later.'
                }));
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleCreateAccount = () => {
        navigate('/');
    };

    // Function to translate lockout messages while preserving time
    const translateLockoutMessage = (backendMessage: string, errorCode: string): string => {
        // Extract time from backend message
        const timeMatch = backendMessage.match(/(\d+)\s*minutes?/i);
        const timeValue = timeMatch ? timeMatch[1] : '';

        // Get translation based on error code
        let translatedMessage = '';
        switch (errorCode) {
            case 'RATE_LIMIT_EXCEEDED':
                translatedMessage = t.signin_errors.rate_limit_exceeded;
                break;
            case 'ACCOUNT_LOCKED':
                translatedMessage = t.signin_errors.account_locked;
                break;
            case 'IP_LOCKED':
                translatedMessage = t.signin_errors.ip_locked;
                break;
            default:
                return backendMessage; // Fallback to original message
        }

        // Replace "later" or similar with the actual time
        if (timeValue) {
            const timeText = timeValue === '1' ? t.lockout_messages.minutes : t.lockout_messages.minutes_plural;
            return translatedMessage.replace(/later\.?/i, `in ${timeValue} ${timeText}.`);
        }

        return translatedMessage;
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

                    {/* General error message */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-600">{errors.general}</p>
                        </div>
                    )}

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
                                        if (errors.general) {
                                            setErrors(prev => ({ ...prev, general: undefined }));
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const passwordInput = document.getElementById('password') as HTMLInputElement;
                                            if (passwordInput) {
                                                passwordInput.focus();
                                            }
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
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        className={`appearance-none relative block w-full px-3 py-3 border rounded-lg force-white-bg ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base`}
                                        placeholder={t.password}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) {
                                                setErrors(prev => ({ ...prev, password: undefined }));
                                            }
                                            if (errors.general) {
                                                setErrors(prev => ({ ...prev, general: undefined }));
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none border-none bg-transparent ${currentLanguage === 'ar' ? 'left-2' : 'right-2'}`}
                                    >
                                        {showPassword ? (
                                            <FaEye className="w-5 h-5" />
                                        ) : (
                                            <FaEyeSlash className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
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
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setRememberMe(checked);
                                        // Save remember me preference to localStorage
                                        setRememberMePreference(checked);
                                    }}
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
                            <ButtonLoader
                                type="submit"
                                isLoading={isSigningIn}
                                disabled={isSigningIn}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.signin}
                            </ButtonLoader>
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