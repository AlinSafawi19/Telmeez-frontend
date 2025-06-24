import React from 'react';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const Security: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].security;

    const securityFeatures = [
        {
            icon: "🛡️",
            title: t.features[0].title,
            description: t.features[0].description,
            details: t.features[0].tag
        },
        {
            icon: "🌍",
            title: t.features[1].title,
            description: t.features[1].description,
            details: t.features[1].tag
        },
        {
            icon: "🔐",
            title: t.features[2].title,
            description: t.features[2].description,
            details: t.features[2].tag
        },
        {
            icon: "📊",
            title: t.features[3].title,
            description: t.features[3].description,
            details: t.features[3].tag
        }
    ];

    return (
        <div className="container mx-auto px-4 py-10 bg-white relative overflow-hidden">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                        <span className="mr-2">🔒</span>
                        {translations[currentLanguage].security.tag}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {translations[currentLanguage].security.title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {translations[currentLanguage].security.subtitle}
                    </p>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {securityFeatures.map((security, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="text-center mb-4">
                            <div className="text-3xl mb-3">{security.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{security.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{security.description}</p>
                            <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full">
                                <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-blue-800 text-xs font-medium">{security.details}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Security;