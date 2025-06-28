import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import '../Landing.css';
import { useLanguage } from '../contexts/LanguageContext';
import { translateNewsletterError } from '../utils/Functions';
import ButtonLoader from '../components/ButtonLoader';

const Newsletter: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].newsletter;
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [originalServerMessage, setOriginalServerMessage] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState(false);

    // Update message when language changes
    useEffect(() => {
        if (originalServerMessage) {
            const translatedMessage = translateNewsletterError(originalServerMessage, translations[currentLanguage]);
            setMessage(prev => prev ? { ...prev, text: translatedMessage } : null);
        }
    }, [currentLanguage, originalServerMessage]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous messages
        setMessage(null);
        setOriginalServerMessage(null);

        // Validate email
        if (!subscribeEmail.trim()) {
            setMessage({ type: 'error', text: t.errors.email_required });
            return;
        }

        if (!validateEmail(subscribeEmail)) {
            setMessage({ type: 'error', text: t.errors.invalid_email });
            return;
        }

        setIsSubscribing(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: subscribeEmail,
                    language: currentLanguage
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store original message and translate it
                setOriginalServerMessage(data.message);
                const translatedMessage = translateNewsletterError(data.message, translations[currentLanguage]);
                setMessage({ type: 'success', text: translatedMessage });
                setSubscribeEmail('');
            } else {
                // Store original message and translate it
                setOriginalServerMessage(data.message);
                const translatedMessage = translateNewsletterError(data.message, translations[currentLanguage]);
                
                // Check if this is a friendly "already subscribed" message that should be shown as success
                const isFriendlyAlreadySubscribed = data.message === 'You\'re already part of our newsletter family! 🎉';
                
                setMessage({ 
                    type: isFriendlyAlreadySubscribed ? 'success' : 'error', 
                    text: translatedMessage 
                });
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setMessage({ type: 'error', text: t.errors.server_errors.network_error });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t.title}
                </h2>
                <p className="text-gray-600 mb-8">
                    {t.subtitle}
                </p>

                {/* Success/Error Message */}
                {message && (
                    <div className={`max-w-md mx-auto mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={subscribeEmail}
                                onChange={(e) => setSubscribeEmail(e.target.value)}
                                placeholder={t.email_placeholder}
                                className={`w-full px-4 py-3 rounded-lg border force-white-bg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${message?.type === 'error' ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        <ButtonLoader
                            type="submit"
                            isLoading={isSubscribing}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                        >
                            {t.subscribe_button}
                        </ButtonLoader>
                    </div>
                </form>

                {/* Privacy Message */}
                <p className="text-sm text-gray-500 mt-4">
                    {t.privacy_message} <a href="/unsubscribe" className="text-blue-600 hover:underline">{t.unsubscribe_anytime}</a>
                </p>

            </div>
        </div>
    )
};

export default Newsletter; 