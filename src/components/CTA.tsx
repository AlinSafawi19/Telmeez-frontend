import React from 'react';
import { translations } from '../translations';
import '../Landing.css';
import { useLanguage } from '../contexts/LanguageContext';

const CTA: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].cta;

    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 relative overflow-hidden">
            {/* Add decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="container mx-auto px-4 text-center relative">
                <h2 className="text-4xl font-bold text-white mb-8">
                    {t.title}
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    {t.subtitle}
                </p>
                <button
                    type="button"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl"
                >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-gradient-to-r from-blue-50 to-white group-hover:translate-x-0"></span>
                    <span className="relative flex items-center">
                        {t.button}
                        <svg className={`w-5 h-5 ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'} transform transition-transform duration-300 ${currentLanguage === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} ${currentLanguage === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    )
};

export default CTA; 