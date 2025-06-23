import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../translations';

interface LanguageContextType {
    currentLanguage: Language;
    setCurrentLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en'); // Default to 'en'

    useEffect(() => {
        // Use requestAnimationFrame for better performance
        const loadLanguage = () => {
            const savedLanguage = localStorage.getItem('language') as Language;
            if (savedLanguage) {
                setCurrentLanguage(savedLanguage);
            }
        };

        // Use requestAnimationFrame instead of setTimeout for better performance
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(loadLanguage);
        } else {
            // Fallback for older browsers
            setTimeout(loadLanguage, 0);
        }
    }, []);

    useEffect(() => {
        // Check if user has given cookie consent
        const cookieConsent = localStorage.getItem('cookieConsent');
        const hasConsent = cookieConsent ? JSON.parse(cookieConsent).necessary : false;

        // Only save language preference to localStorage if user has given consent
        if (hasConsent) {
            localStorage.setItem('language', currentLanguage);
        }
        
        // Update document direction for RTL languages
        if (currentLanguage === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }, [currentLanguage]);

    return (
        <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}; 