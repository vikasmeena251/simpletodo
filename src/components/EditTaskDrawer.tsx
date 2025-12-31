import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar as CalendarIcon, Hash, Flag } from 'lucide-react';
import { Task, Priority, Category, CATEGORIES } from '../types';
import { DatePicker } from './DatePicker';

interface EditTaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskId: string, updates: Partial<Task>) => void;
    task: Task;
}

const priorities: Priority[] = ['high', 'medium', 'low'];

export const EditTaskDrawer: React.FC<EditTaskDrawerProps> = ({ isOpen, onClose, onSave, task }) => {
    const [text, setText] = useState(task.text);
    const [priority, setPriority] = useState<Priority>(task.priority);
    const [category, setCategory] = useState<Category>(task.category);
    const [dueDate, setDueDate] = useState<number | undefined>(task.dueDate);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Reset state when task changes or drawer opens
    useEffect(() => {
        if (isOpen) {
            setText(task.text);
            setPriority(task.priority);
            setCategory(task.category);
            setDueDate(task.dueDate);
        }
    }, [isOpen, task]);

    const handleSave = () => {
        onSave(task.id, {
            text,
            priority,
            category,
            dueDate
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0B1120] rounded-t-3xl z-[101] overflow-hidden shadow-2xl border-t border-slate-200/50 dark:border-slate-800/50 max-h-[90vh] flex flex-col"
                    >
                        {/* Handle Bar */}
                        <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        </div>

                        <div className="p-5 space-y-6 overflow-y-auto pb-safe">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Task</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Text Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Task Name
                                </label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="What needs to be done?"
                                />
                            </div>

                            {/* Priority Chips */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <Flag className="w-3.5 h-3.5" /> Priority
                                </div>
                                <div className="flex gap-3">
                                    {priorities.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold capitalize transition-all border-2 ${priority === p
                                                ? p === 'high' ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-900/20'
                                                    : p === 'medium' ? 'bg-amber-50 border-amber-500 text-amber-600 dark:bg-amber-900/20'
                                                        : 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20'
                                                : 'bg-white dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Chips */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <Hash className="w-3.5 h-3.5" /> Category
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(CATEGORIES).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setCategory(key as Category)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${category === key
                                                ? `bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 dark:text-indigo-300`
                                                : 'bg-white dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-3 relative">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <CalendarIcon className="w-3.5 h-3.5" /> Due Date
                                </div>
                                <button
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${dueDate
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                                        : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-800 text-slate-500'
                                        }`}
                                >
                                    <span className="font-medium">
                                        {dueDate ? new Date(dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'No Due Date'}
                                    </span>
                                    <CalendarIcon className="w-5 h-5 opacity-70" />
                                </button>

                                <AnimatePresence>
                                    {showDatePicker && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className=""
                                        >
                                            <div className="pt-2">
                                                <DatePicker
                                                    currentDate={dueDate}
                                                    onSelect={(date) => {
                                                        setDueDate(date);
                                                        setShowDatePicker(false);
                                                    }}
                                                    onClose={() => setShowDatePicker(false)}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
                            >
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>

                            <div className="h-6 md:hidden" /> {/* Safety spacer for mobile bottom bar */}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
