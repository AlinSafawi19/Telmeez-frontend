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
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 0,
        borderRadius: 12,
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
          'rgba(147, 51, 234, 0.15)',
          'rgba(34, 197, 94, 0.15)',
          'rgba(251, 146, 60, 0.15)',
          'rgba(239, 68, 68, 0.15)'
        ],
        borderColor: [
          'rgba(147, 51, 234, 0.3)',
          'rgba(34, 197, 94, 0.3)',
          'rgba(251, 146, 60, 0.3)',
          'rgba(239, 68, 68, 0.3)'
        ],
        borderWidth: 0,
        borderRadius: 12,
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
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.08)',
        borderWidth: 4,
        fill: true,
        tension: 0.6,
        pointBackgroundColor: 'rgba(168, 85, 247, 1)',
        pointBorderColor: '#f8fafc',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
      {
        label: t.dashboard?.stats?.admins || 'Admins',
        data: historicalStats.map(item => item.admins),
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#f8fafc',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
      },
      {
        label: t.dashboard?.stats?.teachers || 'Teachers',
        data: historicalStats.map(item => item.teachers),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#f8fafc',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
      },
      {
        label: t.dashboard?.stats?.parents || 'Parents',
        data: historicalStats.map(item => item.parents),
        borderColor: 'rgba(251, 146, 60, 1)',
        backgroundColor: 'rgba(251, 146, 60, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(251, 146, 60, 1)',
        pointBorderColor: '#f8fafc',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
      },
      {
        label: t.dashboard?.stats?.students || 'Students',
        data: historicalStats.map(item => item.students),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#f8fafc',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
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
          padding: 25,
          font: {
            size: 13,
            weight: 600
          },
          color: '#475569'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        borderWidth: 2,
        cornerRadius: 16,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: 600
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: 600
          },
          color: '#475569'
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: 600
          },
          color: '#475569'
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
          padding: 25,
          font: {
            size: 13,
            weight: 600
          },
          color: '#475569'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        borderWidth: 2,
        cornerRadius: 16,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: 600
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: 600
          },
          color: '#475569'
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: 600
          },
          color: '#475569'
        }
      }
    }
  };

  const statCards = [
    {
      title: t.dashboard?.stats?.admins || 'Admins',
      used: stats.usedAdmins,
      max: stats.maxAdmins,
      gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
      bgGradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
      icon: '👨‍💼',
      accent: 'violet'
    },
    {
      title: t.dashboard?.stats?.teachers || 'Teachers',
      used: stats.usedTeachers,
      max: stats.maxTeachers,
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
      icon: '👨‍🏫',
      accent: 'emerald'
    },
    {
      title: t.dashboard?.stats?.parents || 'Parents',
      used: stats.usedParents,
      max: stats.maxParents,
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
      icon: '👨‍👩‍👧‍👦',
      accent: 'orange'
    },
    {
      title: t.dashboard?.stats?.students || 'Students',
      used: stats.usedStudents,
      max: stats.maxStudents,
      gradient: 'from-rose-400 via-pink-500 to-red-500',
      bgGradient: 'from-rose-50 via-pink-50 to-red-50',
      icon: '👨‍🎓',
      accent: 'rose'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-40 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 animate-pulse rounded-3xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 animate-pulse rounded-3xl"></div>
          <div className="h-96 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 animate-pulse rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-rose-500 text-xl font-semibold mb-3">
          {t.dashboard?.stats?.error || 'Error loading statistics'}
        </div>
        <div className="text-slate-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Creative Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15, type: "spring", stiffness: 100 }}
            className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-3xl group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:rotate-1`}
          >
            {/* Geometric Background Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-current opacity-10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-transparent to-current opacity-10 rounded-full -ml-8 -mb-8"></div>

            <div className="relative p-8">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse-4' : 'space-x-4'} mb-6`}>
                <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors duration-300 uppercase tracking-wide">
                    {card.title}
                  </h3>
                  <div className="text-3xl font-black text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                    {formatNumber(card.used)}
                    {card.max !== 'unlimited' && (
                      <span className="text-xl text-slate-500 font-normal ml-1">
                        /{formatNumber(card.max)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Creative Progress Indicator */}
              {card.max !== 'unlimited' && (
                <div className="relative mb-4">
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(getUsagePercentage(card.used, card.max), 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${card.gradient} rounded-full relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>
              )}

              <div className="text-sm text-slate-500 font-medium">
                {card.max === 'unlimited' ? (
                  <span className="text-emerald-600 font-bold">
                    {t.dashboard?.stats?.unlimited || 'Unlimited'}
                  </span>
                ) : (
                  <span className="font-semibold">
                    {getUsagePercentage(card.used, card.max).toFixed(1)}% {t.dashboard?.stats?.used || 'used'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Creative Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 80 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl transform transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 rounded-2xl transform rotate-12"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 rounded-xl transform -rotate-12"></div>

          <div className="relative p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="mr-3 text-2xl">📊</span>
              {t.dashboard?.stats?.usageComparison || 'Usage Comparison'}
            </h3>
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 80 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 rounded-3xl transform transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 opacity-20 rounded-2xl transform -rotate-12"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-tr from-pink-400 to-rose-500 opacity-20 rounded-xl transform rotate-12"></div>

          <div className="relative p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="mr-3 text-2xl">📈</span>
              {t.dashboard?.stats?.growthTrend || 'Growth Trend'}
            </h3>
            <div className="h-80">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Creative Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 60 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 via-purple-50 to-violet-50 rounded-3xl transform transition-all duration-500 hover:scale-[1.01]"
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-10 rounded-full animate-bounce bounce-delay-0"></div>
          <div className="absolute top-16 right-12 w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 opacity-10 rounded-full animate-bounce bounce-delay-500"></div>
          <div className="absolute bottom-12 left-12 w-10 h-10 bg-gradient-to-br from-violet-400 to-indigo-500 opacity-10 rounded-full animate-bounce bounce-delay-1000"></div>
        </div>

        <div className="relative p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center">
            <span className="mr-3 text-2xl">🎯</span>
            {t.dashboard?.stats?.summary || 'Summary'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center transform transition-all duration-300 hover:scale-110"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stats.usedAdmins + stats.usedTeachers + stats.usedParents + stats.usedStudents}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {t.dashboard?.stats?.totalActiveUsers || 'Total Active Users'}
              </div>
            </motion.div>
            <motion.div
              className="text-center transform transition-all duration-300 hover:scale-110"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                {(() => {
                  const totalUsed = stats.usedAdmins + stats.usedTeachers + stats.usedParents + stats.usedStudents;
                  const totalMax = (stats.maxAdmins === 'unlimited' ? 0 : stats.maxAdmins) +
                    (stats.maxTeachers === 'unlimited' ? 0 : stats.maxTeachers) +
                    (stats.maxParents === 'unlimited' ? 0 : stats.maxParents) +
                    (stats.maxStudents === 'unlimited' ? 0 : stats.maxStudents);
                  return totalMax > 0 ? Math.round((totalUsed / totalMax) * 100) : 0;
                })()}%
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {t.dashboard?.stats?.capacityUtilization || 'Capacity Utilization'}
              </div>
            </motion.div>
            <motion.div
              className="text-center transform transition-all duration-300 hover:scale-110"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {(() => {
                  const totalUsers = stats.usedAdmins + stats.usedTeachers + stats.usedParents + stats.usedStudents;
                  const totalSeats = (stats.maxAdmins === 'unlimited' ? totalUsers : stats.maxAdmins) +
                    (stats.maxTeachers === 'unlimited' ? totalUsers : stats.maxTeachers) +
                    (stats.maxParents === 'unlimited' ? totalUsers : stats.maxParents) +
                    (stats.maxStudents === 'unlimited' ? totalUsers : stats.maxStudents);
                  return totalSeats > 0 ? Math.round((totalUsers / totalSeats) * 100) : 100;
                })()}%
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {t.dashboard?.stats?.usageEfficiency || 'Usage Efficiency'}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsOverview;
