import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../translations';
import type { Language } from '../translations';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import { useLanguage } from '../contexts/LanguageContext';
import { FaHome, FaEnvelope, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonLoader from '../components/ButtonLoader';
import '../Landing.css';
import logo from "../assets/images/logo.png";
import { translateNewsletterError } from '../utils/Functions';

const Unsubscribe: React.FC = () => {
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage].newsletter;
    const [email, setEmail] = useState('');
    const [isUnsubscribing, setIsUnsubscribing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [originalServerMessage, setOriginalServerMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isRTL = currentLanguage === 'ar';

    // Update message when language changes
    useEffect(() => {
        if (originalServerMessage) {
            const translatedMessage = translateNewsletterError(originalServerMessage, translations[currentLanguage]);
            setMessage(prev => prev ? { ...prev, text: translatedMessage } : null);
        }
    }, [currentLanguage, originalServerMessage]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    };

    // Language dropdown functionality
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
        setTimeout(() => {
            setCurrentLanguage(langCode);
            const direction = getLanguageDirection(langCode);
            document.documentElement.dir = direction;
        }, 500);
        setIsLanguageDropdownOpen(false);
    };

    const handleUnsubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous messages
        setMessage(null);
        setOriginalServerMessage(null);

        // Validate email
        if (!email.trim()) {
            setMessage({ type: 'error', text: t.errors.email_required });
            return;
        }

        if (!validateEmail(email)) {
            setMessage({ type: 'error', text: t.errors.invalid_email });
            return;
        }

        setIsUnsubscribing(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletter/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store original message and translate it
                setOriginalServerMessage(data.message);
                const translatedMessage = translateNewsletterError(data.message, translations[currentLanguage]);
                setMessage({ type: 'success', text: translatedMessage });
                setEmail('');
            } else {
                // Store original message and translate it
                setOriginalServerMessage(data.message);
                const translatedMessage = translateNewsletterError(data.message, translations[currentLanguage]);
                setMessage({ type: 'error', text: translatedMessage });
            }
        } catch (error) {
            console.error('Newsletter unsubscription error:', error);
            setMessage({ type: 'error', text: t.errors.server_errors.network_error });
        } finally {
            setIsUnsubscribing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 4 }, (_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce floating-particle-${i + 1}`}
                    />
                ))}
                {Array.from({ length: 3 }, (_, i) => (
                    <div
                        key={i + 4}
                        className={`absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse floating-particle-${i + 5}`}
                    />
                ))}
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-lg"
                >
                    {/* Header with Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <motion.img
                                src={logo}
                                alt="Telmeez Logo"
                                className="h-20 w-auto cursor-pointer hover:scale-110 transition-transform duration-300"
                                onClick={() => navigate('/')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            />

                            <motion.div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <motion.button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className={`group inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 text-gray-600 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 force-white-bg`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-medium text-sm">{t.back_to_home}</span>
                                </motion.button>

                                {/* Language Dropdown */}
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
                                        <svg className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                {t.unsubscribe_title}
                            </h1>
                            <p className="text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
                                {t.subtitle}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Main Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20"
                    >
                        {/* Success/Error Message */}
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className={`mb-6 p-4 rounded-lg border flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} ${message.type === 'success'
                                        ? 'bg-green-50 border-green-200 text-green-800'
                                        : 'bg-red-50 border-red-200 text-red-800'
                                        }`}
                                >
                                    {message.type === 'success' ? (
                                        <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    ) : (
                                        <FaExclamationTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    )}
                                    <span className="font-medium text-sm">{message.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleUnsubscribe} className="space-y-6">
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                        <FaEnvelope className="w-4 h-4 text-blue-600" />
                                        <span>{t.email_placeholder}</span>
                                    </div>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.unsubscribe_placeholder}
                                        className={`w-full px-4 py-3 text-base rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${message?.type === 'error'
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 bg-white/50 hover:border-blue-300'
                                            }`}
                                    />
                                </div>
                            </div>

                            <ButtonLoader
                                type="submit"
                                isLoading={isUnsubscribing}
                                className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center justify-center">
                                    <FaTimes className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    {t.unsubscribe_button}
                                </span>
                            </ButtonLoader>
                        </form>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="mt-6 text-center"
                    >
                        <p className="text-gray-500 text-xs">
                            {t.changed_your_mind}
                            <button
                                type="button"
                                onClick={() => navigate('/', { state: { scrollTo: 'newsletter' } })}
                                className={`text-blue-600 bg-transparent m-0 p-0 border-none hover:text-blue-700 focus:outline-none font-medium hover:underline transition-colors duration-200 ${isRTL ? 'mr-1' : 'ml-1'}`}
                            >
                                {t.resubscribe}
                            </button>{' '}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Unsubscribe; 