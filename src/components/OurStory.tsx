import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';

const OurStory: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].about;
    const isRTL = currentLanguage === 'ar';

    return (
        <div className="bg-gradient-to-b from-blue-50 to-indigo-100 py-20" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">{t.our_story.title}</h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        {t.our_story.description}
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            icon: "🎯",
                            title: t.mission.title,
                            description: t.mission.description
                        },
                        {
                            icon: "👁️",
                            title: t.vision.title,
                            description: t.vision.description
                        },
                        {
                            icon: "💎",
                            title: t.values.title,
                            description: t.values.description
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 border border-gray-100"
                        >
                            <div className="text-blue-600 text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">{item.icon}</div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurStory; 