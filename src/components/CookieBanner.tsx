import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { translations } from '../translations';

const CookieBanner: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const { preferences, updatePreferences, hasUserConsent } = useCookieConsent();
    const t = translations[currentLanguage].cookie_banner;

    const [showCustomize, setShowCustomize] = useState(false);
    const [localPreferences, setLocalPreferences] = useState(preferences);
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        setLocalPreferences(allAccepted);
        updatePreferences(allAccepted);
    };

    const handleRejectAll = () => {
        const allRejected = {
            necessary: true, // Always true as it's required
            analytics: false,
            marketing: false
        };
        setLocalPreferences(allRejected);
        updatePreferences(allRejected);
    };

    const handleCustomize = () => {
        setShowCustomize(true);
    };

    const handlePreferenceChange = (type: keyof typeof preferences) => {
        if (type === 'necessary') return; // Cannot change necessary cookies
        setLocalPreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleSavePreferences = () => {
        updatePreferences(localPreferences);
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 3000);
    };

    if (hasUserConsent) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-800 p-6 z-50"
            >
                <div className="container mx-auto max-w-5xl">
                    {!showCustomize ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex-1 space-y-3">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {t.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t.description}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-6 py-2.5 bg-indigo-600 focus:outline-none text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                                >
                                    {t.accept_all}
                                </button>
                                <button
                                    onClick={handleRejectAll}
                                    className="px-6 py-2.5 bg-gray-100 focus:outline-none dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                                >
                                    {t.reject_all}
                                </button>
                                <button
                                    onClick={handleCustomize}
                                    className="px-6 py-2.5 focus:outline-none bg-transparent text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 font-medium"
                                >
                                    {t.customize}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                mass: 1
                            }}
                            className="space-y-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex justify-between items-center"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {t.title}
                                </h3>
                                <button
                                    onClick={() => setShowCustomize(false)}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                    aria-label="Close cookie preferences"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl"
                            >
                                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={localPreferences.necessary}
                                            disabled
                                            className="h-5 w-5 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-700"
                                            aria-label="Necessary cookies"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-base font-medium text-gray-900 dark:text-white">{t.necessary}</label>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t.necessary_desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={localPreferences.analytics}
                                            onChange={() => handlePreferenceChange('analytics')}
                                            className="h-5 w-5 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-700"
                                            aria-label="Analytics cookies"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-base font-medium text-gray-900 dark:text-white">{t.analytics}</label>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t.analytics_desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={localPreferences.marketing}
                                            onChange={() => handlePreferenceChange('marketing')}
                                            className="h-5 w-5 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-700"
                                            aria-label="Marketing cookies"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-base font-medium text-gray-900 dark:text-white">{t.marketing}</label>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t.marketing_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSavePreferences}
                                    className="px-6 py-2.5 bg-indigo-600 focus:outline-none text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                                >
                                    {t.save_preferences}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
                <AnimatePresence>
                    {showSavedMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium"
                        >
                            {t.preferences_saved}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};

export default CookieBanner; 