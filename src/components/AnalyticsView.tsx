import React, { useMemo, useState } from 'react';
import { Task, CATEGORIES } from '../types';
import {
    isToday, isSameDay, subDays, startOfDay, eachDayOfInterval,
    differenceInDays, endOfDay, isWithinInterval, format, addDays, isFuture
} from 'date-fns';
import { Flame, Trophy, ChevronLeft, ChevronRight, TrendingUp, PieChart as PieChartIcon, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { FocusRing } from './FocusRing';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface AnalyticsViewProps {
    tasks: Task[];
}

type DateRange = 'week' | 'month' | 'all';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
    // --- DAILY FOCUS STATE (The Ring) ---
    const [ringDate, setRingDate] = useState(new Date());

    // --- HISTORICAL ANALYSIS STATE (The Charts) ---
    const [range, setRange] = useState<DateRange>('week');

    // ==========================================
    // 1. FOCUS RING LOGIC
    // ==========================================
    const dailyStats = useMemo(() => {
        const dateTasks = tasks.filter(t => {
            const dueOnDate = t.dueDate ? isSameDay(t.dueDate, ringDate) : false;
            const completedOnDate = t.completed && t.completedAt ? isSameDay(t.completedAt, ringDate) : false;
            return dueOnDate || completedOnDate;
        });

        const completedCount = dateTasks.filter(t => t.completed).length;
        const totalCount = dateTasks.length;
        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return { completedCount, totalCount, percentage };
    }, [tasks, ringDate]);

    const streak = useMemo(() => {
        let currentStreak = 0;
        const today = new Date();
        const hasActivityToday = tasks.some(t => t.completedAt && isToday(t.completedAt));
        let checkDate = hasActivityToday ? today : subDays(today, 1);

        for (let i = 0; i < 365; i++) {
            const dayHasActivity = tasks.some(t => t.completedAt && isSameDay(t.completedAt, checkDate));
            if (dayHasActivity) {
                currentStreak++;
                checkDate = subDays(checkDate, 1);
            } else {
                break;
            }
        }
        return currentStreak;
    }, [tasks]);

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev' ? subDays(ringDate, 1) : addDays(ringDate, 1);
        if (!isFuture(newDate)) setRingDate(newDate);
    };

    const isRingToday = isToday(ringDate);

    // ==========================================
    // 2. HISTORICAL CHART LOGIC
    // ==========================================
    const rangeConfig = {
        week: { label: 'Last 7 Days', days: 7 },
        month: { label: 'Last 30 Days', days: 30 },
        all: { label: 'All Time', days: 365 },
    };
    const currentRange = rangeConfig[range];

    const completedTasksInRange = useMemo(() => {
        if (range === 'all') return tasks.filter(t => t.completed && t.completedAt);

        const end = endOfDay(new Date());
        const start = startOfDay(subDays(end, currentRange.days - 1));

        return tasks.filter(t => {
            if (!t.completed || !t.completedAt) return false;
            return isWithinInterval(t.completedAt, { start, end });
        });
    }, [tasks, range, currentRange.days]);

    // Activity Data (Area Chart)
    const activityData = useMemo(() => {
        const end = endOfDay(new Date());
        // For 'all', verify if we have tasks older than 30 days to decide range, but let's default to last 30d for clarity if 'all' is selected on chart
        const start = startOfDay(subDays(end, currentRange.days - 1));
        const chartStart = range === 'all' ? startOfDay(subDays(end, 29)) : start;

        return eachDayOfInterval({ start: chartStart, end }).map(day => {
            const count = completedTasksInRange.filter(t =>
                t.completedAt && isSameDay(t.completedAt, day)
            ).length;
            return {
                date: format(day, 'MMM dd'),
                count,
            };
        });
    }, [completedTasksInRange, range, currentRange.days]);

    // Category Data (Pie Chart)
    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        completedTasksInRange.forEach(t => {
            counts[t.category] = (counts[t.category] || 0) + 1;
        });

        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        return Object.entries(counts)
            .map(([key, value], index) => ({
                name: CATEGORIES[key as keyof typeof CATEGORIES]?.label || key,
                value,
                color: COLORS[index % COLORS.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [completedTasksInRange]);

    // Metrics
    const metrics = useMemo(() => {
        const total = completedTasksInRange.length;
        const days = range === 'all' ? 30 : currentRange.days;
        const velocity = (total / days).toFixed(1);

        const tasksWithDueDate = completedTasksInRange.filter(t => t.dueDate);
        const onTime = tasksWithDueDate.filter(t => t.completedAt! <= t.dueDate!).length;
        const onTimeRate = tasksWithDueDate.length > 0 ? Math.round((onTime / tasksWithDueDate.length) * 100) : 0;

        return { total, velocity, onTimeRate };
    }, [completedTasksInRange, range, currentRange.days]);


    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-24 pt-4">

            {/* --- SECTION 1: DAILY FOCUS --- */}
            <div>
                <div className="text-center space-y-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Focus</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {dailyStats.percentage === 100 && dailyStats.totalCount > 0
                                ? "Goal Achieved! 🌟"
                                : "Consistency is key."}
                        </p>
                    </div>

                    {/* Date Navigator */}
                    <div className="flex items-center justify-center gap-4 bg-white dark:bg-slate-800/50 p-2 rounded-2xl w-fit mx-auto shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <button onClick={() => navigateDate('prev')} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-all active:scale-95">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="min-w-[140px] text-center font-semibold text-slate-700 dark:text-slate-200">
                            {isRingToday ? "Today" : format(ringDate, 'EEE, MMM d')}
                        </div>
                        <button onClick={() => navigateDate('next')} disabled={isToday(ringDate)} className={`p-1.5 rounded-xl transition-all active:scale-95 ${isToday(ringDate) ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500'}`}>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    {/* Ring */}
                    <div className="flex justify-center scale-100 transition-all">
                        <FocusRing
                            progress={dailyStats.percentage}
                            label={`${dailyStats.percentage}%`}
                            subLabel={isRingToday ? "Today" : format(ringDate, 'MMM d')}
                            color={dailyStats.percentage === 100 ? '#10b981' : '#6366f1'}
                        />
                    </div>
                    {/* Ring Stats */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                                {dailyStats.completedCount} <span className="text-sm font-normal text-slate-400">/ {dailyStats.totalCount}</span>
                            </span>
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Completed</span>
                        </div>
                        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center relative overflow-hidden">
                            {streak > 2 && <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/20 blur-xl"></div>}
                            <div className="flex items-center gap-1 mb-1 z-10">
                                <span className="text-3xl font-bold text-orange-500 dark:text-orange-400">{streak}</span>
                                <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                            </div>
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 z-10">Streak</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

            {/* --- SECTION 2: HISTORICAL TRENDS --- */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Trends & Insights</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Analyze your long-term performance</p>
                    </div>
                    {/* Range Filter */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        {(['week', 'month', 'all'] as DateRange[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${range === r ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                {rangeConfig[r].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Completed</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{metrics.total}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Avg. Velocity</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{metrics.velocity}</h3>
                            <span className="text-xs text-slate-400">tasks / day</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">On-Time Rate</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{metrics.onTimeRate}%</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Area Chart */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            Activity Trend
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-purple-500" />
                            Category Breakdown
                        </h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center text-slate-400"><p>No data available</p></div>
                            )}
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">{entry.name}</span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">({entry.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
