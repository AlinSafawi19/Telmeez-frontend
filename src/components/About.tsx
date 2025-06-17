import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { translations } from '../translations';
import type { Language } from '../translations';

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

interface AboutProps {
    language?: Language;
}

const About: React.FC<AboutProps> = ({ language = 'en' }) => {
    const t = translations[language].about;
    const isRTL = language === 'ar';
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollToNewsletter = () => {
        const newsletterSection = document.getElementById('newsletter');
        if (newsletterSection) {
            setIsScrolling(true);
            newsletterSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => setIsScrolling(false), 1000);
        }
    };

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
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            {t.press.description}
                        </p>
                        <motion.button
                            onClick={scrollToNewsletter}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex focus:outline-none items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                        >
                            <span className="rtl:ml-2 ltr:mr-2">📰</span>
                            {translations[language].newsletter.title}
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
            </section>

            {/* Add loading overlay for smooth scrolling */}
            {isScrolling && (
                <div className="fixed inset-0 bg-black bg-opacity-10 z-40 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default About; 