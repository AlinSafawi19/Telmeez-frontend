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
            <main>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout; 