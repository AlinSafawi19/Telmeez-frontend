import React from 'react';
import type { JSX } from 'react';
import {
    FaHome,
    FaUsers,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaCalendarAlt,
    FaBook,
    FaFileAlt,
    FaBell,
    FaUserShield
} from 'react-icons/fa';

export interface SidebarLink {
    id: string;
    title: string;
    icon: () => JSX.Element;
    path?: string;
    action?: () => void;
    color: string;
    bgColor: string;
    roles?: string[];
    isActive?: boolean;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
    {
        id: 'overview',
        title: 'Overview',
        icon: () => <FaHome className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        roles: ['superadmin', 'admin', 'teacher', 'student', 'parent']
    },
    {
        id: 'users',
        title: 'Users',
        icon: () => <FaUsers className="w-5 h-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
        roles: ['superadmin', 'admin']
    },
    {
        id: 'teachers',
        title: 'Teachers',
        icon: () => <FaChalkboardTeacher className="w-5 h-5" />,
        color: 'text-green-600',
        bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
        roles: ['superadmin', 'admin']
    },
    {
        id: 'students',
        title: 'Students',
        icon: () => <FaUserGraduate className="w-5 h-5" />,
        color: 'text-orange-600',
        bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100',
        roles: ['superadmin', 'admin', 'teacher']
    },
    {
        id: 'analytics',
        title: 'Analytics',
        icon: () => <FaChartBar className="w-5 h-5" />,
        color: 'text-indigo-600',
        bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
        roles: ['superadmin', 'admin', 'teacher']
    },
    {
        id: 'calendar',
        title: 'Calendar',
        icon: () => <FaCalendarAlt className="w-5 h-5" />,
        color: 'text-pink-600',
        bgColor: 'bg-gradient-to-r from-pink-50 to-pink-100',
        roles: ['superadmin', 'admin', 'teacher', 'student']
    },
    {
        id: 'courses',
        title: 'Courses',
        icon: () => <FaBook className="w-5 h-5" />,
        color: 'text-teal-600',
        bgColor: 'bg-gradient-to-r from-teal-50 to-teal-100',
        roles: ['superadmin', 'admin', 'teacher', 'student']
    },
    {
        id: 'assignments',
        title: 'Assignments',
        icon: () => <FaFileAlt className="w-5 h-5" />,
        color: 'text-cyan-600',
        bgColor: 'bg-gradient-to-r from-cyan-50 to-cyan-100',
        roles: ['superadmin', 'admin', 'teacher', 'student']
    },
    {
        id: 'notifications',
        title: 'Notifications',
        icon: () => <FaBell className="w-5 h-5" />,
        color: 'text-yellow-600',
        bgColor: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
        roles: ['superadmin', 'admin', 'teacher', 'student', 'parent']
    },
    {
        id: 'settings',
        title: 'Settings',
        icon: () => <FaCog className="w-5 h-5" />,
        color: 'text-gray-600',
        bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100',
        roles: ['superadmin', 'admin', 'teacher', 'student', 'parent']
    }
];

export const SIGN_OUT_LINK: SidebarLink = {
    id: 'signout',
    title: 'Sign Out',
    icon: () => <FaSignOutAlt className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-gradient-to-r from-red-50 to-red-100',
    roles: ['superadmin', 'admin', 'teacher', 'student', 'parent']
};

export const getSidebarLinksForRole = (role: string): SidebarLink[] => {
    return SIDEBAR_LINKS.filter(link => 
        !link.roles || link.roles.includes(role)
    );
};

export const getLinkHoverStyles = (link: SidebarLink, isActive: boolean = false) => {
    if (isActive) {
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25';
    }
    
    const colorMap: { [key: string]: string } = {
        'text-blue-600': 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700',
        'text-purple-600': 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700',
        'text-green-600': 'hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700',
        'text-orange-600': 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700',
        'text-indigo-600': 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700',
        'text-pink-600': 'hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 hover:text-pink-700',
        'text-teal-600': 'hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:text-teal-700',
        'text-cyan-600': 'hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-100 hover:text-cyan-700',
        'text-yellow-600': 'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 hover:text-yellow-700',
        'text-gray-600': 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-700',
        'text-red-600': 'hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700'
    };
    
    return colorMap[link.color] || 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-700';
};

export const getIconColor = (link: SidebarLink, isActive: boolean = false) => {
    if (isActive) {
        return 'text-white';
    }
    
    const colorMap: { [key: string]: string } = {
        'text-blue-600': 'text-gray-500 group-hover:text-blue-600',
        'text-purple-600': 'text-gray-500 group-hover:text-purple-600',
        'text-green-600': 'text-gray-500 group-hover:text-green-600',
        'text-orange-600': 'text-gray-500 group-hover:text-orange-600',
        'text-indigo-600': 'text-gray-500 group-hover:text-indigo-600',
        'text-pink-600': 'text-gray-500 group-hover:text-pink-600',
        'text-teal-600': 'text-gray-500 group-hover:text-teal-600',
        'text-cyan-600': 'text-gray-500 group-hover:text-cyan-600',
        'text-yellow-600': 'text-gray-500 group-hover:text-yellow-600',
        'text-gray-600': 'text-gray-500 group-hover:text-gray-600',
        'text-red-600': 'text-gray-500 group-hover:text-red-600'
    };
    
    return colorMap[link.color] || 'text-gray-500 group-hover:text-gray-600';
}; 