import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface ToastProps {
    message: string;
    onUndo?: () => void;
    isVisible: boolean;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onUndo, isVisible, onDismiss }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onDismiss, 10000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onDismiss]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm"
                >
                    <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium">{message}</span>
                        </div>
                        {onUndo && (
                            <button
                                onClick={() => {
                                    onUndo();
                                    onDismiss();
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Undo
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
