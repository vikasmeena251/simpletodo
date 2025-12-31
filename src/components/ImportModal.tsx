import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, AlertCircle, RefreshCcw, Merge, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
    onImport: (strategy: 'replace' | 'merge') => void;
    error: string | null;
    timestamp?: number;
    isAlreadyImported?: boolean;
    isUpdate?: boolean;
    isLocalEmpty?: boolean;
}

export const ImportModal: React.FC<ImportModalProps> = ({
    isOpen,
    onClose,
    tasks,
    onImport,
    error,
    timestamp,
    isAlreadyImported,
    isUpdate,
    isLocalEmpty
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                        <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Tasks</h2>
                                </div>
                                {!error && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                )}
                            </div>

                            {error ? (
                                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-rose-800 dark:text-rose-400">Import Failed</p>
                                        <p className="text-xs text-rose-600 dark:text-rose-500">{error}</p>
                                    </div>
                                </div>
                            ) : isAlreadyImported ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Already Imported</p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-500">
                                                This link has already been added to your list.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="btn btn-primary w-full py-3"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                                            {isUpdate ? 'Update Existing Tasks?' : "You've received a share link!"}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {isUpdate
                                                ? 'This link contains different task data from what you previously imported.'
                                                : `This link contains **${tasks.length} tasks**.`
                                            }
                                            {timestamp && (
                                                <span className="block mt-1 opacity-70">
                                                    Exported on: {new Date(timestamp).toLocaleString()}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Preview List */}
                                    <div className="max-h-48 overflow-y-auto pr-2 -mr-2 space-y-2 custom-scrollbar">
                                        {tasks.slice(0, 5).map(task => (
                                            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{task.text}</span>
                                            </div>
                                        ))}
                                        {tasks.length > 5 && (
                                            <p className="text-[10px] text-center text-slate-400 font-medium italic">
                                                and {tasks.length - 5} more tasks...
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {isLocalEmpty ? (
                                            <button
                                                onClick={() => onImport('replace')}
                                                className="sm:col-span-2 group relative flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-center overflow-hidden"
                                            >
                                                <Download className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                                <div className="text-center">
                                                    <p className="text-base font-bold text-slate-900 dark:text-white">Accept & Add Tasks</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Start your list with these shared tasks</p>
                                                </div>
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => onImport('merge')}
                                                    className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-indigo-500/20 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left overflow-hidden"
                                                >
                                                    <Merge className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Merge</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Add new & keep latest</p>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => onImport('replace')}
                                                    className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-rose-500/20 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left overflow-hidden"
                                                >
                                                    <RefreshCcw className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Replace</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Overwrite local data</p>
                                                    </div>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                    >
                                        Cancel Import
                                    </button>
                                </div>
                            )}

                            {error && (
                                <button
                                    onClick={onClose}
                                    className="btn btn-primary w-full py-3"
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
