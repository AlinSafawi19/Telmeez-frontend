import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const ThemeToggle: React.FC = () => {
    const { theme, setTheme, isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themeOptions = [
        {
            value: 'light' as const,
            label: 'Light',
            icon: SunIcon,
            description: 'Light theme'
        },
        {
            value: 'dark' as const,
            label: 'Dark',
            icon: MoonIcon,
            description: 'Dark theme'
        },
        {
            value: 'system' as const,
            label: 'System',
            icon: ComputerDesktopIcon,
            description: 'Follow system preference'
        }
    ];

    const currentTheme = themeOptions.find(option => option.value === theme);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none border-none transition-colors"
                aria-label="Toggle theme"
            >
                {isDark ? (
                    <MoonIcon className="w-5 h-5" />
                ) : (
                    <SunIcon className="w-5 h-5" />
                )}
                <span className="hidden md:block text-sm font-medium">
                    {currentTheme?.label}
                </span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                    >
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setTheme(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none border-none transition-colors ${
                                    theme === option.value
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <option.icon className="w-4 h-4 mr-3" />
                                <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {option.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeToggle; 