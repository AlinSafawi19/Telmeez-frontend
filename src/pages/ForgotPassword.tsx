import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaEnvelope } from 'react-icons/fa';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/images/logo.png';
import forgetpasssvvg from '../assets/images/forgotpass-illustration.svg';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement password reset request logic
        console.log('Password reset requested for:', email);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-white">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12">
                <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="h-16 w-auto transition-transform hover:scale-105"
                        />
                        <button
                            onClick={() => navigate('/signin')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 rounded-full hover:bg-indigo-50"
                            aria-label="Back to sign in"
                        >
                            <FaHome className="w-5 h-5" />
                            <span className="text-sm font-medium">{t.header.back_to_signin}</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                {t.header.forgot_password}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {t.header.forgot_password_desc}
                            </p>
                        </div>

                        {!isSubmitted ? (
                            <form className="space-y-6" onSubmit={handleSubmit}>
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
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {t.header.reset_password}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4 p-6 bg-green-50 rounded-xl border border-green-100">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-green-700 font-medium">
                                    {t.header.reset_password_sent}
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
                        <h2 className="text-2xl font-bold">Don't worry!</h2>
                        <p className="text-indigo-100">
                            We'll help you recover your password in no time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 