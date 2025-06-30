import React from 'react';
import { motion } from 'framer-motion';
import { type UserStats } from '../services/statsService';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingOverlay from './LoadingOverlay';
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserFriends,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';

interface StatsCardProps {
  stats: UserStats;
  isLoading?: boolean;
  error?: string | null;
  isRTL?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, isLoading = false, error = null }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as Language];

  const calculateUsagePercentage = (used: number, max: number | 'unlimited') => {
    if (max === 'unlimited') return 0;
    if (max === 0) return 0;
    return Math.min((used / max) * 100, 100);
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'critical', color: 'red', icon: FaExclamationTriangle };
    if (percentage >= 75) return { status: 'warning', color: 'amber', icon: FaInfoCircle };
    return { status: 'healthy', color: 'green', icon: FaCheckCircle };
  };

  const getGradientColors = (percentage: number) => {
    if (percentage >= 90) return 'from-red-500 via-red-600 to-red-700';
    if (percentage >= 75) return 'from-amber-500 via-orange-500 to-red-500';
    if (percentage >= 50) return 'from-blue-500 via-indigo-500 to-purple-500';
    return 'from-emerald-500 via-teal-500 to-cyan-500';
  };

  const statItems = [
    {
      key: 'admins',
      label: t.dashboard?.stats?.admins || 'Admins',
      used: stats.usedAdmins,
      max: stats.maxAdmins,
      icon: FaUsers,
      description: 'Administrative users',
      bgGradient: 'from-purple-500 to-indigo-600'
    },
    {
      key: 'teachers',
      label: t.dashboard?.stats?.teachers || 'Teachers',
      used: stats.usedTeachers,
      max: stats.maxTeachers,
      icon: FaChalkboardTeacher,
      description: 'Teaching staff',
      bgGradient: 'from-blue-500 to-cyan-600'
    },
    {
      key: 'parents',
      label: t.dashboard?.stats?.parents || 'Parents',
      used: stats.usedParents,
      max: stats.maxParents,
      icon: FaUserFriends,
      description: 'Parent accounts',
      bgGradient: 'from-emerald-500 to-teal-600'
    },
    {
      key: 'students',
      label: t.dashboard?.stats?.students || 'Students',
      used: stats.usedStudents,
      max: stats.maxStudents,
      icon: FaUserGraduate,
      description: 'Student accounts',
      bgGradient: 'from-orange-500 to-red-600'
    }
  ];

  if (isLoading) {
    return (
      <LoadingOverlay isLoading={isLoading} />
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Statistics</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Stats Grid */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((item, index) => {
            const usagePercentage = calculateUsagePercentage(item.used, item.max);
            const remaining = item.max === 'unlimited' ? '∞' : Math.max(0, item.max - item.used);
            const status = getUsageStatus(usagePercentage);
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.bgGradient} opacity-10 rounded-full -translate-y-10 translate-x-10`}></div>

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`w-8 h-8 bg-${status.color}-100 rounded-full flex items-center justify-center`}>
                      <StatusIcon className={`w-4 h-4 text-${status.color}-600`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.label}</h3>

                    {/* Numbers */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {item.used.toLocaleString()}
                        <span className="text-lg font-normal text-gray-500">/{item.max === 'unlimited' ? '∞' : item.max.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {remaining === '∞' ? 'Unlimited' : `${remaining.toLocaleString()} remaining`}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Usage</span>
                        <span className="font-bold text-gray-900">{usagePercentage.toFixed(1)}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercentage}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${getGradientColors(usagePercentage)} rounded-full relative`}
                          >
                            <div className="absolute inset-0 bg-white opacity-20 rounded-full"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard; 