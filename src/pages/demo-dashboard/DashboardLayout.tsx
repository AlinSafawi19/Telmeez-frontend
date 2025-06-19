import React from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children
}): React.ReactElement => {
    return (
        <div>
            {/* Main Content */}
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout; 