import React from 'react';
import { motion } from 'framer-motion';
import '../Landing.css';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';

const PioneersOffer: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage];

    // Scroll to section function
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 80; // Approximate header height
            const elementPosition = element.offsetTop - headerHeight;

            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    // Handle button click to scroll to pricing
    const handleScrollToPricing = () => {
        scrollToSection('pricing');
    };

    return (
        <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Enhanced decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            {t.pioneersOffer.nofeedbacks.title}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {t.pioneersOffer.nofeedbacks.subtitle}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left side - Main content */}
                        <div className="space-y-6">
                            <div className="inline-block">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <span className="mr-2 rtl:mr-0 rtl:ml-2">✨</span>
                                    {t.pioneersOffer.nofeedbacks.left.tag}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                                {t.pioneersOffer.nofeedbacks.left.offer}
                            </h3>
                            <p className="text-lg text-gray-600">
                                {t.pioneersOffer.nofeedbacks.left.description}
                            </p>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{t.pioneersOffer.nofeedbacks.left.benifets.title}</h4>
                                        <ul className="text-gray-600 space-y-2 mt-2">
                                            <li className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t.pioneersOffer.nofeedbacks.left.benifets.ben1}
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t.pioneersOffer.nofeedbacks.left.benifets.ben2}
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t.pioneersOffer.nofeedbacks.left.benifets.ben3}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">💡</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{t.pioneersOffer.nofeedbacks.left.shape_your_future}</h4>
                                        <p className="text-gray-600">{t.pioneersOffer.nofeedbacks.left.shape_your_future_desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🌟</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{t.pioneersOffer.nofeedbacks.left.recog}</h4>
                                        <p className="text-gray-600">{t.pioneersOffer.nofeedbacks.left.recog_desc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    type='button'
                                    onClick={handleScrollToPricing}
                                    className="inline-flex items-center px-6 py-3 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {t.pioneersOffer.nofeedbacks.left.button}
                                    {currentLanguage === 'ar' ? (
                                        <svg className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right side - Visual elements */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl transform rotate-3"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            1
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{t.pioneersOffer.nofeedbacks.right.info1.title}</h4>
                                            <p className="text-sm text-gray-600">{t.pioneersOffer.nofeedbacks.right.info1.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400 mx-6"></div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            2
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{t.pioneersOffer.nofeedbacks.right.info2.title}</h4>
                                            <p className="text-sm text-gray-600">{t.pioneersOffer.nofeedbacks.right.info2.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400 mx-6"></div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            3
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{t.pioneersOffer.nofeedbacks.right.info3.title}</h4>
                                            <p className="text-sm text-gray-600">{t.pioneersOffer.nofeedbacks.right.info3.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2 rtl:space-x-reverse">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                                    {i === 0 ? t.pioneersOffer.nofeedbacks.right.pioneers.first :
                                                        i === 1 ? t.pioneersOffer.nofeedbacks.right.pioneers.second :
                                                            t.pioneersOffer.nofeedbacks.right.pioneers.third}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <svg className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {t.pioneersOffer.nofeedbacks.right.tag}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PioneersOffer; 