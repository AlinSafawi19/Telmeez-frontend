import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations';
import type { Language } from '../translations';

interface DemoProps {
    language: Language;
}

const Demo: React.FC<DemoProps> = ({ language = 'en' }) => {
    const [activeRole, setActiveRole] = useState<string>('subscriber');
    const [isHovered, setIsHovered] = useState<string | null>(null);
    type TabType = 'features' | 'getting_started' | 'mobile_preview' | 'videos_tutorials';
    const [activeTab, setActiveTab] = useState<TabType>('features');
    const t = translations[language].demo;

    const roles = [
        {
            id: 'subscriber',
            title: t.roles.subscriber.title,
            description: t.roles.subscriber.description,
            features: [
                t.roles.subscriber.features.feature1,
                t.roles.subscriber.features.feature2,
                t.roles.subscriber.features.feature3,
                t.roles.subscriber.features.feature4,
                t.roles.subscriber.features.feature5
            ],
            icon: '👑',
            color: 'from-purple-500 to-indigo-600',
            gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600'
        },
        {
            id: 'admin',
            title: t.roles.admin.title,
            description: t.roles.admin.description,
            features: [
                t.roles.admin.features.feature1,
                t.roles.admin.features.feature2,
                t.roles.admin.features.feature3,
                t.roles.admin.features.feature4,
                t.roles.admin.features.feature5
            ],
            icon: '🏫',
            color: 'from-blue-500 to-cyan-600',
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600'
        },
        {
            id: 'teacher',
            title: t.roles.teacher.title,
            description: t.roles.teacher.description,
            features: [
                t.roles.teacher.features.feature1,
                t.roles.teacher.features.feature2,
                t.roles.teacher.features.feature3,
                t.roles.teacher.features.feature4,
                t.roles.teacher.features.feature5
            ],
            icon: '👨‍🏫',
            color: 'from-green-500 to-emerald-600',
            gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
        },
        {
            id: 'student',
            title: t.roles.student.title,
            description: t.roles.student.description,
            features: [
                t.roles.student.features.feature1,
                t.roles.student.features.feature2,
                t.roles.student.features.feature3,
                t.roles.student.features.feature4,
                t.roles.student.features.feature5
            ],
            icon: '👨‍🎓',
            color: 'from-orange-500 to-amber-600',
            gradient: 'bg-gradient-to-br from-orange-500 to-amber-600'
        },
        {
            id: 'parent',
            title: t.roles.parent.title,
            description: t.roles.parent.description,
            features: [
                t.roles.parent.features.feature1,
                t.roles.parent.features.feature2,
                t.roles.parent.features.feature3,
                t.roles.parent.features.feature4,
                t.roles.parent.features.feature5
            ],
            icon: '👨‍👩‍👧‍👦',
            color: 'from-pink-500 to-rose-600',
            gradient: 'bg-gradient-to-br from-pink-500 to-rose-600'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden min-h-screen">
            {/* Enhanced Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
                            {t.title}
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        {t.subtitle}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t.description}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Role Selection */}
                    <div className="space-y-4">
                        {roles.map((role) => (
                            <motion.button
                                key={role.id}
                                onClick={() => setActiveRole(role.id)}
                                onMouseEnter={() => setIsHovered(role.id)}
                                onMouseLeave={() => setIsHovered(null)}
                                className={`w-full p-6 rounded-xl text-left transition-all focus:outline-none duration-300 relative overflow-hidden group ${activeRole === role.id
                                    ? `${role.gradient} text-white shadow-lg transform`
                                    : 'bg-white hover:bg-gray-50 text-gray-800 shadow-md'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="flex items-center space-x-4 relative z-10">
                                    <motion.span
                                        className="text-3xl"
                                        animate={{
                                            scale: isHovered === role.id ? 1.2 : 1,
                                            rotate: isHovered === role.id ? 5 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {role.icon}
                                    </motion.span>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">{role.title}</h3>
                                        <p className={`text-sm ${activeRole === role.id ? 'text-blue-100' : 'text-gray-600'}`}>
                                            {role.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Role Preview */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('features')}
                                className={`px-6 py-3 text-sm font-medium focus:outline-none ${activeTab === 'features'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t.tabs.features}
                            </button>
                            <button
                                onClick={() => setActiveTab('getting_started')}
                                className={`px-6 py-3 text-sm font-medium focus:outline-none ${activeTab === 'getting_started'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t.tabs.getting_started}
                            </button>
                            <button
                                onClick={() => setActiveTab('mobile_preview')}
                                className={`px-6 py-3 text-sm font-medium focus:outline-none ${activeTab === 'mobile_preview'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t.tabs.mobile_preview}
                            </button>
                            <button
                                onClick={() => setActiveTab('videos_tutorials')}
                                className={`px-6 py-3 text-sm font-medium focus:outline-none ${activeTab === 'videos_tutorials'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t.tabs.videos_tutorials}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-8"
                            >
                                {activeTab === 'features' && (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <motion.span
                                                    className="text-4xl"
                                                    animate={{
                                                        rotate: [0, 10, -10, 0],
                                                        scale: [1, 1.2, 1.2, 1]
                                                    }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    {roles.find(r => r.id === activeRole)?.icon}
                                                </motion.span>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    {roles.find(r => r.id === activeRole)?.title}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 mb-6">
                                                {roles.find(r => r.id === activeRole)?.description}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {roles.find(r => r.id === activeRole)?.features.map((feature, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center space-x-3 group"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-blue-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </motion.div>
                                                    <span className="text-gray-700 transition-colors">{feature}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'getting_started' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-4 mb-6">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-4xl"
                                            >
                                                🚀
                                            </motion.div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {t.guide_title}
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {(activeRole === 'subscriber' ? [
                                                {
                                                    step: 1,
                                                    title: t.getting_started_steps.subscriber.step1.title,
                                                    description: t.getting_started_steps.subscriber.step1.description
                                                },
                                                {
                                                    step: 2,
                                                    title: t.getting_started_steps.subscriber.step2.title,
                                                    description: t.getting_started_steps.subscriber.step2.description
                                                },
                                                {
                                                    step: 3,
                                                    title: t.getting_started_steps.subscriber.step3.title,
                                                    description: t.getting_started_steps.subscriber.step3.description
                                                },
                                                {
                                                    step: 4,
                                                    title: t.getting_started_steps.subscriber.step4.title,
                                                    description: t.getting_started_steps.subscriber.step4.description
                                                }
                                            ] : [
                                                {
                                                    step: 1,
                                                    title: t.getting_started_steps.subscriber.step1.title,
                                                    description: t.getting_started_steps.subscriber.step1.description
                                                },
                                                {
                                                    step: 2,
                                                    title: t.getting_started_steps.subscriber.step2.title,
                                                    description: t.getting_started_steps.subscriber.step2.description
                                                },
                                                {
                                                    step: 3,
                                                    title: t.getting_started_steps.subscriber.step3.title,
                                                    description: t.getting_started_steps.subscriber.step3.description
                                                },
                                                {
                                                    step: 4,
                                                    title: t.getting_started_steps.subscriber.step4.title,
                                                    description: t.getting_started_steps.subscriber.step4.description
                                                }
                                            ]).map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-start p-4 bg-gray-50 rounded-lg [&:not(:dir(rtl))]:space-x-4 [&:dir(rtl)]:space-x-reverse [&:dir(rtl)]:space-x-4"
                                                >
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold">{item.step}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                        <p className="text-gray-600 text-sm">{item.description}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'mobile_preview' && (
                                    <div className="relative">
                                        <div className="w-64 h-[500px] mx-auto bg-gray-900 rounded-[40px] p-4 shadow-xl">
                                            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                                                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 flex items-center justify-center">
                                                    <div className="w-20 h-4 bg-gray-200 rounded-full"></div>
                                                </div>
                                                <div className="mt-8 p-4 flex flex-col items-center justify-center h-full">
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="text-4xl mb-4"
                                                    >
                                                        📱
                                                    </motion.div>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">{t.mobile.title}</h4>
                                                    <p className="text-gray-600 text-sm text-center">
                                                        {t.mobile.coming_soon}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                                            <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'videos_tutorials' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-4 mb-6">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-4xl"
                                            >
                                                🎥
                                            </motion.div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {t.video_tutorials.title}
                                            </h3>
                                        </div>

                                        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-6xl mb-4"
                                            >
                                                🚧
                                            </motion.div>
                                            <h4 className="text-xl font-semibold text-gray-900 mb-2">{t.video_tutorials.coming_soon.title}</h4>
                                            <p className="text-gray-600 text-center max-w-md">
                                                {t.video_tutorials.coming_soon.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 space-y-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${roles.find(r => r.id === activeRole)?.gradient} focus:outline-none shadow-lg hover:shadow-xl`}
                                        onClick={() => window.open(`/demo-dashboard/${activeRole}/overview`, '_blank')}
                                    >
                                        {t.try} {roles.find(r => r.id === activeRole)?.title} {t.dashboard}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
};

export default Demo;
