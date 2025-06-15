import React from 'react';
import { FaHome } from 'react-icons/fa';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: string;
    roleColor: string;
    roleGradient: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children
}) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm p-4">
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none flex items-center gap-2"
                >
                    <FaHome className="w-4 h-4" />
                    Back to Home
                </button>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout; 