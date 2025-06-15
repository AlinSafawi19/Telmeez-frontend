import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import logo2 from '../assets/images/logo2.png';
import PricingPlans from './PricingPlans';
import About from './About';
import Demo from './Demo';
import FAQ from './FAQ';
import type { Language } from '../translations';
import { translations } from '../translations';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selectedPricingPlan, setSelectedPricingPlan] = useState<string | null>(null);
    const dropdownTimeoutRef = useRef<number | null>(null);
    const isHoveringRef = useRef(false);
    const pricingSectionRef = useRef<HTMLDivElement>(null);
    const studentManagementRef = useRef<HTMLDivElement>(null);
    const attendanceSystemRef = useRef<HTMLDivElement>(null);
    const gradeManagementRef = useRef<HTMLDivElement>(null);
    const communicationToolsRef = useRef<HTMLDivElement>(null);
    const ourStoryRef = useRef<HTMLDivElement>(null);
    const demoSectionRef = useRef<HTMLDivElement>(null);
    const faqSectionRef = useRef<HTMLDivElement>(null);
    // Add newsletter form states
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
    const [unsubscribeEmail, setUnsubscribeEmail] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const t = translations[currentLanguage];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'عربي' },
        { code: 'fr', label: 'Français' }
    ];

    const handleLanguageChange = (langCode: Language) => {
        setIsScrolling(true);
        setTimeout(() => {
            setIsScrolling(false);
            setCurrentLanguage(langCode);
            // Here you would typically also update the document direction for RTL languages
            if (langCode === 'ar') {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
        }, 500);
    };

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Add scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowBackToTop(scrollPosition > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Add back to top handler
    const handleBackToTop = () => {
        setIsScrolling(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(() => setIsScrolling(false), 1000);
    };

    const handleDropdownEnter = (dropdown: string) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        isHoveringRef.current = true;
        setActiveDropdown(dropdown);
    };

    const handleDropdownLeave = () => {
        isHoveringRef.current = false;
        dropdownTimeoutRef.current = window.setTimeout(() => {
            if (!isHoveringRef.current) {
                setActiveDropdown(null);
            }
        }, 300);
    };

    const handleDropdownClick = (e: React.MouseEvent, dropdown: string) => {
        e.preventDefault();
        if (dropdown === 'pricing') {
            pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            setActiveDropdown(null);
        } else if (activeDropdown === dropdown) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dropdown);
        }
    };

    // Add loading state handler for smooth scrolling
    const handleSmoothScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            setIsScrolling(true);
            ref.current.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => setIsScrolling(false), 1000);
        }
    };

    // Update the handleDropdownItemClick to use loading state
    const handleDropdownItemClick = (e: React.MouseEvent, featureName?: string) => {
        e.preventDefault();
        if (featureName) {
            switch (featureName) {
                case t.header.features.student_management:
                    handleSmoothScroll(studentManagementRef);
                    break;
                case t.header.features.attendance_system:
                    handleSmoothScroll(attendanceSystemRef);
                    break;
                case t.header.features.grade_management:
                    handleSmoothScroll(gradeManagementRef);
                    break;
                case t.header.features.communication_tools:
                    handleSmoothScroll(communicationToolsRef);
                    break;
                case t.header.about.our_story:
                    const ourStorySection = document.getElementById('our-story');
                    setIsScrolling(true);
                    ourStorySection?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setIsScrolling(false), 1000);
                    break;
                case t.header.about.press:
                    const aboutSection = document.getElementById(featureName.toLowerCase().replace(' ', '-'));
                    setIsScrolling(true);
                    aboutSection?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setIsScrolling(false), 1000);
                    break;
            }
        }
        setActiveDropdown(null);
    };

    const handlePricingDropdownItemClick = (e: React.MouseEvent, planLabel: string) => {
        e.preventDefault();
        setSelectedPricingPlan(planLabel);
        setIsScrolling(true);
        pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setIsScrolling(false), 1000);
        setActiveDropdown(null);
    };

    const dropdownItems = {
        features: [
            { label: t.header.features.student_management, href: '#student-management' },
            { label: t.header.features.attendance_system, href: '#attendance-system' },
            { label: t.header.features.grade_management, href: '#grade-management' },
            { label: t.header.features.communication_tools, href: '#communication-tools' }
        ],
        resources: [
            { label: t.header.resources.demo, href: '#' },
            { label: t.header.resources.faq, href: '#' }
        ],
        about: [
            { label: t.header.about.our_story, href: '#' },
            { label: t.header.about.press, href: '#' }
        ],
        pricing: [
            {
                label: t.header.pricing.starter,
                href: '#',
                monthlyPrice: '$49',
                annualPrice: '$470',
                description: t.header.pricing.starter_desc,
                details: t.header.pricing.starter_details,
                savings: t.header.pricing.savings
            },
            {
                label: t.header.pricing.standard,
                href: '#',
                monthlyPrice: '$99',
                annualPrice: '$950',
                description: t.header.pricing.standard_desc,
                details: t.header.pricing.standard_details,
                savings: t.header.pricing.savings
            },
            {
                label: t.header.pricing.enterprise,
                href: '#',
                monthlyPrice: '$299',
                annualPrice: '$2,870',
                description: t.header.pricing.enterprise_desc,
                details: t.header.pricing.enterprise_details,
                savings: t.header.pricing.savings
            }
        ]
    };

    // Update the newsletter subscription handler
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Here you would typically make an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubscribeEmail('');
        } catch (error) {
        } finally {
        }
    };

    // Update the unsubscribe handler
    const handleUnsubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!unsubscribeEmail) return; // Don't proceed if email is empty


        try {
            // Here you would typically make an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUnsubscribeEmail('');
            setTimeout(() => {
                setIsUnsubscribeModalOpen(false);
            }, 2000);
        } catch (error) {
        } finally {
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <a href="#" onClick={(e) => {
                                e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsScrolling(true);
                                setTimeout(() => setIsScrolling(false), 1000);
                            }} className="transition-transform hover:scale-105">
                                <img src={logo} alt="Telmeez Logo" className="h-20 w-20" />
                            </a>
                        </div>
                        <nav className={`hidden md:flex ${currentLanguage === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setIsScrolling(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setTimeout(() => setIsScrolling(false), 1000);
                            }} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">{t.header.home}</a>
                            <div
                                className="relative group"
                                onMouseEnter={() => handleDropdownEnter('features')}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <a
                                    href="#"
                                    onClick={(e) => handleDropdownClick(e, 'features')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center"
                                >
                                    {t.header.features.features}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'features' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
                                    onMouseEnter={() => handleDropdownEnter('features')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    {dropdownItems.features.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.href}
                                            onClick={(e) => handleDropdownItemClick(e, item.label)}
                                            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div
                                className="relative group"
                                onMouseEnter={() => handleDropdownEnter('pricing')}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <a
                                    href="#"
                                    onClick={(e) => handleDropdownClick(e, 'pricing')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center"
                                >
                                    {t.header.pricing.pricing}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'pricing' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
                                    onMouseEnter={() => handleDropdownEnter('pricing')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    {dropdownItems.pricing.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.href}
                                            onClick={(e) => handlePricingDropdownItemClick(e, item.label)}
                                            className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-gray-900">{item.label}</span>
                                                <div className="text-right">
                                                    <div className="text-blue-600 font-bold">{item.monthlyPrice}{t.header.pricing.permonth}</div>
                                                    <div className="text-sm text-gray-600">{item.annualPrice}{t.header.pricing.peryear}</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                                            <p className="text-xs text-green-600 mt-1">{item.savings}</p>
                                            {item.label === t.header.pricing.starter && (
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        <span className="mr-1">✨</span>
                                                        {t.header.pricing.free_trial}
                                                    </span>
                                                </div>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div
                                className="relative group"
                                onMouseEnter={() => handleDropdownEnter('about')}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <a
                                    href="#"
                                    onClick={(e) => handleDropdownClick(e, 'about')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center"
                                >
                                    {t.header.about.about}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'about' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
                                    onMouseEnter={() => handleDropdownEnter('about')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    {dropdownItems.about.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.href}
                                            onClick={(e) => handleDropdownItemClick(e, item.label)}
                                            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div
                                className="relative group"
                                onMouseEnter={() => handleDropdownEnter('resources')}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <a
                                    href="#"
                                    onClick={(e) => handleDropdownClick(e, 'resources')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center"
                                >
                                    {t.header.resources.resources}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'resources' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
                                    onMouseEnter={() => handleDropdownEnter('resources')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    {dropdownItems.resources.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (item.label === 'Demo') {
                                                    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                } else if (item.label === 'FAQ') {
                                                    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                                setIsScrolling(true);
                                                setTimeout(() => setIsScrolling(false), 1000);
                                                setActiveDropdown(null);
                                            }}
                                            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </nav>
                        <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                            <div className="relative group">
                                <button
                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium focus:outline-none"
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
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-40 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'language' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="language-menu"
                                    ref={languageDropdownRef}
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                handleLanguageChange(lang.code as Language);
                                                setActiveDropdown(null);
                                            }}
                                            className={`flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'bg-transparent'}`}
                                            role="menuitem"
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
                                onClick={() => navigate('/signin')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium focus:outline-none"
                            >
                                {t.header.signin}
                            </button>
                            <button
                                type="button"
                                className="md:hidden text-gray-600 focus:outline-none"
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
                                className="md:hidden mt-4 py-4 border-t overflow-hidden"
                            >
                                <div className="flex justify-end mb-4">
                                    <button
                                        className="text-gray-600 hover:text-blue-600 focus:outline-none"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        aria-label="Close mobile menu"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <nav className="flex flex-col space-y-4">
                                    <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">Home</a>
                                    <div className="pl-4 border-l-2 border-gray-200">
                                        <span className="text-gray-600 font-medium block mb-2">Features</span>
                                        {dropdownItems.features.map((item, index) => (
                                            <a
                                                key={index}
                                                href={item.href}
                                                onClick={(e) => {
                                                    handleDropdownItemClick(e, item.label);
                                                    setIsScrolling(true);
                                                    setTimeout(() => setIsScrolling(false), 1000); setIsMobileMenuOpen(false);
                                                }}
                                                className="block pl-4 py-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                            setIsScrolling(true);
                                            setTimeout(() => setIsScrolling(false), 1000); setIsMobileMenuOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
                                    >
                                        Pricing
                                    </a>
                                    <div className="pl-4 border-l-2 border-gray-200">
                                        <span className="text-gray-600 font-medium block mb-2">About</span>
                                        {dropdownItems.about.map((item, index) => (
                                            <a
                                                key={index}
                                                href={item.href}
                                                onClick={(e) => {
                                                    handleDropdownItemClick(e, item.label);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block pl-4 py-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="pl-4 border-l-2 border-gray-200">
                                        <span className="text-gray-600 font-medium block mb-2">Resources</span>
                                        <ul className="space-y-2">
                                            <li><a href="#demo" onClick={(e) => {
                                                e.preventDefault(); demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                                setTimeout(() => setIsScrolling(false), 1000); setIsMobileMenuOpen(false);
                                            }} className="block pl-4 py-1 text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium">Demo</a></li>
                                            <li><a href="#" onClick={(e) => {
                                                e.preventDefault(); faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                                setTimeout(() => setIsScrolling(false), 1000); setIsMobileMenuOpen(false);
                                            }} className="block pl-4 py-1 text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium">FAQ</a></li>
                                        </ul>
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Hero Section */}
            <div className="min-h-screen pt-24 pb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className={`text-7xl font-bold text-gray-900 mb-8 leading-tight ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                            {t.hero.title}
                        </h1>
                        <p className={`text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed ${isVisible ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
                            {t.hero.subtitle}
                        </p>
                        <div className={`flex justify-center space-x-6 rtl:space-x-reverse ${isVisible ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
                            <button
                                type="button"
                                onClick={() => {
                                    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }}
                                className="bg-blue-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-0"
                            >
                                {t.hero.getStarted}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 300);
                                }}
                                className="bg-white text-blue-600 px-10 py-4 rounded-lg text-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-600 focus:outline-none focus:ring-0"
                            >
                                {t.hero.learnMore}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features-section" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        {t.header.why_us.why_us} <span className="text-blue-600">{t.header.why_us.company_name}</span>{t.header.why_us.question_mark}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="text-blue-600 text-4xl mb-6">👤</div>
                            <h3 className="text-2xl font-semibold mb-4">{t.header.why_us.role_based}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t.header.why_us.role_based_desc}
                            </p>
                        </div>
                        <div className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="text-blue-600 text-4xl mb-6">🔒</div>
                            <h3 className="text-2xl font-semibold mb-4">{t.header.why_us.advanced_security}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t.header.why_us.advanced_security_desc}
                            </p>
                        </div>
                        <div className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="text-blue-600 text-4xl mb-6">💬</div>
                            <h3 className="text-2xl font-semibold mb-4">{t.header.why_us.seamless_comm}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t.header.why_us.seamless_comm_desc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Management Section */}
            <div ref={studentManagementRef} id="student-management" className="py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4 animate-fadeInUp">{t.features.student_management.student_management}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">{t.features.student_management.title}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                {t.features.student_management.subtitle}
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4 ml-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.student_management.student_profiles.student_profiles}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.student_management.student_profiles.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.student_management.student_profiles.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.student_management.student_profiles.tick2}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.student_management.student_profiles.tick3}
                                    </li>
                                </ul>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center ml-4 mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.student_management.enrollment_management.enrollment_management}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.student_management.enrollment_management.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.student_management.enrollment_management.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.student_management.enrollment_management.tick2}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.student_management.enrollment_management.tick3}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance System Section */}
            <div ref={attendanceSystemRef} id="attendance-system" className="py-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-600 text-sm font-semibold mb-4 animate-fadeInUp">{t.features.attendance_system.attendance_system}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">{t.features.attendance_system.title}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                {t.features.attendance_system.subtitle}
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center rtl:ml-4 mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.attendance_system.real_time_tracking.real_time_tracking}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.attendance_system.real_time_tracking.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.attendance_system.real_time_tracking.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.attendance_system.real_time_tracking.tick2}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.attendance_system.real_time_tracking.tick3}
                                    </li>
                                </ul>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center rtl:ml-4 mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.attendance_system.automated_reports.automated_reports}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.attendance_system.automated_reports.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.attendance_system.automated_reports.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.attendance_system.automated_reports.tick2}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.attendance_system.automated_reports.tick3}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grade Management Section */}
            <div ref={gradeManagementRef} id="grade-management" className="py-20 bg-gradient-to-b from-yellow-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 text-sm font-semibold mb-4 animate-fadeInUp">{t.features.grade_management.grade_management}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">{t.features.grade_management.title}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                {t.features.grade_management.subtitle}
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center rtl:ml-4 mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.grade_management.grade_entry.grade_entry}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.grade_management.grade_entry.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.grade_management.grade_entry.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.grade_management.grade_entry.tick2}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.grade_management.grade_entry.tick3}
                                    </li>
                                </ul>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center rtl:ml-4 mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.grade_management.progress_tracking.progress_tracking}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.grade_management.progress_tracking.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.grade_management.progress_tracking.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Performance Reports
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Trend Analysis
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Communication Tools Section */}
            <div ref={communicationToolsRef} id="communication-tools" className="py-20 bg-gradient-to-b from-pink-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4 animate-fadeInUp">{t.features.communication_tools.communication_tools}</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">{t.features.communication_tools.title}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                {t.features.communication_tools.subtitle}
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center ml-4 mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.communication_tools.messaging.messaging}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.communication_tools.messaging.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.communication_tools.messaging.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.communication_tools.messaging.tick2}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.communication_tools.messaging.tick3}
                                    </li>
                                </ul>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center ml-4 mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{t.features.communication_tools.notifications.notifications}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {t.features.communication_tools.notifications.description}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.communication_tools.notifications.tick1}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.communication_tools.notifications.tick2}
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t.features.communication_tools.notifications.tick3}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Plans Section */}
            <div ref={pricingSectionRef} data-section="pricing">
                <PricingPlans initialSelectedPlan={selectedPricingPlan} language={currentLanguage} />
            </div>

            {/* About Section */}
            <div ref={ourStoryRef}>
                <About language={currentLanguage} />
            </div>

            {/* Demo Section */}
            <div ref={demoSectionRef}>
                <Demo language={currentLanguage} />
            </div>

            {/* FAQ Section */}
            <div ref={faqSectionRef}>
                <FAQ language={currentLanguage} />
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-8">
                        {translations[currentLanguage].cta.title}
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        {translations[currentLanguage].cta.subtitle}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                            setIsScrolling(true);
                            setTimeout(() => setIsScrolling(false), 1000);
                        }}
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-0"
                    >
                        {translations[currentLanguage].cta.button}
                    </button>
                </div>
            </div>

            {/* Add Newsletter Section before the footer */}
            <section className="bg-blue-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {translations[currentLanguage].newsletter.title}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {translations[currentLanguage].newsletter.subtitle}
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={subscribeEmail}
                                    onChange={(e) => setSubscribeEmail(e.target.value)}
                                    placeholder={translations[currentLanguage].newsletter.email_placeholder}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {translations[currentLanguage].newsletter.subscribe_button}
                                </button>
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                {translations[currentLanguage].newsletter.privacy_message} <button
                                    onClick={() => setIsUnsubscribeModalOpen(true)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition-colors duration-200 border-0 bg-transparent p-0"
                                >
                                    {translations[currentLanguage].newsletter.unsubscribe_button}
                                </button> {translations[currentLanguage].newsletter.unsubscribe_anytime}
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        <div>
                            <a href="#" onClick={(e) => {
                                e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsScrolling(true);
                                setTimeout(() => setIsScrolling(false), 1000);
                            }} className="inline-block transition-transform hover:scale-105">
                                <img src={logo2} alt="Telmeez Logo" className="h-16 w-16 mb-4" />
                            </a>
                            <p className="text-gray-400">
                                {translations[currentLanguage].footer.text}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.quick_links.quick_links}</h3>
                            <ul className="space-y-2">
                                <li><a href="#our-story" onClick={(e) => {
                                    e.preventDefault(); ourStoryRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.about_us}</a></li>
                                <li><a href="#student-management" onClick={(e) => {
                                    e.preventDefault(); studentManagementRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.features}</a></li>
                                <li><a href="#pricing" onClick={(e) => {
                                    e.preventDefault(); pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.pricing}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.resources.resources}</h3>
                            <ul className="space-y-2">
                                <li><a href="#demo" onClick={(e) => {
                                    e.preventDefault();
                                    setIsScrolling(true);
                                    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.resources.demo}</a></li>
                                <li><a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setIsScrolling(true);
                                    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.resources.faq}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.contact_us.contact_us}</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <svg className={`w-5 h-5 text-gray-400 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="mailto:info@telmeez.com" className="text-gray-400 hover:text-white transition-colors">info@telmeez.com</a>
                                </li>
                                <li className="flex items-center">
                                    <svg className={`w-5 h-5 text-gray-400 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors" dir="ltr">+1 (234) 567-890</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.social}</h3>
                            <div className={`flex ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Facebook">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/telmeez" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Instagram">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="LinkedIn">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{translations[currentLanguage].footer.language}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code as Language)}
                                        className={`flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none ${currentLanguage === lang.code
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} {translations[currentLanguage].footer.copyright}</p>
                    </div>
                </div>
            </footer>

            {/* Add Unsubscribe Modal */}
            <AnimatePresence>
                {isUnsubscribeModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Unsubscribe from Newsletter</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsUnsubscribeModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    aria-label="Close unsubscribe modal"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleUnsubscribe}>
                                <div className="mb-4">
                                    <label htmlFor="unsubscribe-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter your email address to unsubscribe
                                    </label>
                                    <input
                                        type="email"
                                        id="unsubscribe-email"
                                        value={unsubscribeEmail}
                                        onChange={(e) => setUnsubscribeEmail(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsUnsubscribeModalOpen(false)}
                                        className="px-4 py-2 focus:outline-none text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 focus:outline-none bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Unsubscribe
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add loading overlay for smooth scrolling */}
            {isScrolling && (
                <div className="fixed inset-0 bg-black bg-opacity-10 z-40 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}

            {/* Add Back to Top button */}
            <button
                onClick={handleBackToTop}
                className={`fixed bottom-8 ${currentLanguage === 'ar' ? 'left-8' : 'right-8'} p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showBackToTop
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16 pointer-events-none'
                    }`}
                aria-label="Back to top"
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

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                .delay-100 {
                    animation-delay: 100ms;
                }
                .delay-200 {
                    animation-delay: 200ms;
                }
                .delay-300 {
                    animation-delay: 300ms;
                }
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .feature-card {
                    position: relative;
                    overflow: hidden;
                }
                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s;
                }
                .feature-card:hover::before {
                    transform: translateX(100%);
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Landing; 