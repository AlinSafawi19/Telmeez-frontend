import { useState, useEffect } from 'react';
import SubscriberDashboardLayout from './SubscriberDashboardLayout';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select2 from '../../../components/Select2';

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

const Documents: React.FC = () => {
    return (
        <SubscriberDashboardLayout>
            <div>
                <h1>Documents</h1>
            </div>
        </SubscriberDashboardLayout>
    );
};

export default Documents; 