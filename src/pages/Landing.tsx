import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import logo2 from '../assets/images/logo2.png';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingOverlay from '../components/LoadingOverlay';
import '../Landing.css';
import MobileApp from '../components/MobileApp';
import PricingPlans2 from '../components/PricingPlans2';
import OurStory from '../components/OurStory';
import Press from '../components/Press';
import Demo from '../components/Demo';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import CTA from '../components/CTA';
import Newsletter from '../components/Newsletter';
import Security from '../components/Security';
import Testimonials from '../components/Testimonials';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [expandedMobileDropdowns, setExpandedMobileDropdowns] = useState<Set<string>>(new Set());
    const [selectedPlanFromMenu, setSelectedPlanFromMenu] = useState<string | null>(null);

    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownContainerRef = useRef<HTMLDivElement>(null);
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage];
    const isRTL = currentLanguage === 'ar'; // Only Arabic is RTL in our supported languages

    const floatingParticles = Array.from({ length: 6 }, (_, i) => i);
    const pulseParticles = Array.from({ length: 4 }, (_, i) => i + 6);

    const languages = [
        { code: 'en' as const, label: 'English' },
        { code: 'ar' as const, label: 'عربي' },
        { code: 'fr' as const, label: 'Français' }
    ];

    // Toggle mobile dropdown expansion
    const toggleMobileDropdown = (dropdownKey: string) => {
        setExpandedMobileDropdowns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dropdownKey)) {
                newSet.delete(dropdownKey);
            } else {
                newSet.add(dropdownKey);
            }
            return newSet;
        });
    };

    // Close all mobile dropdowns when menu closes
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setExpandedMobileDropdowns(new Set());
    };

    // Close mobile dropdowns when clicking outside
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

    // Close mobile menu when clicking on backdrop
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Scroll to section function
    const scrollToSection = (sectionId: string, closeMenu: boolean = true, selectedPlan?: string) => {

        // If scrolling to pricing section and a plan is selected, store it
        if (sectionId === 'pricing' && selectedPlan) {
            setSelectedPlanFromMenu(selectedPlan);
        }

        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            const element = document.getElementById(sectionId);

            if (element) {
                const headerHeight = 80; // Approximate header height
                const elementPosition = element.offsetTop - headerHeight;

                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open and closeMenu is true
                if (closeMenu) {
                    setIsMobileMenuOpen(false);
                }
                // Close any open dropdowns
                setActiveDropdown(null);
            }
        }, 100);
    };

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
            href: '#hero'
        },
        pricing: {
            label: t.header.pricing.pricing,
            href: '#pricing'
        },
        about: {
            label: t.header.about.about,
            href: '#our-story'
        },
        resources: {
            label: t.header.resources.resources,
            href: '#demo'
        },
        download: {
            label: t.header.download,
            href: '#mobile-app'
        },
        contact: {
            label: t.header.contact,
            href: '#contact'
        }
    };

    const dropdownItems = {
        resources: [
            { label: t.header.resources.demo, href: '#demo' },
            { label: t.header.resources.faq, href: '#faq' },
            { label: t.header.resources.security, href: '#security' }
        ],
        about: [
            { label: t.header.about.our_story, href: '#our-story' },
            { label: t.header.about.press, href: '#press' },
            { label: t.header.about.testimonials, href: '#testimonials' }
        ],
        pricing: [
            {
                label: t.header.pricing.starter,
                href: '#pricing',
                monthlyPrice: '$49',
                annualPrice: '$39.20',
                description: t.header.pricing.starter_desc,
                details: t.header.pricing.starter_details,
                savings: t.header.pricing.savings,
                maxStorage: '10 GB'
            },
            {
                label: t.header.pricing.standard,
                href: '#pricing',
                monthlyPrice: '$99',
                annualPrice: '$79.20',
                description: t.header.pricing.standard_desc,
                details: t.header.pricing.standard_details,
                savings: t.header.pricing.savings,
                maxStorage: '100 GB'
            },
            {
                label: t.header.pricing.enterprise,
                href: '#pricing',
                monthlyPrice: '$299',
                annualPrice: '$239.20',
                description: t.header.pricing.enterprise_desc,
                details: t.header.pricing.enterprise_details,
                savings: t.header.pricing.savings,
                maxStorage: 'Unlimited'
            }
        ]
    };

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
                            // Navigate to the main section
                            const sectionId = item.href.replace('#', '');
                            scrollToSection(sectionId);
                            // Toggle dropdown if it's not already open
                            setActiveDropdown(activeDropdown === dropdownKey ? null : dropdownKey || null);
                        }}
                    >
                        <div className="flex items-center">
                            {item.label}
                        </div>
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
            <a
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
                onClick={(e) => {
                    e.preventDefault();
                    const sectionId = item.href.replace('#', '');
                    scrollToSection(sectionId);
                }}
            >
                <div className="flex items-center">
                    {item.label}
                </div>
            </a>
        );
    };

    const renderMobileNavigationItem = (item: { label: string; href: string }, hasDropdown = false, dropdownItems?: any[], dropdownKey?: string) => {
        if (hasDropdown && dropdownItems) {
            const isExpanded = expandedMobileDropdowns.has(dropdownKey || '');

            return (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <button
                        type="button"
                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        onClick={() => {
                            // Navigate to the main section
                            const sectionId = item.href.replace('#', '');
                            scrollToSection(sectionId, false); // Don't close mobile menu
                            // Toggle dropdown (don't close mobile menu)
                            toggleMobileDropdown(dropdownKey || '');
                        }}
                    >
                        <div className="flex items-center">
                            {item.label}
                        </div>
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden bg-gray-50"
                            >
                                <div className="py-2">
                                    {dropdownItems.map((dropdownItem, index) => (
                                        <motion.a
                                            key={index}
                                            href={dropdownItem.href}
                                            className={`block py-2.5 px-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-l-2 border-transparent relative group`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const sectionId = dropdownItem.href.replace('#', '');
                                                scrollToSection(sectionId, true); // Close mobile menu for dropdown items
                                                closeMobileMenu();
                                            }}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <div className="flex items-center">
                                                <span className="font-medium">{dropdownItem.label}</span>
                                                <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <motion.a
                href={item.href}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                onClick={(e) => {
                    e.preventDefault();
                    const sectionId = item.href.replace('#', '');
                    scrollToSection(sectionId, true); // Close mobile menu for regular items
                    closeMobileMenu();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center">
                    {item.label}
                </div>
            </motion.a>
        );
    };

    const renderPricingDropdown = () => (
        <div
            className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'pricing' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
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
                        const sectionId = item.href.replace('#', '');
                        // Map the plan label to plan ID
                        let planId = 'standard'; // default
                        if (item.label === t.header.pricing.starter) {
                            planId = 'starter';
                        } else if (item.label === t.header.pricing.enterprise) {
                            planId = 'enterprise';
                        }
                        scrollToSection(sectionId, true, planId);
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
            className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'about' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
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
                        const sectionId = item.href.replace('#', '');
                        scrollToSection(sectionId);
                    }}
                >
                    {item.label}
                </a>
            ))}
        </div>
    );

    const renderResourcesDropdown = () => (
        <div
            className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'resources' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
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
                        const sectionId = item.href.replace('#', '');
                        scrollToSection(sectionId);
                    }}
                >
                    {item.label}
                </a>
            ))}
        </div>
    );

    const renderMobilePricingDropdown = () => {
        const isExpanded = expandedMobileDropdowns.has('pricing');

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 text-left bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    onClick={() => toggleMobileDropdown('pricing')}
                >
                    <div className="flex items-center">
                        {headerItems.pricing.label}
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-gray-50"
                        >
                            <div className="py-2">
                                {dropdownItems.pricing.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className={`px-3 py-3 border-b border-gray-100 last:border-b-0`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-800">{item.label}</span>
                                            {item.label === t.header.pricing.starter && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <span className="mr-1">✨</span>
                                                    {t.header.pricing.free_trial}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-right">
                                                <div className="text-blue-600 font-bold text-lg">{item.monthlyPrice}{t.header.pricing.permonth}</div>
                                                <div className="text-sm text-gray-600">{item.annualPrice}{t.header.pricing.peryear}</div>
                                            </div>
                                            <div className="text-xs text-green-600 font-medium">{item.savings}</div>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                                </svg>
                                                <span className="text-xs text-gray-500">{t.pricing.max_storage}:</span>
                                                <span className="text-xs font-semibold text-blue-600">{item.maxStorage}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                                        <p className="text-xs text-gray-500">{item.details}</p>
                                        <button
                                            type="button"
                                            className="w-full mt-2 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const sectionId = item.href.replace('#', '');
                                                // Map the plan label to plan ID
                                                let planId = 'standard'; // default
                                                if (item.label === t.header.pricing.starter) {
                                                    planId = 'starter';
                                                } else if (item.label === t.header.pricing.enterprise) {
                                                    planId = 'enterprise';
                                                }
                                                scrollToSection(sectionId, true, planId);
                                                closeMobileMenu();
                                            }}
                                        >
                                            Select Plan
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

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
                        <nav className={`hidden md:flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
                            {renderNavigationItem(headerItems.home)}
                            {renderNavigationItem(headerItems.pricing, true, renderPricingDropdown(), 'pricing')}
                            {renderNavigationItem(headerItems.about, true, renderAboutDropdown(), 'about')}
                            {renderNavigationItem(headerItems.resources, true, renderResourcesDropdown(), 'resources')}
                            {renderNavigationItem(headerItems.download)}
                            {renderNavigationItem(headerItems.contact)}
                        </nav>
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
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
                                    className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-40 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'language' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
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
                                            onClick={() => handleLanguageChange(lang.code)}
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
                                className="md:hidden mt-4 py-4 border-t max-h-[calc(100vh-100px)] overflow-y-auto bg-gradient-to-b from-white to-gray-50 force-white-bg rounded-lg shadow-lg"
                            >
                                <div className="flex justify-end mb-6 px-4">
                                    <button
                                        type="button"
                                        className="text-gray-600 bg-white p-2 rounded-lg border border-gray-300 focus:outline-none hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                                        onClick={closeMobileMenu}
                                        aria-label="Close mobile menu"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <nav className="flex flex-col space-y-3 px-4 pb-4">
                                    {renderMobileNavigationItem(headerItems.home)}
                                    {renderMobilePricingDropdown()}
                                    {renderMobileNavigationItem(headerItems.about, true, dropdownItems.about, 'about')}
                                    {renderMobileNavigationItem(headerItems.resources, true, dropdownItems.resources, 'resources')}
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
                                onClick={() => scrollToSection('pricing')}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center justify-center">
                                    {t.hero.getStarted}
                                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'mr-2' : 'ml-2'} transform transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                            <button
                                type="button"
                                className="group relative w-full sm:w-auto bg-white/80 backdrop-blur-sm text-blue-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg md:text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 min-w-[200px] sm:min-w-0 overflow-hidden btn-gradient-hover"
                                onClick={() => scrollToSection('demo')}
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
                <Testimonials />
            </section>

            {/* Add Pricing section */}
            <section id="pricing">
                <PricingPlans2 initialSelectedPlan={selectedPlanFromMenu} />
            </section>

            {/* Add Our Story section */}
            <section id="our-story">
                <OurStory />
            </section>

            {/* Add Press section */}
            <section id="press">
                <Press />
            </section>

            {/* Add Demo section */}
            <section id="demo">
                <Demo />
            </section>

            {/* Add FAQ section */}
            <section id="faq">
                <FAQ />
            </section>

            {/* Add Security section */}
            <section id="security">
                <Security />
            </section>

            {/* Add Stats section */}
            <section id="stats">
                Stats
            </section>

            {/* Add CTA section */}
            <section id="cta">
                <CTA />
            </section>

            {/* Add Newsletter section */}
            <section id="newsletter">
                <Newsletter />
            </section>

            {/* Add Contact section */}
            <section id="contact">
                <Contact />
            </section>

            {/* Add Loading Overlay */}
            <LoadingOverlay isLoading={isLoading} />

            {/* Add Back to Top button */}
            <button
                type='button'
                className={`fixed bottom-8 ${isRTL ? 'left-8' : 'right-8'} p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showBackToTop
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

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        <div>
                            <a href="#" className="transition-transform hover:scale-105">
                                <img src={logo2} alt="Telmeez Logo" className="h-16 w-16 mb-4" />
                            </a>
                            <p className="text-gray-400">
                                {translations[currentLanguage].footer.text}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.quick_links.quick_links}</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.about_us}</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.features}</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.pricing}</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.testimonials}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.resources.resources}</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.resources.demo}</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.resources.faq}</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.resources.security}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.contact_us.contact_us}</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <svg className={`w-5 h-5 text-gray-400 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="mailto:contact@telmeezlb.com" className="text-gray-400 hover:text-white transition-colors">contact@telmeezlb.com</a>
                                </li>
                                <li className="flex items-center">
                                    <svg className={`w-5 h-5 text-gray-400 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href="tel:+9611234567" className="text-gray-400 hover:text-white transition-colors">+961 1 234 567</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.social}</h3>
                            <div className={`flex ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                <a href="https://www.facebook.com/profile.php?id=61577265967774" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Facebook">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/telmeezlb" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Instagram">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.281-.057 1.689-.073 4.948-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.language}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {languages.map((lang) => (
                                    <button
                                        type='button'
                                        key={lang.code}
                                        className={`flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none ${currentLanguage === lang.code
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        onClick={() => handleLanguageChange(lang.code)}
                                    >
                                        <span className="text-sm font-medium">{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">📱 {t.app_download.title}</h3>
                            <div className="space-y-3">
                                <button
                                    type='button'
                                    className="flex items-center justify-center w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    disabled
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    {t.app_download.download_ios}
                                </button>
                                <button
                                    type='button'
                                    className="flex items-center justify-center w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    disabled
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    {t.app_download.download_android}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{t.app_download.coming_soon}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} {translations[currentLanguage].footer.copyright}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.privacy_policy}</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.terms_of_service}</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.cookie_policy}</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.data_protection}</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.acceptable_use}</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.refund_policy}</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing; 