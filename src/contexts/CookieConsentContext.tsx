import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
        // Use requestAnimationFrame for better performance
        const loadPreferences = () => {
            const savedPreferences = localStorage.getItem('cookieConsent');
            if (savedPreferences) {
                try {
                    const parsedPreferences = JSON.parse(savedPreferences);
                    // Ensure necessary cookies are always enabled
                    setPreferences({
                        ...parsedPreferences,
                        necessary: true
                    });
                    setHasUserConsent(true);
                } catch (error) {
                    // Ignore parsing errors
                }
            }
        };

        // Use requestAnimationFrame instead of setTimeout for better performance
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(loadPreferences);
        } else {
            // Fallback for older browsers
            setTimeout(loadPreferences, 0);
        }
    }, []);

    const updatePreferences = (prefs: CookiePreferences) => {
        // Ensure necessary cookies are always enabled
        const updatedPrefs = {
            ...prefs,
            necessary: true
        };
        setPreferences(updatedPrefs);
        localStorage.setItem('cookieConsent', JSON.stringify(updatedPrefs));
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