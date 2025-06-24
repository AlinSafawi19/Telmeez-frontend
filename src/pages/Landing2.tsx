import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingOverlay from '../components/LoadingOverlay';
import '../Landing.css';
import MobileApp from '../components/MobileApp';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownContainerRef = useRef<HTMLDivElement>(null);
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage];

    const floatingParticles = Array.from({ length: 6 }, (_, i) => i);
    const pulseParticles = Array.from({ length: 4 }, (_, i) => i + 6);

    const languages = [
        { code: 'en' as const, label: 'English' },
        { code: 'ar' as const, label: 'عربي' },
        { code: 'fr' as const, label: 'Français' }
    ];

    // Handle language change function
    const handleLanguageChange = (newLanguage: 'en' | 'ar' | 'fr') => {
        if (newLanguage === currentLanguage) return;

        // Immediately close dropdown and reset styles
        setActiveDropdown(null);

        // Reset any inline styles on language dropdown items using the ref
        if (languageDropdownContainerRef.current) {
            const languageItems = languageDropdownContainerRef.current.querySelectorAll('button[role="menuitem"]');
            languageItems.forEach((item) => {
                if (item instanceof HTMLElement) {
                    item.style.backgroundColor = '';
                    item.style.color = '';
                }
            });
        }

        setIsLoading(true);

        // Simulate loading time for better UX
        setTimeout(() => {
            setIsLoading(false);
            setCurrentLanguage(newLanguage);
        }, 500);
    };

    const headerItems = {
        home: {
            label: t.header.home,
            href: '#'
        },
        pricing: {
            label: t.header.pricing.pricing,
            href: '#'
        },
        about: {
            label: t.header.about.about,
            href: '#'
        },
        resources: {
            label: t.header.resources.resources,
            href: '#'
        },
        download: {
            label: t.header.download,
            href: '#'
        },
        contact: {
            label: t.header.contact,
            href: '#'
        }
    };

    const dropdownItems = {
        resources: [
            { label: t.header.resources.demo, href: '#' },
            { label: t.header.resources.faq, href: '#' },
            { label: t.header.resources.security, href: '#' }
        ],
        about: [
            { label: t.header.about.our_story, href: '#' },
            { label: t.header.about.press, href: '#' },
            { label: t.header.about.testimonials, href: '#' }
        ],
        pricing: [
            {
                label: t.header.pricing.starter,
                href: '#',
                monthlyPrice: '$49',
                annualPrice: '$39',
                description: t.header.pricing.starter_desc,
                details: t.header.pricing.starter_details,
                savings: t.header.pricing.savings,
                maxStorage: '10 GB'
            },
            {
                label: t.header.pricing.standard,
                href: '#',
                monthlyPrice: '$99',
                annualPrice: '$79',
                description: t.header.pricing.standard_desc,
                details: t.header.pricing.standard_details,
                savings: t.header.pricing.savings,
                maxStorage: '100 GB'
            },
            {
                label: t.header.pricing.enterprise,
                href: '#',
                monthlyPrice: '$299',
                annualPrice: '$239',
                description: t.header.pricing.enterprise_desc,
                details: t.header.pricing.enterprise_details,
                savings: t.header.pricing.savings,
                maxStorage: 'Unlimited'
            }
        ]
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Reset active dropdown when language changes
    useEffect(() => {
        setActiveDropdown(null);
    }, [currentLanguage]);

    // Handle scroll events for back-to-top button
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowBackToTop(scrollTop > 300); // Show button when scrolled more than 300px
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Handle back to top click
    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const renderNavigationItem = (item: { label: string; href: string }, hasDropdown = false, dropdownContent?: React.ReactNode, dropdownKey?: string) => {
        if (hasDropdown) {
            return (
                <div
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(dropdownKey || null)}
                    onMouseLeave={(e) => {
                        // Check if we're moving to the dropdown content
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (!e.currentTarget.contains(relatedTarget)) {
                            setActiveDropdown(null);
                        }
                    }}
                >
                    <a
                        href={item.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveDropdown(activeDropdown === dropdownKey ? null : dropdownKey || null);
                        }}
                    >
                        {item.label}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </a>
                    <div
                        onMouseEnter={() => setActiveDropdown(dropdownKey || null)}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        {dropdownContent}
                    </div>
                </div>
            );
        }

        return (
            <a href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                {item.label}
            </a>
        );
    };

    const renderMobileNavigationItem = (item: { label: string; href: string }, hasDropdown = false, dropdownItems?: any[]) => {
        if (hasDropdown && dropdownItems) {
            return (
                <div className={`${currentLanguage === 'ar' ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-gray-200`}>
                    <span className="text-gray-600 font-medium block mb-2">{item.label}</span>
                    {dropdownItems.map((dropdownItem, index) => (
                        <a
                            key={index}
                            href={dropdownItem.href}
                            className={`block ${currentLanguage === 'ar' ? 'pr-4' : 'pl-4'} py-1 text-gray-500 hover:text-blue-600 transition-colors duration-200`}
                        >
                            {dropdownItem.label}
                        </a>
                    ))}
                </div>
            );
        }

        return (
            <a href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                {item.label}
            </a>
        );
    };

    const renderPricingDropdown = () => (
        <div
            className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'pricing' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
        >
            {dropdownItems.pricing.map((item, index) => (
                <a
                    key={index}
                    href={item.href}
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">{item.label}</span>
                        <div className="text-right">
                            <div className="text-blue-600 font-bold">{item.monthlyPrice}{t.header.pricing.permonth}</div>
                            <div className="text-sm text-gray-600">{item.annualPrice}{t.header.pricing.peryear}</div>
                        </div>
                    </div>
                    <p className="text-xs text-green-600">{item.savings}</p>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                            <span className="text-xs text-gray-500 font-medium">{t.pricing.max_storage}:</span>
                            <span className="text-xs font-semibold text-blue-600">{item.maxStorage}</span>
                        </div>
                        {item.label === t.header.pricing.starter && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <span className="mr-1">✨</span>
                                {t.header.pricing.free_trial}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                </a>
            ))}
        </div>
    );

    const renderAboutDropdown = () => (
        <div
            className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'about' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
        >
            {dropdownItems.about.map((item, index) => (
                <a
                    key={index}
                    href={item.href}
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.color = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    {item.label}
                </a>
            ))}
        </div>
    );

    const renderResourcesDropdown = () => (
        <div
            className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'resources' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
        >
            {dropdownItems.resources.map((item, index) => (
                <a
                    key={index}
                    href={item.href}
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.color = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    {item.label}
                </a>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <a href="#" className="transition-transform hover:scale-105">
                                <img src={logo} alt="Telmeez Logo" className="h-20 w-20" />
                            </a>
                        </div>
                        <nav className={`hidden md:flex ${currentLanguage === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
                            {renderNavigationItem(headerItems.home)}
                            {renderNavigationItem(headerItems.pricing, true, renderPricingDropdown(), 'pricing')}
                            {renderNavigationItem(headerItems.about, true, renderAboutDropdown(), 'about')}
                            {renderNavigationItem(headerItems.resources, true, renderResourcesDropdown(), 'resources')}
                            {renderNavigationItem(headerItems.download)}
                            {renderNavigationItem(headerItems.contact)}
                        </nav>
                        <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                            <div className="relative group" ref={languageDropdownRef}>
                                <button
                                    key={`language-button-${currentLanguage}`}
                                    type="button"
                                    className="flex items-center bg-white text-gray-600 hover:bg-gray-100 transition-colors duration-300 font-medium focus:outline-none px-3 py-2 rounded-lg border border-gray-300"
                                    onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    aria-label="Select language"
                                >
                                    <span className="font-medium">
                                        {languages.find(lang => lang.code === currentLanguage)?.label}
                                    </span>
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    ref={languageDropdownContainerRef}
                                    key={`language-dropdown-${currentLanguage}`}
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-40 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'language' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="language-menu"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            type="button"
                                            key={lang.code}
                                            className={`flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'bg-transparent'} cursor-pointer`}
                                            role="menuitem"
                                            onMouseEnter={(e) => {
                                                if (currentLanguage !== lang.code) {
                                                    e.currentTarget.style.backgroundColor = '#eff6ff';
                                                    e.currentTarget.style.color = '#2563eb';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (currentLanguage !== lang.code) {
                                                    e.currentTarget.style.backgroundColor = '';
                                                    e.currentTarget.style.color = '';
                                                }
                                            }}
                                            onClick={() => {
                                                handleLanguageChange(lang.code);
                                            }}
                                        >
                                            <span>{lang.label}</span>
                                            {currentLanguage === lang.code && (
                                                <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/signin')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium focus:outline-none"
                            >
                                {t.header.signin}
                            </button>
                            <button
                                type="button"
                                className="md:hidden text-gray-600 bg-white p-2 rounded-lg border border-gray-300 focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle mobile menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="md:hidden mt-4 py-4 border-t overflow-hidden bg-white force-white-bg"
                            >
                                <div className="flex justify-end mb-4">
                                    <button
                                        type="button"
                                        className="text-gray-600 bg-white p-2 rounded-lg border border-gray-300 focus:outline-none hover:bg-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        aria-label="Close mobile menu"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <nav className="flex flex-col space-y-4 p-4">
                                    {renderMobileNavigationItem(headerItems.home)}
                                    {renderMobileNavigationItem(headerItems.pricing)}
                                    {renderMobileNavigationItem(headerItems.about, true, dropdownItems.about)}
                                    {renderMobileNavigationItem(headerItems.resources, true, dropdownItems.resources)}
                                    {renderMobileNavigationItem(headerItems.download)}
                                    {renderMobileNavigationItem(headerItems.contact)}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Add Hero section */}
            <section id="hero" className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center relative overflow-hidden">
                {/* Enhanced decorative background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {floatingParticles.map((i: number) => (
                        <div
                            key={i}
                            className={`absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce floating-particle-${i + 1}`}
                        />
                    ))}
                    {pulseParticles.map((i: number) => (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse floating-particle-${i + 1}`}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-5xl mx-auto">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-8 mt-8"
                        >
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 shadow-sm">
                                {t.hero.tag}
                            </span>
                        </motion.div>

                        {/* Enhanced Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        >
                            <span className="animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                                {t.hero.title}
                            </span>
                        </motion.h1>

                        {/* Enhanced Subtitle */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium animate-float"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800">
                                {t.hero.subtitle}
                            </span>
                        </motion.h2>

                        {/* Enhanced CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className={`flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 rtl:space-x-reverse px-4 sm:px-6 lg:px-0`}
                        >
                            <button
                                type="button"
                                className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg md:text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 min-w-[200px] sm:min-w-0 overflow-hidden btn-gradient-hover animate-glow"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center justify-center">
                                    {t.hero.getStarted}
                                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'} transform transition-transform duration-300 ${currentLanguage === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                            <button
                                type="button"
                                className="group relative w-full sm:w-auto bg-white/80 backdrop-blur-sm text-blue-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg md:text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 min-w-[200px] sm:min-w-0 overflow-hidden btn-gradient-hover"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center justify-center">
                                    {t.hero.learnMore}
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{t.hero.bottom_tags.tag1}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>{t.hero.bottom_tags.tag2}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{t.hero.bottom_tags.tag3}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Add Mobile App section */}
            <section id="mobile-app">
                <MobileApp />
            </section>

            {/* Add Testimonials section */}
            <section id="testimonials">
                Testimonials
            </section>

            {/* Add Pricing section */}
            <section id="pricing">
                Pricing
            </section>

            {/* Add Our Story section */}
            <section id="our-story">
                Pricing
            </section>

            {/* Add Press section */}
            <section id="press">
                Press
            </section>

            {/* Add Demo section */}
            <section id="demo">
                Demo
            </section>

            {/* Add FAQ section */}
            <section id="faq">
                FAQ
            </section>

            {/* Add Security section */}
            <section id="security">
                Security
            </section>

            {/* Add Stats section */}
            <section id="stats">
                Stats
            </section>

            {/* Add CTA section */}
            <section id="cta">
                CTA
            </section>

            {/* Add Newsletter section */}
            <section id="newsletter">
                Newsletter
            </section>

            {/* Add Contact section */}
            <section id="contact">
                Contact
            </section>

            {/* Add Loading Overlay */}
            <LoadingOverlay isLoading={isLoading} />

            {/* Add Back to Top button */}
            <button
                type='button'
                className={`fixed bottom-8 ${currentLanguage === 'ar' ? 'left-8' : 'right-8'} p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showBackToTop
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16 pointer-events-none'
                    }`}
                aria-label="Back to top"
                onClick={handleBackToTop}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Landing; 