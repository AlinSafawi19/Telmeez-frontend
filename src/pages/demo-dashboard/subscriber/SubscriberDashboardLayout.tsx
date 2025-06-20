import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo2 from '../../../assets/images/logo2.png';
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
    BuildingLibraryIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    BuildingOfficeIcon,
    ExclamationTriangleIcon,
    ArrowRightOnRectangleIcon,
    QuestionMarkCircleIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import { FaUser } from 'react-icons/fa';

interface SubscriberDashboardLayoutProps {
    children: React.ReactNode;
}

const SubscriberDashboardLayout: React.FC<SubscriberDashboardLayoutProps> = ({
    children
}): React.ReactElement => {
    const { subscriber, logout, isDemoMode, setDemoMode } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'administration': false,
        'communication': false,
        'system': false
    });
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const location = useLocation();

    // Function to check if a navigation item is active
    const isActiveLink = (href: string) => {
        if (href.startsWith('#')) {
            // For hash links, check if the current pathname matches
            return location.pathname === href.substring(1) ||
                (href === '#overview' && location.pathname.includes('dashboard'));
        }
        return location.pathname === href;
    };

    // Function to check if a parent section should be expanded based on active children
    const shouldExpandSection = (children: any[]) => {
        return children.some(child => isActiveLink(child.href));
    };

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

    const navigationItems = [
        {
            id: 'overview',
            name: 'Overview',
            icon: HomeIcon,
            href: '/demo-dashboard/subscriber/overview',
            color: 'text-blue-500'
        },
        {
            id: 'administration',
            name: 'Administration',
            icon: ShieldCheckIcon,
            color: 'text-purple-500',
            children: [
                { name: 'Admins', icon: UsersIcon, href: '/demo-dashboard/subscriber/admins', color: 'text-purple-400' },
                { name: 'Incident Reports', icon: ExclamationTriangleIcon, href: '/demo-dashboard/subscriber/incident-reports', color: 'text-purple-400' },
            ]
        },
        {
            id: 'departments',
            name: 'Departments',
            icon: BuildingOfficeIcon,
            href: '/demo-dashboard/subscriber/departments',
            color: 'text-teal-500'
        },
        {
            id: 'communication',
            name: 'Communication',
            icon: ChatBubbleLeftRightIcon,
            color: 'text-green-500',
            children: [
                { name: 'Messages', icon: ChatBubbleLeftRightIcon, href: '/demo-dashboard/subscriber/messages', color: 'text-green-400' },
                { name: 'Announcements', icon: MegaphoneIcon, href: '/demo-dashboard/subscriber/announcements', color: 'text-green-400' },
                { name: 'Notifications', icon: BellIcon, href: '/demo-dashboard/subscriber/notifications', color: 'text-green-400' }
            ]
        },
        {
            id: 'events',
            name: 'Events & Calendar',
            icon: CalendarDaysIcon,
            href: '/demo-dashboard/subscriber/events',
            color: 'text-orange-500'
        },
        {
            id: 'analytics',
            name: 'Analytics & Reports',
            icon: ChartBarIcon,
            href: '/demo-dashboard/subscriber/analytics',
            color: 'text-indigo-500'
        },
        {
            id: 'system',
            name: 'System',
            icon: Cog6ToothIcon,
            color: 'text-gray-500',
            children: [
                { name: 'General Settings', icon: Cog6ToothIcon, href: '/demo-dashboard/subscriber/settings', color: 'text-gray-400' },
                { name: 'Billing', icon: CreditCardIcon, href: '/demo-dashboard/subscriber/billing', color: 'text-gray-400' },
                { name: 'Account', icon: UserCircleIcon, href: '/demo-dashboard/subscriber/account', color: 'text-gray-400' },
                { name: 'Documents', icon: DocumentTextIcon, href: '/demo-dashboard/subscriber/documents', color: 'text-gray-400' }
            ]
        },
        {
            id: 'audit-logs',
            name: 'Audit Logs',
            icon: DocumentTextIcon,
            href: '/demo-dashboard/subscriber/audit-logs',
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
                                    <h1 className="text-lg font-bold text-white">{subscriber?.user?.first_name} {subscriber?.user?.last_name}</h1>
                                    {subscriber?.institution_name && (
                                        <span className="text-blue-200 font-medium text-sm">
                                            {subscriber.institution_name}
                                        </span>
                                    )}
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
                        <nav className="flex-1 overflow-y-auto mt-6 px-4 space-y-2 pb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
                            {navigationItems.map((item) => {
                                const isActive = item.href ? isActiveLink(item.href) : false;
                                const hasActiveChild = item.children ? shouldExpandSection(item.children) : false;
                                const isExpanded = expandedSections[item.id] || hasActiveChild;

                                return (
                                    <div key={item.id}>
                                        {item.children ? (
                                            <div>
                                                <button
                                                    onClick={() => toggleSection(item.id)}
                                                    className={`w-full flex items-center justify-between px-3 bg-transparent text-gray-300 py-2 text-sm font-medium rounded-md transition-colors border-none focus:outline-none ${hasActiveChild
                                                        ? ''
                                                        : 'hover:bg-gray-700 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronDownIcon className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRightIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="ml-8 mt-2 space-y-1"
                                                        >
                                                            {item.children.map((child, index) => {
                                                                const isChildActive = isActiveLink(child.href);
                                                                return (
                                                                    <Link
                                                                        key={index}
                                                                        to={child.href}
                                                                        className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${isChildActive
                                                                            ? 'bg-gray-700 text-white'
                                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        <child.icon className={`w-4 h-4 ${child.color}`} />
                                                                        <span>{child.name}</span>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.href}
                                                className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                    ? 'bg-gray-700 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                    }`}
                                            >
                                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                                <span>{item.name}</span>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Footer Section */}
                        <div className="border-t border-gray-700 p-4 mt-auto">
                            <div className="space-y-3">
                                {/* Enhanced Support Section */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-3 text-white">
                                    <div className="flex items-center space-x-2">
                                        <QuestionMarkCircleIcon className="w-4 h-4 text-blue-200" />
                                        <span className="text-sm font-medium">Need Help?</span>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <a
                                            href="mailto:support@telmeez.com"
                                            className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <EnvelopeIcon className="w-3 h-3" />
                                            <span>support@telmeez.com</span>
                                        </a>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors w-full text-left border-none bg-transparent focus:outline-none"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-400" />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        </div>
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
                                                alt={`${subscriber.user?.first_name} ${subscriber.user?.last_name}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${subscriber?.profileImage?.file_url ? 'hidden' : ''}`}>
                                            <span className="text-white font-semibold text-sm">
                                                {subscriber?.user?.first_name?.[0]}{subscriber?.user?.last_name?.[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {subscriber?.user?.first_name} {subscriber?.user?.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {subscriber?.roles?.find(role => role.id === subscriber?.user?.role_id)?.name}
                                        </p>
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
                                        > <Link
                                            to="/demo-dashboard/subscriber/account"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                                <FaUser className="w-4 h-4 mr-3 text-green-500" />
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/demo-dashboard/subscriber/billing"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <BuildingLibraryIcon className="w-4 h-4 mr-3 text-purple-500" />
                                                Billing
                                            </Link>
                                            <div className="border-t border-gray-100"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none border-none"
                                            >
                                                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-red-500" />
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