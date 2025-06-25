import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import type { Language } from '../translations';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import logo from '../assets/images/logo.png';
import comingsoon from '../assets/images/comingsoon.svg';
import '../Landing.css';

const ComingSoon: React.FC = () => {
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage];
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    function calculateTimeLeft() {
        const targetDate = new Date('2025-12-01T00:00:00');
        const now = new Date();
        const difference = +targetDate - +now;

        const timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };

        return difference > 0 ? timeLeft : null;
    }

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
        setCurrentLanguage(langCode);
        // Set document direction based on language
        const direction = getLanguageDirection(langCode);
        document.documentElement.dir = direction;
        setIsLanguageDropdownOpen(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                    {/* Animated background blobs */}
                    <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-indigo-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
                    {/* Header with Logo and Language Toggle */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                        <img
                            src={logo}
                            alt="Telmeez Logo"
                            className="h-16 w-auto transition-transform hover:scale-105"
                        />
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type='button'
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium focus:outline-none force-white-bg"
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

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-8"
                        >
                            <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                                {t.comingSoon?.title}
                            </h1>
                            <div className="w-24 h-1 bg-indigo-400 mx-auto rounded-full"></div>
                            {timeLeft && (
                                <div className={`flex justify-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'} text-lg mt-4 font-semibold text-indigo-500 dark:text-indigo-300 mb-8`}>
                                    {Object.entries(timeLeft).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <div className="text-2xl font-bold">{value}</div>
                                            <div className="text-sm capitalize">
                                                {key === 'days' && t.days}
                                                {key === 'hours' && t.hours}
                                                {key === 'minutes' && t.minutes}
                                                {key === 'seconds' && t.seconds}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8"
                        >
                            <motion.img
                                src={comingsoon}
                                alt="Coming Soon Illustration"
                                className="max-w-md mx-auto w-full h-auto"
                                initial={{ y: 0 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;


