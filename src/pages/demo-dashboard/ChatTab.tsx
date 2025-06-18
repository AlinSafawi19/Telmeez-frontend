import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '../../contexts/MessagesContext';
import { useAdmin } from '../../contexts/AdminContext';
import { FaUser, FaPaperPlane, FaSearch, FaCheck, FaCheckDouble } from 'react-icons/fa';

const ChatTab: React.FC = () => {
    const { messages, addMessage, markAsRead } = useMessages();
    const { admins } = useAdmin();
    const [newMessage, setNewMessage] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
    const [adminSearchQuery, setAdminSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const readTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedAdmin) {
            // Clear any existing timeout
            if (readTimeoutRef.current) {
                clearTimeout(readTimeoutRef.current);
            }

            // Set new timeout to mark messages as read
            readTimeoutRef.current = setTimeout(() => {
                const adminInfo = admins.find(a => a.id === selectedAdmin);
                if (adminInfo) {
                    const adminFullName = `${adminInfo.firstName} ${adminInfo.lastName}`;
                    messages.forEach(message => {
                        if (message.sender === 'admin' && 
                            message.adminName === adminFullName && 
                            !message.read) {
                            markAsRead(message.id);
                        }
                    });
                }
            }, 1000);
        }

        // Cleanup timeout on unmount or when selectedAdmin changes
        return () => {
            if (readTimeoutRef.current) {
                clearTimeout(readTimeoutRef.current);
            }
        };
    }, [selectedAdmin, admins, messages, markAsRead]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedAdmin) {
            const admin = admins.find(a => a.id === selectedAdmin);
            if (admin) {
                addMessage(newMessage.trim(), 'superadmin');
                // Simulate admin response (in a real app, this would come from the backend)
                setTimeout(() => {
                    addMessage(
                        `Thank you for your message. I will get back to you shortly.`,
                        'admin',
                        `${admin.firstName} ${admin.lastName}`
                    );
                }, 1000);
                setNewMessage('');
            }
        }
    };

    const filteredAdmins = admins.filter(admin => 
        `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase())
    );

    const selectedAdminMessages = messages.filter(message => {
        const selectedAdminInfo = admins.find(a => a.id === selectedAdmin);
        const adminFullName = selectedAdminInfo ? `${selectedAdminInfo.firstName} ${selectedAdminInfo.lastName}` : '';
        
        // For admin messages, check if it's from the selected admin
        if (message.sender === 'admin') {
            return message.adminName === adminFullName;
        }
        
        // For superadmin messages, check if the next message is from the selected admin
        if (message.sender === 'superadmin') {
            const messageIndex = messages.indexOf(message);
            const nextMessage = messages[messageIndex + 1];
            return nextMessage && nextMessage.sender === 'admin' && nextMessage.adminName === adminFullName;
        }
        
        return false;
    });

    return (
        <div className="flex h-full">
            {/* Admin List Sidebar */}
            <div className="w-64 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            value={adminSearchQuery}
                            onChange={(e) => setAdminSearchQuery(e.target.value)}
                            placeholder="Search admins..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredAdmins.map(admin => {
                        const adminFullName = `${admin.firstName} ${admin.lastName}`;
                        const unreadCount = messages.filter(message => 
                            message.sender === 'admin' && 
                            message.adminName === adminFullName && 
                            !message.read
                        ).length;

                        return (
                            <button
                                key={admin.id}
                                onClick={() => setSelectedAdmin(admin.id)}
                                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150 ${
                                    selectedAdmin === admin.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-full bg-gray-100 text-gray-600 mr-3">
                                            <FaUser className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{admin.firstName} {admin.lastName}</p>
                                            <p className="text-sm text-gray-500">{admin.email}</p>
                                        </div>
                                    </div>
                                    {unreadCount > 0 && (
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedAdmin ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedAdminMessages.map((message, index) => {
                                const isFirstUnread = !message.read && 
                                    (index === 0 || selectedAdminMessages[index - 1].read);
                                
                                return (
                                    <React.Fragment key={message.id}>
                                        {isFirstUnread && (
                                            <div className="flex items-center my-4">
                                                <div className="flex-1 border-t border-gray-200"></div>
                                                <span className="px-4 text-xs font-medium text-gray-500 bg-gray-50 rounded-full">
                                                    New Messages
                                                </span>
                                                <div className="flex-1 border-t border-gray-200"></div>
                                            </div>
                                        )}
                                        <div
                                            className={`flex ${message.sender === 'superadmin' ? 'justify-end' : 'justify-start'}`}
                                            onClick={() => !message.read && markAsRead(message.id)}
                                        >
                                            <div
                                                className={`flex items-start space-x-2 max-w-[70%] ${
                                                    message.sender === 'superadmin' ? 'flex-row-reverse space-x-reverse' : ''
                                                }`}
                                            >
                                                <div className={`p-2 rounded-full ${
                                                    message.sender === 'superadmin' 
                                                        ? 'bg-indigo-100 text-indigo-600' 
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    <FaUser className="h-4 w-4" />
                                                </div>
                                                <div className={`rounded-lg p-3 ${
                                                    message.sender === 'superadmin'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                }`}>
                                                    {message.sender === 'admin' && message.adminName && (
                                                        <p className="text-xs font-semibold mb-1 text-gray-600">{message.adminName}</p>
                                                    )}
                                                    <p className="text-sm">{message.content}</p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className={`text-xs ${
                                                            message.sender === 'superadmin' ? 'text-indigo-200' : 'text-gray-500'
                                                        }`}>
                                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        {message.sender === 'superadmin' && (
                                                            <span className="ml-2">
                                                                {message.read ? (
                                                                    <FaCheckDouble className="h-3 w-3 text-indigo-200" />
                                                                ) : (
                                                                    <FaCheck className="h-3 w-3 text-indigo-200" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                    aria-label="Send message"
                                >
                                    <FaPaperPlane className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <FaUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Select an admin to start chatting</h3>
                            <p className="mt-1 text-sm text-gray-500">Choose from the list of admins on the left</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatTab; 