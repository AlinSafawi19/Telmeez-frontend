import type { Language } from '../translations';

export interface LanguageOption {
    code: Language;
    label: string;
    flag?: string;
    dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageOption[] = [
    { 
        code: 'en', 
        label: 'English',
        flag: '🇺🇸',
        dir: 'ltr'
    },
    { 
        code: 'ar', 
        label: 'عربي',
        flag: '🇸🇦',
        dir: 'rtl'
    },
    { 
        code: 'fr', 
        label: 'Français',
        flag: '🇫🇷',
        dir: 'ltr'
    }
];

export const DEFAULT_LANGUAGE: Language = 'en';

export const getLanguageByCode = (code: Language): LanguageOption | undefined => {
    return LANGUAGES.find(lang => lang.code === code);
};

export const getLanguageDirection = (code: Language): 'ltr' | 'rtl' => {
    const language = getLanguageByCode(code);
    return language?.dir || 'ltr';
}; 