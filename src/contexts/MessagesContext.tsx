import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';

export interface Message {
    id: number;
    sender: 'user' | 'admin';
    content: string;
    timestamp: Date;
    read: boolean;
}

interface MessagesContextType {
    messages: Message[];
    addMessage: (content: string, sender: 'user' | 'admin') => void;
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
            content: 'Welcome to Telmeez! How can I help you today?',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            read: true
        },
        {
            id: 2,
            sender: 'user',
            content: 'I need help with my subscription plan.',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            read: true
        },
        {
            id: 3,
            sender: 'admin',
            content: 'I\'d be happy to help you with that. What specific questions do you have about your subscription?',
            timestamp: new Date(Date.now() - 900000), // 15 minutes ago
            read: false
        }
    ]);

    const addMessage = (content: string, sender: 'user' | 'admin') => {
        const newMessage: Message = {
            id: Date.now(),
            sender,
            content,
            timestamp: new Date(),
            read: sender === 'user' // Messages from user are automatically marked as read
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