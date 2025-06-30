import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { type UserStats } from '../services/statsService';
import { translations } from '../translations';
import type { Language } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import {
    FaUsers,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaUserFriends,
    FaExclamationTriangle
} from 'react-icons/fa';
import './StatsBarChart.css';

interface StatsBarChartProps {
    stats: UserStats;
    isLoading?: boolean;
    error?: string | null;
}

const StatsBarChart: React.FC<StatsBarChartProps> = ({
    stats,
    isLoading = false,
    error = null
}) => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage as Language];

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Chart</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const getUsageStatus = (percentage: number) => {
        if (percentage >= 90) return { status: 'critical', color: '#EF4444', bgColor: '#FEF2F2' };
        if (percentage >= 75) return { status: 'warning', color: '#F59E0B', bgColor: '#FFFBEB' };
        return { status: 'healthy', color: '#10B981', bgColor: '#ECFDF5' };
    };

    const data = [
        {
            name: t.dashboard?.stats?.admins || 'Admins',
            used: stats.usedAdmins,
            max: stats.maxAdmins === 'unlimited' ? 0 : stats.maxAdmins,
            usage: stats.maxAdmins === 'unlimited' ? 0 : Math.min((stats.usedAdmins / stats.maxAdmins) * 100, 100),
            color: '#8B5CF6',
            gradient: 'from-purple-500 to-indigo-600',
            icon: FaUsers,
            description: 'Administrative users'
        },
        {
            name: t.dashboard?.stats?.teachers || 'Teachers',
            used: stats.usedTeachers,
            max: stats.maxTeachers === 'unlimited' ? 0 : stats.maxTeachers,
            usage: stats.maxTeachers === 'unlimited' ? 0 : Math.min((stats.usedTeachers / stats.maxTeachers) * 100, 100),
            color: '#3B82F6',
            gradient: 'from-blue-500 to-cyan-600',
            icon: FaChalkboardTeacher,
            description: 'Teaching staff'
        },
        {
            name: t.dashboard?.stats?.parents || 'Parents',
            used: stats.usedParents,
            max: stats.maxParents === 'unlimited' ? 0 : stats.maxParents,
            usage: stats.maxParents === 'unlimited' ? 0 : Math.min((stats.usedParents / stats.maxParents) * 100, 100),
            color: '#10B981',
            gradient: 'from-emerald-500 to-teal-600',
            icon: FaUserFriends,
            description: 'Parent accounts'
        },
        {
            name: t.dashboard?.stats?.students || 'Students',
            used: stats.usedStudents,
            max: stats.maxStudents === 'unlimited' ? 0 : stats.maxStudents,
            usage: stats.maxStudents === 'unlimited' ? 0 : Math.min((stats.usedStudents / stats.maxStudents) * 100, 100),
            color: '#F59E0B',
            gradient: 'from-orange-500 to-red-600',
            icon: FaUserGraduate,
            description: 'Student accounts'
        }
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const status = getUsageStatus(data.usage);
            const IconComponent = data.icon;

            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-48"
                >
                    <div className="flex items-center mb-2">
                        <div className={`w-6 h-6 bg-gradient-to-r ${data.gradient} rounded-md flex items-center justify-center mr-2`}>
                            <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
                            <p className="text-xs text-gray-600">{data.description}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Used:</span>
                            <span className="font-semibold text-gray-900 text-sm">{data.used.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Max:</span>
                            <span className="font-semibold text-gray-900 text-sm">{data.max === 0 ? '∞' : data.max.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Usage:</span>
                            <span className="font-semibold text-gray-900 text-sm">{data.usage.toFixed(1)}%</span>
                        </div>

                        <div className="pt-1">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">{data.usage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="progress-bar"
                                    ref={(el) => {
                                        if (el) {
                                            el.style.width = `${data.usage}%`;
                                            el.style.background = `linear-gradient(90deg, ${data.color}80, ${data.color})`;
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${status.status === 'critical' ? 'bg-red-100 text-red-700' :
                            status.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                            {status.status === 'critical' ? 'Critical Usage' :
                                status.status === 'warning' ? 'High Usage' :
                                    'Healthy Usage'}
                        </div>
                    </div>
                </motion.div>
            );
        }
        return null;
    };

    const CustomBar = (props: any) => {
        const { x, y, width, height, payload } = props;
        const data = payload?.payload;

        if (!data) {
            return null;
        }

        const isUnlimited = data.max === 0;

        return (
            <g>
                {/* Usage bar with gradient */}
                <defs>
                    <linearGradient id={`gradient-${data.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={data.color} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={data.color} stopOpacity={1} />
                    </linearGradient>
                </defs>
                <rect
                    x={x}
                    y={y + (height * (1 - data.usage / 100))}
                    width={width}
                    height={height * (data.usage / 100)}
                    fill={`url(#gradient-${data.name})`}
                    rx={6}
                    className="transition-all duration-300 hover:opacity-80"
                />
                {/* Shine effect */}
                <rect
                    x={x}
                    y={y + (height * (1 - data.usage / 100))}
                    width={width}
                    height={height * (data.usage / 100)}
                    fill="url(#shine)"
                    rx={6}
                    opacity={0.3}
                />
                {/* Max capacity indicator line for unlimited */}
                {isUnlimited && (
                    <line
                        x1={x}
                        y1={y + height * 0.8}
                        x2={x + width}
                        y2={y + height * 0.8}
                        stroke="#6B7280"
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        opacity={0.6}
                    />
                )}
            </g>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Chart Container */}
            <div className="focus:outline-none chart-container">
                <div className="relative h-80 focus:outline-none chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            className="focus:outline-none"
                        >
                            <defs>
                                <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="white" stopOpacity={0.3} />
                                    <stop offset="50%" stopColor="white" stopOpacity={0.1} />
                                    <stop offset="100%" stopColor="white" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 14, fill: '#374151', fontWeight: 600 }}
                                axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                                tickLine={false}
                                tickMargin={10}
                                label={{
                                    value: t.dashboard?.stats?.users || 'Users',
                                    angle: -90,
                                    position: 'insideLeft',
                                    className: 'y-axis-label',
                                    offset: 0
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                content={() => (
                                    <div className="flex justify-center space-x-6 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-[#D1D5DB] rounded"></div>
                                            <span className="text-sm text-gray-600">Max Capacity</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                            <span className="text-sm text-gray-600">Used</span>
                                        </div>
                                    </div>
                                )}
                            />
                            <Bar dataKey="max" fill="#D1D5DB" radius={[6, 6, 0, 0]} barSize={32} />
                            <Bar dataKey="used" shape={<CustomBar />} radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default StatsBarChart; 