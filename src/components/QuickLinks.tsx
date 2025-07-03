import React from 'react';
import { motion } from 'framer-motion';
import {
    FaCog,
    FaCreditCard,
    FaArrowRight,
    FaUserPlus,
    FaCalendarCheck
} from 'react-icons/fa';
import { translations } from '../translations';
import type { Language } from '../translations';

interface QuickLink {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    roles?: string[];
}

interface QuickLinksProps {
    currentLanguage: Language;
    userRole?: string;
    onLinkClick?: (linkId: string) => void;
    onViewAllActivities?: () => void;
}

const QuickLinks: React.FC<QuickLinksProps> = ({
    currentLanguage,
    userRole = 'admin',
    onLinkClick
}) => {
    const t = translations[currentLanguage];

    const quickLinks: QuickLink[] = [
        {
            id: 'users',
            title: t.dashboard?.quickLinks?.users || 'Invite Admins',
            description: 'Manage admin accounts and permissions for your institution',
            icon: <FaUserPlus className="w-4 h-4" />
        },
        {
            id: 'calendar',
            title: t.dashboard?.quickLinks?.calendar || 'Calendar',
            description: 'View and manage schedules, events, and academic calendar',
            icon: <FaCalendarCheck className="w-4 h-4" />
        },
        {
            id: 'billing',
            title: t.dashboard?.quickLinks?.billing || 'Billing & Subscription',
            description: 'Manage your subscription, billing, and payment methods',
            icon: <FaCreditCard className="w-4 h-4" />
        }
    ];

    // Normalize user role to handle different formats
    const normalizedUserRole = userRole?.toLowerCase?.() || userRole || '';

    // TEMPORARY: Show all links for testing - remove this in production
    const showAllLinks = true;

    // Filter links based on user role
    const filteredLinks = showAllLinks ? quickLinks : quickLinks.filter(link => {
        // If no roles specified, show the link
        if (!link.roles) return true;

        // If userRole is undefined or empty, show all links for testing
        if (!normalizedUserRole || normalizedUserRole === '') return true;

        // Check if user role is in the allowed roles (case insensitive)
        return link.roles.some(role => role.toLowerCase() === normalizedUserRole);
    });

    // Debug logging
    console.log('QuickLinks Debug:', {
        userRole,
        normalizedUserRole,
        totalLinks: quickLinks.length,
        filteredLinks: filteredLinks.length,
        availableRoles: quickLinks.map(link => ({ id: link.id, roles: link.roles }))
    });

    const handleLinkClick = (link: QuickLink) => {
        if (onLinkClick) {
            onLinkClick(link.id);
        }
        // You can add navigation logic here
        console.log(`Quick link clicked: ${link.id}`);
    };

    return (
        <div className="space-y-6">
            {/* Quick Links Section */}
            <div>
                <div className="space-y-3">
                    {filteredLinks.map((link, index) => (
                        <motion.button
                            key={link.id}
                            onClick={() => handleLinkClick(link)}
                            className="
                            group relative w-full p-5 rounded-xl border border-gray-200 bg-white 
                            hover:ring hover:ring-blue-200 
                            hover:shadow 
                            transition-all duration-300 
                            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                            text-left
                        "
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.2,
                                delay: index * 0.05
                            }}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        {link.icon}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                                        {link.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-normal">
                                        {link.description}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <FaArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {filteredLinks.length === 0 && (
                    <motion.div
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-gray-400 mb-3">
                            <FaCog className="w-8 h-8 mx-auto" />
                        </div>
                        <p className="text-gray-600 text-sm mb-1 font-medium">
                            {t.dashboard?.quickLinks?.noLinks || 'No quick links available for your role'}
                        </p>
                        <p className="text-gray-500 text-xs">
                            {t.dashboard?.quickLinks?.noLinksDesc || 'Contact your administrator to get access to more features'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default QuickLinks; 