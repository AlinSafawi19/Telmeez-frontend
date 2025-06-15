import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

interface CookieConsentContextType {
    preferences: CookiePreferences;
    updatePreferences: (prefs: CookiePreferences) => void;
    hasUserConsent: boolean;
}

const defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
    const [hasUserConsent, setHasUserConsent] = useState(false);

    useEffect(() => {
        const savedPreferences = localStorage.getItem('cookieConsent');
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
            setHasUserConsent(true);
        }
    }, []);

    const updatePreferences = (prefs: CookiePreferences) => {
        setPreferences(prefs);
        localStorage.setItem('cookieConsent', JSON.stringify(prefs));
        setHasUserConsent(true);
    };

    return (
        <CookieConsentContext.Provider value={{ preferences, updatePreferences, hasUserConsent }}>
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (context === undefined) {
        throw new Error('useCookieConsent must be used within a CookieConsentProvider');
    }
    return context;
}; 