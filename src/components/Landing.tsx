import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import logo2 from '../assets/images/logo2.png';
import logoarb from '../assets/images/logo_arb.png';
import logo2arb from '../assets/images/logo2_arb.png';
import PricingPlans from './PricingPlans';
import About from './About';
import Demo from './Demo';
import FAQ from './FAQ';
import type { Language } from '../translations';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import '../Landing.css';

interface TestimonialForm {
    name: string;
    position: string;
    institution: string;
    quote: string;
    email: string;
}

interface TestimonialFormErrors {
    name?: string;
    position?: string;
    institution?: string;
    quote?: string;
    email?: string;
}

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selectedPricingPlan, setSelectedPricingPlan] = useState<string | null>(null);
    const dropdownTimeoutRef = useRef<number | null>(null);
    const isHoveringRef = useRef(false);
    const pricingSectionRef = useRef<HTMLDivElement>(null);
    const studentManagementRef = useRef<HTMLDivElement>(null);
    const ourStoryRef = useRef<HTMLDivElement>(null);
    const demoSectionRef = useRef<HTMLDivElement>(null);
    const faqSectionRef = useRef<HTMLDivElement>(null);
    const securitySectionRef = useRef<HTMLDivElement>(null);
    // Add newsletter form states
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeEmailError, setSubscribeEmailError] = useState('');
    const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
    const [unsubscribeEmail, setUnsubscribeEmail] = useState('');
    const [unsubscribeEmailError, setUnsubscribeEmailError] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage];
    const [testimonials, /*setTestimonials*/] = useState<any[]>([]);

    // Add testimonial form states
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>({
        name: '',
        position: '',
        institution: '',
        quote: '',
        email: ''
    });

    const [showUnsubscribeMessage, setShowUnsubscribeMessage] = useState(false);
    const [testimonialFormErrors, setTestimonialFormErrors] = useState<TestimonialFormErrors>({});

    useEffect(() => {
        localStorage.clear();
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
            // Update error messages if they exist
            if (subscribeEmailError) {
                if (!subscribeEmail.trim()) {
                    setSubscribeEmailError(translations[langCode].newsletter.errors.email_required);
                } else if (!validateEmail(subscribeEmail)) {
                    setSubscribeEmailError(translations[langCode].newsletter.errors.invalid_email);
                }
            }
        }, 500);
    };

    // Add scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowBackToTop(scrollPosition > 300);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
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

    // Update the handleDropdownItemClick to use loading state
    const handleDropdownItemClick = (e: React.MouseEvent, name?: string) => {
        e.preventDefault();
        if (name) {
            switch (name) {
                case t.header.about.our_story:
                    const ourStorySection = document.getElementById('our-story');
                    setIsScrolling(true);
                    ourStorySection?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setIsScrolling(false), 1000);
                    break;
                case t.header.about.press:
                    const aboutSection = document.getElementById(name.toLowerCase().replace(' ', '-'));
                    setIsScrolling(true);
                    aboutSection?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setIsScrolling(false), 1000);
                    break;
                case t.header.about.testimonials:
                    const testimonialsSection = document.getElementById('testimonials');
                    setIsScrolling(true);
                    testimonialsSection?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setIsScrolling(false), 1000);
                    break;
            }
        }
        setActiveDropdown(null);
    };

    const handlePricingDropdownItemClick = (e: React.MouseEvent, planLabel: string) => {
        e.preventDefault();
        // Map the plan label to its corresponding ID
        const planId = planLabel === t.header.pricing.starter ? 'starter' :
            planLabel === t.header.pricing.standard ? 'standard' :
                planLabel === t.header.pricing.enterprise ? 'enterprise' : null;

        if (planId) {
            setSelectedPricingPlan(planId);
            setIsScrolling(true);
            pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => setIsScrolling(false), 1000);
        }
        setActiveDropdown(null);
    };

    const dropdownItems = {
        features: [
            //{ label: , href: '#' }
        ],
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

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubscribeEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setSubscribeEmail(email);
        setSubscribeEmailError(''); // Clear any existing error when user types
    };

    const handleUnsubscribeEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setUnsubscribeEmail(email);
    };

    // Update the newsletter subscription handler
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!subscribeEmail.trim()) {
            setSubscribeEmailError(t.newsletter.errors.email_required);
            return;
        }
        if (!validateEmail(subscribeEmail)) {
            setSubscribeEmailError(t.newsletter.errors.invalid_email);
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUnsubscribeEmail(subscribeEmail);
            setSubscribeEmail('');
            setSubscribeEmailError('');
        } catch (error) {
        }
    };

    // Update the unsubscribe handler
    const handleUnsubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!unsubscribeEmail.trim()) {
            setUnsubscribeEmailError(t.newsletter.errors.email_required);
            return;
        }
        if (!validateEmail(unsubscribeEmail)) {
            setUnsubscribeEmailError(t.newsletter.errors.invalid_email);
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUnsubscribeEmail('');
            setUnsubscribeEmailError('');
            setShowUnsubscribeMessage(true);
            setTimeout(() => {
                setIsUnsubscribeModalOpen(false);
                setShowUnsubscribeMessage(false);
            }, 2000);
        } catch (error) {
        } finally {
        }
    };

    // Add testimonial form change handler
    const handleTestimonialFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedForm = {
            ...testimonialForm,
            [name]: value
        };
        setTestimonialForm(updatedForm);
    };

    const validateTestimonialForm = (): boolean => {
        const errors: TestimonialFormErrors = {};
        let isValid = true;

        // Name validation
        if (!testimonialForm.name.trim()) {
            errors.name = t.testimonials.modal.errors.email_required;
            isValid = false;
        }

        // Position validation
        if (!testimonialForm.position.trim()) {
            errors.position = t.testimonials.modal.errors.position_required;
            isValid = false;
        }

        // Institution validation
        if (!testimonialForm.institution.trim()) {
            errors.institution = t.testimonials.modal.errors.institution_required;
            isValid = false;
        }

        // Quote validation
        if (!testimonialForm.quote.trim()) {
            errors.quote = t.testimonials.modal.errors.quote_required;
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!testimonialForm.email.trim()) {
            errors.email = t.testimonials.modal.errors.email_required;
            isValid = false;
        } else if (!emailRegex.test(testimonialForm.email)) {
            errors.email = t.testimonials.modal.errors.invalid_email;
            isValid = false;
        }

        setTestimonialFormErrors(errors);
        return isValid;
    };

    const handleTestimonialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateTestimonialForm()) {
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

            // Clear form and errors after successful submission
            setTestimonialForm({
                name: '',
                position: '',
                institution: '',
                quote: '',
                email: ''
            });
            setTestimonialFormErrors({});
            setIsTestimonialModalOpen(false);
        } catch (error) {
        }
    };

    const handleCloseTestimonialModal = () => {
        setIsTestimonialModalOpen(false);
        setTestimonialFormErrors({});
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
                                <img src={currentLanguage === 'ar' ? logoarb : logo} alt="Telmeez Logo" className="h-20 w-20" />
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
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'features' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg`}
                                    onMouseEnter={() => handleDropdownEnter('features')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    {dropdownItems.features.map((/*item,*/ index) => (
                                        <a
                                            key={index}
                                            //href={item.href}
                                            //onClick={(e) => handleDropdownItemClick(e, item.label)}
                                            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {/*item.label*/}
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
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'pricing' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg`}
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
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'about' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg`}
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
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'resources' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg`}
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
                                                } else if (item.label === 'Security & Compliance') {
                                                    securitySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                            <a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsScrolling(true);
                                    // Scroll to the contact section (which is the contact/support section)
                                    const contactSection = document.querySelector('.py-20.bg-gradient-to-r.from-blue-600.to-blue-600');
                                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }}
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium hidden md:block"
                            >
                                {t.header.contact || 'Contact'}
                            </a>
                        </nav>
                        <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                            <div className="relative group">
                                <button
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
                                    className={`absolute ${currentLanguage === 'ar' ? 'right-0' : 'left-0'} mt-2 w-40 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'language' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg`}
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
                                        className="text-gray-600 bg-white p-2 rounded-lg border border-gray-300 focus:outline-none hover:bg-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        aria-label="Close mobile menu"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <nav className="flex flex-col space-y-4">
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setIsMobileMenuOpen(false);
                                        requestAnimationFrame(() => {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            setIsScrolling(true);
                                            setTimeout(() => setIsScrolling(false), 1000);
                                        });
                                    }} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">{t.header.home}</a>
                                    <div className={`${currentLanguage === 'ar' ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-gray-200`}>
                                        <span className="text-gray-600 font-medium block mb-2">{t.header.features.features}</span>
                                        {dropdownItems.features.map((/*item,*/ index) => (
                                            <a
                                                key={index}
                                                //href={item.href}
                                                onClick={(/*e*/) => {
                                                    setIsMobileMenuOpen(false);
                                                    requestAnimationFrame(() => {
                                                        setIsScrolling(true);
                                                        setTimeout(() => setIsScrolling(false), 1000);
                                                    });
                                                }}
                                                className={`block ${currentLanguage === 'ar' ? 'pr-4' : 'pl-4'} py-1 text-gray-500 hover:text-blue-600 transition-colors duration-200`}
                                            >
                                                {/*item.label*/}
                                            </a>
                                        ))}
                                    </div>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsMobileMenuOpen(false);
                                            requestAnimationFrame(() => {
                                                pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                setIsScrolling(true);
                                                setTimeout(() => setIsScrolling(false), 1000);
                                            });
                                        }}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
                                    >
                                        {t.header.pricing.pricing}
                                    </a>
                                    <div className={`${currentLanguage === 'ar' ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-gray-200`}>
                                        <span className="text-gray-600 font-medium block mb-2">{t.header.about.about}</span>
                                        {dropdownItems.about.map((item, index) => (
                                            <a
                                                key={index}
                                                href={item.href}
                                                onClick={(e) => {
                                                    setIsMobileMenuOpen(false);
                                                    requestAnimationFrame(() => {
                                                        handleDropdownItemClick(e, item.label);
                                                    });
                                                }}
                                                className={`block ${currentLanguage === 'ar' ? 'pr-4' : 'pl-4'} py-1 text-gray-500 hover:text-blue-600 transition-colors duration-200`}
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                    <div className={`${currentLanguage === 'ar' ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-gray-200`}>
                                        <span className="text-gray-600 font-medium block mb-2">{t.header.resources.resources}</span>
                                        <ul className="space-y-2">
                                            <li><a href="#demo" onClick={(e) => {
                                                e.preventDefault();
                                                setIsMobileMenuOpen(false);
                                                requestAnimationFrame(() => {
                                                    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                    setIsScrolling(true);
                                                    setTimeout(() => setIsScrolling(false), 1000);
                                                });
                                            }} className={`block ${currentLanguage === 'ar' ? 'pr-4' : 'pl-4'} py-1 text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium`}>{t.header.resources.demo}</a></li>
                                            <li><a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                setIsMobileMenuOpen(false);
                                                requestAnimationFrame(() => {
                                                    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                    setIsScrolling(true);
                                                    setTimeout(() => setIsScrolling(false), 1000);
                                                });
                                            }} className={`block ${currentLanguage === 'ar' ? 'pr-4' : 'pl-4'} py-1 text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium`}>{t.header.resources.faq}</a></li>
                                            <li><a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                setIsMobileMenuOpen(false);
                                                requestAnimationFrame(() => {
                                                    securitySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                    setIsScrolling(true);
                                                    setTimeout(() => setIsScrolling(false), 1000);
                                                });
                                            }} className={`block ${currentLanguage === 'ar' ? 'pr-4' : 'pl-4'} py-1 text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium`}>{t.header.resources.security}</a></li>
                                        </ul>
                                        <a
                                            href="#contact"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsMobileMenuOpen(false);
                                                requestAnimationFrame(() => {
                                                    setIsScrolling(true);
                                                    // Scroll to the contact section (which is the contact/support section)
                                                    const contactSection = document.querySelector('.py-20.bg-gradient-to-r.from-blue-600.to-blue-600');
                                                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                                                    setTimeout(() => setIsScrolling(false), 1000);
                                                });
                                            }}
                                            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
                                        >
                                            {t.header.contact}
                                        </a>
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Hero Section */}
            <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center relative overflow-hidden">
                {/* Enhanced decorative background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce floating-particle-${i + 1}`}
                        />
                    ))}
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i + 6}
                            className={`absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse floating-particle-${i + 7}`}
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
                                onClick={() => {
                                    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }}
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
                                onClick={() => {
                                    ourStoryRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }}
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
            </div>

            {/* Features Section */}
            <div id="features-section">

            </div>

            {/* App Download Section */}
            <div id="app-download" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-block">
                                    <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                                        <span className="mr-2">📱</span>
                                        {t.app_download.coming_soon}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 mt-4 leading-tight">
                                    {t.app_download.title}
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    {t.app_download.subtitle}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="space-y-4"
                            >
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t.app_download.key_features}</h3>
                                <ul className="space-y-3">
                                    {t.app_download.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${currentLanguage === 'ar' ? 'ml-3' : 'mr-3'} text-blue-600 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                            >
                                <button
                                    className="flex items-center justify-center px-4 sm:px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                    disabled
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    {t.app_download.download_ios}
                                </button>
                                <button
                                    className="flex items-center justify-center px-4 sm:px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                    disabled
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    {t.app_download.download_android}
                                </button>
                            </motion.div>
                        </div>

                        {/* Right side - Mobile mockup and QR code */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="relative order-1 lg:order-2 flex justify-center"
                        >
                            <div className="relative mx-auto max-w-xs sm:max-w-sm">
                                {/* Mobile phone mockup */}
                                <div className="relative w-48 sm:w-64 h-[400px] sm:h-[500px] mx-auto bg-gray-900 rounded-[32px] sm:rounded-[40px] p-3 sm:p-4 shadow-2xl">
                                    <div className="w-full h-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden relative">
                                        {/* Status bar */}
                                        <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-gray-100 flex items-center justify-center">
                                            <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-200 rounded-full"></div>
                                        </div>

                                        {/* App content */}
                                        <div className="mt-6 sm:mt-8 p-3 sm:p-4 flex flex-col items-center justify-center h-full">
                                            <div className="text-center space-y-3 sm:space-y-4">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                                                    <img
                                                        src={currentLanguage === 'ar' ? logoarb : logo}
                                                        alt="Telmeez Logo"
                                                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                                                    />
                                                </div>
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{currentLanguage === 'ar' ? 'تلميز' : 'Telmeez'}</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 text-center">
                                                    {t.app_download.coming_soon}
                                                </p>

                                                {/* QR Code placeholder */}
                                                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mx-auto">
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded flex items-center justify-center mx-auto mb-2">
                                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M3,3H11V5H5V11H3V3M3,13H5V19H11V21H3V13M13,3V5H19V11H21V3H13M19,13H21V21H13V19H19V13Z" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-xs text-gray-500">{t.app_download.scan_qr}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 text-center mt-2">
                                                        {t.app_download.qr_description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce animation-delay-1000"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                {/* Enhanced decorative elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                {testimonials.length > 0 ? t.testimonials.hasfeedbacks.title : t.testimonials.nofeedbacks.title}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                {testimonials.length > 0
                                    ? t.testimonials.hasfeedbacks.subtitle
                                    : t.testimonials.nofeedbacks.subtitle}
                            </p>
                            <button
                                onClick={() => setIsTestimonialModalOpen(true)}
                                className="mt-8 inline-flex items-center px-6 py-3 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <svg className={`w-5 h-5 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t.testimonials.modal.title}
                            </button>
                        </motion.div>
                    </div>

                    {testimonials.length >= 3 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.slice(-3).map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative">
                                        <div className="flex items-center mb-6">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                    {testimonial.initials}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                                <p className="text-gray-600">{testimonial.position}</p>
                                                <p className="text-sm text-blue-600 font-medium">{testimonial.institution}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <svg className="absolute -top-4 -left-4 w-8 h-8 text-blue-200 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 32 32">
                                                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                            </svg>
                                            <p className="text-gray-600 italic mb-4 pl-4 group-hover:text-gray-900 transition-colors duration-300">
                                                {testimonial.quote}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500">{testimonial.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* Left side - Main content */}
                                <div className="space-y-6">
                                    <div className="inline-block">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            <span className="mr-2">✨</span>
                                            {t.testimonials.nofeedbacks.left.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                                        {t.testimonials.nofeedbacks.left.offer}
                                    </h3>
                                    <p className="text-lg text-gray-600">
                                        {t.testimonials.nofeedbacks.left.description}
                                    </p>
                                    <div className="flex flex-col space-y-4">
                                        <div className={`flex items-start ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">🎯</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.left.benifets.title}</h4>
                                                <ul className="text-gray-600 space-y-2 mt-2">
                                                    <li className="flex items-center">
                                                        <svg className={`w-4 h-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.left.benifets.ben1}
                                                    </li>
                                                    <li className="flex items-center">
                                                        <svg className={`w-4 h-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.left.benifets.ben2}
                                                    </li>
                                                    <li className="flex items-center">
                                                        <svg className={`w-4 h-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.left.benifets.ben3}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={`flex items-start ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">💡</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.left.shape_your_future}</h4>
                                                <p className="text-gray-600">{t.testimonials.nofeedbacks.left.shape_your_future_desc}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-start ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">🌟</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.left.recog}</h4>
                                                <p className="text-gray-600">{t.testimonials.nofeedbacks.left.recog_desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={() => {
                                                pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                setIsScrolling(true);
                                                setTimeout(() => setIsScrolling(false), 1000);
                                            }}
                                            className="inline-flex items-center px-6 py-3 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {t.testimonials.nofeedbacks.left.button}
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Right side - Visual elements */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl transform rotate-3"></div>
                                    <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                        <div className="space-y-6">
                                            <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    1
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.right.info1.title}</h4>
                                                    <p className="text-sm text-gray-600">{t.testimonials.nofeedbacks.right.info1.subtitle}</p>
                                                </div>
                                            </div>
                                            <div className="h-8 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400 mx-6"></div>
                                            <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    2
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.right.info2.title}</h4>
                                                    <p className="text-sm text-gray-600">{t.testimonials.nofeedbacks.right.info2.subtitle}</p>
                                                </div>
                                            </div>
                                            <div className="h-8 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400 mx-6"></div>
                                            <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    3
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.right.info3.title}</h4>
                                                    <p className="text-sm text-gray-600">{t.testimonials.nofeedbacks.right.info3.subtitle}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className={`flex ${currentLanguage === 'ar' ? 'space-x-reverse -space-x-2' : '-space-x-2'}`}>
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                                            {i === 0 ? t.testimonials.nofeedbacks.right.pioneers.first :
                                                                i === 1 ? t.testimonials.nofeedbacks.right.pioneers.second :
                                                                    t.testimonials.nofeedbacks.right.pioneers.third}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.right.tag}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
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

            {/* Security & Trust Section */}
            <div ref={securitySectionRef} className="py-10 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                                <span className="mr-2">🔒</span>
                                {translations[currentLanguage].security.tag}
                            </span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                {translations[currentLanguage].security.title}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {translations[currentLanguage].security.subtitle}
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: "🛡️",
                                title: translations[currentLanguage].security.features[0].title,
                                description: translations[currentLanguage].security.features[0].description,
                                details: translations[currentLanguage].security.features[0].tag
                            },
                            {
                                icon: "🌍",
                                title: translations[currentLanguage].security.features[1].title,
                                description: translations[currentLanguage].security.features[1].description,
                                details: translations[currentLanguage].security.features[1].tag
                            },
                            {
                                icon: "🔐",
                                title: translations[currentLanguage].security.features[2].title,
                                description: translations[currentLanguage].security.features[2].description,
                                details: translations[currentLanguage].security.features[2].tag
                            },
                            {
                                icon: "📊",
                                title: translations[currentLanguage].security.features[3].title,
                                description: translations[currentLanguage].security.features[3].description,
                                details: translations[currentLanguage].security.features[3].tag
                            }
                        ].map((security, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="text-center mb-4">
                                    <div className="text-3xl mb-3">{security.icon}</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{security.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{security.description}</p>
                                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full">
                                        <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-blue-800 text-xs font-medium">{security.details}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>


                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-16 grid md:grid-cols-3 gap-8"
                    >
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                            <div className="text-gray-600">{translations[currentLanguage].security.uptime_guarantee}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                            <div className="text-gray-600">{translations[currentLanguage].security.security_monitoring}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
                            <div className="text-gray-600">{translations[currentLanguage].security.security_breaches}</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 relative overflow-hidden">
                {/* Add decorative elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="container mx-auto px-4 text-center relative">
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
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl"
                    >
                        <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-gradient-to-r from-blue-50 to-white group-hover:translate-x-0"></span>
                        <span className="relative flex items-center">
                            {translations[currentLanguage].cta.button}
                            <svg className={`w-5 h-5 ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'} transform transition-transform duration-300 ${currentLanguage === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} ${currentLanguage === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* Add Newsletter Section before the footer */}
            <section id="newsletter" className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={subscribeEmail}
                                        onChange={handleSubscribeEmailChange}
                                        placeholder={translations[currentLanguage].newsletter.email_placeholder}
                                        className={`w-full px-4 py-3 rounded-lg border force-white-bg ${subscribeEmailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                                    />
                                    {subscribeEmailError && (
                                        <p className="mt-1 text-sm text-red-500">{subscribeEmailError}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {translations[currentLanguage].newsletter.subscribe_button}
                                </button>
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                {translations[currentLanguage].newsletter.privacy_message} <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsUnsubscribeModalOpen(true);
                                    }}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition-colors duration-200 border-0 bg-transparent p-0"
                                >
                                    {translations[currentLanguage].newsletter.unsubscribe_button}
                                </button> {translations[currentLanguage].newsletter.unsubscribe_anytime}
                            </p>
                        </form>

                    </div>
                </div>
            </section>

            {/* Contact/Support Section */}
            <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">{translations[currentLanguage].contact.Title}</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        {translations[currentLanguage].contact.SubTitle}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        {[
                            {
                                icon: "📞",
                                title: translations[currentLanguage].contact.Phone,
                                description: translations[currentLanguage].contact.speak_with_our_experts,
                                action: "+961 1 234 567",
                                href: "tel:+9611234567"
                            },
                            {
                                icon: "📧",
                                title: translations[currentLanguage].contact.Email,
                                description: translations[currentLanguage].contact.send_us_message,
                                action: "contact@telmeezlb.com",
                                href: "mailto:contact@telmeezlb.com"
                            }
                        ].map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                            >
                                <div className="text-4xl mb-4">{contact.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{contact.title}</h3>
                                <p className="text-orange-100 mb-4">{contact.description}</p>
                                <a
                                    href={contact.href}
                                    className="text-white font-medium hover:text-orange-200 transition-colors duration-300 cursor-pointer"
                                >
                                    {contact.action}
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        <div>
                            <a href="#" onClick={(e) => {
                                e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsScrolling(true);
                                setTimeout(() => setIsScrolling(false), 1000);
                            }} className="inline-block transition-transform hover:scale-105">
                                <img src={currentLanguage === 'ar' ? logo2arb : logo2} alt="Telmeez Logo" className="h-16 w-16 mb-4" />
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
                                <li><a href="#testimonials" onClick={(e) => {
                                    e.preventDefault(); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.quick_links.testimonials}</a></li>
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
                                <li><a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setIsScrolling(true);
                                    securitySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.resources.security}</a></li>
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
                        <div>
                            <h3 className="text-lg font-semibold mb-4">📱 {t.app_download.title}</h3>
                            <div className="space-y-3">
                                <button
                                    className="flex items-center justify-center w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    disabled
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    {t.app_download.download_ios}
                                </button>
                                <button
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
                            <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.privacy_policy}</a>
                            <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.terms_of_service}</a>
                            <a href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.cookie_policy}</a>
                            <a href="/data-protection" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.data_protection}</a>
                            <a href="/acceptable-use" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.acceptable_use}</a>
                            <a href="/refund-policy" className="text-gray-400 hover:text-white transition-colors">{translations[currentLanguage].footer.legal.refund_policy}</a>
                        </div>
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
                                <h3 className="text-xl font-semibold text-gray-900">{translations[currentLanguage].newsletter.unsubscribe_title}</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsUnsubscribeModalOpen(false);
                                        setUnsubscribeEmailError('');
                                    }}
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
                                        {translations[currentLanguage].newsletter.email_placeholder}
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            id="unsubscribe-email"
                                            value={unsubscribeEmail}
                                            onChange={handleUnsubscribeEmailChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${unsubscribeEmailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                                        />
                                        {unsubscribeEmailError && (
                                            <p className="mt-1 text-sm text-red-500">{unsubscribeEmailError}</p>
                                        )}
                                    </div>
                                </div>

                                {showUnsubscribeMessage ? (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="mt-2 mb-2 inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">{t.newsletter.unsubscribe_message}</span>
                                    </motion.div>
                                ) : null}

                                <div className={`flex justify-end ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUnsubscribeModalOpen(false);
                                            setUnsubscribeEmailError('');
                                        }}
                                        className="px-4 py-2 focus:outline-none text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {translations[currentLanguage].cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 focus:outline-none bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {translations[currentLanguage].newsletter.unsubscribe_button}
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

            {/* Add Testimonial Modal */}
            <AnimatePresence>
                {isTestimonialModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {t.testimonials.modal.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{t.testimonials.modal.subtitle}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseTestimonialModal}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200 p-2 hover:bg-gray-100 rounded-md force-white-bg"
                                    aria-label="Close testimonial modal"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.name}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={testimonialForm.name}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder={t.testimonials.modal.form.name_placeholder}
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.name && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.name}</p>
                                        )}
                                    </div>
                                    <div className="group">
                                        <label htmlFor="position" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.role}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="position"
                                                name="position"
                                                value={testimonialForm.position}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.position ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder={t.testimonials.modal.form.role_placeholder}
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.position && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.position}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label htmlFor="institution" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.institution}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="institution"
                                                name="institution"
                                                value={testimonialForm.institution}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.institution ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder={t.testimonials.modal.form.institution_placeholder}
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.institution && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.institution}</p>
                                        )}
                                    </div>
                                    <div className="group">
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.email}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="email"
                                                name="email"
                                                value={testimonialForm.email}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder="john@example.com"
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.email && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="quote" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                        {t.testimonials.modal.form.testimonial}
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="quote"
                                            name="quote"
                                            value={testimonialForm.quote}
                                            onChange={handleTestimonialFormChange}
                                            rows={4}
                                            className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.quote ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                            placeholder={t.testimonials.modal.form.testimonial_placeholder}
                                        />
                                        <div className={`absolute top-2 ${currentLanguage === 'ar' ? 'right-2' : 'left-2'} pointer-events-none`}>
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {testimonialFormErrors.quote && (
                                        <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.quote}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleCloseTestimonialModal}
                                        className={`px-4 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200 font-medium force-white-bg ${currentLanguage === 'ar' ? 'ml-3' : 'mr-3'}`}
                                    >
                                        {t.testimonials.modal.form.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {t.testimonials.modal.form.submit}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing; 