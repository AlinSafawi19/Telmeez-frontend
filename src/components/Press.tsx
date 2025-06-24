import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingOverlay from './LoadingOverlay';

interface Announcement {
    title: string;
    description: string;
    date: string;
}

interface PressSection {
    title: string;
    description: string;
    announcements?: Announcement[];
}

const Press: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].about;
    const isRTL = currentLanguage === 'ar';
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="bg-gradient-to-b from-blue-50 to-indigo-100 py-20" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">{t.press.title}</h2>
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        {t.press.description}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex focus:outline-none items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                    >
                        <span className="rtl:ml-2 ltr:mr-2">📰</span>
                        {translations[currentLanguage].newsletter.title}
                    </motion.button>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {(t.press as PressSection).announcements?.map((announcement: Announcement, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 border border-gray-100"
                        >
                            <div className="text-blue-600 text-sm font-semibold mb-2">{announcement.date}</div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">{announcement.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{announcement.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {isLoading && (
                <LoadingOverlay isLoading={isLoading} />
            )}
        </div>
    );
};

export default Press; 