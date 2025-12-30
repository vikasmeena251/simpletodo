import React from 'react';
import { LayoutList, Calendar, BarChart3, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavProps {
    currentView: 'tasks' | 'analytics' | 'calendar';
    onViewChange: (view: 'tasks' | 'analytics' | 'calendar') => void;
    onAddTask: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange, onAddTask }) => {
    return (
        <>
            {/* Floating Action Button - Only visible on Tasks view */}
            <AnimatePresence>
                {currentView === 'tasks' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-24 right-5 z-40 md:hidden"
                    >
                        <button
                            onClick={onAddTask}
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 active:scale-95 transition-all hover:scale-105"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 p-2 pb-safe bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 z-50 md:hidden pb-6">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <button
                        onClick={() => onViewChange('tasks')}
                        className={`mobile-nav-item flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === 'tasks' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        <div className={`p-1 rounded-lg transition-all ${currentView === 'tasks' ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''}`}>
                            <LayoutList className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium">Tasks</span>
                    </button>

                    <button
                        onClick={() => onViewChange('calendar')}
                        className={`mobile-nav-item flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === 'calendar' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        <div className={`p-1 rounded-lg transition-all ${currentView === 'calendar' ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''}`}>
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium">Calendar</span>
                    </button>

                    <button
                        onClick={() => onViewChange('analytics')}
                        className={`mobile-nav-item flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === 'analytics' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        <div className={`p-1 rounded-lg transition-all ${currentView === 'analytics' ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''}`}>
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium">Insights</span>
                    </button>
                </div>
            </nav>
        </>
    );
};
