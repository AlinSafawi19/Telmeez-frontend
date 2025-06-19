import React, { useState, useEffect } from 'react';
import { useSubscriber } from '../../contexts/SubscriberContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo2 from '../../assets/images/logo2.png';
import {
    HomeIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    BellIcon,
    Cog6ToothIcon,
    CreditCardIcon,
    UserCircleIcon,
    CalendarDaysIcon,
    MegaphoneIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon,
    AcademicCapIcon,
    BuildingLibraryIcon,
    DocumentTextIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface SubscriberDashboardLayoutProps {
    children: React.ReactNode;
}

const SubscriberDashboardLayout: React.FC<SubscriberDashboardLayoutProps> = ({
    children
}): React.ReactElement => {
    const { subscriber, logout, isDemoMode, setDemoMode, isLoading } = useSubscriber();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'administration': false,
        'communication': false,
        'system': false
    });
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log('SubscriberDashboardLayout - subscriber:', subscriber);
        console.log('SubscriberDashboardLayout - profileImage:', subscriber?.profileImage);
        console.log('SubscriberDashboardLayout - isDemoMode:', isDemoMode);
    }, [subscriber, isDemoMode]);

    // Auto-enable demo mode for dashboard routes if no subscriber is logged in
    useEffect(() => {
        if (!subscriber && !isDemoMode) {
            setDemoMode(true);
        }
    }, [subscriber, isDemoMode, setDemoMode]);

    // Show loading state while initializing
    if (isLoading || (!subscriber && !isDemoMode)) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Show error state if no subscriber data is available
    if (!subscriber) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No User Data</h2>
                    <p className="text-gray-600 mb-4">Unable to load subscriber information.</p>
                    <button
                        onClick={() => setDemoMode(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Enable Demo Mode
                    </button>
                </div>
            </div>
        );
    }

    const navigationItems = [
        {
            id: 'overview',
            name: 'Overview',
            icon: HomeIcon,
            href: '#overview',
            color: 'text-blue-500'
        },
        {
            id: 'administration',
            name: 'Administration',
            icon: ShieldCheckIcon,
            color: 'text-purple-500',
            children: [
                { name: 'Admins', icon: UsersIcon, href: '#admins', color: 'text-purple-400' },
                { name: 'Institutions', icon: BuildingLibraryIcon, href: '#institutions', color: 'text-purple-400' },
                { name: 'Roles & Permissions', icon: AcademicCapIcon, href: '#roles', color: 'text-purple-400' }
            ]
        },
        {
            id: 'communication',
            name: 'Communication',
            icon: ChatBubbleLeftRightIcon,
            color: 'text-green-500',
            children: [
                { name: 'Messages', icon: ChatBubbleLeftRightIcon, href: '#messages', color: 'text-green-400' },
                { name: 'Announcements', icon: MegaphoneIcon, href: '#announcements', color: 'text-green-400' },
                { name: 'Notifications', icon: BellIcon, href: '#notifications', color: 'text-green-400' }
            ]
        },
        {
            id: 'events',
            name: 'Events & Calendar',
            icon: CalendarDaysIcon,
            href: '#events',
            color: 'text-orange-500'
        },
        {
            id: 'analytics',
            name: 'Analytics & Reports',
            icon: ChartBarIcon,
            href: '#analytics',
            color: 'text-indigo-500'
        },
        {
            id: 'system',
            name: 'System',
            icon: Cog6ToothIcon,
            color: 'text-gray-500',
            children: [
                { name: 'General Settings', icon: Cog6ToothIcon, href: '#settings', color: 'text-gray-400' },
                { name: 'Billing', icon: CreditCardIcon, href: '#billing', color: 'text-gray-400' },
                { name: 'Account', icon: UserCircleIcon, href: '#account', color: 'text-gray-400' },
                { name: 'Documents', icon: DocumentTextIcon, href: '#documents', color: 'text-gray-400' }
            ]
        },
        {
            id: 'audit-logs',
            name: 'Audit Logs',
            icon: DocumentTextIcon,
            href: '#audit-log',
            color: 'text-yellow-500'
        },
    ];

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleLogout = () => {
        logout();
        setUserDropdownOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col h-full"
                    >
                        {/* Logo Section */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={logo2}
                                    alt="Telmeez Logo"
                                    className="w-16 h-16 object-contain"
                                />
                                <div>
                                    <h1 className="text-lg font-bold text-white">{subscriber?.first_name} {subscriber?.last_name}</h1>
                                    <p className="text-xs text-gray-400">Dashboard</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                                aria-label="Close sidebar"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto mt-6 px-4 space-y-2 pb-6">
                            {navigationItems.map((item) => (
                                <div key={item.id}>
                                    {item.children ? (
                                        <div>
                                            <button
                                                onClick={() => toggleSection(item.id)}
                                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 rounded-md bg-transparent hover:bg-gray-700 hover:text-white transition-colors border-none focus:outline-none"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                                    <span>{item.name}</span>
                                                </div>
                                                {expandedSections[item.id] ? (
                                                    <ChevronDownIcon className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {expandedSections[item.id] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="ml-8 mt-2 space-y-1"
                                                    >
                                                        {item.children.map((child, index) => (
                                                            <a
                                                                key={index}
                                                                href={child.href}
                                                                className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                                                            >
                                                                <child.icon className={`w-4 h-4 ${child.color}`} />
                                                                <span>{child.name}</span>
                                                            </a>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <a
                                            href={item.href}
                                            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                            <span>{item.name}</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Left side - Menu button and breadcrumbs */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                aria-label="Open sidebar"
                            >
                                <Bars3Icon className="w-5 h-5" />
                            </button>

                            {/* Breadcrumbs */}
                            <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                                <span className="text-gray-400">Dashboard</span>
                                {subscriber?.institution_name && (
                                    <>
                                        <span>/</span>
                                        <span className="text-blue-600 font-medium">
                                            {subscriber.institution_name}
                                        </span>
                                    </>
                                )}
                            </nav>
                        </div>

                        {/* Right side - Search and user menu */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Notifications */}
                            <button
                                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none border-none"
                                aria-label="Notifications"
                            >
                                <BellIcon className="w-5 h-5" />
                                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none border-none"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-200">
                                        {subscriber?.profileImage?.file_url ? (
                                            <img
                                                src={subscriber.profileImage.file_url}
                                                alt={`${subscriber.first_name} ${subscriber.last_name}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.log('Profile image failed to load:', subscriber.profileImage?.file_url);
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${subscriber?.profileImage?.file_url ? 'hidden' : ''}`}>
                                            <span className="text-white font-semibold text-sm">
                                                {subscriber?.first_name?.[0]}{subscriber?.last_name?.[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {subscriber?.first_name} {subscriber?.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">Super Administrator</p>
                                    </div>
                                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {userDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                                        >
                                            <a
                                                href="#command-center"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <AcademicCapIcon className="w-4 h-4 mr-3 text-indigo-500" />
                                                Command Center
                                            </a>
                                            <a
                                                href="#power-tools"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <BuildingLibraryIcon className="w-4 h-4 mr-3 text-orange-500" />
                                                Power Tools
                                            </a>
                                            <a
                                                href="#mission-control"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <MegaphoneIcon className="w-4 h-4 mr-3 text-red-500" />
                                                Mission Control
                                            </a>
                                            <div className="border-t border-gray-100"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none border-none"
                                            >
                                                Sign out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-6 min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SubscriberDashboardLayout; 