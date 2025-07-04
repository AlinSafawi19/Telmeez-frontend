import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import DashboardLayout from '../components/DashboardLayout';
import StatsOverview from '../components/StatsOverview';
import QuickLinks from '../components/QuickLinks';
import statsService, { type UserStats, type HistoricalStats } from '../services/statsService';

interface Subscription {
    _id: string;
    planId: string;
    planName: string;
    billingCycle: 'monthly' | 'annual';
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    startDate: Date;
    endDate: Date;
    nextBillingDate: Date;
    amount: number;
    currency: string;
}

const Dashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const { user: authUser, isLoading: authLoading } = useAuth();
    const t = translations[currentLanguage];

    // Get subscription data from navigation state (if any)
    const subscriptionData = location.state?.subscription as Subscription;

    // State management
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showSidebar, setShowSidebar] = useState(false);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [historicalStats, setHistoricalStats] = useState<HistoricalStats[]>([]);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState<string | null>(null);

    // Handle authentication state
    useEffect(() => {
        if (!authLoading) {
            setIsLoading(false);

            // Process subscription data if available
            if (subscriptionData) {
                // Handle subscription data if needed
            }
        }
    }, [authLoading, subscriptionData]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !authUser) {
            navigate('/signin');
        }
    }, [authUser, authLoading, navigate]);

    // Add a more robust authentication check
    useEffect(() => {
        // Only redirect if we're sure the user is not authenticated
        // and we're not in the loading state
        if (!authLoading && !authUser && !isLoading) {
            console.log('🚨 Dashboard: User not authenticated, redirecting to signin');
            console.log('🔍 Dashboard Debug:', { authLoading, authUser, isLoading });
            navigate('/signin');
        }
    }, [authUser, authLoading, isLoading, navigate]);

    // Debug authentication state changes
    useEffect(() => {
        console.log('🔍 Dashboard Auth State:', {
            authLoading,
            authUser: authUser ? `${authUser.firstName} ${authUser.lastName}` : null,
            isLoading,
            isAuthenticated: !!authUser
        });
    }, [authLoading, authUser, isLoading]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                setStatsError(null);

                // Fetch both current and historical stats in parallel
                const [statsData, historicalData] = await Promise.all([
                    statsService.getUserStats(),
                    statsService.getHistoricalStats()
                ]);

                setStats(statsData);
                setHistoricalStats(historicalData);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStatsError(error instanceof Error ? error.message : 'Failed to load statistics');
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    if (isLoading || authLoading) {
        return (
            <LoadingOverlay isLoading={isLoading || authLoading} />
        );
    }

    if (!authUser) {
        return null;
    }

    return (
        <DashboardLayout
            activeTab={activeTab}
            onTabChange={handleTabChange}
            showSidebar={showSidebar}
            onSidebarToggle={setShowSidebar}
            pageTitle={t.dashboard?.welcome?.replace('{institutionName}', authUser.institutionName || 'Telmeez').replace('{firstName}', authUser.firstName || 'User') || 'Welcome!'}
            pageDescription={t.dashboard?.we_excited_to_have_you?.replace('{institutionName}', authUser.institutionName || 'Telmeez') || 'We\'re excited to have you!'}
            isLoading={false}
        >
            {/* Stats Overview and Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Overview - takes 2/3 of the space */}
                <div className="lg:col-span-2">
                    <StatsOverview
                        stats={stats || {
                            maxAdmins: 0,
                            maxTeachers: 0,
                            maxParents: 0,
                            maxStudents: 0,
                            usedAdmins: 0,
                            usedTeachers: 0,
                            usedParents: 0,
                            usedStudents: 0
                        }}
                        historicalStats={historicalStats}
                        isLoading={statsLoading}
                        error={statsError}
                    />
                </div>

                {/* Quick Links - takes 1/3 of the space */}
                <div className="lg:col-span-1">
                    <QuickLinks
                        currentLanguage={currentLanguage}
                        userRole={authUser?.role?.role || 'admin'}
                        onLinkClick={(linkId) => {
                            console.log(`Quick link clicked: ${linkId}`);
                            // You can add navigation logic here
                            // For now, just log the click
                        }}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard; 