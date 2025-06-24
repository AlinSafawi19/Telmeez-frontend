import React, { useState } from 'react';
import { translations } from '../translations';
import '../Landing.css';
import { useLanguage } from '../contexts/LanguageContext';

const Newsletter: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].newsletter;
    const [subscribeEmail, setSubscribeEmail] = useState('');

    return (
        <div className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t.title}
                </h2>
                <p className="text-gray-600 mb-8">
                    {t.subtitle}
                </p>

                <form className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={subscribeEmail}
                                placeholder={t.email_placeholder}
                                className={`w-full px-4 py-3 rounded-lg border force-white-bg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t.subscribe_button}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
};

export default Newsletter; 