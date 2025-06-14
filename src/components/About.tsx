import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../translations';
import type { Language } from '../translations';

interface AboutProps {
    language?: Language;
}

const About: React.FC<AboutProps> = ({ language = 'en' }) => {
    const t = translations[language].about;
    const isRTL = language === 'ar';

    return (
        <div className="min-h-screen bg-white-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Our Story Section */}
            <section id="our-story" className="py-20">
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
            </section>

            {/* Press Section */}
            <section id="press" className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">{t.press.title}</h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {t.press.description}
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">{t.press.latest_news.title}</h3>
                                <span className="text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full">{t.press.latest_news.date}</span>
                            </div>
                            <p className="text-blue-600 font-medium mb-4">{t.press.latest_news.source}</p>
                            <p className="text-gray-600 mb-6">{t.press.latest_news.description}</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About; 