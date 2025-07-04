import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import type { UserStats, HistoricalStats } from '../services/statsService';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import LoadingOverlay from './LoadingOverlay';
import {
  FaUsers,
  FaUserTie,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaChartLine
} from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatsOverviewProps {
  stats: UserStats;
  historicalStats: HistoricalStats[];
  isLoading: boolean;
  error: string | null;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, historicalStats, isLoading, error }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const isRTL = currentLanguage === 'ar';

  // Helper function to get usage percentage
  const getUsagePercentage = (used: number, max: number | 'unlimited') => {
    if (max === 'unlimited') return 0;
    return max > 0 ? (used / max) * 100 : 0;
  };

  // Helper function to format numbers
  const formatNumber = (num: number | 'unlimited') => {
    if (num === 'unlimited') return '∞';
    return num.toLocaleString();
  };

  // Chart data for bar chart (usage comparison)
  const barChartData = {
    labels: [
      t.dashboard?.stats?.admins || 'Admins',
      t.dashboard?.stats?.teachers || 'Teachers',
      t.dashboard?.stats?.parents || 'Parents',
      t.dashboard?.stats?.students || 'Students'
    ],
    datasets: [
      {
        label: t.dashboard?.stats?.used || 'Used',
        data: [stats.usedAdmins, stats.usedTeachers, stats.usedParents, stats.usedStudents],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: t.dashboard?.stats?.available || 'Available',
        data: [
          stats.maxAdmins === 'unlimited' ? 0 : stats.maxAdmins - stats.usedAdmins,
          stats.maxTeachers === 'unlimited' ? 0 : stats.maxTeachers - stats.usedTeachers,
          stats.maxParents === 'unlimited' ? 0 : stats.maxParents - stats.usedParents,
          stats.maxStudents === 'unlimited' ? 0 : stats.maxStudents - stats.usedStudents
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.1)',
          'rgba(16, 185, 129, 0.1)',
          'rgba(245, 158, 11, 0.1)',
          'rgba(239, 68, 68, 0.1)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 0.3)',
          'rgba(16, 185, 129, 0.3)',
          'rgba(245, 158, 11, 0.3)',
          'rgba(239, 68, 68, 0.3)'
        ],
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  // Chart data for line chart (usage trends - real data)
  const lineChartData = {
    labels: historicalStats.map(item => item.month),
    datasets: [
      {
        label: t.dashboard?.stats?.totalUsers || 'Total Users',
        data: historicalStats.map(item => item.totalUsers),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: t.dashboard?.stats?.admins || 'Admins',
        data: historicalStats.map(item => item.admins),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: t.dashboard?.stats?.teachers || 'Teachers',
        data: historicalStats.map(item => item.teachers),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: t.dashboard?.stats?.parents || 'Parents',
        data: historicalStats.map(item => item.parents),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: t.dashboard?.stats?.students || 'Students',
        data: historicalStats.map(item => item.students),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          },
          color: '#374151',
          textDirection: isRTL ? 'rtl' : 'ltr'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 13,
          weight: 600
        },
        bodyFont: {
          size: 12
        },
        textDirection: isRTL ? 'rtl' : 'ltr'
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500
          },
          color: '#374151',
          textDirection: isRTL ? 'rtl' : 'ltr'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500
          },
          color: '#374151',
          textDirection: isRTL ? 'rtl' : 'ltr'
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          },
          color: '#374151',
          textDirection: isRTL ? 'rtl' : 'ltr'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 13,
          weight: 600
        },
        bodyFont: {
          size: 12
        },
        textDirection: isRTL ? 'rtl' : 'ltr'
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500
          },
          color: '#374151',
          textDirection: isRTL ? 'rtl' : 'ltr'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500
          },
          color: '#374151',
          textDirection: isRTL ? 'rtl' : 'ltr'
        }
      }
    }
  };

  const statCards = [
    {
      title: t.dashboard?.stats?.admins || 'Admins',
      used: stats.usedAdmins,
      max: stats.maxAdmins,
      color: 'blue',
      icon: FaUserTie
    },
    {
      title: t.dashboard?.stats?.teachers || 'Teachers',
      used: stats.usedTeachers,
      max: stats.maxTeachers,
      color: 'green',
      icon: FaChalkboardTeacher
    },
    {
      title: t.dashboard?.stats?.parents || 'Parents',
      used: stats.usedParents,
      max: stats.maxParents,
      color: 'yellow',
      icon: FaUsers
    },
    {
      title: t.dashboard?.stats?.students || 'Students',
      used: stats.usedStudents,
      max: stats.maxStudents,
      color: 'red',
      icon: FaUserGraduate
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        progress: 'bg-blue-600',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        progress: 'bg-green-600',
        icon: 'text-green-600',
        iconBg: 'bg-green-100'
      },
      yellow: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        progress: 'bg-amber-600',
        icon: 'text-amber-600',
        iconBg: 'bg-amber-100'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        progress: 'bg-red-600',
        icon: 'text-red-600',
        iconBg: 'bg-red-100'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <LoadingOverlay isLoading={isLoading} />
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 text-lg font-semibold mb-2">
          {t.dashboard?.stats?.error || 'Error loading statistics'}
        </div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Professional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const colors = getColorClasses(card.color);
          const IconComponent = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 mb-4`}>
                <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    {card.title}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(card.used)}
                    {card.max !== 'unlimited' && (
                      <span className={`text-lg text-gray-500 font-normal ${isRTL ? 'mr-1' : 'ml-1'}`}>
                        /{formatNumber(card.max)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {card.max !== 'unlimited' && (
                <div className="mb-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(getUsagePercentage(card.used, card.max), 100)}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className={`h-full ${colors.progress} rounded-full`}
                    />
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                {card.max === 'unlimited' ? (
                  <span className={`font-medium ${colors.text}`}>
                    {t.dashboard?.stats?.unlimited || 'Unlimited'}
                  </span>
                ) : (
                  <span className="font-medium">
                    {getUsagePercentage(card.used, card.max).toFixed(1)}% {t.dashboard?.stats?.used || 'used'}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Professional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center mb-6">
            <div className={`w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <FaChartBar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t.dashboard?.stats?.usageComparison || 'Usage Comparison'}
            </h3>
          </div>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center mb-6">
            <div className={`w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <FaChartLine className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t.dashboard?.stats?.growthTrend || 'Growth Trend'}
            </h3>
          </div>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsOverview;
