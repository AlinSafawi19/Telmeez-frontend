import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations';
import type { Language } from '../translations';

interface FAQProps {
    language?: Language;
}

const FAQ: React.FC<FAQProps> = ({ language = 'en' }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const t = translations[language].faq;

    return (
        <div id="faq-section" className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {t.title}
                    </h2>
                    <p className="text-gray-600">
                        {t.subtitle}
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.questions.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 h-fit"
                        >
                            <button
                                className="w-full px-5 py-4 text-left focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-medium text-gray-800">{item.question}</h3>
                                    <motion.svg
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-5 h-5 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </motion.svg>
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="px-5 pb-4 overflow-hidden"
                                    >
                                        <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ; 