import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Swal from 'sweetalert2';

export interface Admin {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending' | 'incomplete';
    joinDate: Date;
    lastActive: Date;
    profileImage?: string;
    isOnline: boolean;
    school?: string;
    department?: string;
    permissions: string[];
    date: string;
    stats: {
        parents: number;
        students: number;
        teachers: number;
    };
}

interface AdminContextType {
    admins: Admin[];
    selectedAdmins: number[];
    searchQuery: string;
    statusFilter: 'all' | 'active' | 'inactive' | 'incomplete';
    sortConfig: {
        key: string;
        direction: 'ascending' | 'descending';
    };
    rowsPerPage: number;
    currentPage: number;
    selectedChatAdmin: number | null;
    setSearchQuery: (query: string) => void;
    setStatusFilter: (filter: 'all' | 'active' | 'inactive' | 'incomplete') => void;
    setRowsPerPage: (rows: number) => void;
    setCurrentPage: (page: number) => void;
    handleSelectAll: (checked: boolean) => void;
    handleSelectAdmin: (id: number) => void;
    handleAddAdmin: (adminData: Omit<Admin, 'id' | 'date' | 'stats' | 'status' | 'isOnline' | 'profileImage'>) => Promise<void>;
    handleEditAdmin: (adminData: Omit<Admin, 'id' | 'date' | 'stats' | 'status'>) => Promise<void>;
    handleDeleteAdmin: (id: number) => Promise<void>;
    handleBulkDelete: () => Promise<void>;
    handleSort: (key: string) => void;
    getSortIcon: (columnKey: string) => React.JSX.Element;
    filterAdmins: (admins: Admin[]) => Admin[];
    sortData: (data: Admin[]) => Admin[];
    getPaginatedData: (data: Admin[]) => Admin[];
    getTotalPages: (data: Admin[]) => number;
    setSelectedChatAdmin: (adminId: number | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

interface AdminProviderProps {
    children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
    const [admins, setAdmins] = useState<Admin[]>([
        {
            id: 1,
            firstName: 'Alin',
            lastName: 'Safawi',
            email: 'alin@safawi.com',
            phone: '+1-555-1234',
            status: 'active',
            joinDate: new Date('2024-03-15'),
            lastActive: new Date('2024-03-15'),
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            isOnline: false,
            school: 'ABC School',
            department: 'Mathematics',
            permissions: ['view', 'edit'],
            date: '2024-03-15',
            stats: {
                parents: 0,
                students: 0,
                teachers: 0
            }
        },
        {
            id: 2,
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah@example.com',
            phone: '+1-555-5678',
            status: 'active',
            joinDate: new Date('2024-03-14'),
            lastActive: new Date('2024-03-15'),
            isOnline: true,
            school: 'XYZ School',
            department: 'Science',
            permissions: ['view'],
            date: '2024-03-14',
            stats: {
                parents: 0,
                students: 0,
                teachers: 0
            }
        },
        {
            id: 3,
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'michael@example.com',
            phone: '+1-555-9012',
            status: 'incomplete',
            joinDate: new Date('2024-03-13'),
            lastActive: new Date('2024-03-13'),
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            isOnline: true,
            school: 'ABC School',
            department: 'Mathematics',
            permissions: ['view'],
            date: '2024-03-13',
            stats: {
                parents: 0,
                students: 0,
                teachers: 0
            }
        },
        {
            id: 4,
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily@example.com',
            phone: '+1-555-3456',
            status: 'active',
            joinDate: new Date('2024-03-12'),
            lastActive: new Date('2024-03-15'),
            isOnline: false,
            school: 'XYZ School',
            department: 'Science',
            permissions: ['view', 'edit'],
            date: '2024-03-12',
            stats: {
                parents: 0,
                students: 0,
                teachers: 0
            }
        },
        {
            id: 5,
            firstName: 'David',
            lastName: 'Miller',
            email: 'david@example.com',
            phone: '+1-555-7890',
            status: 'inactive',
            joinDate: new Date('2024-03-11'),
            lastActive: new Date('2024-03-11'),
            isOnline: true,
            school: 'ABC School',
            department: 'Mathematics',
            permissions: ['view'],
            date: '2024-03-11',
            stats: {
                parents: 0,
                students: 0,
                teachers: 0
            }
        }
    ]);
    const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'incomplete'>('all');
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'ascending' | 'descending';
    }>({ key: 'date', direction: 'descending' });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedChatAdmin, setSelectedChatAdmin] = useState<number | null>(null);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedAdmins(admins.map(admin => admin.id));
        } else {
            setSelectedAdmins([]);
        }
    }, [admins]);

    const handleSelectAdmin = useCallback((id: number) => {
        setSelectedAdmins(prev => {
            if (prev.includes(id)) {
                return prev.filter(adminId => adminId !== id);
            }
            return [...prev, id];
        });
    }, []);

    const handleAddAdmin = useCallback(async (adminData: Omit<Admin, 'id' | 'date' | 'stats' | 'status' | 'isOnline' | 'profileImage'>) => {
        const newAdmin: Admin = {
            id: Math.max(...admins.map(a => a.id)) + 1,
            ...adminData,
            status: 'incomplete',
            isOnline: Math.random() > 0.5, // Random online status
            joinDate: new Date(),
            lastActive: new Date(),
            permissions: [],
            date: new Date().toISOString().split('T')[0],
            stats: {
                parents: 0,
                students: 0,
                teachers: 0
            }
        };
        setAdmins(prev => [...prev, newAdmin]);
    }, [admins]);

    const handleEditAdmin = useCallback(async (adminData: Omit<Admin, 'id' | 'date' | 'stats' | 'status'>) => {
        setAdmins(prev => prev.map(admin => {
            if (admin.id === selectedAdmins[0]) {
                const totalActivity = admin.stats.parents + admin.stats.students + admin.stats.teachers;
                const newStatus: 'active' | 'inactive' | 'incomplete' = totalActivity > 0 ? 'active' : 'inactive';
                return { ...admin, ...adminData, status: newStatus };
            }
            return admin;
        }));
    }, [selectedAdmins]);

    const handleDeleteAdmin = useCallback(async (id: number) => {
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
            setAdmins(prev => prev.filter(admin => admin.id !== id));
            setSelectedAdmins(prev => prev.filter(adminId => adminId !== id));
        }
    }, []);

    const handleBulkDelete = useCallback(async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${selectedAdmins.length} admin(s). This action cannot be undone.`,
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
            setAdmins(prev => prev.filter(admin => !selectedAdmins.includes(admin.id)));
            setSelectedAdmins([]);
        }
    }, [selectedAdmins]);

    const handleSort = useCallback((key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    }, []);

    const getSortIcon = useCallback((columnKey: string) => {
        if (sortConfig.key !== columnKey) {
            return <span className="ml-1 inline-block">↕</span>;
        }
        return sortConfig.direction === 'ascending'
            ? <span className="ml-1 inline-block">↑</span>
            : <span className="ml-1 inline-block">↓</span>;
    }, [sortConfig]);

    const filterAdmins = useCallback((admins: Admin[]) => {
        let filtered = admins;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(admin => admin.status === statusFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(admin =>
                admin.firstName.toLowerCase().includes(query) ||
                admin.lastName.toLowerCase().includes(query) ||
                admin.email.toLowerCase().includes(query) ||
                admin.status.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [statusFilter, searchQuery]);

    const sortData = useCallback((data: Admin[]) => {
        const filteredData = filterAdmins(data);
        return [...filteredData].sort((a, b) => {
            if (sortConfig.key === 'date') {
                return sortConfig.direction === 'ascending'
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            if (sortConfig.key.startsWith('stats.')) {
                const statKey = sortConfig.key.split('.')[1] as keyof typeof a.stats;
                return sortConfig.direction === 'ascending'
                    ? a.stats[statKey] - b.stats[statKey]
                    : b.stats[statKey] - a.stats[statKey];
            }
            const key = sortConfig.key as keyof Admin;
            return sortConfig.direction === 'ascending'
                ? String(a[key]).localeCompare(String(b[key]))
                : String(b[key]).localeCompare(String(a[key]));
        });
    }, [filterAdmins, sortConfig]);

    const getPaginatedData = useCallback((data: Admin[]) => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    }, [currentPage, rowsPerPage]);

    const getTotalPages = useCallback((data: Admin[]) => {
        return Math.ceil(data.length / rowsPerPage);
    }, [rowsPerPage]);

    const value = {
        admins,
        selectedAdmins,
        searchQuery,
        statusFilter,
        sortConfig,
        rowsPerPage,
        currentPage,
        selectedChatAdmin,
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
        setSelectedChatAdmin,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}; 