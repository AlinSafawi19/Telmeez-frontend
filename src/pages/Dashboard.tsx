import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';
import { LANGUAGES, getLanguageDirection } from '../constants/languages';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/images/logo.png";
import {
    FaHome,
    FaBell,
    FaCog,
    FaSignOutAlt,
    FaUserCog,
    FaBars,
    FaTimes,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import '../Landing.css';
import LoadingOverlay from '../components/LoadingOverlay';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'superadmin' | 'admin' | 'teacher' | 'student' | 'parent';
    institutionName: string;
    phone: string;
    avatar?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
}

interface Subscription {
    _id: string;
    planId: string;
    planName: string;
    billingCycle: 'monthly' | 'annual';
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    startDate: Date;
    endDate: Date;
    nextBillingDate: Date;
    amount: number;
    currency: string;
}

/* Interfaces for backend data
interface BackendUser {
    id?: string;
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    institutionName?: string;
    role?: any;
    isActive?: boolean;
    createdAt?: string | Date;
    lastLogin?: string | Date;
}

interface BackendSubscription {
    id?: string;
    _id?: string;
    plan?: string;
    planId?: string;
    planName?: string;
    billingCycle?: 'monthly' | 'annual';
    status?: 'active' | 'cancelled' | 'expired' | 'trial';
    startDate?: string | Date;
    endDate?: string | Date;
    nextBillingDate?: string | Date;
    amount?: number;
    totalAmount?: number;
    currency?: string;
} */

const Dashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const t = translations[currentLanguage];
    const isRTL = currentLanguage === 'ar';

    // Get user and subscription data from navigation state
    const userData = location.state?.user as User;
    const subscriptionData = location.state?.subscription as Subscription;

    // Refs for language dropdown
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownContainerRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    // State management
    const [user, setUser] = useState<User | null>(userData || null);
    const [subscription, setSubscription] = useState<Subscription | null>(subscriptionData || null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLanguageChanging, setIsLanguageChanging] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showSidebar, setShowSidebar] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside language dropdown
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(target)) {
                if (activeDropdown === 'language') {
                    setActiveDropdown(null);
                }
            }

            // Check if click is outside profile dropdown
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
                if (activeDropdown === 'profile') {
                    setActiveDropdown(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    // Reset active dropdown when language changes
    useEffect(() => {
        setActiveDropdown(null);
    }, [currentLanguage]);

    // Mock data for demonstration
    useEffect(() => {
        // Debug: Log the received user and subscription data
        console.log('Dashboard: Received user data:', user);
        console.log('Dashboard: Received subscription data:', subscription);

        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);

            // Set mock user data if not provided
            if (!user) {
                // handle demo data
            } else {
                // Handle user data from backend (convert id to _id if needed)
                const processedUser = {
                    ...user,
                    _id: user._id,
                    role: user.role,
                    institutionName: user.institutionName,
                    phone: user.phone,
                    isActive: user.isActive !== undefined ? user.isActive : true,
                    lastLogin: user.lastLogin || undefined,
                    createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
                };
                console.log('Dashboard: Processed user data:', processedUser);
                setUser(processedUser);
            }

            // Set mock subscription data if not provided
            if (!subscription) {
                // handle demo data
            } else {
                // Handle subscription data from backend (convert id to _id if needed)
                const processedSubscription = {
                    ...subscription,
                    _id: subscription._id,
                    planId: subscription.planId,
                    planName: subscription.planName,
                    billingCycle: subscription.billingCycle,
                    status: subscription.status,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    nextBillingDate: subscription.nextBillingDate,
                    amount: subscription.amount,
                    currency: subscription.currency
                };
                setSubscription(processedSubscription);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []); // Remove dependencies to prevent infinite re-renders

    // Redirect if no user data
    useEffect(() => {
        if (!user && !isLoading) {
            navigate('/signin');
        }
    }, [user, isLoading, navigate]);

    const handleSignOut = () => {
        // Clear user data and redirect to sign in
        setUser(null);
        navigate('/signin');
    };

    const handleLanguageChange = (langCode: Language) => {
        setIsLanguageChanging(true);
        setActiveDropdown(null);

        // Simulate language change process with a small delay
        setTimeout(() => {
            setCurrentLanguage(langCode);
            const direction = getLanguageDirection(langCode);
            document.documentElement.dir = direction;
            setIsLanguageChanging(false);
        }, 500);
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    if (isLoading) {
        return (
            <LoadingOverlay isLoading={isLoading} />
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <motion.div
                className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 bg-white transform transition-all duration-300 ease-in-out h-screen lg:relative ${showSidebar ? 'translate-x-0' : `${isRTL ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`
                    }`}
                animate={{
                    width: isSidebarCollapsed && window.innerWidth >= 1024 ? 80 : 256
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                initial={false}
            >
                {/* Top sticky logo */}
                <div className="flex flex-col h-full">
                    <motion.div
                        className={`flex-shrink-0 px-4 py-4 border-b border-gray-200 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 relative`}
                        layout
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`flex items-center ${isRTL ? 'space-x-reverse-4' : 'space-x-4'}`}
                        >
                            <div className={`flex-shrink-0 relative group ${isRTL ? 'ml-6' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <img src={logo} alt="Telmeez" className="h-14 w-auto" />
                            </div>
                            <AnimatePresence>
                                {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                                    <motion.div
                                        className="flex flex-col"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.h1
                                            initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                            className={`text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}
                                        >
                                            {user.institutionName ? user.institutionName : 'Telmeez'}
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                                            className={`text-xs text-gray-600 font-medium flex items-center whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}
                                        >
                                            <span className={`w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full ${isRTL ? 'ml-2' : 'mr-2'} animate-pulse`}></span>
                                            {t.dashboard?.education}
                                        </motion.p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Mobile close button */}
                        <button
                            type='button'
                            onClick={() => setShowSidebar(false)}
                            className={`lg:hidden absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200`}
                            aria-label="Close sidebar"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>

                        {/* Collapse/Expand button */}
                        <motion.button
                            type='button'
                            onClick={toggleSidebar}
                            className={`absolute ${isRTL ? '-left-3' : '-right-3'} focus:outline-none top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-110 z-10 lg:flex hidden`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{
                                    rotate: isSidebarCollapsed
                                        ? (isRTL ? 0 : 180)
                                        : (isRTL ? 180 : 0)
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {isRTL ? (
                                    <FaChevronRight className="w-3 h-3 text-gray-600" />
                                ) : (
                                    <FaChevronLeft className="w-3 h-3 text-gray-600" />
                                )}
                            </motion.div>
                        </motion.button>
                    </motion.div>

                    {/* Navigation links */}
                    <div className={`flex-1 overflow-y-auto ${isRTL ? 'border-l' : 'border-r'} border-gray-200`}>
                        <nav className="px-3 space-y-1 py-6">
                            <motion.button
                                type='button'
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center ${isRTL ? 'space-x-reverse-3' : 'space-x-3'} focus:outline-none border-none px-4 py-3.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${activeTab === 'overview'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-700 hover:shadow-md'
                                    }`}
                                whileHover={{ x: isRTL ? -4 : 4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                layout
                            >
                                <div className={`relative z-20 ${activeTab === 'overview' ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors duration-300 ${isRTL ? 'ml-4' : ''}`}>
                                    <FaHome className="w-5 h-5" />
                                </div>
                                <AnimatePresence>
                                    {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                                        <motion.span
                                            className={`font-semibold text-sm relative z-20 ${activeTab === 'overview' ? 'text-white' : ''}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {t.dashboard?.overview || 'Overview'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {activeTab === 'overview' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        </nav>
                    </div>

                    {/* Bottom sticky sign out */}
                    <motion.div
                        className={`flex-shrink-0 p-4 border-t ${isRTL ? 'border-l' : 'border-r'} border-gray-200`}
                        layout
                    >
                        <motion.button
                            type='button'
                            onClick={() => setShowSignOutConfirmation(true)}
                            className={`w-full flex items-center ${isRTL ? 'space-x-reverse-3' : 'space-x-3'} border-none focus:outline-none px-4 py-3.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 hover:shadow-md`}
                            whileHover={{ x: isRTL ? -4 : 4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                        >
                            <div className={`relative z-10 text-gray-500 group-hover:text-red-600 transition-colors duration-300 ${isRTL ? 'ml-4' : ''}`}>
                                <FaSignOutAlt className="w-5 h-5" />
                            </div>
                            <AnimatePresence>
                                {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                                    <motion.span
                                        className="font-semibold text-sm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {t.dashboard?.signout}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Mobile overlay */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className={`flex flex-col flex-1 h-screen overflow-y-auto ${isRTL ? 'lg:mr-0' : 'lg:ml-0'}`}>
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
                    <div className={`flex items-center ${isRTL ? 'lg:flex-row-reverse' : ''} justify-between`}>
                        {/* Mobile menu button */}
                        <button
                            type='button'
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                            aria-label="Toggle mobile menu"
                        >
                            {showSidebar ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>

                        {/* Spacer for mobile - pushes right side actions to the right */}
                        <div className="lg:hidden flex-1"></div>

                        {/* Actions - positioned left in RTL, right in LTR on desktop */}
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse-4 lg:mr-auto' : 'space-x-2 sm:space-x-4 ml-auto'}`}>
                            {/* Language selector */}
                            <div className={`relative group ${isRTL ? 'ml-4' : ''}`} ref={languageDropdownRef}>
                                <button
                                    key={`language-button-${currentLanguage}`}
                                    type="button"
                                    className="flex items-center bg-white text-gray-600 hover:bg-gray-100 transition-colors duration-300 font-medium focus:outline-none px-3 py-2 rounded-lg border border-gray-300"
                                    onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                                    aria-haspopup="true"
                                    aria-label="Select language"
                                >
                                    <span className="font-medium">
                                        {LANGUAGES.find(lang => lang.code === currentLanguage)?.label}
                                    </span>
                                    <svg className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    {LANGUAGES.map((lang) => (
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
                                                <svg className={`w-4 h-4 ${isRTL ? 'mr-auto' : 'ml-auto'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notifications */}
                            <button
                                type='button'
                                className={`relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none border-none transition-colors duration-200 ${isRTL ? 'ml-4' : ''}`}
                                aria-label="Notifications"
                            >
                                <FaBell className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            {/* User menu */}
                            <div className="relative group" ref={profileDropdownRef}>
                                <button
                                    key={`profile-button-${user._id}`}
                                    type="button"
                                    className={`flex items-center ${isRTL ? 'space-x-reverse-4' : 'space-x-2 sm:space-x-3'} p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-all duration-300 font-medium`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdown(activeDropdown === 'profile' ? null : 'profile');
                                    }}
                                    aria-haspopup="true"
                                    aria-label="User menu"
                                >
                                    <div className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-4' : ''}`}>
                                        <span className="text-white font-medium text-sm">
                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                        </span>
                                    </div>
                                    <div className={`hidden md:block text-left ${isRTL ? 'ml-4' : ''}`}>
                                        <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div
                                    key={`profile-dropdown-${user._id}`}
                                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${activeDropdown === 'profile' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'} force-white-bg z-50`}
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="profile-menu"
                                >
                                    {/* Menu items */}
                                    <button
                                        type="button"
                                        className={`flex items-center w-full text-left px-4 py-3 border-none text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none cursor-pointer rounded-none`}
                                        role="menuitem"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#eff6ff';
                                            e.currentTarget.style.color = '#2563eb';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.color = '';
                                        }}
                                        onClick={() => {
                                            console.log('Profile Settings clicked');
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        <FaUserCog className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'} text-gray-400`} />
                                        <span>{t.dashboard?.profileSettings}</span>
                                    </button>

                                    <button
                                        type="button"
                                        className={`flex items-center w-full text-left px-4 py-3 border-none text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none cursor-pointer rounded-none`}
                                        role="menuitem"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#eff6ff';
                                            e.currentTarget.style.color = '#2563eb';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.color = '';
                                        }}
                                        onClick={() => {
                                            console.log('Account Settings clicked');
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        <FaCog className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'} text-gray-400`} />
                                        <span>{t.dashboard?.accountSettings}</span>
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        type="button"
                                        className={`flex items-center w-full text-left px-4 py-3 border-none text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 focus:outline-none cursor-pointer rounded-none`}
                                        role="menuitem"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fef2f2';
                                            e.currentTarget.style.color = '#dc2626';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.color = '';
                                        }}
                                        onClick={() => {
                                            setShowSignOutConfirmation(true);
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        <FaSignOutAlt className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'} text-red-400`} />
                                        <span>{t.dashboard?.signout}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Section */}
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                {user.lastLogin ? (
                                    <>{t.dashboard?.welcome_back}</>
                                ) : (
                                    <>{t.dashboard?.welcome?.replace('{institutionName}', user.institutionName || 'Telmeez').replace('{firstName}', user.firstName || 'User') || 'Welcome!'}</>
                                )}
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                {user.lastLogin ? (
                                    <>{t.dashboard?.here_whats_happening?.replace('{institutionName}', user.institutionName || 'Telmeez') || 'Here\'s what\'s happening today.'}</>
                                ) : (
                                    <>{t.dashboard?.we_excited_to_have_you?.replace('{institutionName}', user.institutionName || 'Telmeez') || 'We\'re excited to have you!'}</>
                                )}
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {isLanguageChanging && (
                <LoadingOverlay isLoading={isLanguageChanging} />
            )}

            {/* Sign Out Confirmation Modal */}
            <AnimatePresence>
                {showSignOutConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSignOutConfirmation(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`flex items-center mb-4 ${isRTL ? 'space-x-reverse-4' : 'space-x-4'}`}>
                                <div className={`w-12 h-12 bg-red-100 rounded-full flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
                                    <FaSignOutAlt className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
                                    <p className="text-sm text-gray-500">Are you sure you want to sign out?</p>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6">
                                You will be logged out of your account and redirected to the sign-in page. Any unsaved changes will be lost.
                            </p>

                            <div className={`flex ${isRTL ? 'space-x-reverse-3' : 'space-x-3'}`}>
                                <button
                                    type="button"
                                    onClick={() => setShowSignOutConfirmation(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border-none hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSignOutConfirmation(false);
                                        handleSignOut();
                                    }}
                                    className="flex-1 px-4 py-2 text-white bg-red-600 border-none hover:bg-red-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard; 