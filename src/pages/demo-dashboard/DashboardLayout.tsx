import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaEnvelope, FaCog, FaUser, FaChevronDown, FaCreditCard, FaExclamationTriangle, FaInfoCircle, FaCog as FaSettings, FaCheckCircle } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import logoarb from '../../assets/images/logo_arb.png';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: string;
    roleColor: string;
    roleGradient: string;
    onBillingClick?: () => void;
    onGeneralClick?: () => void;
    onAccountClick?: () => void;
    onChatClick?: () => void;
    onNotificationsClick?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    role,
    onBillingClick,
    onGeneralClick,
    onAccountClick,
    onChatClick,
    onNotificationsClick
}) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const { currentLanguage } = useLanguage();

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
                setIsMessagesOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mock data - in a real app, this would come from your backend
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        avatar: null,
        role: role,
        subscriptionPlan: 'Standard',
        unreadNotifications: 3,
        unreadMessages: 2
    };

    // Mock notifications data
    const notifications = [
        {
            id: 1,
            type: 'success',
            title: 'New admin account created',
            message: 'A new admin account has been created successfully',
            time: '2 minutes ago',
            icon: FaCheckCircle,
            read: false
        },
        {
            id: 2,
            type: 'warning',
            title: 'System maintenance scheduled',
            message: 'System maintenance is scheduled for tomorrow at 2 AM',
            time: '1 hour ago',
            icon: FaExclamationTriangle,
            read: false
        },
        {
            id: 3,
            type: 'info',
            title: 'New feature update available',
            message: 'Check out our latest features and improvements',
            time: '3 hours ago',
            icon: FaInfoCircle,
            read: false
        }
    ];

    const handleBillingClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onBillingClick) {
            onBillingClick();
        }
        setIsProfileDropdownOpen(false);
    };

    const handleGeneralClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onGeneralClick) {
            onGeneralClick();
        }
        setIsProfileDropdownOpen(false);
    };

    const handleAccountClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onAccountClick) {
            onAccountClick();
        }
        setIsProfileDropdownOpen(false);
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        // In a real app, this would update the backend
        setIsNotificationsOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <img
                                src={currentLanguage === 'ar' ? logoarb : logo}
                                alt="Telmeez Logo"
                                className="h-16 w-auto transition-transform hover:scale-105"
                            />
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center space-x-6">
                            {/* Subscription Plan */}
                            <div className="hidden md:flex flex-col items-center">
                                <span className="text-sm font-semibold text-gray-700">{user.subscriptionPlan}</span>
                                <a
                                    href="/settings/billing"
                                    className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                >
                                    Upgrade Plan
                                </a>
                            </div>

                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={() => {
                                        setIsNotificationsOpen(!isNotificationsOpen);
                                        setIsMessagesOpen(false);
                                        setIsProfileDropdownOpen(false);
                                    }}
                                    className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none relative transition-colors duration-200"
                                >
                                    <FaBell className="h-5 w-5" />
                                    {user.unreadNotifications > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-pulse">
                                            {user.unreadNotifications}
                                        </span>
                                    )}
                                </button>
                                <div className={`absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 ease-in-out origin-top-right ${isNotificationsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer border-l-4 ${notification.type === 'success' ? 'border-green-500' :
                                                        notification.type === 'warning' ? 'border-yellow-500' :
                                                            'border-blue-500'
                                                    }`}
                                            >
                                                <div className="flex items-start">
                                                    <div className={`flex-shrink-0 p-1 rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        <notification.icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <span className="text-xs text-gray-400">{notification.time}</span>
                                                            {!notification.read && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                    New
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-100">
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (onNotificationsClick) onNotificationsClick();
                                                setIsNotificationsOpen(false);
                                            }}
                                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center"
                                        >
                                            View all notifications
                                            <FaChevronDown className="ml-1 h-3 w-3 transform rotate-90" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="relative" ref={messagesRef}>
                                <button
                                    onClick={() => {
                                        setIsMessagesOpen(!isMessagesOpen);
                                        setIsNotificationsOpen(false);
                                        setIsProfileDropdownOpen(false);
                                        if (onChatClick) onChatClick();
                                    }}
                                    className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none relative transition-colors duration-200"
                                    aria-label="Open chat"
                                >
                                    <FaEnvelope className="h-5 w-5" />
                                    {user.unreadMessages > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-pulse">
                                            {user.unreadMessages}
                                        </span>
                                    )}
                                </button>
                                <div className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 ease-in-out origin-top-right ${isMessagesOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
                                            <p className="text-sm font-medium text-gray-900">New message from Sarah</p>
                                            <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
                                            <p className="text-sm font-medium text-gray-900">Meeting reminder from Team Lead</p>
                                            <p className="text-xs text-gray-500 mt-1">30 minutes ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => {
                                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                                        setIsNotificationsOpen(false);
                                        setIsMessagesOpen(false);
                                    }}
                                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="h-8 w-8 rounded-full ring-2 ring-gray-100 transition-transform hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center ring-2 ring-gray-100 transition-transform hover:scale-105">
                                                <FaUser className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        <span className="ml-2 text-sm font-medium hidden md:block">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <FaChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                    </div>
                                </button>
                                <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 ease-in-out origin-top-right ${isProfileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <a href="#" onClick={handleGeneralClick} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="flex items-center">
                                            <FaCog className="mr-2 h-4 w-4 text-gray-500" />
                                            General Settings
                                        </div>
                                    </a>
                                    <a href="#" onClick={handleBillingClick} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="flex items-center">
                                            <FaCreditCard className="mr-2 h-4 w-4 text-gray-500" />
                                            Billing & Subscription
                                        </div>
                                    </a>
                                    <a href="#" onClick={handleAccountClick} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="flex items-center">
                                            <FaUser className="mr-2 h-4 w-4 text-gray-500" />
                                            Account Settings
                                        </div>
                                    </a>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <a href="#" className="block px-4 py-2.5 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-700 font-medium transition-all duration-200 ">
                                        Sign out
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout; 