import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { type UserStats } from '../services/statsService';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingOverlay from './LoadingOverlay';
import './StatsLineChart.css';

interface StatsLineChartProps {
  stats: UserStats;
  isLoading?: boolean;
  error?: string | null;
}

const StatsLineChart: React.FC<StatsLineChartProps> = ({ 
  stats, 
  isLoading = false, 
  error = null 
}) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as Language];

  if (isLoading) {
    return (
      <LoadingOverlay isLoading={isLoading} />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Generate mock data for the last 7 days (in a real app, this would come from your API)
  const generateMockData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic mock data based on current stats
      const baseAdmins = Math.floor(stats.usedAdmins * 0.8);
      const baseTeachers = Math.floor(stats.usedTeachers * 0.8);
      const baseParents = Math.floor(stats.usedParents * 0.8);
      const baseStudents = Math.floor(stats.usedStudents * 0.8);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        admins: baseAdmins + Math.floor(Math.random() * (stats.usedAdmins - baseAdmins + 1)),
        teachers: baseTeachers + Math.floor(Math.random() * (stats.usedTeachers - baseTeachers + 1)),
        parents: baseParents + Math.floor(Math.random() * (stats.usedParents - baseParents + 1)),
        students: baseStudents + Math.floor(Math.random() * (stats.usedStudents - baseStudents + 1))
      });
    }
    
    return data;
  };

  const data = generateMockData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index} 
              className="tooltip-entry"
              ref={(el) => {
                if (el) {
                  el.style.color = entry.color;
                }
              }}
            >
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.dashboard?.stats?.usageTrends || 'Usage Trends'}
        </h3>
        <p className="text-sm text-gray-600">
          {t.dashboard?.stats?.last7Days || 'User activity over the last 7 days'}
        </p>
      </div>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              label={{ 
                value: t.dashboard?.stats?.users || 'Users', 
                angle: -90, 
                position: 'insideLeft',
                className: 'y-axis-label'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="admins" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              name={t.dashboard?.stats?.admins || 'Admins'}
            />
            <Line 
              type="monotone" 
              dataKey="teachers" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              name={t.dashboard?.stats?.teachers || 'Teachers'}
            />
            <Line 
              type="monotone" 
              dataKey="parents" 
              stroke="#F59E0B" 
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              name={t.dashboard?.stats?.parents || 'Parents'}
            />
            <Line 
              type="monotone" 
              dataKey="students" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
              name={t.dashboard?.stats?.students || 'Students'}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{stats.usedAdmins}</div>
          <div className="text-xs text-blue-700">{t.dashboard?.stats?.admins || 'Admins'}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{stats.usedTeachers}</div>
          <div className="text-xs text-green-700">{t.dashboard?.stats?.teachers || 'Teachers'}</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">{stats.usedParents}</div>
          <div className="text-xs text-yellow-700">{t.dashboard?.stats?.parents || 'Parents'}</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{stats.usedStudents}</div>
          <div className="text-xs text-red-700">{t.dashboard?.stats?.students || 'Students'}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsLineChart; 