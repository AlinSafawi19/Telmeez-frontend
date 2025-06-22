import SubscriberDashboardLayout from './SubscriberDashboardLayout';
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

const Overview: React.FC = () => {
    return (
        <SubscriberDashboardLayout>
            <div>
                <h1>Overview</h1>
            </div>
        </SubscriberDashboardLayout>
    );
};

export default Overview; 