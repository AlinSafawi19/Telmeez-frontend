import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '../../contexts/MessagesContext';
import { useAdmin } from '../../contexts/AdminContext';
import { FaUser, FaPaperPlane, FaSearch, FaCheck, FaCheckDouble, FaEllipsisV, FaPhone, FaVideo, FaSmile, FaPaperclip, FaMicrophone } from 'react-icons/fa';

const ChatTab: React.FC = () => {
    const { messages, addMessage, markAsRead } = useMessages();
    const { admins } = useAdmin();
    const [newMessage, setNewMessage] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
    const [adminSearchQuery, setAdminSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
            if (readTimeoutRef.current) {
                clearTimeout(readTimeoutRef.current);
            }

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
                setNewMessage('');
                
                // Show typing indicator
                setIsTyping(true);
                
                setTimeout(() => {
                    setIsTyping(false);
                    addMessage(
                        `Thank you for your message. I will get back to you shortly.`,
                        'admin',
                        `${admin.firstName} ${admin.lastName}`
                    );
                }, 2000);
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
        
        if (message.sender === 'admin') {
            return message.adminName === adminFullName;
        }
        
        if (message.sender === 'superadmin') {
            const messageIndex = messages.indexOf(message);
            const nextMessage = messages[messageIndex + 1];
            return nextMessage && nextMessage.sender === 'admin' && nextMessage.adminName === adminFullName;
        }
        
        return false;
    });

    const selectedAdminInfo = admins.find(a => a.id === selectedAdmin);

    // Get online status (mock data) - make it consistent per admin
    const getOnlineStatus = (adminId: number) => {
        // Use adminId to generate consistent online status
        // This ensures the same admin always has the same status
        return adminId % 3 !== 0; // 2/3 chance of being online (adminId 1,2,4,5,7,8... will be online)
    };

    return (
        <div className="flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Admin List Sidebar */}
            <div className="w-96 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                            <span className="mr-2">💬</span>
                            Messages
                        </h2>
                        <div className="relative">
                            <input
                                type="text"
                                value={adminSearchQuery}
                                onChange={(e) => setAdminSearchQuery(e.target.value)}
                                placeholder="Search admins..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300"
                            />
                            <FaSearch className="absolute left-4 top-3.5 text-white/70" />
                        </div>
                    </div>
                </div>

                {/* Admin List */}
                <div className="flex-1 overflow-y-auto p-2 chat-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {filteredAdmins.map((admin, index) => {
                        const adminFullName = `${admin.firstName} ${admin.lastName}`;
                        const unreadCount = messages.filter(message => 
                            message.sender === 'admin' && 
                            message.adminName === adminFullName && 
                            !message.read
                        ).length;

                        const lastMessage = messages
                            .filter(m => m.sender === 'admin' && m.adminName === adminFullName)
                            .pop();

                        const isOnline = getOnlineStatus(admin.id);

                        return (
                            <button
                                key={admin.id}
                                onClick={() => setSelectedAdmin(admin.id)}
                                className={`focus:outline-none w-full p-4 text-left rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover-lift animate-fade-in ${
                                    selectedAdmin === admin.id 
                                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 shadow-lg' 
                                        : 'hover:bg-white/50 border border-transparent'
                                }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <div className="relative mr-4">
                                            <div className={`p-3 rounded-2xl ${
                                                selectedAdmin === admin.id 
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg animate-pulse-glow' 
                                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                                            }`}>
                                                <FaUser className="h-4 w-4" />
                                            </div>
                                            {/* Online indicator */}
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                                isOnline ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 truncate">{admin.firstName} {admin.lastName}</p>
                                                {isOnline && (
                                                    <span className="text-xs text-green-600 font-medium">• online</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                                            {lastMessage && (
                                                <p className="text-xs text-gray-400 truncate mt-1">
                                                    {lastMessage.content.substring(0, 35)}...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {unreadCount > 0 && (
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full min-w-[24px] shadow-lg animate-pulse">
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
            <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm shadow-inner">
                {selectedAdmin ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative mr-4">
                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                                            <FaUser className="h-5 w-5" />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                            selectedAdminInfo && getOnlineStatus(selectedAdminInfo.id) ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {selectedAdminInfo?.firstName} {selectedAdminInfo?.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${
                                                selectedAdminInfo && getOnlineStatus(selectedAdminInfo.id) ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></span>
                                            {selectedAdminInfo && getOnlineStatus(selectedAdminInfo.id) ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button 
                                        className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                                        aria-label="Call admin"
                                    >
                                        <FaPhone className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <button 
                                        className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                                        aria-label="Video call admin"
                                    >
                                        <FaVideo className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <button 
                                        className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                                        aria-label="More options"
                                    >
                                        <FaEllipsisV className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-white/50 chat-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                            {selectedAdminMessages.map((message, index) => {
                                const isFirstUnread = !message.read && 
                                    (index === 0 || selectedAdminMessages[index - 1].read);
                                
                                return (
                                    <React.Fragment key={message.id}>
                                        {isFirstUnread && (
                                            <div className="flex items-center my-8">
                                                <div className="flex-1 border-t border-gray-200/50"></div>
                                                <span className="px-6 py-2 text-xs font-medium text-gray-500 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/50">
                                                    New Messages
                                                </span>
                                                <div className="flex-1 border-t border-gray-200/50"></div>
                                            </div>
                                        )}
                                        <div
                                            className={`flex ${message.sender === 'superadmin' ? 'justify-end' : 'justify-start'} ${
                                                message.sender === 'superadmin' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                                            }`}
                                            onClick={() => !message.read && markAsRead(message.id)}
                                        >
                                            <div
                                                className={`flex items-end space-x-3 max-w-[75%] ${
                                                    message.sender === 'superadmin' ? 'flex-row-reverse space-x-reverse' : ''
                                                }`}
                                            >
                                                <div className={`p-3 rounded-2xl ${
                                                    message.sender === 'superadmin' 
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg animate-pulse-glow' 
                                                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                                                }`}>
                                                    <FaUser className="h-4 w-4" />
                                                </div>
                                                <div className={`rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm message-bubble hover-lift ${
                                                    message.sender === 'superadmin'
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                                        : 'bg-white/90 text-gray-900 border border-gray-200/50'
                                                }`}>
                                                    {message.sender === 'admin' && message.adminName && (
                                                        <p className="text-xs font-semibold mb-2 text-gray-600">{message.adminName}</p>
                                                    )}
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <p className={`text-xs ${
                                                            message.sender === 'superadmin' ? 'text-indigo-200' : 'text-gray-400'
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
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start animate-fade-in">
                                    <div className="flex items-end space-x-3">
                                        <div className="p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600">
                                            <FaUser className="h-4 w-4" />
                                        </div>
                                        <div className="bg-white/90 rounded-3xl px-6 py-4 shadow-lg border border-gray-200/50">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-white/20 p-6 bg-white/80 backdrop-blur-xl">
                            <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                                <div className="flex-1 relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="w-full rounded-2xl border border-gray-200/50 px-6 py-4 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm"
                                            style={{ minHeight: '56px' }}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                            <button
                                                type="button"
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                aria-label="Add emoji"
                                            >
                                                <FaSmile className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                aria-label="Attach file"
                                            >
                                                <FaPaperclip className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                                    aria-label="Send message"
                                >
                                    <FaPaperPlane className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-2xl p-4 hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    aria-label="Voice message"
                                >
                                    <FaMicrophone className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50/50 to-blue-50/50">
                        <div className="text-center max-w-md p-8 animate-fade-in">
                            <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm inline-block mb-8 shadow-lg hover-lift">
                                <FaUser className="h-16 w-16 text-indigo-600" />
                            </div>
                            <h3 className="text-3xl font-bold gradient-text mb-4">Start a Conversation</h3>
                            <p className="text-gray-600 leading-relaxed text-lg mb-6">
                                Select an admin from the list to begin chatting. Your messages will appear here once you start a conversation.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <div className="p-3 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 animate-pulse">
                                    <FaSearch className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 animate-pulse" style={{ animationDelay: '0.5s' }}>
                                    <FaUser className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="p-3 rounded-full bg-gradient-to-r from-pink-100 to-red-100 animate-pulse" style={{ animationDelay: '1s' }}>
                                    <FaPaperPlane className="h-5 w-5 text-pink-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatTab; 