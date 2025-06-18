import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaEnvelope, FaCog, FaUser, FaChevronDown, FaCreditCard, FaComments, FaSearch, FaPaperPlane, FaCheck, FaCheckDouble, FaPhone, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaMicrophone } from 'react-icons/fa';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logo.png';
import logoarb from '../../assets/images/logo_arb.png';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useMessages } from '../../contexts/MessagesContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useUser } from '../../contexts/UserContext';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: string;
    roleColor: string;
    roleGradient: string;
    onBillingClick?: () => void;
    onGeneralClick?: () => void;
    onAccountClick?: () => void;
    onNotificationsClick?: () => void;
    onChatClick?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    role,
    onBillingClick,
    onGeneralClick,
    onAccountClick,
    onChatClick,
    onNotificationsClick
}): React.ReactElement => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isSwalOpen, setIsSwalOpen] = useState(false);
    const { currentLanguage } = useLanguage();
    const { notifications, markAsRead: markNotificationAsRead, deleteNotification } = useNotifications();
    const { messages, unreadCount, markAsRead } = useMessages();
    const { admins } = useAdmin();
    const { user } = useUser();
    const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchAdmin, setSearchAdmin] = useState('');
    const readTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);

    // Get selected admin info
    const selectedAdminInfo = selectedAdmin ? admins.find(a => a.id === selectedAdmin) : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isSwalOpen) return; // Don't close dropdowns if SweetAlert is open

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
    }, [isSwalOpen]);

    useEffect(() => {
        if (selectedAdmin && isMessagesOpen) {
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
    }, [selectedAdmin, isMessagesOpen, admins, messages, markAsRead]);

    const handleNotificationsToggle = () => {
        const newIsOpen = !isNotificationsOpen;
        setIsNotificationsOpen(newIsOpen);
        setIsMessagesOpen(false);
        setIsProfileDropdownOpen(false);
    };

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

    const handleDeleteNotification = async (id: number) => {
        setIsSwalOpen(true);
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-xl shadow-lg',
                title: 'text-lg font-medium text-gray-900',
                htmlContainer: 'text-sm text-gray-500',
                confirmButton: 'rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                cancelButton: 'rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
                actions: 'mt-4 space-x-3'
            },
            buttonsStyling: false,
            width: 'auto',
            padding: '1.5rem'
        });

        if (result.isConfirmed) {
            deleteNotification(id);
        }
        setIsSwalOpen(false);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle sending a new message
        console.log('Sending message:', newMessage);
        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b border-gray-100">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <img
                            src={currentLanguage === 'ar' ? logoarb : logo}
                            alt="Telmeez Logo"
                            className="h-16 w-auto transition-transform hover:scale-105"
                        />

                        {/* Right side items */}
                        <div className="flex items-center space-x-6">
                            {/* Subscription Plan */}
                            <div className="hidden md:flex flex-col items-center">
                                <span className="text-sm font-semibold text-gray-700">{user?.subscriptionPlan || 'Free'}</span>
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
                                    onClick={handleNotificationsToggle}
                                    className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none relative transition-colors duration-200"
                                    aria-label="Toggle notifications"
                                >
                                    <FaBell className="h-5 w-5" />
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-pulse">
                                            {notifications.filter(n => !n.read).length}
                                        </span>
                                    )}
                                </button>
                                <div className={`absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 ease-in-out origin-top-right ${isNotificationsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {[...notifications]
                                            .filter(notification => {
                                                const notificationDate = new Date(notification.time);
                                                const today = new Date();
                                                return notificationDate.toDateString() === today.toDateString();
                                            })
                                            .sort((a, b) => {
                                                // First sort by read status (unread first)
                                                if (a.read !== b.read) {
                                                    return a.read ? 1 : -1;
                                                }
                                                // Then sort by time (newest first)
                                                return new Date(b.time).getTime() - new Date(a.time).getTime();
                                            })
                                            .map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer border-l-4 ${notification.read ? 'border-transparent' : 'border-indigo-500'
                                                        }`}
                                                >
                                                    <div className="flex items-start">
                                                        <div className={`p-2 rounded-lg mr-3 ${notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-green-100 text-green-600'
                                                            }`}>
                                                            <notification.icon className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                                {!notification.read && (
                                                                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                                                        New
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <p className="text-xs text-gray-400">
                                                                    {new Date(notification.time).toLocaleString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true
                                                                    })}
                                                                </p>
                                                                <div className="flex space-x-2">
                                                                    {!notification.read && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                markNotificationAsRead(notification.id);
                                                                            }}
                                                                            className="focus:outline-none text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                                                        >
                                                                            Mark as read
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteNotification(notification.id);
                                                                        }}
                                                                        className="focus:outline-none text-xs text-red-600 hover:text-red-800 font-medium"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (onNotificationsClick) onNotificationsClick();
                                                    setIsNotificationsOpen(false);
                                                }}
                                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                View all notifications
                                            </a>
                                            {notifications.filter(n => {
                                                const notificationDate = new Date(n.time);
                                                const today = new Date();
                                                return !n.read && notificationDate.toDateString() !== today.toDateString();
                                            }).length > 0 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        {notifications.filter(n => {
                                                            const notificationDate = new Date(n.time);
                                                            const today = new Date();
                                                            return !n.read && notificationDate.toDateString() !== today.toDateString();
                                                        }).length} unread from previous days
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="relative" ref={messagesRef}>
                                <button
                                    onClick={() => {
                                        const newIsOpen = !isMessagesOpen;
                                        setIsMessagesOpen(newIsOpen);
                                        setIsNotificationsOpen(false);
                                        setIsProfileDropdownOpen(false);
                                        if (!newIsOpen) {
                                            setSearchAdmin('');
                                            setSelectedAdmin(null);
                                        }
                                    }}
                                    className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none relative transition-colors duration-200"
                                    aria-label="Open messages"
                                >
                                    <FaEnvelope className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                <div className={`absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-1 z-50 transform transition-all duration-300 ease-in-out origin-top-right border border-white/20 ${isMessagesOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden rounded-t-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                                        <div className="relative z-10 flex justify-between items-center">
                                            <h3 className="text-lg font-bold text-white flex items-center">
                                                <span className="mr-2">💬</span>
                                                Messages
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    if (onChatClick) onChatClick();
                                                    setIsMessagesOpen(false);
                                                }}
                                                className="focus:outline-none text-xs text-white/90 hover:text-white transition-colors duration-200 flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30"
                                            >
                                                <FaComments className="h-3 w-3 mr-1" />
                                                Open in Tab
                                            </button>
                                        </div>
                                    </div>
                                    <div className="max-h-[600px] overflow-hidden">
                                        {selectedAdmin ? (
                                            <div className="flex flex-col h-[500px]">
                                                {/* Chat Header */}
                                                <div className="p-4 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-white/50">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAdmin(null);
                                                            setSearchAdmin('');
                                                        }}
                                                        className="focus:outline-none flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl hover:bg-white shadow-sm"
                                                    >
                                                        <FaChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                                                        <span className="ml-2 text-sm font-medium">Back</span>
                                                    </button>
                                                    <div className="flex items-center">
                                                        <div className="relative mr-3">
                                                            {selectedAdminInfo?.profileImage ? (
                                                                <img
                                                                    src={selectedAdminInfo.profileImage}
                                                                    alt={`${selectedAdminInfo.firstName} ${selectedAdminInfo.lastName}`}
                                                                    className="h-8 w-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                                                                    <span className="text-sm font-medium">
                                                                        {selectedAdminInfo?.firstName[0]}{selectedAdminInfo?.lastName[0]}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${selectedAdminInfo?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                                }`}></div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {selectedAdminInfo?.firstName} {selectedAdminInfo?.lastName}
                                                            </p>
                                                            <p className={`text-xs font-medium ${selectedAdminInfo?.isOnline ? 'text-green-600' : 'text-gray-500'
                                                                }`}>
                                                                • {selectedAdminInfo?.isOnline ? 'online' : 'offline'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            className="focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                                                            aria-label="Call admin"
                                                        >
                                                            <FaPhone className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            className="focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                                                            aria-label="Video call admin"
                                                        >
                                                            <FaVideo className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            className="focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                                                            aria-label="More options"
                                                        >
                                                            <FaEllipsisV className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Chat Area */}
                                                <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50/30 to-white/50">
                                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px] min-h-[350px]">
                                                        {messages
                                                            .filter(message => {
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
                                                            })
                                                            .map((message, index, filteredMessages) => {
                                                                const isFirstUnread = !message.read &&
                                                                    (index === 0 || filteredMessages[index - 1].read);

                                                                return (
                                                                    <React.Fragment key={message.id}>
                                                                        {isFirstUnread && (
                                                                            <div className="flex items-center my-3">
                                                                                <div className="flex-1 border-t border-gray-200/50"></div>
                                                                                <span className="px-4 py-1 text-xs font-medium text-gray-500 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/50">
                                                                                    New Messages
                                                                                </span>
                                                                                <div className="flex-1 border-t border-gray-200/50"></div>
                                                                            </div>
                                                                        )}
                                                                        <div
                                                                            className={`flex ${message.sender === 'superadmin' ? 'justify-end' : 'justify-start'}`}
                                                                            onClick={() => !message.read && markAsRead(message.id)}
                                                                        >
                                                                            <div
                                                                                className={`flex items-end space-x-2 max-w-[85%] ${message.sender === 'superadmin' ? 'flex-row-reverse space-x-reverse' : ''
                                                                                    }`}
                                                                            >
                                                                                {message.sender === 'admin' && selectedAdminInfo ? (
                                                                                    <div className="relative">
                                                                                        {selectedAdminInfo.profileImage ? (
                                                                                            <img
                                                                                                src={selectedAdminInfo.profileImage}
                                                                                                alt={`${selectedAdminInfo.firstName} ${selectedAdminInfo.lastName}`}
                                                                                                className="h-8 w-8 rounded-full object-cover shadow-lg"
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg flex items-center justify-center">
                                                                                                <span className="text-xs font-medium">
                                                                                                    {selectedAdminInfo.firstName[0]}{selectedAdminInfo.lastName[0]}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${selectedAdminInfo.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                                                            }`}></div>
                                                                                    </div>
                                                                                ) : (
                                                                                    null
                                                                                )}
                                                                                <div className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${message.sender === 'superadmin'
                                                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                                                                        : 'bg-white/90 text-gray-900 border border-gray-200/50'
                                                                                    }`}>
                                                                                    {message.sender === 'admin' && message.adminName && (
                                                                                        <p className="text-xs font-semibold mb-1 text-gray-600">{message.adminName}</p>
                                                                                    )}
                                                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                                                    <div className="flex items-center justify-between mt-2">
                                                                                        <p className={`text-xs ${message.sender === 'superadmin' ? 'text-indigo-200' : 'text-gray-400'
                                                                                            }`}>
                                                                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                        </p>
                                                                                        {message.sender === 'superadmin' && (
                                                                                            <span className="ml-1">
                                                                                                {message.read ? (
                                                                                                    <FaCheckDouble className="h-2.5 w-2.5 text-indigo-200" />
                                                                                                ) : (
                                                                                                    <FaCheck className="h-2.5 w-2.5 text-indigo-200" />
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
                                                    </div>
                                                    <form onSubmit={handleSendMessage} className="border-t border-gray-100/50 p-4 bg-white/80 backdrop-blur-sm">
                                                        <div className="flex items-end space-x-3">
                                                            <div className="flex-1 relative">
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        value={newMessage}
                                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                                        placeholder="Type your message..."
                                                                        className="w-full text-sm rounded-xl border border-gray-200/50 px-4 py-2.5 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-sm"
                                                                    />
                                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                                                        <button
                                                                            type="button"
                                                                            className="focus:outline-none p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                                            aria-label="Add emoji"
                                                                        >
                                                                            <FaSmile className="h-3.5 w-3.5 text-gray-500" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="focus:outline-none p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                                            aria-label="Attach file"
                                                                        >
                                                                            <FaPaperclip className="h-3.5 w-3.5 text-gray-500" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-xl px-3 py-2.5 hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                                aria-label="Voice message"
                                                            >
                                                                <FaMicrophone className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-4 py-2.5 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                                aria-label="Send message"
                                                            >
                                                                <FaPaperPlane className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-[500px] flex flex-col">
                                                <div className="p-4 border-b border-gray-100/50 flex-shrink-0">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={searchAdmin}
                                                            onChange={(e) => setSearchAdmin(e.target.value)}
                                                            placeholder="Search admins..."
                                                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-sm"
                                                        />
                                                        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 h-4 w-4" />
                                                        {searchAdmin && (
                                                            <button
                                                                onClick={() => setSearchAdmin('')}
                                                                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                                aria-label="Clear search"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-2">
                                                    {admins
                                                        .filter(admin => {
                                                            if (!searchAdmin.trim()) return true;
                                                            const searchTerm = searchAdmin.toLowerCase();
                                                            const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
                                                            const email = admin.email.toLowerCase();
                                                            return fullName.includes(searchTerm) || email.includes(searchTerm);
                                                        })
                                                        .map((admin) => {
                                                            const adminFullName = `${admin.firstName} ${admin.lastName}`;
                                                            const unreadCount = messages.filter(message =>
                                                                message.sender === 'admin' &&
                                                                message.adminName === adminFullName &&
                                                                !message.read
                                                            ).length;

                                                            const lastMessage = messages
                                                                .filter(m => m.sender === 'admin' && m.adminName === adminFullName)
                                                                .pop();

                                                            return (
                                                                <button
                                                                    key={admin.id}
                                                                    onClick={() => setSelectedAdmin(admin.id)}
                                                                    className={`focus:outline-none w-full p-4 text-left rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover-lift ${selectedAdmin === admin.id
                                                                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 shadow-lg'
                                                                            : 'hover:bg-white/50 border border-transparent'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center flex-1 min-w-0">
                                                                            <div className="relative mr-4">
                                                                                {admin.profileImage ? (
                                                                                    <img
                                                                                        src={admin.profileImage}
                                                                                        alt={`${admin.firstName} ${admin.lastName}`}
                                                                                        className={`h-8 w-8 rounded-full object-cover ${selectedAdmin === admin.id
                                                                                                ? 'ring-2 ring-indigo-500'
                                                                                                : ''
                                                                                            }`}
                                                                                    />
                                                                                ) : (
                                                                                    <div className={`p-2.5 rounded-xl ${selectedAdmin === admin.id
                                                                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                                                                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                                                                                        }`}>
                                                                                        <span className="text-sm font-medium">
                                                                                            {admin.firstName[0]}{admin.lastName[0]}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                {/* Online indicator */}
                                                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                                                    }`}></div>
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="font-semibold text-gray-900 truncate text-sm">{admin.firstName} {admin.lastName}</p>
                                                                                    {admin.isOnline && (
                                                                                        <span className="text-xs text-green-600 font-medium">• online</span>
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                                                                                {lastMessage && (
                                                                                    <p className="text-xs text-gray-400 truncate mt-1">
                                                                                        {lastMessage.content.substring(0, 30)}...
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {unreadCount > 0 && (
                                                                            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full min-w-[20px] shadow-lg animate-pulse">
                                                                                {unreadCount}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    {admins.filter(admin => {
                                                        if (!searchAdmin.trim()) return false;
                                                        const searchTerm = searchAdmin.toLowerCase();
                                                        const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
                                                        const email = admin.email.toLowerCase();
                                                        return fullName.includes(searchTerm) || email.includes(searchTerm);
                                                    }).length === 0 && searchAdmin.trim() && (
                                                            <div className="p-6 text-center">
                                                                <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-100/80 to-gray-200/80 backdrop-blur-sm inline-block mb-4">
                                                                    <FaSearch className="h-8 w-8 text-gray-400" />
                                                                </div>
                                                                <p className="text-sm text-gray-500">No admins found matching "{searchAdmin}"</p>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        )}
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
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user ? `${user.firstName} ${user.lastName}` : 'User Avatar'}
                                                className="h-8 w-8 rounded-full ring-2 ring-gray-100 transition-transform hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center ring-2 ring-gray-100 transition-transform hover:scale-105">
                                                <FaUser className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        <span className="ml-2 text-sm font-medium hidden md:block">
                                            {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                                        </span>
                                        <FaChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </div>
                                </button>
                                <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 ease-in-out origin-top-right ${isProfileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</p>
                                        <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
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