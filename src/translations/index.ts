import { en } from './en';
import { ar } from './ar';
import { fr } from './fr';

export const translations = {
    en,
    ar,
    fr
};

export type Language = keyof typeof translations; 