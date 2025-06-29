import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaEnvelope, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import authService from '../services/authService';
import logo from '../assets/images/logo.png';
import forgetpasssvvg from '../assets/images/forgotpass-illustration.svg';
import '../Landing.css';
import LoadingOverlay from '../components/LoadingOverlay';
import ButtonLoader from '../components/ButtonLoader';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [errors, setErrors] = useState<{ 
        email?: string; 
        code?: string; 
        password?: string; 
        confirmPassword?: string;
        general?: string;
        errorCode?: string;
    }>({});
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
        if (errors.errorCode) {
            let errorMsg = t.header.forgot_password_errors.general_error || 'An error occurred. Please try again.';
            switch (errors.errorCode) {
                case 'EMAIL_REQUIRED':
                    errorMsg = t.header.forgot_password_errors.email_required;
                    break;
                case 'CODE_REQUIRED':
                    errorMsg = t.header.forgot_password_errors.code_required;
                    break;
                case 'PASSWORD_REQUIRED':
                    errorMsg = t.header.forgot_password_errors.password_required;
                    break;
                case 'PASSWORD_TOO_SHORT':
                    errorMsg = t.header.forgot_password_errors.password_too_short;
                    break;
                case 'INVALID_OR_EXPIRED_CODE':
                    errorMsg = t.header.forgot_password_errors.invalid_or_expired_code;
                    break;
                case 'USER_NOT_FOUND':
                    errorMsg = t.header.forgot_password_errors.user_not_found;
                    break;
                case 'EMAIL_SEND_FAILED':
                    errorMsg = t.header.forgot_password_errors.email_send_failed;
                    break;
                default:
                    errorMsg = t.header.forgot_password_errors.general_error;
            }
            setErrors(prev => ({ ...prev, general: errorMsg }));
        }
    }, [currentLanguage, t.header.signin_errors, t.header.forgot_password_errors, errors.errorCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({});

        // Validate email
        if (!email) {
            setErrors(prev => ({ ...prev, email: t.header.signin_errors.email_required }));
            return;
        }

        try {
            setIsVerifyingCode(true);
            await authService.forgotPassword({ email });
            setStep('code');
        } catch (error: any) {
            console.error('Forgot password error:', error);
            let errorCode = 'INTERNAL_SERVER_ERROR';
            
            if (error && error.message) {
                // Try to parse error_code from backend response
                try {
                    const parsed = JSON.parse(error.message);
                    if (parsed && parsed.error_code) {
                        errorCode = parsed.error_code;
                    }
                } catch {
                    // Fallback to string matching if not JSON
                    if (error.message.includes('Email is required')) {
                        errorCode = 'EMAIL_REQUIRED';
                    } else if (error.message.includes('Failed to send')) {
                        errorCode = 'EMAIL_SEND_FAILED';
                    }
                }
            }
            
            setErrors(prev => ({ 
                ...prev, 
                general: '', // Will be set by useEffect
                errorCode: errorCode 
            }));
        } finally {
            setIsVerifyingCode(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({});

        // Validate code
        if (!verificationCode) {
            setErrors(prev => ({ ...prev, code: 'Verification code is required' }));
            return;
        }

        try {
            setIsVerifyingCode(true);
            await authService.verifyResetCode({ email, code: verificationCode });
            setStep('password');
        } catch (error: any) {
            console.error('Verify code error:', error);
            let errorCode = 'INTERNAL_SERVER_ERROR';
            
            if (error && error.message) {
                // Try to parse error_code from backend response
                try {
                    const parsed = JSON.parse(error.message);
                    if (parsed && parsed.error_code) {
                        errorCode = parsed.error_code;
                    }
                } catch {
                    // Fallback to string matching if not JSON
                    if (error.message.includes('Email is required')) {
                        errorCode = 'EMAIL_REQUIRED';
                    } else if (error.message.includes('Verification code is required')) {
                        errorCode = 'CODE_REQUIRED';
                    } else if (error.message.includes('Invalid or expired')) {
                        errorCode = 'INVALID_OR_EXPIRED_CODE';
                    }
                }
            }
            
            setErrors(prev => ({ 
                ...prev, 
                general: '', // Will be set by useEffect
                errorCode: errorCode 
            }));
        } finally {
            setIsVerifyingCode(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({});

        // Validate password
        if (!newPassword) {
            setErrors(prev => ({ ...prev, password: t.header.forgot_password_errors.password_required }));
            return;
        }

        if (newPassword.length < 8) {
            setErrors(prev => ({ ...prev, password: t.header.forgot_password_errors.password_too_short }));
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: t.header.forgot_password_errors.passwords_dont_match }));
            return;
        }

        try {
            setIsResettingPassword(true);
            await authService.resetPassword({ 
                email, 
                code: verificationCode, 
                newPassword 
            });
            setStep('success');
        } catch (error: any) {
            console.error('Reset password error:', error);
            let errorCode = 'INTERNAL_SERVER_ERROR';
            
            if (error && error.message) {
                // Try to parse error_code from backend response
                try {
                    const parsed = JSON.parse(error.message);
                    if (parsed && parsed.error_code) {
                        errorCode = parsed.error_code;
                    }
                } catch {
                    // Fallback to string matching if not JSON
                    if (error.message.includes('Email is required')) {
                        errorCode = 'EMAIL_REQUIRED';
                    } else if (error.message.includes('Verification code is required')) {
                        errorCode = 'CODE_REQUIRED';
                    } else if (error.message.includes('New password is required')) {
                        errorCode = 'PASSWORD_REQUIRED';
                    } else if (error.message.includes('at least 8 characters')) {
                        errorCode = 'PASSWORD_TOO_SHORT';
                    } else if (error.message.includes('Invalid or expired')) {
                        errorCode = 'INVALID_OR_EXPIRED_CODE';
                    } else if (error.message.includes('User not found')) {
                        errorCode = 'USER_NOT_FOUND';
                    }
                }
            }
            
            setErrors(prev => ({ 
                ...prev, 
                general: '', // Will be set by useEffect
                errorCode: errorCode 
            }));
        } finally {
            setIsResettingPassword(false);
        }
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
                            className="flex focus:outline-none items-center px-3 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-lg hover:bg-gray-100 force-white-bg focus:outline-none"
                            aria-label="Back to sign in"
                        >
                            <FaHome className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:inline rtl:mr-2 ltr:ml-2">{t.header.back_to_signin}</span>
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
                                className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50 force-white-bg focus:outline-none"
                                aria-label="Back to sign in"
                            >
                                <FaHome className="w-5 h-5" />
                                <span className="text-sm font-medium rtl:mr-2 ltr:ml-2">{t.header.back_to_signin}</span>
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

                        {step === 'email' && (
                            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                        {t.header.email}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 rtl:right-0 rtl:pr-3 ltr:left-0 ltr:pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="text"
                                            autoComplete="email"
                                            className={`block w-full rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 force-white-bg`}
                                            placeholder={t.header.forgot_password_email_placeholder}
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
                        )}

                        {step === 'code' && (
                            <form className="space-y-4 sm:space-y-6" onSubmit={handleVerifyCode}>
                                <div className="space-y-2">
                                    <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                                        {t.header.verification_code}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 rtl:right-0 rtl:pr-3 ltr:left-0 ltr:pl-3 flex items-center pointer-events-none">
                                            <FaKey className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="verification-code"
                                            name="verification-code"
                                            type="text"
                                            autoComplete="one-time-code"
                                            className={`block w-full rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-3 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 force-white-bg`}
                                            placeholder={t.header.verification_code_placeholder}
                                            value={verificationCode}
                                            onChange={(e) => {
                                                setVerificationCode(e.target.value);
                                                if (errors.code) {
                                                    setErrors(prev => ({ ...prev, code: undefined }));
                                                }
                                            }}
                                        />
                                    </div>
                                    {errors.code && (
                                        <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                    )}
                                </div>

                                <ButtonLoader
                                    type="submit"
                                    isLoading={isVerifyingCode}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {t.header.verify_code}
                                </ButtonLoader>
                            </form>
                        )}

                        {step === 'password' && (
                            <form className="space-y-4 sm:space-y-6" onSubmit={handleResetPassword}>
                                <div className="space-y-2">
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                        {t.header.new_password}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="new-password"
                                            name="new-password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            className={`block w-full rtl:pr-3 rtl:pl-10 ltr:pl-3 ltr:pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 force-white-bg`}
                                            placeholder={t.header.new_password_placeholder}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                if (errors.password) {
                                                    setErrors(prev => ({ ...prev, password: undefined }));
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
                                                    if (confirmPasswordInput) {
                                                        confirmPasswordInput.focus();
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute rtl:left-2 ltr:right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none border-none bg-transparent"
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

                                <div className="space-y-2">
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                        {t.header.confirm_password}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            className={`block w-full rtl:pr-3 rtl:pl-10 ltr:pl-3 ltr:pr-10 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 force-white-bg`}
                                            placeholder={t.header.confirm_password_placeholder}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (errors.confirmPassword) {
                                                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute rtl:left-2 ltr:right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none border-none bg-transparent"
                                        >
                                            {showConfirmPassword ? (
                                                <FaEye className="w-5 h-5" />
                                            ) : (
                                                <FaEyeSlash className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <ButtonLoader
                                    type="submit"
                                    isLoading={isResettingPassword}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {t.header.reset_password}
                                </ButtonLoader>
                            </form>
                        )}

                        {step === 'success' && (
                            <div className="text-center space-y-6 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-lg">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-green-800">
                                        {t.header.password_reset_success}
                                    </h3>
                                    <p className="text-green-700 text-base">
                                        {t.header.password_reset_success_desc}
                                    </p>
                                </div>
                                <div className="pt-4">
                                <button
                                    onClick={() => navigate('/signin')}
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                >
                                        <svg className="w-5 h-5 rtl:ml-2 ltr:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    {t.header.back_to_signin}
                                </button>
                                </div>
                            </div>
                        )}

                        {/* General error message */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-600">{errors.general}</p>
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