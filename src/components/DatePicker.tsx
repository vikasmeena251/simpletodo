import React, { useRef, useEffect } from 'react';
import { Recurrence } from '../types';
import { Calendar as CalendarIcon, Sun, ChevronRight, Repeat } from 'lucide-react';

interface DatePickerProps {
    onSelect: (date: number, recurrence?: Recurrence) => void;
    onClose: () => void;
    currentDate?: number;
    currentRecurrence?: Recurrence;
}

export const DatePicker: React.FC<DatePickerProps> = ({ onSelect, onClose, currentDate, currentRecurrence }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            // Create date from string (YYYY-MM-DD) and set to appropriate time
            const date = new Date(e.target.value);
            // Adjust for timezone offset to prevent day shifting
            const userTimezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
            onSelect(adjustedDate.getTime(), currentRecurrence);
        }
    };

    const setToday = () => {
        onSelect(Date.now(), currentRecurrence);
    };

    const setTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        onSelect(d.getTime(), currentRecurrence);
    };

    const setRecurrence = (type: Recurrence | undefined) => {
        onSelect(currentDate || Date.now(), type);
    };

    // Format current date for input value (YYYY-MM-DD)
    const dateValue = currentDate
        ? new Date(currentDate).toISOString().split('T')[0]
        : '';

    return (
        <div
            ref={ref}
            className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-scale-in origin-top-right"
        >
            <div className="space-y-1">
                <button
                    onClick={setToday}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Today</span>
                    <span className="ml-auto text-xs text-slate-400 group-hover:text-amber-500">
                        {new Date().toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                </button>

                <button
                    onClick={setTomorrow}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                >
                    <ChevronRight className="w-4 h-4 text-primary-500" />
                    <span>Tomorrow</span>
                    <span className="ml-auto text-xs text-slate-400 group-hover:text-primary-500">
                        {new Date(Date.now() + 86400000).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                </button>
            </div>

            <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

            <div className="px-3 py-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Pick Date
                </label>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        type="date"
                        value={dateValue}
                        onChange={handleDateChange}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Force show picker on some browsers if needed
                            if (e.target instanceof HTMLInputElement) {
                                try {
                                    e.target.showPicker();
                                } catch (error) {
                                    // Fallback for browsers causing errors or not supporting showPicker explicitly here
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

            <div className="px-3 py-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Repeat
                </label>
                <div className="flex gap-1">
                    <button
                        onClick={() => setRecurrence(undefined)}
                        className={`flex-1 text-xs py-1.5 rounded-md border ${currentRecurrence === undefined
                            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                    >
                        None
                    </button>
                    <button
                        onClick={() => setRecurrence('daily')}
                        className={`flex-1 text-xs py-1.5 rounded-md border ${currentRecurrence === 'daily'
                            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setRecurrence('weekly')}
                        className={`flex-1 text-xs py-1.5 rounded-md border ${currentRecurrence === 'weekly'
                            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setRecurrence('monthly')}
                        className={`flex-1 text-xs py-1.5 rounded-md border ${currentRecurrence === 'monthly'
                            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                    >
                        Month
                    </button>
                </div>
            </div>
        </div>
    );
};
