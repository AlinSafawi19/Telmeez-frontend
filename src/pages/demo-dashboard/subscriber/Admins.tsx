import { useState, useEffect } from 'react';
import SubscriberDashboardLayout from './SubscriberDashboardLayout';
import { useUser } from '../../../contexts/UserContext';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaUserShield, FaCircle, FaEdit, FaTrash, FaCheck, FaTimes, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaCrown, FaFilter, FaClock, FaAngleDown, FaLayerGroup, FaCalendarAlt, FaToggleOn, FaExchangeAlt } from 'react-icons/fa';
import Select2 from '../../../components/Select2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from 'react-dom';

// Custom styles for react-datepicker to prevent cutoff
const datePickerStyles = `
  .react-datepicker-popper {
    z-index: 9999 !important;
    position: absolute !important;
  }
  
  .react-datepicker-wrapper {
    position: relative;
  }
  
  .react-datepicker__input-container {
    position: relative;
  }
  
  .react-datepicker__calendar-container {
    z-index: 9999 !important;
    position: absolute !important;
    background: white !important;
    border: 1px solid #ccc !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
  }
  
  .react-datepicker__month-container {
    z-index: 9999 !important;
  }
  
  .react-datepicker__header {
    z-index: 9999 !important;
  }
  
  .react-datepicker__month {
    z-index: 9999 !important;
  }
  
  .react-datepicker__day {
    z-index: 9999 !important;
  }
  
  .react-datepicker__day:hover {
    background-color: #f0f0f0 !important;
  }
  
  .react-datepicker__day--selected {
    background-color: #0066cc !important;
    color: white !important;
  }
  
  .react-datepicker__day--in-range {
    background-color: #e6f3ff !important;
  }
  
  .react-datepicker__day--keyboard-selected {
    background-color: #0066cc !important;
    color: white !important;
  }
  
  .react-datepicker__navigation {
    z-index: 9999 !important;
  }
  
  .react-datepicker__current-month {
    z-index: 9999 !important;
  }
  
  .react-datepicker__month-dropdown-container,
  .react-datepicker__year-dropdown-container {
    z-index: 9999 !important;
  }
`;

const PopperContainer = (props: { children?: React.ReactNode }) => {
    return ReactDOM.createPortal(props.children, document.body);
};

const statusColors: Record<string, string> = {
    Active: 'text-green-500',
    Inactive: 'text-gray-400',
    Pending: 'text-yellow-500',
};

type SortField = 'name' | 'email' | 'status' | 'phone' | 'department';
type SortDirection = 'asc' | 'desc';

