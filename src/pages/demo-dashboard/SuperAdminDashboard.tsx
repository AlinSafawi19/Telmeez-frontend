import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaUserFriends, FaTrash, FaCreditCard, FaTimes, FaCog, FaUser, FaGlobe, FaBell, FaComments, FaExclamationTriangle, FaInfoCircle, FaCalendarAlt, FaBullhorn } from 'react-icons/fa'
import type { Admin } from '../../contexts/AdminContext';
import { useAdmin } from '../../contexts/AdminContext';
import AdminModalComponent from '../../components/AdminModal';
import { useNotifications, type Notification } from '../../contexts/NotificationsContext';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ChatTab from './ChatTab';
import Select2 from '../../components/Select2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SuperAdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'admins' | 'billing' | 'general' | 'account' | 'notifications' | 'chat' | 'calendar'>('overview');
    const [billingActive, setBillingActive] = useState(false);
    const [generalActive, setGeneralActive] = useState(false);
    const [accountActive, setAccountActive] = useState(false);
    const [chatActive, setChatActive] = useState(false);
    const [notificationsActive, setNotificationsActive] = useState(false);
    const { notifications, markAsRead, deleteNotification } = useNotifications();
    const [notificationTypeFilter, setNotificationTypeFilter] = useState<('info' | 'warning' | 'success')[]>([]);
    const [notificationReadFilter, setNotificationReadFilter] = useState<('read' | 'unread')[]>([]);
    const [notificationSearchQuery, setNotificationSearchQuery] = useState('');
    const [tabOrder, setTabOrder] = useState<string[]>(['overview', 'admins', 'calendar']);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | undefined>();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set(['Today', 'Yesterday']));
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

    const {
        admins,
        selectedAdmins,
        searchQuery,
        statusFilter,
        rowsPerPage,
        currentPage,
        setSearchQuery,
        setStatusFilter,
        setRowsPerPage,
        setCurrentPage,
        handleSelectAll,
        handleSelectAdmin,
        handleAddAdmin,
        handleEditAdmin,
        handleDeleteAdmin,
        handleBulkDelete,
        handleSort,
        getSortIcon,
        filterAdmins,
        sortData,
        getPaginatedData,
        getTotalPages,
    } = useAdmin();

    // Standard plan limits
    const planLimits = {
        admin: 10,
        teacher: 150,
        student: 1500,
        parent: 750
    };

    // Calculate current usage from admin stats
    const currentUsage = {
        admin: admins.length,
        teacher: admins.reduce((sum, admin) => sum + admin.stats.teachers, 0),
        student: admins.reduce((sum, admin) => sum + admin.stats.students, 0),
        parent: admins.reduce((sum, admin) => sum + admin.stats.parents, 0)
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

    const handleChatClick = () => {
        if (!tabOrder.includes('chat')) {
            setChatActive(true);
            setActiveTab('chat');
            setTabOrder(prev => [...prev, 'chat']);
        } else {
            setActiveTab('chat');
        }
    };

    // Function to handle clicking on admin name in recent admins table
    const handleAdminNameClick = (admin: Admin) => {
        // Navigate to admins tab
        setActiveTab('admins');
        
        // Select the specific admin
        handleSelectAdmin(admin.id);
        
        // Clear any existing search to make sure the admin is visible
        setSearchQuery('');
        setStatusFilter('all');
        
        // Reset to first page to ensure the admin is visible
        setCurrentPage(1);
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, rowsPerPage, setCurrentPage]);

    const toggleDateGroup = (date: string) => {
        setExpandedDates(prev => {
            const newSet = new Set(prev);
            if (newSet.has(date)) {
                newSet.delete(date);
            } else {
                newSet.add(date);
            }
            return newSet;
        });
    };

    // Add these chart data configurations before the return statement
    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Total Users',
                data: [150, 230, 320, 410, 480, 550],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const userComparisonData = {
        labels: ['Administrators', 'Teachers', 'Students', 'Parents'],
        datasets: [
            {
                label: 'Current Users',
                data: [currentUsage.admin, currentUsage.teacher, currentUsage.student, currentUsage.parent],
                backgroundColor: [
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
            },
        ],
    };

    const userStatusData = {
        labels: ['Active', 'Inactive', 'Incomplete'],
        datasets: [
            {
                data: [
                    admins.filter(a => a.status === 'active').length,
                    admins.filter(a => a.status === 'inactive').length,
                    admins.filter(a => a.status === 'incomplete').length,
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
            },
        ],
    };

    const schoolPerformanceData = {
        labels: ['Attendance', 'Academic Progress', 'Teacher Engagement', 'Parent Involvement', 'Resource Utilization'],
        datasets: [
            {
                label: 'Current Month',
                data: [94.5, 87.2, 92.0, 78.5, 85.0],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgb(99, 102, 241)',
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 102, 241)',
            },
            {
                label: 'Last Month',
                data: [92.2, 85.7, 90.5, 75.0, 82.5],
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                borderColor: 'rgb(147, 51, 234)',
                pointBackgroundColor: 'rgb(147, 51, 234)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(147, 51, 234)',
            },
        ],
    };

    const handleCancelPlan = () => {
        // In a real application, this would make an API call to cancel the plan
        alert('Plan cancellation request submitted. Your plan will remain active until the end of the current billing period.');
        setIsCancelModalOpen(false);
    };

    return (
        <DashboardLayout
            role="Super Admin"
            roleColor="text-purple-600"
            roleGradient="from-purple-600 to-indigo-600"
            onBillingClick={handleBillingClick}
            onGeneralClick={handleGeneralClick}
            onAccountClick={handleAccountClick}
            onNotificationsClick={handleNotificationsClick}
            onChatClick={handleChatClick}
        >
            <div className="flex h-full">
                {/* Vertical Navigation Tabs */}
                <div className="w-72 bg-white border-r border-gray-100 fixed inset-y-0 left-0 flex flex-col">
                    <div className="px-6 pt-[5rem] pb-[1.5rem] flex-shrink-0 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your school system</p>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-4 py-4">
                        {tabOrder.map((tab) => {
                            const getIcon = () => {
                                switch (tab) {
                                    case 'overview': return <FaGlobe className="h-5 w-5" />;
                                    case 'admins': return <FaUserShield className="h-5 w-5" />;
                                    case 'billing': return <FaCreditCard className="h-5 w-5" />;
                                    case 'general': return <FaCog className="h-5 w-5" />;
                                    case 'account': return <FaUser className="h-5 w-5" />;
                                    case 'notifications': return <FaBell className="h-5 w-5" />;
                                    case 'chat': return <FaComments className="h-5 w-5" />;
                                    case 'calendar': return <FaCalendarAlt className="h-5 w-5" />;
                                    default: return <FaGlobe className="h-5 w-5" />;
                                }
                            };

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`${activeTab === tab
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        } focus:outline-none group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 w-full relative`}
                                >
                                    <div className="flex items-center flex-1">
                                        <div className={`${activeTab === tab
                                            ? 'text-indigo-600 bg-indigo-100'
                                            : 'text-gray-400 group-hover:text-gray-500 group-hover:bg-gray-100'
                                            } p-2 rounded-lg mr-3 transition-all duration-200`}>
                                            {getIcon()}
                                        </div>
                                        <span className="capitalize">{tab}</span>
                                    </div>
                                    {(tab === 'billing' || tab === 'general' || tab === 'account' || tab === 'chat' || tab === 'notifications') && (
                                        <button
                                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (tab === 'billing') handleCloseBilling(e);
                                                else if (tab === 'general') handleCloseGeneral(e);
                                                else if (tab === 'account') handleCloseAccount(e);
                                                else if (tab === 'notifications') handleCloseNotifications(e);
                                                else if (tab === 'chat') handleCloseChat(e);
                                            }}
                                            aria-label={`Close ${tab} tab`}
                                        >
                                            <FaTimes className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                        </button>
                                    )}
                                    {activeTab === tab && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="px-4 py-6 flex-shrink-0 border-t border-gray-100">
                        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 border border-indigo-100">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <FaInfoCircle className="h-5 w-5 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-indigo-900">Need Help?</p>
                                    <a href="mailto:contact@telmeezlb.com" className="text-xs text-indigo-700 mt-1 hover:text-indigo-900 hover:underline">Contact support for assistance</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto ml-40">
                    <div className="mx-auto px-2 sm:px-4 lg:px-6 py-6">
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
                                                className="bg-white rounded-lg shadow-sm p-2 border border-gray-100 hover:shadow-md transition-all duration-300"
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
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stat.remaining > 50 ? 'bg-green-100 text-green-800' :
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

                                    {/* Charts Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* User Growth Chart */}
                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">User Growth</h2>
                                            <div className="h-64">
                                                <Line
                                                    data={userGrowthData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'top' as const,
                                                            },
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* User Comparison Chart */}
                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h2>
                                            <div className="h-64">
                                                <Bar
                                                    data={userComparisonData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                display: false,
                                                            },
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* User Status Chart */}
                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Status</h2>
                                            <div className="h-64">
                                                <Doughnut
                                                    data={userStatusData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'right' as const,
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* School Performance Chart */}
                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">School Performance</h2>
                                            <div className="h-64">
                                                <Radar
                                                    data={schoolPerformanceData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'top' as const,
                                                            },
                                                        },
                                                        scales: {
                                                            r: {
                                                                beginAtZero: true,
                                                                max: 100,
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Links Section */}
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <button
                                                onClick={handleBillingClick}
                                                className="focus:outline-none flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                            >
                                                <div className="p-2 bg-green-100 rounded-lg mb-2">
                                                    <FaCreditCard className="h-6 w-6 text-green-600" />
                                                </div>
                                                <span className="text-sm font-medium text-green-900">Billing</span>
                                            </button>
                                            <button
                                                onClick={handleGeneralClick}
                                                className="focus:outline-none flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                                            >
                                                <div className="p-2 bg-orange-100 rounded-lg mb-2">
                                                    <FaCog className="h-6 w-6 text-orange-600" />
                                                </div>
                                                <span className="text-sm font-medium text-orange-900">Settings</span>
                                            </button>
                                            <button
                                                onClick={handleAccountClick}
                                                className="focus:outline-none flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                                            >
                                                <div className="p-2 bg-indigo-100 rounded-lg mb-2">
                                                    <FaUser className="h-6 w-6 text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-medium text-indigo-900">Account</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('general')}
                                                className="focus:outline-none flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                            >
                                                <div className="p-2 bg-blue-100 rounded-lg mb-2">
                                                    <FaBullhorn className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <span className="text-sm font-medium text-blue-900">Announcements</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Actions and System Status */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className='flex flex-col gap-6'>
                                            {/* School Overview */}
                                            <div className="bg-white rounded-lg shadow-sm p-6">
                                                <h2 className="text-lg font-medium text-gray-900 mb-4">School Overview</h2>
                                                <div className="space-y-6">
                                                    {/* School Performance */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-700">School Performance</span>
                                                            <span className="text-sm text-gray-500">This Month</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-green-50 rounded-lg p-3">
                                                                <p className="text-xs text-green-700">Attendance Rate</p>
                                                                <p className="text-lg font-semibold text-green-900">94.5%</p>
                                                                <p className="text-xs text-green-600 mt-1">↑ 2.3% from last month</p>
                                                            </div>
                                                            <div className="bg-blue-50 rounded-lg p-3">
                                                                <p className="text-xs text-blue-700">Academic Progress</p>
                                                                <p className="text-lg font-semibold text-blue-900">87.2%</p>
                                                                <p className="text-xs text-blue-600 mt-1">↑ 1.5% from last month</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Recent Activities */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-700">Recent Activities</span>
                                                            <button className="focus:outline-none text-xs text-indigo-600 hover:text-indigo-900">View All</button>
                                                        </div>
                                                        <div className="space-y-3">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Upcoming Events */}
                                            <div className="bg-white rounded-lg shadow-sm p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Upcoming Events</span>
                                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                        <FaCalendarAlt className="h-4 w-4 mr-2" />
                                                        Add Event
                                                    </button>
                                                </div>
                                                <div className="space-y-3">

                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Admins Section */}
                                        <div className='flex flex-col gap-6'>
                                            <div className="overflow-x-auto bg-white rounded-lg shadow-sm p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h2 className="text-lg font-medium text-gray-900">Recent Admins</h2>
                                                    <button
                                                        onClick={handleOpenAddModal}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <FaUserPlus className="h-4 w-4 mr-2" />
                                                        Add New Admin
                                                    </button>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                                                    #
                                                                </th>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                                                    <button
                                                                        onClick={() => handleSort('firstName')}
                                                                        className="flex items-center focus:outline-none border-none"
                                                                    >
                                                                        Name {getSortIcon('firstName')}
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                                                    <button
                                                                        onClick={() => handleSort('email')}
                                                                        className="flex items-center focus:outline-none border-none"
                                                                    >
                                                                        Email {getSortIcon('email')}
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                                    <button
                                                                        onClick={() => handleSort('status')}
                                                                        className="flex items-center focus:outline-none border-none"
                                                                    >
                                                                        Status {getSortIcon('status')}
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                                    <button
                                                                        onClick={() => handleSort('date')}
                                                                        className="flex items-center focus:outline-none border-none"
                                                                    >
                                                                        Date {getSortIcon('date')}
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {sortData(admins)
                                                                .slice(0, 3)
                                                                .map((admin, index) => (
                                                                    <tr key={admin.id}>
                                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                                            <div className="flex items-center">
                                                                                <div className="flex-shrink-0 h-8 w-8">
                                                                                    {admin.profileImage ? (
                                                                                        <img
                                                                                            src={admin.profileImage}
                                                                                            alt={`${admin.firstName} ${admin.lastName}`}
                                                                                            className="h-8 w-8 rounded-full object-cover"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                                            <span className="text-indigo-600 font-medium text-sm">
                                                                                                {admin.firstName[0]}{admin.lastName[0]}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="ml-3">
                                                                                    <button
                                                                                        onClick={() => handleAdminNameClick(admin)}
                                                                                        className="text-sm font-medium text-gray-900 truncate max-w-[120px] hover:text-indigo-600 hover:underline focus:outline-none border-none bg-transparent"
                                                                                    >
                                                                                        {admin.firstName} {admin.lastName}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-900 truncate max-w-[150px]">{admin.email}</div>
                                                                        </td>
                                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                                ${admin.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                                    admin.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                                                {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                            {new Date(admin.date).toLocaleDateString()}
                                                                        </td>
                                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                                            <button
                                                                                onClick={() => handleOpenEditModal(admin)}
                                                                                className="text-indigo-600 hover:text-indigo-900 mr-2 focus:outline-none"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                                                className="text-red-600 hover:text-red-900 focus:outline-none"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Admins Tab Content */}
                            {activeTab === 'admins' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Modern Header Section */}
                                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="mb-6 lg:mb-0">
                                                <h2 className="text-3xl font-bold mb-2">Administrators</h2>
                                                <p className="text-indigo-100 text-lg">Manage your school administrators and their access</p>
                                                <div className="flex items-center mt-4 space-x-6">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                                        <span className="text-indigo-100 text-sm">
                                                            {admins.filter(a => a.status === 'active').length} Active
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                                                        <span className="text-indigo-100 text-sm">
                                                            {admins.filter(a => a.status === 'inactive').length} Inactive
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                                        <span className="text-indigo-100 text-sm">
                                                            {admins.filter(a => a.status === 'incomplete').length} Incomplete
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                                {selectedAdmins.length > 0 && (
                                                    <button
                                                        onClick={handleBulkDelete}
                                                        className="inline-flex items-center px-4 py-3 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm"
                                                    >
                                                        <FaTrash className="h-4 w-4 mr-2" />
                                                        Delete Selected ({selectedAdmins.length})
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleOpenAddModal}
                                                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-white bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 backdrop-blur-sm shadow-lg"
                                                >
                                                    <FaUserPlus className="h-5 w-5 mr-2" />
                                                    Add New Admin
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Search and Filters */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <div className="space-y-6">
                                            {/* Search Bar */}
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="block w-full pl-12 pr-12 py-4 text-base border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                                                    placeholder="Search administrators by name, email, or status..."
                                                />
                                                {searchQuery && (
                                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                                        <button
                                                            onClick={() => setSearchQuery('')}
                                                            className="text-gray-400 hover:text-gray-500 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                            aria-label="Clear search"
                                                        >
                                                            <FaTimes className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Filters Row */}
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                {/* Status Filters */}
                                                <div className="flex flex-wrap gap-3">
                                                    <span className="text-sm font-medium text-gray-700 self-center">Filter by:</span>
                                                    <button
                                                        onClick={() => setStatusFilter('all')}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${statusFilter === 'all'
                                                            ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-200'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                            }`}
                                                    >
                                                        All ({admins.length})
                                                    </button>
                                                    <button
                                                        onClick={() => setStatusFilter('active')}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${statusFilter === 'active'
                                                            ? 'bg-green-100 text-green-800 ring-2 ring-green-200'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                            }`}
                                                    >
                                                        Active ({admins.filter(a => a.status === 'active').length})
                                                    </button>
                                                    <button
                                                        onClick={() => setStatusFilter('inactive')}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ${statusFilter === 'inactive'
                                                            ? 'bg-red-100 text-red-800 ring-2 ring-red-200'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                            }`}
                                                    >
                                                        Inactive ({admins.filter(a => a.status === 'inactive').length})
                                                    </button>
                                                    <button
                                                        onClick={() => setStatusFilter('incomplete')}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 ${statusFilter === 'incomplete'
                                                            ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-200'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                            }`}
                                                    >
                                                        Incomplete ({admins.filter(a => a.status === 'incomplete').length})
                                                    </button>
                                                </div>

                                                {/* Rows per page selector */}
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium text-gray-700">Show:</span>
                                                    <Select2
                                                        value={rowsPerPage}
                                                        onChange={setRowsPerPage}
                                                        options={[
                                                            { value: 5, label: '5 per page' },
                                                            { value: 10, label: '10 per page' },
                                                            { value: 25, label: '25 per page' },
                                                            { value: 50, label: '50 per page' }
                                                        ]}
                                                        className="w-32"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Admins Table */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full divide-y divide-gray-200">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
                                                            <label className="sr-only">Select all administrators</label>
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                                                                checked={selectedAdmins.length === admins.length}
                                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                                aria-label="Select all administrators"
                                                            />
                                                        </th>
                                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                                                            #
                                                        </th>
                                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-0">
                                                            <button
                                                                onClick={() => handleSort('firstName')}
                                                                className="flex items-center focus:outline-none border-none hover:text-gray-800 transition-colors duration-200"
                                                            >
                                                                Administrator {getSortIcon('firstName')}
                                                            </button>
                                                        </th>
                                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-0">
                                                            <button
                                                                onClick={() => handleSort('email')}
                                                                className="flex items-center focus:outline-none border-none hover:text-gray-800 transition-colors duration-200"
                                                            >
                                                                Email {getSortIcon('email')}
                                                            </button>
                                                        </th>
                                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                                                            <button
                                                                onClick={() => handleSort('status')}
                                                                className="flex items-center focus:outline-none border-none hover:text-gray-800 transition-colors duration-200"
                                                            >
                                                                Status {getSortIcon('status')}
                                                            </button>
                                                        </th>
                                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                                                            <button
                                                                onClick={() => handleSort('date')}
                                                                className="flex items-center focus:outline-none border-none hover:text-gray-800 transition-colors duration-200"
                                                            >
                                                                Date {getSortIcon('date')}
                                                            </button>
                                                        </th>
                                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                                                            Usage
                                                        </th>
                                                        <th scope="col" className="px-3 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-100">
                                                    {getPaginatedData(sortData(admins)).map((admin, index) => (
                                                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <label className="sr-only">Select administrator {admin.firstName} {admin.lastName}</label>
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                                                                    checked={selectedAdmins.includes(admin.id)}
                                                                    onChange={() => handleSelectAdmin(admin.id)}
                                                                    aria-label={`Select administrator ${admin.firstName} ${admin.lastName}`}
                                                                />
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap">
                                                                <div className="flex items-center min-w-0">
                                                                    <div className="flex-shrink-0 h-10 w-10 relative">
                                                                        {admin.profileImage ? (
                                                                            <img
                                                                                src={admin.profileImage}
                                                                                alt={`${admin.firstName} ${admin.lastName}`}
                                                                                className="h-10 w-10 rounded-lg object-cover ring-2 ring-gray-100"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-100">
                                                                                <span className="text-white font-semibold text-sm">
                                                                                    {admin.firstName[0]}{admin.lastName[0]}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {/* Online/Offline indicator */}
                                                                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                                                                            admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                                        }`} />
                                                                    </div>
                                                                    <div className="ml-3 min-w-0 flex-1">
                                                                        <div className="text-sm font-semibold text-gray-900 truncate">
                                                                            {admin.firstName} {admin.lastName}
                                                                        </div>
                                                                        <div className="flex items-center mt-1">
                                                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                                                admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                                            }`} />
                                                                            <span className="text-xs text-gray-500 truncate">
                                                                                {admin.isOnline ? 'Online' : 'Offline'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900 truncate font-medium max-w-[200px]">{admin.email}</div>
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                                                    admin.status === 'active' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' :
                                                                    admin.status === 'inactive' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' :
                                                                    'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                                                                }`}>
                                                                    {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                                {new Date(admin.date).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </td>
                                                            <td className="px-3 py-4">
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <div className="flex items-center">
                                                                                <FaUserFriends className="h-3 w-3 text-pink-500 mr-1" />
                                                                                <span className="text-xs text-gray-600 font-medium">P</span>
                                                                            </div>
                                                                            <span className="text-xs font-bold text-gray-900">{admin.stats.parents}</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-100 rounded-full h-1">
                                                                            <div
                                                                                className="bg-gradient-to-r from-pink-500 to-rose-500 h-1 rounded-full transition-all duration-300"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <div className="flex items-center">
                                                                                <FaUserGraduate className="h-3 w-3 text-green-500 mr-1" />
                                                                                <span className="text-xs text-gray-600 font-medium">S</span>
                                                                            </div>
                                                                            <span className="text-xs font-bold text-gray-900">{admin.stats.students}</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-100 rounded-full h-1">
                                                                            <div
                                                                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full transition-all duration-300"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <div className="flex items-center">
                                                                                <FaChalkboardTeacher className="h-3 w-3 text-blue-500 mr-1" />
                                                                                <span className="text-xs text-gray-600 font-medium">T</span>
                                                                            </div>
                                                                            <span className="text-xs font-bold text-gray-900">{admin.stats.teachers}</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-100 rounded-full h-1">
                                                                            <div
                                                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full transition-all duration-300"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                    <button
                                                                        onClick={() => handleOpenEditModal(admin)}
                                                                        className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        title="Edit administrator"
                                                                    >
                                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                                        className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                                        title="Delete administrator"
                                                                    >
                                                                        <FaTrash className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Enhanced Pagination */}
                                        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-100">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(Math.min(currentPage + 1, getTotalPages(filterAdmins(admins))))}
                                                    disabled={currentPage === getTotalPages(filterAdmins(admins))}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Showing{' '}
                                                        <span className="font-semibold">
                                                            {(currentPage - 1) * rowsPerPage + 1}
                                                        </span>{' '}
                                                        to{' '}
                                                        <span className="font-semibold">
                                                            {Math.min(currentPage * rowsPerPage, filterAdmins(admins).length)}
                                                        </span>{' '}
                                                        of{' '}
                                                        <span className="font-semibold">{filterAdmins(admins).length}</span>{' '}
                                                        results
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                                                        <button
                                                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                                            disabled={currentPage === 1}
                                                            className="focus:outline-none relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                        >
                                                            <span className="sr-only">Previous</span>
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                        {Array.from({ length: getTotalPages(filterAdmins(admins)) }, (_, i) => i + 1).map((page) => (
                                                            <button
                                                                key={page}
                                                                onClick={() => setCurrentPage(page)}
                                                                className={`focus:outline-none relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                                                                    currentPage === page
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 ring-2 ring-indigo-200'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                                                }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        ))}
                                                        <button
                                                            onClick={() => setCurrentPage(Math.min(currentPage + 1, getTotalPages(filterAdmins(admins))))}
                                                            disabled={currentPage === getTotalPages(filterAdmins(admins))}
                                                            className="focus:outline-none relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                        >
                                                            <span className="sr-only">Next</span>
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Notifications Tab Content */}
                            {notificationsActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                                                <p className="mt-1 text-sm text-gray-500">View and manage your notifications</p>
                                            </div>
                                            <div className="flex space-x-3">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={notificationSearchQuery}
                                                        onChange={(e) => setNotificationSearchQuery(e.target.value)}
                                                        placeholder="Search notifications..."
                                                        className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                    {notificationSearchQuery && (
                                                        <button
                                                            onClick={() => setNotificationSearchQuery('')}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                            aria-label="Clear search"
                                                        >
                                                            <FaTimes className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        // Get filtered notifications
                                                        const filteredNotifications = notifications.filter(notification => {
                                                            // Apply search filter
                                                            if (notificationSearchQuery) {
                                                                const searchLower = notificationSearchQuery.toLowerCase();
                                                                const matchesSearch =
                                                                    notification.title.toLowerCase().includes(searchLower) ||
                                                                    notification.message.toLowerCase().includes(searchLower);
                                                                if (!matchesSearch) return false;
                                                            }
                                                            // Apply type filter
                                                            if (notificationTypeFilter.length > 0 && !notificationTypeFilter.includes(notification.type)) {
                                                                return false;
                                                            }
                                                            // Apply read status filter
                                                            if (notificationReadFilter.length > 0) {
                                                                if (notificationReadFilter.includes('read') && !notification.read) {
                                                                    return false;
                                                                }
                                                                if (notificationReadFilter.includes('unread') && notification.read) {
                                                                    return false;
                                                                }
                                                            }
                                                            // Apply date range filter
                                                            const notificationDate = new Date(notification.time);
                                                            if (startDate && startDate > notificationDate) {
                                                                return false;
                                                            }
                                                            if (endDate) {
                                                                const endOfDay = new Date(endDate);
                                                                endOfDay.setHours(23, 59, 59, 999);
                                                                if (endOfDay < notificationDate) {
                                                                    return false;
                                                                }
                                                            }
                                                            return true;
                                                        });

                                                        // Mark only filtered notifications as read
                                                        filteredNotifications.forEach(notification => {
                                                            markAsRead(notification.id);
                                                        });
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Mark all as read
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        // Get filtered notifications count
                                                        const filteredNotifications = notifications.filter(notification => {
                                                            // Apply search filter
                                                            if (notificationSearchQuery) {
                                                                const searchLower = notificationSearchQuery.toLowerCase();
                                                                const matchesSearch =
                                                                    notification.title.toLowerCase().includes(searchLower) ||
                                                                    notification.message.toLowerCase().includes(searchLower);
                                                                if (!matchesSearch) return false;
                                                            }
                                                            // Apply type filter
                                                            if (notificationTypeFilter.length > 0 && !notificationTypeFilter.includes(notification.type)) {
                                                                return false;
                                                            }
                                                            // Apply read status filter
                                                            if (notificationReadFilter.length > 0) {
                                                                if (notificationReadFilter.includes('read') && !notification.read) {
                                                                    return false;
                                                                }
                                                                if (notificationReadFilter.includes('unread') && notification.read) {
                                                                    return false;
                                                                }
                                                            }
                                                            // Apply date range filter
                                                            const notificationDate = new Date(notification.time);
                                                            if (startDate && startDate > notificationDate) {
                                                                return false;
                                                            }
                                                            if (endDate) {
                                                                const endOfDay = new Date(endDate);
                                                                endOfDay.setHours(23, 59, 59, 999);
                                                                if (endOfDay < notificationDate) {
                                                                    return false;
                                                                }
                                                            }
                                                            return true;
                                                        });

                                                        const result = await Swal.fire({
                                                            title: 'Clear Notifications',
                                                            text: `Are you sure you want to clear ${filteredNotifications.length} notification${filteredNotifications.length === 1 ? '' : 's'}?`,
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#4F46E5',
                                                            cancelButtonColor: '#EF4444',
                                                            confirmButtonText: 'Clear',
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
                                                            // Delete only the filtered notifications
                                                            filteredNotifications.forEach(notification => {
                                                                deleteNotification(notification.id);
                                                            });
                                                        }
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>

                                        {/* Notification Filters */}
                                        <div className="mb-6 space-y-4">
                                            <div className="flex flex-wrap gap-4">
                                                {/* Type Filter */}
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Filter by Type
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => {
                                                                if (notificationTypeFilter.includes('info')) {
                                                                    setNotificationTypeFilter(prev => prev.filter(type => type !== 'info'));
                                                                } else {
                                                                    setNotificationTypeFilter(prev => [...prev, 'info']);
                                                                }
                                                            }}
                                                            className={`px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${notificationTypeFilter.includes('info')
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            Info
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (notificationTypeFilter.includes('warning')) {
                                                                    setNotificationTypeFilter(prev => prev.filter(type => type !== 'warning'));
                                                                } else {
                                                                    setNotificationTypeFilter(prev => [...prev, 'warning']);
                                                                }
                                                            }}
                                                            className={`px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${notificationTypeFilter.includes('warning')
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            Warning
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (notificationTypeFilter.includes('success')) {
                                                                    setNotificationTypeFilter(prev => prev.filter(type => type !== 'success'));
                                                                } else {
                                                                    setNotificationTypeFilter(prev => [...prev, 'success']);
                                                                }
                                                            }}
                                                            className={`px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${notificationTypeFilter.includes('success')
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            Success
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Read Status Filter */}
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Filter by Status
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => setNotificationReadFilter([])}
                                                            className={`px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 ${notificationReadFilter.length === 0
                                                                ? 'bg-gray-200 text-gray-900 ring-2 ring-gray-300'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            All
                                                        </button>
                                                        <button
                                                            onClick={() => setNotificationReadFilter(['read'])}
                                                            className={`px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 ${notificationReadFilter.includes('read')
                                                                ? 'bg-gray-200 text-gray-900 ring-2 ring-gray-300'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            Read
                                                        </button>
                                                        <button
                                                            onClick={() => setNotificationReadFilter(['unread'])}
                                                            className={`px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${notificationReadFilter.includes('unread')
                                                                ? 'bg-indigo-200 text-indigo-900 ring-2 ring-indigo-300'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            Unread
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Date Range Filter */}
                                                <div className="flex-1 min-w-[200px]">
                                                    <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Filter by Date Range
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="flex-1">
                                                            <DatePicker
                                                                selected={startDate}
                                                                onChange={(dates) => setDateRange(dates)}
                                                                startDate={startDate}
                                                                endDate={endDate}
                                                                selectsRange
                                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                placeholderText="Select date range"
                                                                dateFormat="MMM d, yyyy"
                                                                isClearable
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                                maxDate={new Date()}
                                                                customInput={
                                                                    <div className="relative">
                                                                        <input
                                                                            type="text"
                                                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                            placeholder="Select date range"
                                                                            readOnly
                                                                        />
                                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                                                                        </div>
                                                                    </div>
                                                                }
                                                            />
                                                        </div>
                                                        {(startDate || endDate) && (
                                                            <button
                                                                onClick={() => setDateRange([null, null])}
                                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                aria-label="Clear date range"
                                                            >
                                                                Clear
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Filter Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => {
                                                        const today = new Date();
                                                        const sevenDaysAgo = new Date(today);
                                                        sevenDaysAgo.setDate(today.getDate() - 7);
                                                        setDateRange([sevenDaysAgo, today]);
                                                    }}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${startDate && endDate &&
                                                        new Date(startDate).getTime() === new Date(new Date().setDate(new Date().getDate() - 7)).getTime() &&
                                                        new Date(endDate).toDateString() === new Date().toDateString()
                                                        ? 'bg-green-200 text-green-900 ring-2 ring-green-300'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    Last 7 Days
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setNotificationTypeFilter([]);
                                                        setNotificationReadFilter([]);
                                                        setDateRange([null, null]);
                                                    }}
                                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                >
                                                    Clear All Filters
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {Object.entries([...notifications]
                                                .filter(notification => {
                                                    // Apply search filter
                                                    if (notificationSearchQuery) {
                                                        const searchLower = notificationSearchQuery.toLowerCase();
                                                        const matchesSearch =
                                                            notification.title.toLowerCase().includes(searchLower) ||
                                                            notification.message.toLowerCase().includes(searchLower);
                                                        if (!matchesSearch) return false;
                                                    }
                                                    // Apply type filter
                                                    if (notificationTypeFilter.length > 0 && !notificationTypeFilter.includes(notification.type)) {
                                                        return false;
                                                    }
                                                    // Apply read status filter
                                                    if (notificationReadFilter.length > 0) {
                                                        if (notificationReadFilter.includes('read') && !notification.read) {
                                                            return false;
                                                        }
                                                        if (notificationReadFilter.includes('unread') && notification.read) {
                                                            return false;
                                                        }
                                                    }
                                                    // Apply date range filter
                                                    const notificationDate = new Date(notification.time);
                                                    if (startDate && startDate > notificationDate) {
                                                        return false;
                                                    }
                                                    if (endDate) {
                                                        const endOfDay = new Date(endDate);
                                                        endOfDay.setHours(23, 59, 59, 999);
                                                        if (endOfDay < notificationDate) {
                                                            return false;
                                                        }
                                                    }
                                                    return true;
                                                })
                                                .sort((a, b) => {
                                                    // First sort by read status (unread first)
                                                    if (a.read !== b.read) {
                                                        return a.read ? 1 : -1;
                                                    }
                                                    // Then sort by time (newest first)
                                                    return new Date(b.time).getTime() - new Date(a.time).getTime();
                                                })
                                                .reduce<Record<string, Notification[]>>((groups, notification) => {
                                                    const notificationDate = new Date(notification.time);
                                                    const today = new Date();
                                                    const yesterday = new Date(today);
                                                    yesterday.setDate(yesterday.getDate() - 1);

                                                    let dateKey: string;

                                                    // Check if the notification is from today
                                                    if (notificationDate.toDateString() === today.toDateString()) {
                                                        dateKey = 'Today';
                                                    }
                                                    // Check if the notification is from yesterday
                                                    else if (notificationDate.toDateString() === yesterday.toDateString()) {
                                                        dateKey = 'Yesterday';
                                                    }
                                                    // For other dates, use the full date format
                                                    else {
                                                        dateKey = notificationDate.toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        });
                                                    }

                                                    if (!groups[dateKey]) {
                                                        groups[dateKey] = [];
                                                    }
                                                    groups[dateKey].push(notification);
                                                    return groups;
                                                }, {}))
                                                .map(([date, notifications]) => (
                                                    <div key={date} className="space-y-4">
                                                        <div
                                                            className="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
                                                            onClick={() => toggleDateGroup(date)}
                                                        >
                                                            <div className="flex-1 border-t border-gray-200" />
                                                            <div className="px-4 flex items-center">
                                                                <span className="text-sm font-medium text-gray-500">{date}</span>
                                                                <span className="ml-2 text-xs text-gray-400">
                                                                    ({notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'})
                                                                </span>
                                                                <motion.div
                                                                    animate={{ rotate: expandedDates.has(date) ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="ml-2"
                                                                >
                                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </motion.div>
                                                            </div>
                                                            <div className="flex-1 border-t border-gray-200" />
                                                        </div>
                                                        <motion.div
                                                            initial={false}
                                                            animate={{
                                                                height: expandedDates.has(date) ? 'auto' : 0,
                                                                opacity: expandedDates.has(date) ? 1 : 0
                                                            }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="space-y-4">
                                                                {notifications.map((notification: Notification) => (
                                                                    <div
                                                                        key={notification.id}
                                                                        className={`p-4 rounded-lg border ${notification.read ? 'bg-white border-gray-200' : 'bg-indigo-50 border-indigo-100'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-start">
                                                                            <div className={`p-2 rounded-lg mr-4 ${notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                                                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                                                    'bg-green-100 text-green-600'
                                                                                }`}>
                                                                                <notification.icon className="h-5 w-5" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center justify-between">
                                                                                    <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {new Date(notification.time).toLocaleString('en-US', {
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        })}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                                                                                <div className="mt-3 flex space-x-3">
                                                                                    {!notification.read && (
                                                                                        <button
                                                                                            onClick={() => markAsRead(notification.id)}
                                                                                            className="focus:outline-none text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                                                                        >
                                                                                            Mark as read
                                                                                        </button>
                                                                                    )}
                                                                                    <button
                                                                                        onClick={async () => {
                                                                                            const result = await Swal.fire({
                                                                                                title: 'Delete Notification',
                                                                                                text: "Are you sure you want to delete this notification?",
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
                                                                                                deleteNotification(notification.id);
                                                                                            }
                                                                                        }}
                                                                                        className="focus:outline-none text-xs text-red-600 hover:text-red-800 font-medium"
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* chat Tab Content */}
                            {chatActive && (
                                <ChatTab />
                            )}

                            {/* Calendar Tab Content */}
                            {activeTab === 'calendar' && (
                                <div className="bg-white rounded-lg shadow-sm p-6">

                                </div>
                            )}
                        </div>
                    </div>
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