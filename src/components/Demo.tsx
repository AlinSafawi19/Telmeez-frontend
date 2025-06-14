import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations';
import type { Language } from '../translations';

interface DemoProps {
    language?: Language;
}

const Demo: React.FC<DemoProps> = ({ language = 'en' }) => {
    const [activeTab, setActiveTab] = useState('student-management');
    const t = translations[language].demo;
    const isRTL = language === 'ar';

    const demoFeatures = {
        'student-management': {
            title: t.features.student_management.title,
            description: t.features.student_management.description,
            features: t.features.student_management.features,
            icon: '👥',
            color: 'from-sky-400 to-blue-500'
        },
        'attendance': {
            title: t.features.attendance.title,
            description: t.features.attendance.description,
            features: t.features.attendance.features,
            icon: '📊',
            color: 'from-emerald-400 to-green-500'
        },
        'grades': {
            title: t.features.grades.title,
            description: t.features.grades.description,
            features: t.features.grades.features,
            icon: '📝',
            color: 'from-violet-400 to-purple-500'
        },
        'communication': {
            title: t.features.communication.title,
            description: t.features.communication.description,
            features: t.features.communication.features,
            icon: '💬',
            color: 'from-amber-400 to-orange-500'
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-20" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        {t.title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t.subtitle}
                    </p>
                </motion.div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {Object.keys(demoFeatures).map((feature) => (
                            <motion.button
                                key={feature}
                                onClick={() => setActiveTab(feature)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-6 rounded-2xl transition-all duration-300 focus:outline-none ${activeTab === feature
                                        ? `bg-gradient-to-r ${demoFeatures[feature as keyof typeof demoFeatures].color} text-white shadow-lg`
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                                    }`}
                            >
                                <div className="text-3xl mb-3">
                                    {demoFeatures[feature as keyof typeof demoFeatures].icon}
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {demoFeatures[feature as keyof typeof demoFeatures].title}
                                </h3>
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl shadow-lg overflow-hidden"
                        >
                            <div className="grid lg:grid-cols-2 gap-0">
                                <div className="p-12">
                                    <div className={`text-6xl mb-6 ${activeTab === 'student-management' ? 'text-sky-500' :
                                            activeTab === 'attendance' ? 'text-emerald-500' :
                                                activeTab === 'grades' ? 'text-violet-500' : 'text-amber-500'
                                        }`}>
                                        {demoFeatures[activeTab as keyof typeof demoFeatures].icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        {demoFeatures[activeTab as keyof typeof demoFeatures].title}
                                    </h3>
                                    <p className="text-base text-gray-600 mb-6">
                                        {demoFeatures[activeTab as keyof typeof demoFeatures].description}
                                    </p>
                                    <ul className="space-y-4">
                                        {demoFeatures[activeTab as keyof typeof demoFeatures].features.map((feature, index) => (
                                            <li key={index}>
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center text-gray-600"
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} ${activeTab === 'student-management' ? 'bg-sky-500' :
                                                            activeTab === 'attendance' ? 'bg-emerald-500' :
                                                                activeTab === 'grades' ? 'bg-violet-500' : 'bg-amber-500'
                                                        }`} />
                                                    {feature}
                                                </motion.div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={`bg-gradient-to-br ${demoFeatures[activeTab as keyof typeof demoFeatures].color} p-12 flex items-center justify-center`}>
                                    <div className="text-center text-white">
                                        <div className="text-7xl mb-4">
                                            {demoFeatures[activeTab as keyof typeof demoFeatures].icon}
                                        </div>
                                        <p className="text-base font-light">
                                            {t.coming_soon}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Demo; 