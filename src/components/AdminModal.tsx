import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export interface Admin {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: 'active' | 'inactive' | 'incomplete';
    date: string;
    stats: {
        parents: number;
        students: number;
        teachers: number;
    };
}

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (admin: Omit<Admin, 'id' | 'date' | 'stats' | 'status'>) => Promise<void>;
    admin?: Admin;
    mode: 'add' | 'edit';
    isBulkEdit?: boolean;
    selectedCount?: number;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSave, admin, mode, isBulkEdit = false, selectedCount = 0 }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [error, setError] = useState('');

    // Update form data when admin prop changes
    useEffect(() => {
        if (admin) {
            setFormData({
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: ''
            });
        }
    }, [admin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {mode === 'add' ? 'Add New Admin' : isBulkEdit ? `Edit ${selectedCount} Admins` : 'Edit Admin'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="focus:outline-none text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <FaTimes />
                    </button>
                </div>

                {isBulkEdit && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                            You are editing {selectedCount} admin{selectedCount !== 1 ? 's' : ''}. Changes will be applied to all selected admins.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="focus:outline-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isBulkEdit ? `Save Changes (${selectedCount})` : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminModal; 