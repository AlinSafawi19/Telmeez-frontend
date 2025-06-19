import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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
    return (
        <DashboardLayout
            role="teacher"
            roleColor="from-green-500 to-emerald-600"
            roleGradient="bg-gradient-to-br from-green-500 to-emerald-600"
        >
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
                    The Super Admin dashboard is currently under development. Stay tuned for powerful Super Admin tools!
                </motion.p>
            </div>
        </DashboardLayout>
    );
};

export default SuperAdminDashboard; 