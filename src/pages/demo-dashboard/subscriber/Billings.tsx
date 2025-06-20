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
import { useUser } from '../../../contexts/UserContext';

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

const Billings: React.FC = () => {
    const { subscriber } = useUser();

    return (
        <SubscriberDashboardLayout>
            <div>
                <h1>Billings</h1>
            </div>
        </SubscriberDashboardLayout>
    );
};

export default Billings; 