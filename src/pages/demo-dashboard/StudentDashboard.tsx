import React from 'react';
import DashboardLayout from './DashboardLayout';
import { motion } from 'framer-motion';

const StudentDashboard: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl mb-4"
                >
                    🚧
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900"
                >
                    Coming Soon
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-600 text-center max-w-2xl"
                >
                    The Student dashboard is currently under development. Stay tuned for an engaging learning experience!
                </motion.p>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard; 