const Admins: React.FC = () => {
    const { subscriber, updateSubscriber } = useUser();
    const [search, setSearch] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showMaxLimitModal, setShowMaxLimitModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedAdminForTransfer, setSelectedAdminForTransfer] = useState<any>(null);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<number>(0);
    const [departmentFilter, setDepartmentFilter] = useState<number>(0);
    const [onlineFilter, setOnlineFilter] = useState<number>(0);

    // Date range filter states
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [dateFilterType, setDateFilterType] = useState<'created' | 'last_login'>('created');
    const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

    // Add admin form state
    const [newAdmin, setNewAdmin] = useState({
        first_name: '',
        last_name: '',
        email: '',
        department_id: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Transfer department form state
    const [transferForm, setTransferForm] = useState({
        department_id: 0
    });
    const [isTransferring, setIsTransferring] = useState(false);

    // Add validation states
    const [validationErrors, setValidationErrors] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    // Transfer validation states
    const [transferValidationErrors, setTransferValidationErrors] = useState({
        department_id: ''
    });

    // Inject custom CSS for datepicker
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = datePickerStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const admins = subscriber?.admins || [];
    const adminProfiles = subscriber?.adminProfileImages || [];
    const userStatuses = subscriber?.user_statuses || [];
    const plans = subscriber?.plans || [];
    const payments = subscriber?.payments || [];
    const departments = subscriber?.departments || [];

    // Get current plan based on latest payment
    const getCurrentPlan = () => {
        if (payments.length === 0) return null;

        // Sort payments by creation date to get the latest
        const latestPayment = payments.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        return plans.find(plan => plan.id === latestPayment.plan_id);
    };

    const currentPlan = getCurrentPlan();
    const maxAdmins = currentPlan?.max_admin;
    const isAtMaxLimit = maxAdmins !== null && maxAdmins !== undefined && admins.length >= maxAdmins;
    const isNearLimit = maxAdmins !== null && maxAdmins !== undefined && admins.length >= maxAdmins * 0.8; // 80% of limit

    const getProfileImage = (adminId: string) =>
        adminProfiles.find((img) => img.user_id === adminId)?.file_url ||
        'https://ui-avatars.com/api/?name=Admin';
    const getStatus = (statusId: string) => userStatuses.find((s) => s.id === statusId)?.name || 'Active';

    const getDepartmentName = (adminId: string) => {
        const department = departments.find((dept) => dept.head_of_department_id === adminId);
        return department?.name || 'N/A';
    };

    const getLoggedInUserTimezone = (): string => {
        return subscriber?.preferences?.timezone || 'UTC';
    };

    const formatTimezone = (timezone: string): string => {
        // Convert timezone to a more readable format
        const timezoneMap: Record<string, string> = {
            'America/New_York': 'EST/EDT',
            'America/Chicago': 'CST/CDT',
            'America/Denver': 'MST/MDT',
            'America/Los_Angeles': 'PST/PDT',
            'Europe/London': 'GMT/BST',
            'Europe/Paris': 'CET/CEST',
            'Asia/Beirut': 'EET/EEST',
            'Asia/Tokyo': 'JST',
            'UTC': 'UTC'
        };

        return timezoneMap[timezone] || timezone.split('/').pop()?.replace('_', ' ') || timezone;
    };

    const convertToUserTimezone = (date: Date, timezone: string): Date => {
        try {
            const userDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
            return userDate;
        } catch (error) {
            console.warn('Invalid timezone, using UTC:', timezone);
            return date;
        }
    };

    const isDateInRange = (date: Date, start: Date | null, end: Date | null, timezone: string): boolean => {
        if (!start && !end) return true;

        const userDate = convertToUserTimezone(date, timezone);
        const userStart = start ? convertToUserTimezone(start, timezone) : null;
        const userEnd = end ? convertToUserTimezone(end, timezone) : null;

        if (userStart && userDate < userStart) return false;
        if (userEnd && userDate > userEnd) return false;

        return true;
    };

    // Quick date filter functions
    const setLast7Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        setStartDate(start);
        setEndDate(end);
        setActiveQuickFilter('Last 7 Days');
        setCurrentPage(1);
    };

    const setLast3Months = () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        setStartDate(start);
        setEndDate(end);
        setActiveQuickFilter('Last 3 Months');
        setCurrentPage(1);
    };

    const clearDateFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setActiveQuickFilter(null);
        setCurrentPage(1);
    };

    // Filter options - moved before filteredAdmins function
    const statusOptions = [
        { value: 0, label: 'All Statuses' },
        ...userStatuses.map((status, index) => ({
            value: index + 1,
            label: status.name
        }))
    ];

    const departmentFilterOptions = [
        { value: 0, label: 'All Departments' },
        ...departments.map((dept, index) => ({
            value: index + 1,
            label: dept.name
        })),
        { value: departments.length + 1, label: 'N/A' }
    ];

    const onlineOptions = [
        { value: 0, label: 'All' },
        { value: 1, label: 'Online' },
        { value: 2, label: 'Offline' }
    ];

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <FaSort className="text-gray-400" />;
        }
        return sortDirection === 'asc' ? <FaSortUp className="text-purple-600" /> : <FaSortDown className="text-purple-600" />;
    };

    const sortAdmins = (adminsToSort: typeof admins) => {
        return [...adminsToSort].sort((a, b) => {
            let aValue: string;
            let bValue: string;

            switch (sortField) {
                case 'name':
                    aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
                    bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
                    break;
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'status':
                    aValue = getStatus(a.user_status_id).toLowerCase();
                    bValue = getStatus(b.user_status_id).toLowerCase();
                    break;
                case 'phone':
                    aValue = a.phone.toLowerCase();
                    bValue = b.phone.toLowerCase();
                    break;
                case 'department':
                    aValue = getDepartmentName(a.id).toLowerCase();
                    bValue = getDepartmentName(b.id).toLowerCase();
                    break;
                default:
                    aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
                    bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const filteredAdmins = admins.filter((admin) => {
        const fullName = `${admin.first_name} ${admin.last_name}`.toLowerCase();
        const email = admin.email.toLowerCase();
        const status = getStatus(admin.user_status_id);
        const department = getDepartmentName(admin.id);
        const isOnline = admin.is_online;

        // Search filter
        const matchesSearch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());

        // Status filter - fixed logic
        const selectedStatusOption = statusOptions[statusFilter];
        const matchesStatus = statusFilter === 0 || status === selectedStatusOption?.label;

        // Department filter - fixed logic
        const selectedDepartmentOption = departmentFilterOptions[departmentFilter];
        const matchesDepartment = departmentFilter === 0 ||
            (departmentFilter <= departments.length
                ? department === selectedDepartmentOption?.label
                : department === 'N/A');

        // Online filter - fixed logic
        let matchesOnline = true;
        if (onlineFilter === 1) {
            matchesOnline = isOnline;
        } else if (onlineFilter === 2) {
            matchesOnline = !isOnline;
        }
        // When onlineFilter is 0 (All), matchesOnline remains true

        // Date range filter with timezone support
        const loggedInUserTimezone = getLoggedInUserTimezone();
        let matchesDateRange = true;

        if (startDate || endDate) {
            const dateToCheck = dateFilterType === 'created' ? admin.createdAt : admin.last_login;
            matchesDateRange = isDateInRange(dateToCheck, startDate, endDate, loggedInUserTimezone);
        }

        return matchesSearch && matchesStatus && matchesDepartment && matchesOnline && matchesDateRange;
    });

    const sortedAdmins = sortAdmins(filteredAdmins);

    // Pagination logic
    const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAdmins = sortedAdmins.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Reset to first page when search, filters, or itemsPerPage changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // Filter change handlers
    const handleStatusFilterChange = (value: number) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleDepartmentFilterChange = (value: number) => {
        setDepartmentFilter(value);
        setCurrentPage(1);
    };

    const handleOnlineFilterChange = (value: number) => {
        setOnlineFilter(value);
        setCurrentPage(1);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setStatusFilter(0);
        setDepartmentFilter(0);
        setOnlineFilter(0);
        setStartDate(null);
        setEndDate(null);
        setActiveQuickFilter(null);
        setCurrentPage(1);
    };

    // Check if any filters are active
    const hasActiveFilters = statusFilter > 0 || departmentFilter > 0 || onlineFilter > 0 || startDate || endDate;

    const handleEditAdmin = (adminId: string) => {
        console.log('Editing admin:', adminId);
        // TODO: Implement edit admin functionality
    };

    const handleTransferDepartment = (admin: any) => {
        setSelectedAdminForTransfer(admin);
        setTransferForm({ department_id: 0 });
        setTransferValidationErrors({ department_id: '' });
        setShowTransferModal(true);
    };

    const validateTransferForm = (): boolean => {
        const errors = {
            department_id: ''
        };

        if (!transferForm.department_id) {
            errors.department_id = 'Please select a department';
        }

        setTransferValidationErrors(errors);
        return !Object.values(errors).some(error => error !== '');
    };

    const handleTransferInputChange = (field: string, value: number) => {
        setTransferForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error for this field when user starts typing
        if (transferValidationErrors[field as keyof typeof transferValidationErrors]) {
            setTransferValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const getCurrentHeadInfo = (departmentId: number) => {
        if (!departmentId) return null;
        const selectedDepartment = departments[departmentId - 1];
        if (!selectedDepartment || !selectedDepartment.head_of_department_id) return null;
        
        const headAdmin = admins.find(admin => admin.id === selectedDepartment.head_of_department_id);
        return headAdmin ? {
            name: `${headAdmin.first_name} ${headAdmin.last_name}`,
            email: headAdmin.email,
            id: headAdmin.id
        } : null;
    };

    const handleTransferAdmin = async () => {
        if (!validateTransferForm() || !selectedAdminForTransfer) {
            return;
        }

        setIsTransferring(true);
        try {
            // Find the selected department
            const selectedDepartment = departments[transferForm.department_id - 1];
            if (!selectedDepartment) {
                throw new Error('Selected department not found');
            }

            // Update subscriber data
            if (subscriber) {
                const updatedSubscriber = { ...subscriber };

                // Remove admin from current department head position
                updatedSubscriber.departments = (subscriber.departments || []).map(dept =>
                    dept.head_of_department_id === selectedAdminForTransfer.id
                        ? { ...dept, head_of_department_id: '' }
                        : dept
                );

                // Set admin as head of the new department
                updatedSubscriber.departments = updatedSubscriber.departments.map(dept =>
                    dept.id === selectedDepartment.id
                        ? { ...dept, head_of_department_id: selectedAdminForTransfer.id }
                        : dept
                );

                updateSubscriber(updatedSubscriber);
            }

            // Reset form and close modal
            setTransferForm({ department_id: 0 });
            setTransferValidationErrors({ department_id: '' });
            setSelectedAdminForTransfer(null);
            setShowTransferModal(false);
        } catch (error) {
            console.error('Error transferring admin:', error);
            alert('Failed to transfer admin. Please try again.');
        } finally {
            setIsTransferring(false);
        }
    };

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const errors = {
            first_name: '',
            last_name: '',
            email: ''
        };

        // Validate first name
        if (!newAdmin.first_name.trim()) {
            errors.first_name = 'First name is required';
        } else if (newAdmin.first_name.trim().length < 2) {
            errors.first_name = 'First name must be at least 2 characters';
        }

        // Validate last name
        if (!newAdmin.last_name.trim()) {
            errors.last_name = 'Last name is required';
        } else if (newAdmin.last_name.trim().length < 2) {
            errors.last_name = 'Last name must be at least 2 characters';
        }

        // Validate email
        if (!newAdmin.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(newAdmin.email.trim())) {
            errors.email = 'Please enter a valid email address';
        }

        setValidationErrors(errors);

        // Return true if all validations pass
        return !Object.values(errors).some(error => error !== '');
    };

    const handleInputChange = (field: string, value: string | number) => {
        setNewAdmin(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error for this field when user starts typing
        if (validationErrors[field as keyof typeof validationErrors]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleDeleteAdmin = (adminId: string) => {
        console.log('Deleting admin:', adminId);
        setShowDeleteConfirm(null);

        // Remove admin from subscriber data
        if (subscriber) {
            const updatedSubscriber = {
                ...subscriber,
                admins: (subscriber.admins || []).filter(admin => admin.id !== adminId),
                adminProfileImages: (subscriber.adminProfileImages || []).filter(img => img.user_id !== adminId),
                adminPreferences: (subscriber.adminPreferences || []).filter(pref => pref.user_id !== adminId)
            };

            // If this admin was a head of department, remove them from that role
            updatedSubscriber.departments = (subscriber.departments || []).map(dept =>
                dept.head_of_department_id === adminId
                    ? { ...dept, head_of_department_id: '' }
                    : dept
            );

            updateSubscriber(updatedSubscriber);
        }
    };

    const handleAddAdminClick = () => {
        if (isAtMaxLimit) {
            setShowMaxLimitModal(true);
        } else {
            setShowAddModal(true);
        }
    };

    const handleUpgradePlan = () => {
        setShowMaxLimitModal(false);
        // TODO: Navigate to upgrade page or open upgrade modal
        console.log('Navigate to upgrade page');
        // For demo purposes, you could navigate to a pricing page
        // window.location.href = '/pricing';
        // Or open an upgrade modal
        alert('Upgrade functionality would be implemented here');
    };

    const handleAddAdmin = async () => {
        // Validate form first
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            // Create new admin object
            const adminId = `demo-user-${Date.now()}`;
            const newAdminUser = {
                id: adminId,
                first_name: newAdmin.first_name,
                last_name: newAdmin.last_name,
                email: newAdmin.email,
                country_code: '',
                phone: '',
                password: 'hashed_password_here',
                subscriber_id: subscriber?.id || '',
                user_status_id: 'status_003', // Pending by default
                role_id: 'role_002', // Admin role
                user_preference_id: `pref-${adminId}`,
                is_online: false,
                is_verified: true,
                last_login: new Date(),
                primary_address: '',
                secondary_address: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                profile_image_id: `demo-profile-${adminId}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: subscriber?.user?.id || '',
                updatedBy: subscriber?.user?.id || ''
            };

            // Create profile image for new admin (no default image)
            const newProfileImage = {
                id: `demo-profile-${adminId}`,
                user_id: adminId,
                file_name: `${newAdmin.first_name.toLowerCase()}-${newAdmin.last_name.toLowerCase()}-profile.jpg`,
                file_type: 'image/jpeg',
                file_url: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${newAdmin.first_name} ${newAdmin.last_name}`),
                uploaded_at: new Date(),
                uploaded_by: adminId,
                is_active: true
            };

            // Create preference for new admin
            const newPreference = {
                id: `pref-${adminId}`,
                language: 'en',
                user_id: adminId,
                timezone: 'America/New_York',
                updatedAt: new Date(),
                createdAt: new Date()
            };

            // Update subscriber with new admin
            if (subscriber) {
                const updatedSubscriber = {
                    ...subscriber,
                    admins: [...(subscriber.admins || []), newAdminUser],
                    adminProfileImages: [...(subscriber.adminProfileImages || []), newProfileImage],
                    adminPreferences: [...(subscriber.adminPreferences || []), newPreference]
                };

                // If department is selected, update the department's head
                if (newAdmin.department_id > 0) {
                    const selectedDepartment = departments[newAdmin.department_id - 1];
                    if (selectedDepartment) {
                        updatedSubscriber.departments = (subscriber.departments || []).map(dept =>
                            dept.id === selectedDepartment.id
                                ? { ...dept, head_of_department_id: adminId }
                                : dept
                        );
                    }
                }

                updateSubscriber(updatedSubscriber);
            }

            // Reset form and close modal
            setNewAdmin({
                first_name: '',
                last_name: '',
                email: '',
                department_id: 0
            });
            setValidationErrors({
                first_name: '',
                last_name: '',
                email: ''
            });
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Failed to add admin. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Options for items per page dropdown
    const itemsPerPageOptions = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 25, label: '25' },
        { value: 50, label: '50' },
        { value: 100, label: '100' }
    ];

    // Options for department dropdown
    const departmentOptions = departments
        .map((dept, originalIndex) => ({
            dept,
            originalIndex: originalIndex + 1
        }))
        .filter(item => !item.dept.head_of_department_id) // Only show departments without a head
        .map(item => ({
            value: item.originalIndex,
            label: item.dept.name
        }));

    // Options for department dropdown in transfer modal
    const transferDepartmentOptions = departments
        .map((dept, originalIndex) => ({
            value: originalIndex + 1,
            label: dept.name,
            hasHead: !!dept.head_of_department_id,
            currentHeadId: dept.head_of_department_id,
            currentHeadName: dept.head_of_department_id ? 
                (() => {
                    const headAdmin = admins.find(admin => admin.id === dept.head_of_department_id);
                    return headAdmin ? `${headAdmin.first_name} ${headAdmin.last_name}` : 'Unknown Admin';
                })() : null
        }))
        .filter(option => option.hasHead !== selectedAdminForTransfer?.id); // Show all departments except where this admin is already head

    // Quick filter options
    const quickFilters = [
        { label: 'All Admins', action: () => clearAllFilters(), active: !hasActiveFilters },
        { label: 'Online Only', action: () => handleOnlineFilterChange(1), active: onlineFilter === 1 },
        { label: 'Offline Only', action: () => handleOnlineFilterChange(2), active: onlineFilter === 2 },
        { label: 'Active Status', action: () => handleStatusFilterChange(1), active: statusFilter === 1 },
        { label: 'Inactive Status', action: () => handleStatusFilterChange(2), active: statusFilter === 2 },
        { label: 'Pending Status', action: () => handleStatusFilterChange(3), active: statusFilter === 3 },
        { 
            label: 'Last 7 Days', 
            action: setLast7Days, 
            active: activeQuickFilter === 'Last 7 Days'
        },
        { 
            label: 'Last 3 Months', 
            action: setLast3Months, 
            active: activeQuickFilter === 'Last 3 Months'
        },
    ];

    return (
        <SubscriberDashboardLayout>
            <div className="p-6 mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`rounded-xl shadow-lg px-6 py-4 flex items-center gap-6 w-full md:w-auto ${isAtMaxLimit
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            : isNearLimit
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                            }`}
                    >
                        <FaUserShield className="text-3xl" />
                        <div className="flex-1">
                            <div className="text-xl font-bold flex items-center gap-2">
                                {admins.length}/{maxAdmins || '∞'}
                                {isAtMaxLimit && <FaExclamationTriangle className="text-yellow-300" />}
                                {isNearLimit && !isAtMaxLimit && <FaExclamationTriangle className="text-yellow-300" />}
                            </div>
                            <div className="text-xs font-medium">
                                {isAtMaxLimit ? 'Maximum Admins Reached' : 'Total Admins'}
                            </div>
                            {isNearLimit && !isAtMaxLimit && maxAdmins && (
                                <div className="text-xs opacity-90 mt-1">
                                    {maxAdmins - admins.length} admin{maxAdmins - admins.length !== 1 ? 's' : ''} remaining
                                </div>
                            )}
                        </div>
                        {isAtMaxLimit && (
                            <button
                                onClick={handleUpgradePlan}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none border-none shadow-sm"
                            >
                                <FaCrown className="text-yellow-500" />
                                Upgrade
                            </button>
                        )}
                    </motion.div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search admins..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            onClick={handleAddAdminClick}
                            disabled={isAtMaxLimit}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition focus:outline-none border-none ${isAtMaxLimit
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                        >
                            <FaUserPlus />
                            <span>{isAtMaxLimit ? 'Max Reached' : 'Add Admin'}</span>
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    {/* Compact Filter Header */}
                    <div>
                        <div className="flex items-center justify-between">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                                className="flex items-center gap-3 flex-1 cursor-pointer focus:outline-none bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <FaFilter className="text-white text-sm" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        Filters
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                            {hasActiveFilters ? `${filteredAdmins.length}/${admins.length}` : 'All'}
                                        </span>
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: isFiltersExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaAngleDown className="text-purple-600 text-sm" />
                                    </motion.div>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Collapsible Filter Content */}
                    <motion.div
                        initial={false}
                        animate={{
                            height: isFiltersExpanded ? 'auto' : 0,
                            opacity: isFiltersExpanded ? 1 : 0
                        }}
                        transition={{
                            height: { duration: 0.3, ease: 'easeInOut' },
                            opacity: { duration: 0.2, ease: 'easeInOut' }
                        }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                            {/* Main Filters in Single Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FaCircle className="text-green-500 text-xs" />
                                        Status
                                    </label>
                                    <div className="relative">
                                        <Select2
                                            options={statusOptions}
                                            value={statusFilter}
                                            onChange={handleStatusFilterChange}
                                            placeholder="All Statuses"
                                            className="w-full text-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl pl-10"
                                        />
                                        <FaCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-sm" />
                                    </div>
                                </div>

                                {/* Department Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FaLayerGroup className="text-blue-500 text-xs" />
                                        Department
                                    </label>
                                    <div className="relative">
                                        <Select2
                                            options={departmentFilterOptions}
                                            value={departmentFilter}
                                            onChange={handleDepartmentFilterChange}
                                            placeholder="All Departments"
                                            className="w-full text-sm bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl pl-10"
                                        />
                                        <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm" />
                                    </div>
                                </div>

                                {/* Online Status Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FaToggleOn className="text-purple-500 text-xs" />
                                        Online
                                    </label>
                                    <div className="relative">
                                        <Select2
                                            options={onlineOptions}
                                            value={onlineFilter}
                                            onChange={handleOnlineFilterChange}
                                            placeholder="All"
                                            className="w-full text-sm bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl pl-10"
                                        />
                                        <FaToggleOn className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 text-sm" />
                                    </div>
                                </div>

                                {/* Date Type */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FaCalendarAlt className="text-orange-500 text-xs" />
                                        Date Type
                                    </label>
                                    <div className="relative">
                                        <Select2
                                            options={[
                                                { value: 1, label: 'Created' },
                                                { value: 2, label: 'Last Login' }
                                            ]}
                                            value={dateFilterType === 'created' ? 1 : 2}
                                            onChange={(value) => setDateFilterType(value === 1 ? 'created' : 'last_login')}
                                            placeholder="Created"
                                            className="w-full text-sm bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl pl-10"
                                        />
                                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-sm" />
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FaClock className="text-teal-500 text-xs" />
                                        Date Range
                                    </label>
                                    <div className="relative">
                                        <DatePicker
                                            selectsRange={true}
                                            startDate={startDate || undefined}
                                            endDate={endDate || undefined}
                                            onChange={(update) => {
                                                const [start, end] = update;
                                                setStartDate(start);
                                                setEndDate(end);
                                                setActiveQuickFilter(null);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full px-3 py-2 pl-10 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm"
                                            placeholderText="Select date range"
                                            dateFormat="MMM dd, yyyy"
                                            isClearable={true}
                                            showYearDropdown={true}
                                            showMonthDropdown={true}
                                            dropdownMode="select"
                                            maxDate={new Date()}
                                            popperClassName="z-[9999]"
                                            popperContainer={PopperContainer}
                                        />
                                        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 text-sm" />
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                        <FaClock className="text-xs" />
                                        <span>Dates filtered in your timezone ({formatTimezone(getLoggedInUserTimezone())})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div className="border-t border-gray-100 pt-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-gray-700">Quick:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {quickFilters.map((filter, index) => (
                                            <button
                                                key={index}
                                                onClick={filter.action}
                                                className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 focus:outline-none border ${filter.active
                                                    ? 'bg-purple-600 text-white border-purple-600'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters Display - Compact */}
                            {hasActiveFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border-t border-gray-100 pt-3 mt-3"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-gray-700">Active:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {statusFilter > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">
                                                    Status: {statusOptions[statusFilter]?.label}
                                                    <button
                                                        onClick={() => setStatusFilter(0)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Remove status filter"
                                                    >
                                                        <FaTimes className="text-xs" />
                                                    </button>
                                                </span>
                                            )}
                                            {departmentFilter > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                                                    Dept: {departmentFilter <= departments.length
                                                        ? departmentFilterOptions[departmentFilter]?.label
                                                        : 'N/A'}
                                                    <button
                                                        onClick={() => setDepartmentFilter(0)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Remove department filter"
                                                    >
                                                        <FaTimes className="text-xs" />
                                                    </button>
                                                </span>
                                            )}
                                            {onlineFilter > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full border border-purple-200">
                                                    {onlineOptions[onlineFilter]?.label}
                                                    <button
                                                        onClick={() => setOnlineFilter(0)}
                                                        className="text-purple-600 hover:text-purple-800"
                                                        title="Remove online status filter"
                                                    >
                                                        <FaTimes className="text-xs" />
                                                    </button>
                                                </span>
                                            )}
                                            {(startDate || endDate) && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full border border-orange-200">
                                                    {dateFilterType === 'created' ? 'Created' : 'Last Login'}: {startDate?.toLocaleDateString() || 'Any'} - {endDate?.toLocaleDateString() || 'Any'}
                                                    <button
                                                        onClick={clearDateFilter}
                                                        className="text-orange-600 hover:text-orange-800"
                                                        title="Remove date filter"
                                                    >
                                                        <FaTimes className="text-xs" />
                                                    </button>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Warning Banner when approaching limit */}
                {isNearLimit && !isAtMaxLimit && maxAdmins && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                    >
                        <div className="flex items-start gap-3">
                            <FaExclamationTriangle className="text-yellow-600 text-lg mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-yellow-800">
                                    Approaching Admin Limit
                                </h4>
                                <p className="text-sm text-yellow-700 mb-3">
                                    You have {maxAdmins - admins.length} admin{maxAdmins - admins.length !== 1 ? 's' : ''} remaining.
                                    Consider upgrading your plan for more admin accounts.
                                </p>
                                {(maxAdmins - admins.length) <= 2 && (
                                    <button
                                        onClick={handleUpgradePlan}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-colors duration-200 focus:outline-none border-none"
                                    >
                                        <FaCrown className="text-yellow-400" />
                                        Upgrade Plan
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Add Admin Modal */}
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <FaUserPlus className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Add New Admin</h3>
                                    <p className="text-sm text-gray-500">Create a new admin account</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newAdmin.first_name}
                                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-colors ${validationErrors.first_name ? 'border-red-300 focus:ring-red-400' : ''
                                            }`}
                                        placeholder="Enter first name"
                                    />
                                    {validationErrors.first_name && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.first_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newAdmin.last_name}
                                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-colors ${validationErrors.last_name ? 'border-red-300 focus:ring-red-400' : ''
                                            }`}
                                        placeholder="Enter last name"
                                    />
                                    {validationErrors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.last_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={newAdmin.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-colors ${validationErrors.email ? 'border-red-300 focus:ring-red-400' : ''
                                            }`}
                                        placeholder="Enter email address"
                                    />
                                    {validationErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Head of Department
                                    </label>
                                    {departmentOptions.length === 0 ? (
                                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                            All departments already have heads assigned
                                        </div>
                                    ) : (
                                        <Select2
                                            options={departmentOptions}
                                            value={newAdmin.department_id}
                                            onChange={(value) => handleInputChange('department_id', value)}
                                            placeholder="Select department"
                                            className="w-full"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                >
                                    <FaTimes />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddAdmin}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            Add Admin
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Max Limit Modal */}
                {showMaxLimitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowMaxLimitModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <FaExclamationTriangle className="text-red-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Maximum Admin Limit Reached</h3>
                                    <p className="text-sm text-gray-500">Your current plan has reached its admin limit</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Current Plan:</span>
                                    <span className="text-sm font-semibold text-gray-900">{currentPlan?.name || 'Unknown Plan'}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Admin Limit:</span>
                                    <span className="text-sm font-semibold text-red-600">{maxAdmins || '∞'} admins</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Current Usage:</span>
                                    <span className="text-sm font-semibold text-gray-900">{admins.length} admins</span>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">
                                To add more admin accounts, you'll need to upgrade to a higher plan.
                                Higher plans offer more admin slots and additional features.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowMaxLimitModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                >
                                    <FaTimes />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpgradePlan}
                                    className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                >
                                    <FaCrown className="text-yellow-400" />
                                    Upgrade Plan
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Transfer Department Modal */}
                {showTransferModal && selectedAdminForTransfer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowTransferModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaExchangeAlt className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Transfer Department</h3>
                                    <p className="text-sm text-gray-500">Move admin to a different department</p>
                                </div>
                            </div>

                            {/* Admin Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getProfileImage(selectedAdminForTransfer.id)}
                                        alt={selectedAdminForTransfer.first_name}
                                        className="w-10 h-10 rounded-full border-2 border-blue-200"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {selectedAdminForTransfer.first_name} {selectedAdminForTransfer.last_name}
                                        </h4>
                                        <p className="text-sm text-gray-600">{selectedAdminForTransfer.email}</p>
                                        <p className="text-xs text-gray-500">
                                            Current: {getDepartmentName(selectedAdminForTransfer.id)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Department <span className="text-red-500">*</span>
                                    </label>
                                    {transferDepartmentOptions.length === 0 ? (
                                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                            No available departments for transfer
                                        </div>
                                    ) : (
                                        <Select2
                                            options={transferDepartmentOptions}
                                            value={transferForm.department_id}
                                            onChange={(value) => handleTransferInputChange('department_id', value)}
                                            placeholder="Select department"
                                            className={`w-full ${transferValidationErrors.department_id ? 'border-red-300 focus:ring-red-400' : ''}`}
                                        />
                                    )}
                                    {transferValidationErrors.department_id && (
                                        <p className="mt-1 text-sm text-red-600">{transferValidationErrors.department_id}</p>
                                    )}
                                </div>

                                {/* Warning about current department */}
                                {getDepartmentName(selectedAdminForTransfer.id) !== 'N/A' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <FaExclamationTriangle className="text-yellow-600 text-sm mt-0.5" />
                                            <div className="text-sm text-yellow-800">
                                                <p className="font-medium">Transfer Warning</p>
                                                <p className="text-xs mt-1">
                                                    This admin is currently the head of <strong>{getDepartmentName(selectedAdminForTransfer.id)}</strong>. 
                                                    Transferring will remove them from this position.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Warning about department with existing head */}
                                {transferForm.department_id > 0 && (() => {
                                    const currentHeadInfo = getCurrentHeadInfo(transferForm.department_id);
                                    const hasExistingHead = currentHeadInfo && currentHeadInfo.id !== selectedAdminForTransfer.id;
                                    
                                    if (hasExistingHead) {
                                        return (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <div className="flex items-start gap-2">
                                                    <FaExclamationTriangle className="text-red-600 text-sm mt-0.5" />
                                                    <div className="text-sm text-red-800">
                                                        <p className="font-medium">Department Already Has a Head</p>
                                                        <p className="text-xs mt-1">
                                                            <strong>{currentHeadInfo.name}</strong> ({currentHeadInfo.email}) 
                                                            is currently the head of this department.
                                                        </p>
                                                        <p className="text-xs mt-1 font-medium">
                                                            Transferring will replace them as the department head.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowTransferModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                >
                                    <FaTimes />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTransferAdmin}
                                    disabled={isTransferring || transferDepartmentOptions.length === 0}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                >
                                    {isTransferring ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Transferring...
                                        </>
                                    ) : (
                                        <>
                                            <FaExchangeAlt />
                                            Transfer
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-x-auto"
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Admin
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center gap-2">
                                        Email Address
                                        {getSortIcon('email')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                        {getSortIcon('status')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('phone')}
                                >
                                    <div className="flex items-center gap-2">
                                        Phone Number
                                        {getSortIcon('phone')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('department')}
                                >
                                    <div className="flex items-center gap-2">
                                        Head of Department
                                        {getSortIcon('department')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {currentAdmins.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-400">
                                        {sortedAdmins.length === 0 ? 'No admins found.' : 'No admins on this page.'}
                                    </td>
                                </tr>
                            )}
                            {currentAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-purple-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={getProfileImage(admin.id)}
                                                    alt={admin.first_name}
                                                    className="w-12 h-12 rounded-full border-2 border-purple-200 shadow"
                                                />
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${admin.is_online ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800 text-sm">
                                                    {admin.first_name} {admin.last_name}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${admin.is_online
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-gray-50 text-gray-500'
                                                    }`}>
                                                    {admin.is_online ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusColors[getStatus(admin.user_status_id)] || 'text-gray-500'}`}>
                                            <FaCircle className={`text-xs ${statusColors[getStatus(admin.user_status_id)] || 'text-gray-400'}`} />
                                            {getStatus(admin.user_status_id)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{admin.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {getDepartmentName(admin.id)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            {/* Quick Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleEditAdmin(admin.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 group focus:outline-none border-none"
                                                    title="Edit Admin"
                                                >
                                                    <FaEdit className="text-sm group-hover:text-green-700" />
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleTransferDepartment(admin)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group focus:outline-none border-none"
                                                    title="Transfer Department"
                                                >
                                                    <FaExchangeAlt className="text-sm group-hover:text-blue-700" />
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setShowDeleteConfirm(admin.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group focus:outline-none border-none"
                                                    title="Delete Admin"
                                                >
                                                    <FaTrash className="text-sm group-hover:text-red-700" />
                                                </motion.button>
                                            </div>

                                            {/* Delete Confirmation Modal */}
                                            {showDeleteConfirm === admin.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                                <FaTrash className="text-red-600" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">Delete Admin</h3>
                                                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 mb-6">
                                                            Are you sure you want to delete <strong>{admin.first_name} {admin.last_name}</strong>?
                                                            This will permanently remove their access to the system.
                                                        </p>
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(null)}
                                                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                                            >
                                                                <FaTimes />
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none border-none"
                                                            >
                                                                <FaCheck />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Pagination Controls */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-lg px-6 py-4 overflow-visible"
                >
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                            <span className="font-semibold">{Math.min(endIndex, sortedAdmins.length)}</span> of{' '}
                            <span className="font-semibold">{sortedAdmins.length}</span> results
                        </div>

                        {/* Row Filter Dropdown */}
                        <div className="flex items-center gap-2 text-sm text-gray-700 relative">
                            <span>Show:</span>
                            <Select2
                                options={itemsPerPageOptions}
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                placeholder="Select..."
                                className="w-20"
                            />
                            <span>entries</span>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none border-none ${currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                                title="Previous page"
                            >
                                <FaChevronLeft className="text-sm" />
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Show first page, last page, current page, and pages around current page
                                    const shouldShow =
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1;

                                    if (shouldShow) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none border-none ${page === currentPage
                                                    ? 'bg-purple-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        (page === 2 && currentPage > 3) ||
                                        (page === totalPages - 1 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span key={page} className="px-2 text-gray-400">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none border-none ${currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                                title="Next page"
                            >
                                <FaChevronRight className="text-sm" />
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </SubscriberDashboardLayout>
    );
};

export default Admins; 