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
            {/* Main Content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout; 