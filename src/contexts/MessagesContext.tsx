import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';

export interface Message {
    id: number;
    sender: 'superadmin' | 'admin';
    content: string;
    timestamp: Date;
    read: boolean;
    adminName?: string; // Name of the admin if sender is admin
    conversationId?: string; // ID to group messages by conversation
}

interface MessagesContextType {
    messages: Message[];
    addMessage: (content: string, sender: 'superadmin' | 'admin', adminName?: string, conversationId?: string) => void;
    markAsRead: (id: number) => void;
    deleteMessage: (id: number) => void;
    unreadCount: number;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
    const context = useContext(MessagesContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessagesProvider');
    }
    return context;
};

interface MessagesProviderProps {
    children: ReactNode;
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'admin',
            adminName: 'Sarah Wilson',
            content: 'Good morning! I have a question about the new admin onboarding process.',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            read: true,
            conversationId: 'sarah-wilson'
        },
        {
            id: 2,
            sender: 'superadmin',
            content: 'Hello Sarah! I\'d be happy to help you with that. What specific questions do you have?',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            read: true,
            conversationId: 'sarah-wilson'
        },
        {
            id: 3,
            sender: 'admin',
            adminName: 'Sarah Wilson',
            content: 'I\'m not sure about the new permission settings for user management.',
            timestamp: new Date(Date.now() - 900000), // 15 minutes ago
            read: false,
            conversationId: 'sarah-wilson'
        },
        {
            id: 4,
            sender: 'admin',
            adminName: 'Michael Brown',
            content: 'Hi, I need help with setting up new teacher accounts.',
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            read: false,
            conversationId: 'michael-brown'
        },
        {
            id: 5,
            sender: 'superadmin',
            content: 'Sure, I can help you with that. What specific issues are you facing?',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            read: true,
            conversationId: 'michael-brown'
        }
    ]);

    const addMessage = (content: string, sender: 'superadmin' | 'admin', adminName?: string, conversationId?: string) => {
        const newMessage: Message = {
            id: Date.now(),
            sender,
            content,
            timestamp: new Date(),
            read: sender === 'superadmin', // Messages from superadmin are automatically marked as read
            adminName,
            conversationId
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const markAsRead = (id: number) => {
        setMessages(prev =>
            prev.map(message =>
                message.id === id ? { ...message, read: true } : message
            )
        );
    };

    const deleteMessage = (id: number) => {
        setMessages(prev => prev.filter(message => message.id !== id));
    };

    const unreadCount = messages.filter(message => !message.read).length;

    return (
        <MessagesContext.Provider
            value={{
                messages,
                addMessage,
                markAsRead,
                deleteMessage,
                unreadCount
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
}; 