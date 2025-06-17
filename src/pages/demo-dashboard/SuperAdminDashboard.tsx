import { useState, useRef } from 'react';
import DashboardLayout from './DashboardLayout';
import { motion, useDragControls } from 'framer-motion';
import { FaUserPlus, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaUserFriends, FaTrash, FaSort, FaSortUp, FaSortDown, FaCreditCard, FaReceipt, FaTimes, FaCog, FaUser, FaGlobe, FaBell, FaLock, FaLanguage, FaComments, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'
import type { Admin } from '../../components/AdminModal';
import AdminModalComponent from '../../components/AdminModal';

const SuperAdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'admins' | 'billing' | 'general' | 'account' | 'chat' | 'notifications'>('overview');
    const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
    const [billingActive, setBillingActive] = useState(false);
    const [generalActive, setGeneralActive] = useState(false);
    const [accountActive, setAccountActive] = useState(false);
    const [chatActive, setChatActive] = useState(false);
    const [notificationsActive, setNotificationsActive] = useState(false);
    const [isDraggingChat, setIsDraggingChat] = useState(false);
    const [tabOrder, setTabOrder] = useState<string[]>(['overview', 'admins']);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'ascending' | 'descending';
    }>({ key: 'date', direction: 'descending' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | undefined>();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [admins, setAdmins] = useState<Admin[]>([
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            status: 'active',
            date: '2024-03-15',
            stats: { parents: 45, students: 120, teachers: 12 }
        },
        {
            id: 2,
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah@example.com',
            status: 'active',
            date: '2024-03-14',
            stats: { parents: 52, students: 110, teachers: 15 }
        },
        {
            id: 3,
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'michael@example.com',
            status: 'incomplete',
            date: '2024-03-13',
            stats: { parents: 0, students: 0, teachers: 0 }
        },
        {
            id: 4,
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily@example.com',
            status: 'active',
            date: '2024-03-12',
            stats: { parents: 48, students: 90, teachers: 13 }
        },
        {
            id: 5,
            firstName: 'David',
            lastName: 'Miller',
            email: 'david@example.com',
            status: 'inactive',
            date: '2024-03-11',
            stats: { parents: 20, students: 25, teachers: 4 }
        },
        {
            id: 6,
            firstName: 'Lisa',
            lastName: 'Anderson',
            email: 'lisa@example.com',
            status: 'active',
            date: '2024-03-10',
            stats: { parents: 15, students: 20, teachers: 1 }
        },
        {
            id: 7,
            firstName: 'Robert',
            lastName: 'Taylor',
            email: 'robert@example.com',
            status: 'incomplete',
            date: '2024-03-09',
            stats: { parents: 0, students: 0, teachers: 0 }
        }
    ]);

    // Standard plan limits
    const planLimits = {
        admin: 10,
        teacher: 150,
        student: 1500,
        parent: 750
    };

    // Current usage (this would come from your backend in a real implementation)
    const currentUsage = {
        admin: 3,
        teacher: 45,
        student: 320,
        parent: 180
    };

    const stats = [
        {
            label: 'Administrators',
            value: `${currentUsage.admin}/${planLimits.admin}`,
            icon: FaUserShield,
            color: 'text-purple-600',
            remaining: planLimits.admin - currentUsage.admin
        },
        {
            label: 'Teachers',
            value: `${currentUsage.teacher}/${planLimits.teacher}`,
            icon: FaChalkboardTeacher,
            color: 'text-blue-600',
            remaining: planLimits.teacher - currentUsage.teacher
        },
        {
            label: 'Students',
            value: `${currentUsage.student}/${planLimits.student}`,
            icon: FaUserGraduate,
            color: 'text-green-600',
            remaining: planLimits.student - currentUsage.student
        },
        {
            label: 'Parents',
            value: `${currentUsage.parent}/${planLimits.parent}`,
            icon: FaUserFriends,
            color: 'text-pink-600',
            remaining: planLimits.parent - currentUsage.parent
        }
    ];

    // Add billing related state
    const [billingHistory] = useState([
        {
            id: 1,
            date: '2024-03-15',
            amount: '$99.00',
            status: 'paid',
            invoiceNumber: 'INV-2024-001',
            plan: 'Standard Plan',
            billingPeriod: 'Monthly'
        },
        {
            id: 2,
            date: '2024-02-15',
            amount: '$99.00',
            status: 'paid',
            invoiceNumber: 'INV-2024-002',
            plan: 'Standard Plan',
            billingPeriod: 'Monthly'
        },
        {
            id: 3,
            date: '2024-01-15',
            amount: '$99.00',
            status: 'paid',
            invoiceNumber: 'INV-2024-003',
            plan: 'Standard Plan',
            billingPeriod: 'Monthly'
        }
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    const [paymentMethods] = useState([
        {
            id: 1,
            type: 'card',
            last4: '4242',
            expiry: '12/25',
            isDefault: true
        }
    ]);

    const [billingSortConfig, setBillingSortConfig] = useState<{
        key: string;
        direction: 'ascending' | 'descending';
    }>({ key: 'date', direction: 'descending' });

    const dragControls = useDragControls();
    const chatButtonRef = useRef<HTMLDivElement>(null);

    const [notifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'New admin account created',
            message: 'A new admin account has been created successfully',
            time: '2 minutes ago',
            icon: FaCheckCircle,
            read: false
        },
        {
            id: 2,
            type: 'warning',
            title: 'System maintenance scheduled',
            message: 'System maintenance is scheduled for tomorrow at 2 AM',
            time: '1 hour ago',
            icon: FaExclamationTriangle,
            read: false
        },
        {
            id: 3,
            type: 'info',
            title: 'New feature update available',
            message: 'Check out our latest features and improvements',
            time: '3 hours ago',
            icon: FaInfoCircle,
            read: false
        }
    ]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedAdmins(admins.map(admin => admin.id));
        } else {
            setSelectedAdmins([]);
        }
    };

    const handleSelectAdmin = (id: number) => {
        if (selectedAdmins.includes(id)) {
            setSelectedAdmins(selectedAdmins.filter(adminId => adminId !== id));
        } else {
            setSelectedAdmins([...selectedAdmins, id]);
        }
    };

    const handleAddAdmin = async (adminData: Omit<Admin, 'id' | 'date' | 'stats' | 'status'>) => {
        // In a real application, this would be an API call
        const newAdmin: Admin = {
            id: Math.max(...admins.map(a => a.id)) + 1,
            ...adminData,
            status: 'incomplete', // New admins start as incomplete
            date: new Date().toISOString().split('T')[0],
            stats: { parents: 0, students: 0, teachers: 0 }
        };
        setAdmins([...admins, newAdmin]);
    };

    const handleEditAdmin = async (adminData: Omit<Admin, 'id' | 'date' | 'stats' | 'status'>) => {
        if (!selectedAdmin) return;

        // In a real application, this would be an API call
        const updatedAdmin = admins.map(admin => {
            if (admin.id === selectedAdmin.id) {
                // Determine status based on activity
                const totalActivity = admin.stats.parents + admin.stats.students + admin.stats.teachers;
                let newStatus: 'active' | 'inactive' | 'incomplete';

                if (totalActivity > 0) {
                    newStatus = 'active';
                } else {
                    newStatus = 'inactive';
                }

                return {
                    ...admin,
                    ...adminData,
                    status: newStatus
                };
            }
            return admin;
        });

        setAdmins(updatedAdmin);
    };

    const handleDeleteAdmin = async (id: number) => {
        // In a real application, this would be an API call
        setAdmins(admins.filter(admin => admin.id !== id));
        setSelectedAdmins(selectedAdmins.filter(adminId => adminId !== id));
    };

    const handleBulkDelete = async () => {
        // In a real application, this would be an API call
        setAdmins(admins.filter(admin => !selectedAdmins.includes(admin.id)));
        setSelectedAdmins([]);
    };

    const handleOpenAddModal = () => {
        setSelectedAdmin(undefined);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (admin: Admin) => {
        setSelectedAdmin(admin);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey: string) => {
        if (sortConfig.key !== columnKey) {
            return <FaSort className="ml-1 inline-block" />;
        }
        return sortConfig.direction === 'ascending'
            ? <FaSortUp className="ml-1 inline-block" />
            : <FaSortDown className="ml-1 inline-block" />;
    };

    const sortData = (data: any[]) => {
        return [...data].sort((a, b) => {
            if (sortConfig.key === 'date') {
                return sortConfig.direction === 'ascending'
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            if (sortConfig.key.startsWith('stats.')) {
                const statKey = sortConfig.key.split('.')[1];
                return sortConfig.direction === 'ascending'
                    ? a.stats[statKey] - b.stats[statKey]
                    : b.stats[statKey] - a.stats[statKey];
            }
            return sortConfig.direction === 'ascending'
                ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        });
    };

    const handleUpgradePlan = () => {
        // In a real application, this would redirect to a pricing/upgrade page
        alert('Redirecting to upgrade page...');
    };

    const handleBillingClick = () => {
        if (!tabOrder.includes('billing')) {
            setBillingActive(true);
            setActiveTab('billing');
            setTabOrder(prev => [...prev, 'billing']);
        } else {
            setActiveTab('billing');
        }
    };

    const handleCloseBilling = (e: React.MouseEvent) => {
        e.stopPropagation();
        setBillingActive(false);
        const currentIndex = tabOrder.indexOf('billing');
        const previousTab = tabOrder[currentIndex - 1] || 'overview';
        setActiveTab(previousTab as any);
        setTabOrder(prev => prev.filter(tab => tab !== 'billing'));
    };

    const handleCancelPlan = () => {
        // In a real application, this would make an API call to cancel the plan
        alert('Plan cancellation request submitted. Your plan will remain active until the end of the current billing period.');
        setIsCancelModalOpen(false);
    };

    const handleBillingSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (billingSortConfig.key === key && billingSortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setBillingSortConfig({ key, direction });
    };

    const getBillingSortIcon = (columnKey: string) => {
        if (billingSortConfig.key !== columnKey) {
            return <FaSort className="ml-1 inline-block" />;
        }
        return billingSortConfig.direction === 'ascending'
            ? <FaSortUp className="ml-1 inline-block" />
            : <FaSortDown className="ml-1 inline-block" />;
    };

    const sortBillingData = (data: any[]) => {
        return [...data].sort((a, b) => {
            if (billingSortConfig.key === 'date') {
                return billingSortConfig.direction === 'ascending'
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            if (billingSortConfig.key === 'amount') {
                const amountA = parseFloat(a.amount.replace('$', ''));
                const amountB = parseFloat(b.amount.replace('$', ''));
                return billingSortConfig.direction === 'ascending'
                    ? amountA - amountB
                    : amountB - amountA;
            }
            return billingSortConfig.direction === 'ascending'
                ? a[billingSortConfig.key].localeCompare(b[billingSortConfig.key])
                : b[billingSortConfig.key].localeCompare(a[billingSortConfig.key]);
        });
    };

    const handleGeneralClick = () => {
        if (!tabOrder.includes('general')) {
            setGeneralActive(true);
            setActiveTab('general');
            setTabOrder(prev => [...prev, 'general']);
        } else {
            setActiveTab('general');
        }
    };

    const handleCloseGeneral = (e: React.MouseEvent) => {
        e.stopPropagation();
        setGeneralActive(false);
        const currentIndex = tabOrder.indexOf('general');
        const previousTab = tabOrder[currentIndex - 1] || 'overview';
        setActiveTab(previousTab as any);
        setTabOrder(prev => prev.filter(tab => tab !== 'general'));
    };

    const handleAccountClick = () => {
        if (!tabOrder.includes('account')) {
            setAccountActive(true);
            setActiveTab('account');
            setTabOrder(prev => [...prev, 'account']);
        } else {
            setActiveTab('account');
        }
    };

    const handleCloseAccount = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAccountActive(false);
        const currentIndex = tabOrder.indexOf('account');
        const previousTab = tabOrder[currentIndex - 1] || 'overview';
        setActiveTab(previousTab as any);
        setTabOrder(prev => prev.filter(tab => tab !== 'account'));
    };

    const handleChatClick = () => {
        // Just show the chat button, don't open the tab
        setIsDraggingChat(true);
    };

    const handleChatDragEnd = (event: any, info: any) => {
        // Check if the drag ended near the tab bar
        const tabBar = document.querySelector('.border-b.border-gray-200');
        if (tabBar) {
            const tabBarRect = tabBar.getBoundingClientRect();
            if (info.point.y <= tabBarRect.bottom + 50) {
                // Open chat as tab
                if (!tabOrder.includes('chat')) {
                    setChatActive(true);
                    setActiveTab('chat');
                    setTabOrder(prev => [...prev, 'chat']);
                } else {
                    setActiveTab('chat');
                }
            }
        }
        setIsDraggingChat(false);
    };

    const handleCloseChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        setChatActive(false);
        const currentIndex = tabOrder.indexOf('chat');
        const previousTab = tabOrder[currentIndex - 1] || 'overview';
        setActiveTab(previousTab as any);
        setTabOrder(prev => prev.filter(tab => tab !== 'chat'));
    };

    const handleNotificationsClick = () => {
        if (!tabOrder.includes('notifications')) {
            setNotificationsActive(true);
            setActiveTab('notifications');
            setTabOrder(prev => [...prev, 'notifications']);
        } else {
            setActiveTab('notifications');
        }
    };

    const handleCloseNotifications = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNotificationsActive(false);
        const currentIndex = tabOrder.indexOf('notifications');
        const previousTab = tabOrder[currentIndex - 1] || 'overview';
        setActiveTab(previousTab as any);
        setTabOrder(prev => prev.filter(tab => tab !== 'notifications'));
    };

    return (
        <DashboardLayout
            role="Super Admin"
            roleColor="bg-purple-600"
            roleGradient="from-purple-600 to-indigo-600"
            onBillingClick={handleBillingClick}
            onGeneralClick={handleGeneralClick}
            onAccountClick={handleAccountClick}
            onChatClick={handleChatClick}
            onNotificationsClick={handleNotificationsClick}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Draggable Chat Button */}
                {!tabOrder.includes('chat') && (
                    <motion.div
                        ref={chatButtonRef}
                        drag
                        dragControls={dragControls}
                        dragMomentum={false}
                        onDragEnd={handleChatDragEnd}
                        className="fixed bottom-8 right-8 z-50"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <div className="bg-indigo-600 text-white p-4 rounded-full shadow-lg cursor-move flex items-center space-x-2">
                            <FaComments className="h-6 w-6" />
                            <span className="text-sm font-medium">Drag to open chat</span>
                        </div>
                    </motion.div>
                )}

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabOrder.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`${activeTab === tab
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize focus:outline-none flex items-center group relative`}
                            >
                                {tab}
                                {(tab === 'billing' || tab === 'general' || tab === 'account' || tab === 'chat' || tab === 'notifications') && (
                                    <button
                                        className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (tab === 'billing') handleCloseBilling(e);
                                            else if (tab === 'general') handleCloseGeneral(e);
                                            else if (tab === 'account') handleCloseAccount(e);
                                            else if (tab === 'chat') handleCloseChat(e);
                                            else if (tab === 'notifications') handleCloseNotifications(e);
                                        }}
                                        aria-label={`Close ${tab} tab`}
                                    >
                                        <FaTimes className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    </button>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Notifications Tab Content */}
                {activeTab === 'notifications' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border-l-4 ${notification.type === 'success' ? 'border-green-500 bg-green-50' :
                                            notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                                                'border-blue-500 bg-blue-50'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <div className={`flex-shrink-0 p-1 rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            <notification.icon className="h-4 w-4" />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-gray-400">{notification.time}</span>
                                                {!notification.read && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-8">
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-start">
                                            <div className={`p-3 rounded-lg ${stat.color.replace('text', 'bg')} bg-opacity-10`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                                <div className="flex items-baseline mt-1">
                                                    <p className="text-2xl font-bold text-gray-900">{stat.value.split('/')[0]}</p>
                                                    <p className="ml-2 text-sm text-gray-500">of {stat.value.split('/')[1]}</p>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                        <span>Usage</span>
                                                        <span>{Math.round((parseInt(stat.value.split('/')[0]) / parseInt(stat.value.split('/')[1])) * 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(parseInt(stat.value.split('/')[0]) / parseInt(stat.value.split('/')[1])) * 100}%` }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                            className={`h-2.5 rounded-full ${stat.color.replace('text', 'bg')}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        stat.remaining > 50 ? 'bg-green-100 text-green-800' :
                                                        stat.remaining > 20 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {stat.remaining} remaining
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <AdminModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={modalMode === 'add' ? handleAddAdmin : handleEditAdmin}
                admin={selectedAdmin}
                mode={modalMode}
            />

            {/* Cancel Plan Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Cancel Plan</h3>
                                <button
                                    onClick={() => setIsCancelModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    aria-label="Close cancel plan modal"
                                >
                                    <FaTimes className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Important Information</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Your plan will remain active until the end of the current billing period</li>
                                                    <li>All data, including student records, teacher information, and administrative settings will be securely preserved</li>
                                                    <li>You can reactivate your plan at any time</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Keep Plan
                                    </button>
                                    <button
                                        onClick={handleCancelPlan}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Confirm Cancellation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default SuperAdminDashboard; 