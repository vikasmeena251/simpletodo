import React, { useState, useMemo } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, addMonths, subMonths,
    addWeeks, subWeeks, addDays, subDays, isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task, CATEGORIES, Priority } from '../types';

interface CalendarViewProps {
    tasks: Task[];
}

type CalendarMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mode, setMode] = useState<CalendarMode>('month');

    // Navigation Handlers
    const next = () => {
        if (mode === 'month') setCurrentDate(addMonths(currentDate, 1));
        else if (mode === 'week') setCurrentDate(addWeeks(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 1));
    };

    const prev = () => {
        if (mode === 'month') setCurrentDate(subMonths(currentDate, 1));
        else if (mode === 'week') setCurrentDate(subWeeks(currentDate, 1));
        else setCurrentDate(subDays(currentDate, 1));
    };

    const today = () => setCurrentDate(new Date());

    // Generate Days for Grid
    const days = useMemo(() => {
        let start = startOfMonth(currentDate);
        let end = endOfMonth(currentDate);

        if (mode === 'week') {
            start = startOfWeek(currentDate);
            end = endOfWeek(currentDate);
        } else if (mode === 'month') {
            // Expand to full weeks for month view
            start = startOfWeek(start);
            end = endOfWeek(end);
        } else {
            // Day mode
            return [currentDate];
        }

        return eachDayOfInterval({ start, end });
    }, [currentDate, mode]);

    // Group tasks by date
    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>();
        tasks.forEach(task => {
            if (task.dueDate) {
                const dateKey = format(task.dueDate, 'yyyy-MM-dd');
                const existing = map.get(dateKey) || [];
                map.set(dateKey, [...existing, task]);
            }
        });
        return map;
    }, [tasks]);

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case 'high': return 'bg-rose-500';
            case 'medium': return 'bg-amber-500';
            case 'low': return 'bg-blue-500';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">

            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            {format(currentDate, mode === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {mode === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM d')}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {(['month', 'week', 'day'] as CalendarMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${mode === m
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

                    <div className="flex items-center gap-1">
                        <button onClick={prev} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={today} className="px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                            Today
                        </button>
                        <button onClick={next} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="glass-panel p-4 rounded-2xl overflow-hidden min-h-[600px]">
                {/* Weekday Headers */}
                {mode !== 'day' && (
                    <div className="grid grid-cols-7 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                )}

                {/* Days */}
                <div className={`
          ${mode === 'day' ? 'grid-cols-1' : mode === 'week' ? 'flex flex-col md:grid md:grid-cols-7' : 'grid grid-cols-7'} 
          gap-2 h-full
        `}>
                    {days.map(day => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayTasks = tasksByDate.get(dateKey) || [];
                        const isTodayDate = isToday(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <motion.div
                                key={day.toISOString()}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => {
                                    setCurrentDate(day);
                                    setMode('day');
                                }}
                                className={`
                  p-2 rounded-xl transition-all cursor-pointer group relative border
                  ${isTodayDate
                                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                    }
                  ${!isCurrentMonth && mode === 'month' ? 'opacity-40' : 'opacity-100'}
                  ${mode === 'day' ? 'min-h-[400px]' : ''}
                  ${mode === 'month' ? 'min-h-[80px] sm:min-h-[100px]' : ''}
                  ${mode === 'week' ? 'min-h-[auto] md:min-h-[600px] mb-2 md:mb-0' : ''}
                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`
                      text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                      ${isTodayDate ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'}
                    `}>
                                            {format(day, 'd')}
                                        </span>
                                        {mode === 'week' && (
                                            <span className="md:hidden text-sm font-medium text-slate-500">
                                                {format(day, 'EEEE')}
                                            </span>
                                        )}
                                    </div>
                                    {dayTasks.length > 0 && mode !== 'day' && (
                                        <span className="text-xs font-medium text-slate-400">
                                            {dayTasks.length}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    {mode === 'month' ? (
                                        // Month View: Dots / Tiny Bars
                                        dayTasks.slice(0, 4).map(task => (
                                            <div key={task.id} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors">
                                                <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`} />
                                                <span className={`text-[10px] truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {task.text}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        // Week/Day View: Full Cards
                                        dayTasks.map(task => (
                                            <div
                                                key={task.id}
                                                className={`
                           flex items-center gap-2 p-2 rounded-lg border text-xs sm:text-sm animate-slide-up
                           ${task.completed ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}
                         `}
                                            >
                                                <div className={`w-1 h-8 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{task.text}</p>
                                                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                                                        <span className={`px-1.5 py-0.5 rounded ${CATEGORIES[task.category]?.bg || 'bg-slate-100'} ${CATEGORIES[task.category]?.color || 'text-slate-500'} bg-opacity-50`}>
                                                            {CATEGORIES[task.category]?.label || 'Task'}
                                                        </span>
                                                        {task.completed && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {mode === 'month' && dayTasks.length > 4 && (
                                        <div className="text-[10px] text-slate-400 px-1.5">
                                            +{dayTasks.length - 4} more
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
