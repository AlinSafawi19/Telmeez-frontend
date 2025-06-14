import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import logo2 from '../assets/images/logo2.png';
import PricingPlans from './PricingPlans';
import About from './About';
import Demo from './Demo';
import FAQ from './FAQ';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selectedPricingPlan, setSelectedPricingPlan] = useState<string | null>(null);
    const [isStudentProfilesModalOpen, setIsStudentProfilesModalOpen] = useState(false);
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
    const [isGradeEntryModalOpen, setIsGradeEntryModalOpen] = useState(false);
    const [isProgressTrackingModalOpen, setIsProgressTrackingModalOpen] = useState(false);
    const [isMessagingSystemModalOpen, setIsMessagingSystemModalOpen] = useState(false);
    const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
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
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [subscriptionMessage, setSubscriptionMessage] = useState('');
    const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
    const [unsubscribeEmail, setUnsubscribeEmail] = useState('');
    const [unsubscribeStatus, setUnsubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [unsubscribeMessage, setUnsubscribeMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

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
                case 'Student Management':
                    handleSmoothScroll(studentManagementRef);
                    break;
                case 'Attendance System':
                    handleSmoothScroll(attendanceSystemRef);
                    break;
                case 'Grade Management':
                    handleSmoothScroll(gradeManagementRef);
                    break;
                case 'Communication Tools':
                    handleSmoothScroll(communicationToolsRef);
                    break;
                case 'Our Story':
                    const ourStorySection = document.getElementById('our-story');
                    setIsScrolling(true);
                    ourStorySection?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setIsScrolling(false), 1000);
                    break;
                case 'Press':
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
            { label: 'Student Management', href: '#student-management' },
            { label: 'Attendance System', href: '#attendance-system' },
            { label: 'Grade Management', href: '#grade-management' },
            { label: 'Communication Tools', href: '#communication-tools' }
        ],
        resources: [
            { label: 'Demo', href: '#' },
            { label: 'FAQ', href: '#' }
        ],
        about: [
            { label: 'Our Story', href: '#' },
            { label: 'Press', href: '#' }
        ],
        pricing: [
            {
                label: 'Starter',
                href: '#',
                monthlyPrice: '$49',
                annualPrice: '$470',
                description: 'Perfect for small schools',
                details: '1 Admin, 10 Teachers, 100 Students',
                savings: 'Save 20% annually'
            },
            {
                label: 'Standard',
                href: '#',
                monthlyPrice: '$99',
                annualPrice: '$950',
                description: 'Best for medium-sized institutions',
                details: '2 Admins, 30 Teachers, 300 Students',
                savings: 'Save 20% annually'
            },
            {
                label: 'Enterprise',
                href: '#',
                monthlyPrice: 'Custom',
                annualPrice: 'Custom',
                description: 'Includes custom domain, priority support',
                details: 'Unlimited users',
                savings: 'Contact for pricing'
            }
        ]
    };

    // Update the newsletter subscription handler
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSubscriptionStatus('idle');

        try {
            // Here you would typically make an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubscriptionStatus('success');
            setSubscriptionMessage('Thank you for subscribing! We\'ll keep you updated with the latest news.');
            setEmail('');
        } catch (error) {
            setSubscriptionStatus('error');
            setSubscriptionMessage('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Update the unsubscribe handler
    const handleUnsubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setUnsubscribeStatus('idle');

        try {
            // Here you would typically make an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUnsubscribeStatus('success');
            setUnsubscribeMessage('You have been successfully unsubscribed from our newsletter.');
            setUnsubscribeEmail('');
            setTimeout(() => {
                setIsUnsubscribeModalOpen(false);
            }, 2000);
        } catch (error) {
            setUnsubscribeStatus('error');
            setUnsubscribeMessage('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
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
                        <nav className="hidden md:flex space-x-8">
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setIsScrolling(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setTimeout(() => setIsScrolling(false), 1000);
                            }} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">Home</a>
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
                                    Features
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'features' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
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
                                    Pricing
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'pricing' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
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
                                                    <div className="text-blue-600 font-bold">{item.monthlyPrice}/mo</div>
                                                    <div className="text-sm text-gray-600">{item.annualPrice}/yr</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                                            <p className="text-xs text-green-600 mt-1">{item.savings}</p>
                                            {item.label === 'Starter' && (
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        <span className="mr-1">✨</span>
                                                        Free Trial
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
                                    About
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'about' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
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
                                    Resources
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <div
                                    className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'resources' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'}`}
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
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/signin')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium focus:outline-none"
                            >
                                Sign In
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
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 py-4 border-t animate-fadeIn">
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
                                            onClick={(e) => handleDropdownItemClick(e, item.label)}
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
                                        <li><a href="#demo" onClick={(e) => { e.preventDefault(); demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block pl-4 py-1 text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium">Demo</a></li>
                                        <li><a href="#" onClick={(e) => { e.preventDefault(); faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block pl-4 py-1 text-gray-500 hover:text-blue-600 transition-colors duration-300 font-medium">FAQ</a></li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <div className="min-h-screen pt-24 pb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className={`text-7xl font-bold text-gray-900 mb-8 leading-tight ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                            Empowering Educational Institutions
                        </h1>
                        <p className={`text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed ${isVisible ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
                            A comprehensive platform designed for schools, universities, and educational institutions.
                            Streamline your operations and enhance communication across your organization.
                        </p>
                        <div className={`flex justify-center space-x-6 ${isVisible ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
                            <button
                                type="button"
                                onClick={() => {
                                    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }}
                                className="bg-blue-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-0"
                            >
                                Get Started
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }}
                                className="bg-white text-blue-600 px-10 py-4 rounded-lg text-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-600 focus:outline-none focus:ring-0"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features-section" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        Why Institutions Choose <span className="text-blue-600">Telmeez</span>?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="text-blue-600 text-4xl mb-6">👤</div>
                            <h3 className="text-2xl font-semibold mb-4">Role-Based Access</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Customized dashboards for administrators, staff, parents, and students with secure role-based permissions.
                            </p>
                        </div>
                        <div className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="text-blue-600 text-4xl mb-6">🔒</div>
                            <h3 className="text-2xl font-semibold mb-4">Advanced Security</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enterprise-grade security with password encryption, token-based sessions, and account protection.
                            </p>
                        </div>
                        <div className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="text-blue-600 text-4xl mb-6">💬</div>
                            <h3 className="text-2xl font-semibold mb-4">Seamless Communication</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Connect administrators, staff, parents, and students through our integrated platform.
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
                            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4 animate-fadeInUp">Student Management</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">Comprehensive Student Management</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                Comprehensive tools to manage student information, track progress, and maintain records efficiently.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Student Profiles</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Create and manage detailed student profiles with personal information, academic history, and contact details.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Personal Information Management
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Academic History Tracking
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Contact Details Management
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsStudentProfilesModalOpen(true)}
                                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Enrollment Management</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Streamline the enrollment process with digital forms, document uploads, and automated workflows.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Digital Form Processing
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Document Management
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Automated Workflows
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsEnrollmentModalOpen(true)}
                                        className="text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
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
                            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-600 text-sm font-semibold mb-4 animate-fadeInUp">Attendance System</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">Modern Attendance Tracking</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                Modern attendance tracking with real-time monitoring and automated reporting.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Digital Attendance</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Take attendance digitally with QR codes, biometric integration, or manual entry options.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        QR Code Scanning
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Biometric Integration
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Manual Entry Options
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAttendanceModalOpen(true)}
                                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Automated Reports</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Generate detailed attendance reports and analytics to track patterns and identify trends.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Detailed Analytics
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Pattern Recognition
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Custom Report Generation
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsReportsModalOpen(true)}
                                        className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
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
                            <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 text-sm font-semibold mb-4 animate-fadeInUp">Grade Management</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">Comprehensive Grading System</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                Efficiently manage and track student grades with our comprehensive grading system.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Grade Entry</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Easy-to-use interface for entering and managing grades with support for various grading scales.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Multiple Grading Scales
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Bulk Grade Entry
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Grade History Tracking
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsGradeEntryModalOpen(true)}
                                        className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Progress Tracking</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Monitor student progress over time with visual analytics and detailed performance reports.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Visual Analytics
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
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsProgressTrackingModalOpen(true)}
                                        className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
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
                            <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-4 animate-fadeInUp">Communication Tools</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">Integrated Communication Platform</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
                                Stay connected with students, parents, and staff through our integrated communication platform.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Messaging System</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Real-time messaging between teachers, students, and parents with support for attachments and group chats.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Real-time Chat
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        File Sharing
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Group Conversations
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsMessagingSystemModalOpen(true)}
                                        className="text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Announcements</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Share important updates and announcements with the entire school community through targeted broadcasts.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Targeted Broadcasting
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Scheduled Announcements
                                    </li>
                                    <li className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Rich Media Support
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsAnnouncementsModalOpen(true)}
                                        className="text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-200 flex items-center group focus:outline-none"
                                    >
                                        Learn More
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Plans Section */}
            <div ref={pricingSectionRef} data-section="pricing">
                <PricingPlans initialSelectedPlan={selectedPricingPlan} />
            </div>

            {/* About Section */}
            <div ref={ourStoryRef}>
                <About />
            </div>

            {/* Demo Section */}
            <div ref={demoSectionRef}>
                <Demo />
            </div>

            {/* FAQ Section */}
            <div ref={faqSectionRef}>
                <FAQ />
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-8">
                        Ready to Transform Your Institution?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Experience a modern, intuitive platform designed specifically for educational institutions. Streamline your operations and enhance communication across your organization.
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
                        View Plans
                    </button>
                </div>
            </div>

            {/* Add Newsletter Section before the footer */}
            <section className="bg-blue-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Stay Updated with Telmeez
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Subscribe to our newsletter for the latest updates, features, and educational insights.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-6 py-3 rounded-lg font-medium text-white transition-colors duration-300 focus:outline-none ${isLoading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Subscribing...
                                        </span>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </div>

                            {subscriptionStatus !== 'idle' && (
                                <div className={`mt-4 p-3 rounded-lg ${subscriptionStatus === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {subscriptionMessage}
                                </div>
                            )}

                            <p className="mt-4 text-sm text-gray-500">
                                We respect your privacy. <button
                                    onClick={() => setIsUnsubscribeModalOpen(true)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition-colors duration-200 border-0 bg-transparent p-0"
                                >
                                    Unsubscribe
                                </button> at any time.
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
                                Empowering educational institutions with innovative solutions.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#our-story" onClick={(e) => {
                                    e.preventDefault(); ourStoryRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#student-management" onClick={(e) => {
                                    e.preventDefault(); studentManagementRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" onClick={(e) => {
                                    e.preventDefault(); pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsScrolling(true);
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><a href="#demo" onClick={(e) => {
                                    e.preventDefault();
                                    setIsScrolling(true);
                                    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
                                <li><a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setIsScrolling(true);
                                    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => setIsScrolling(false), 1000);
                                }} className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="mailto:info@telmeez.com" className="text-gray-400 hover:text-white transition-colors">info@telmeez.com</a>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">+1 (234) 567-890</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                            <div className="flex space-x-4">
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
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Telmeez. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Student Profiles Modal */}
            {isStudentProfilesModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Student Profiles</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsStudentProfilesModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Student Information</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our student profile system provides a centralized location for all student-related information, making it easy to access and manage student data efficiently.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Personal Information</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Basic details (name, DOB, gender)</li>
                                                <li>• Contact information</li>
                                                <li>• Emergency contacts</li>
                                                <li>• Medical information</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Academic Information</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Enrollment history</li>
                                                <li>• Course registrations</li>
                                                <li>• Academic performance</li>
                                                <li>• Attendance records</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Customizable Fields</h5>
                                            <p className="text-gray-600 text-sm">
                                                Add custom fields to capture institution-specific information
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-green-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Data Security</h5>
                                            <p className="text-gray-600 text-sm">
                                                Advanced encryption and access controls for sensitive information
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Document Management</h5>
                                            <p className="text-gray-600 text-sm">
                                                Upload and manage important student documents securely
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Streamlined student information management and retrieval</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Improved communication between staff and parents</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enhanced data accuracy and reduced administrative workload</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Comprehensive student history tracking and reporting</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsStudentProfilesModalOpen(false)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enrollment Management Modal */}
            {isEnrollmentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Enrollment Management</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsEnrollmentModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Streamlined Enrollment Process</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our enrollment management system simplifies the entire process from application to registration, making it efficient for both administrators and applicants.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Application Process</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Online application forms</li>
                                                <li>• Document upload system</li>
                                                <li>• Application status tracking</li>
                                                <li>• Automated notifications</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Registration Features</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Course selection</li>
                                                <li>• Schedule management</li>
                                                <li>• Fee payment integration</li>
                                                <li>• Student ID generation</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Automated Workflows</h5>
                                            <p className="text-gray-600 text-sm">
                                                Streamline enrollment with customizable approval processes
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Real-time Processing</h5>
                                            <p className="text-gray-600 text-sm">
                                                Instant updates and status changes for all stakeholders
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-green-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Document Management</h5>
                                            <p className="text-gray-600 text-sm">
                                                Secure storage and verification of enrollment documents
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Reduced administrative workload and processing time</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Improved applicant experience with self-service options</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enhanced data accuracy and compliance</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Comprehensive reporting and analytics</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEnrollmentModalOpen(false)}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Digital Attendance Modal */}
            {isAttendanceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Digital Attendance System</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsAttendanceModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Smart Attendance Tracking</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our digital attendance system revolutionizes how schools track and manage student attendance, making it more efficient and accurate than traditional methods.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Attendance Methods</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• QR code scanning</li>
                                                <li>• Biometric verification</li>
                                                <li>• Mobile app check-in</li>
                                                <li>• Web portal access</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Real-time Features</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Instant attendance updates</li>
                                                <li>• Automated notifications</li>
                                                <li>• Absence tracking</li>
                                                <li>• Late arrival monitoring</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Quick Check-in</h5>
                                            <p className="text-gray-600 text-sm">
                                                Fast and efficient attendance marking with multiple verification methods
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-green-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Automated Reports</h5>
                                            <p className="text-gray-600 text-sm">
                                                Generate comprehensive attendance reports and analytics
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Smart Alerts</h5>
                                            <p className="text-gray-600 text-sm">
                                                Instant notifications for absences and attendance patterns
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Eliminates manual attendance taking and reduces errors</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Saves time for teachers and administrators</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Provides real-time attendance data and insights</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enhances communication with parents and guardians</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsAttendanceModalOpen(false)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Automated Reports Modal */}
            {isReportsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Automated Reports & Analytics</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsReportsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Reporting System</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our automated reporting system provides detailed insights and analytics to help schools make data-driven decisions and track student progress effectively.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Report Types</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Academic performance reports</li>
                                                <li>• Attendance analytics</li>
                                                <li>• Financial statements</li>
                                                <li>• Custom report generation</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Analytics Features</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Trend analysis</li>
                                                <li>• Comparative studies</li>
                                                <li>• Predictive insights</li>
                                                <li>• Performance metrics</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-green-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Data Visualization</h5>
                                            <p className="text-gray-600 text-sm">
                                                Interactive charts and graphs for better data understanding
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Real-time Updates</h5>
                                            <p className="text-gray-600 text-sm">
                                                Instant report generation with live data integration
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Automated Scheduling</h5>
                                            <p className="text-gray-600 text-sm">
                                                Scheduled report generation and distribution
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Saves time with automated report generation</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Provides actionable insights for decision-making</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enhances transparency and accountability</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Supports data-driven educational strategies</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsReportsModalOpen(false)}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grade Entry Modal */}
            {isGradeEntryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Grade Entry & Management</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsGradeEntryModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Efficient Grade Management</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our grade entry system streamlines the process of recording, calculating, and managing student grades, making it easier for teachers to focus on teaching.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Grade Entry Features</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Bulk grade entry</li>
                                                <li>• Custom grading scales</li>
                                                <li>• Weighted assignments</li>
                                                <li>• Grade calculation tools</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Management Tools</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Grade history tracking</li>
                                                <li>• Grade modification logs</li>
                                                <li>• Parent portal access</li>
                                                <li>• Progress monitoring</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-indigo-50 p-4 rounded-lg">
                                            <div className="text-indigo-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Flexible Entry</h5>
                                            <p className="text-gray-600 text-sm">
                                                Multiple ways to enter and manage grades efficiently
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Auto Calculation</h5>
                                            <p className="text-gray-600 text-sm">
                                                Automatic grade calculations with customizable formulas
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Progress Tracking</h5>
                                            <p className="text-gray-600 text-sm">
                                                Monitor student progress and identify areas for improvement
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Reduces time spent on grade management</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Minimizes calculation errors</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Improves communication with parents</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Provides comprehensive grade history</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsGradeEntryModalOpen(false)}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Tracking Modal */}
            {isProgressTrackingModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Progress Tracking & Analytics</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsProgressTrackingModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Progress Monitoring</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our progress tracking system provides detailed insights into student performance, helping educators identify strengths, weaknesses, and areas for improvement.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Tracking Metrics</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Academic performance trends</li>
                                                <li>• Attendance patterns</li>
                                                <li>• Assignment completion rates</li>
                                                <li>• Skill development progress</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Analytics Tools</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Performance dashboards</li>
                                                <li>• Comparative analysis</li>
                                                <li>• Predictive insights</li>
                                                <li>• Custom reporting</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <div className="text-yellow-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Performance Analytics</h5>
                                            <p className="text-gray-600 text-sm">
                                                Detailed analysis of student performance across subjects
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Trend Analysis</h5>
                                            <p className="text-gray-600 text-sm">
                                                Track progress over time with visual trend indicators
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Early Warning System</h5>
                                            <p className="text-gray-600 text-sm">
                                                Identify at-risk students and intervene proactively
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enables data-driven teaching strategies</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Facilitates personalized learning plans</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Improves student engagement and outcomes</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enhances parent-teacher communication</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsProgressTrackingModalOpen(false)}
                                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Messaging System Modal */}
            {isMessagingSystemModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Messaging System</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsMessagingSystemModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Real-time Messaging</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our messaging system allows for real-time communication between teachers, students, and parents.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Features</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Real-time chat</li>
                                                <li>• File sharing</li>
                                                <li>• Group conversations</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Benefits</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Improved communication</li>
                                                <li>• Increased collaboration</li>
                                                <li>• Enhanced parent-teacher communication</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Real-time Chat</h5>
                                            <p className="text-gray-600 text-sm">
                                                Fast and efficient real-time messaging
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-green-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">File Sharing</h5>
                                            <p className="text-gray-600 text-sm">
                                                Secure and efficient file sharing
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Group Conversations</h5>
                                            <p className="text-gray-600 text-sm">
                                                Organize conversations with customizable group settings
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enhanced communication and collaboration</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Increased parent-teacher interaction</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Improved student engagement and outcomes</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Reduced administrative workload</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsMessagingSystemModalOpen(false)}
                                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Announcements Modal */}
            {isAnnouncementsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Announcements System</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsAnnouncementsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">School-wide Announcements</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our announcements system enables efficient communication of important updates and information to the entire school community.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Features</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Targeted broadcasts</li>
                                                <li>• Scheduled announcements</li>
                                                <li>• Priority notifications</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-900 mb-2">Benefits</h5>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>• Improved information flow</li>
                                                <li>• Better community engagement</li>
                                                <li>• Enhanced communication</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <div className="text-orange-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Targeted Broadcasts</h5>
                                            <p className="text-gray-600 text-sm">
                                                Send announcements to specific groups or the entire school
                                            </p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <div className="text-yellow-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Scheduled Announcements</h5>
                                            <p className="text-gray-600 text-sm">
                                                Plan and schedule announcements in advance
                                            </p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <div className="text-red-600 mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 mb-2">Priority Notifications</h5>
                                            <p className="text-gray-600 text-sm">
                                                Highlight urgent announcements with priority status
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h4>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Streamlined communication across the school community</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Improved information delivery and accessibility</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Enhanced parent and student engagement</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600">Reduced administrative workload for communication tasks</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsAnnouncementsModalOpen(false)}
                                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Unsubscribe Modal */}
            {isUnsubscribeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
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
                                    disabled={isLoading}
                                />
                            </div>

                            {unsubscribeStatus !== 'idle' && (
                                <div className={`mb-4 p-3 rounded-lg ${unsubscribeStatus === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {unsubscribeMessage}
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsUnsubscribeModalOpen(false)}
                                    className="px-4 py-2 focus:outline-none text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 focus:outline-none bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Unsubscribe'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                className={`fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showBackToTop
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
            `}</style>
        </div>
    );
};

export default Landing; 