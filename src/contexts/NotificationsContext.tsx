import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export interface Notification {
    id: number;
    type: 'info' | 'warning' | 'success';
    title: string;
    message: string;
    time: string; // Full date string
    read: boolean;
    icon: any;
}

interface NotificationsContextType {
    notifications: Notification[];
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: number) => void;
    clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};

interface NotificationsProviderProps {
    children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
    // Get current date and time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const [notifications, setNotifications] = useState<Notification[]>([
        // Today's notifications
        {
            id: 1,
            type: 'info',
            title: 'System Update',
            message: 'A new system update is available. Please review the changes.',
            time: today.toISOString(),
            read: false,
            icon: FaInfoCircle
        },
        {
            id: 2,
            type: 'warning',
            title: 'Storage Warning',
            message: 'Your storage is almost full. Consider upgrading your plan.',
            time: new Date(today.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            read: false,
            icon: FaExclamationTriangle
        },
        {
            id: 3,
            type: 'success',
            title: 'Payment Successful',
            message: 'Your subscription payment has been processed successfully.',
            time: new Date(today.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: true,
            icon: FaCheckCircle
        },

        // Yesterday's notifications
        {
            id: 4,
            type: 'info',
            title: 'New Feature Available',
            message: 'Check out our latest feature: Advanced Analytics Dashboard.',
            time: yesterday.toISOString(),
            read: false,
            icon: FaInfoCircle
        },
        {
            id: 5,
            type: 'warning',
            title: 'Security Alert',
            message: 'Multiple failed login attempts detected. Please check your account.',
            time: new Date(yesterday.getTime() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours before yesterday
            read: true,
            icon: FaExclamationTriangle
        },
        {
            id: 6,
            type: 'success',
            title: 'Backup Complete',
            message: 'Your system backup has been completed successfully.',
            time: new Date(yesterday.getTime() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours before yesterday
            read: false,
            icon: FaCheckCircle
        },

        // Last year's notifications
        {
            id: 7,
            type: 'info',
            title: 'System Migration',
            message: 'System migration completed. New features are now available.',
            time: lastYear.toISOString(),
            read: true,
            icon: FaInfoCircle
        },
        {
            id: 8,
            type: 'warning',
            title: 'License Expiring',
            message: 'Your license will expire in 30 days. Please renew to continue using all features.',
            time: new Date(lastYear.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days before last year
            read: true,
            icon: FaExclamationTriangle
        },
        {
            id: 9,
            type: 'success',
            title: 'Major Update',
            message: 'Version 2.0 has been released with significant improvements.',
            time: new Date(lastYear.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days before last year
            read: true,
            icon: FaCheckCircle
        }
    ]);

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev =>
            prev.filter(notification => notification.id !== id)
        );
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}; 