import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Share2 } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
    isEmpty?: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, isEmpty }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                        <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Share Tasks</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {isEmpty ? (
                                <div className="space-y-6 text-center py-4">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Share2 className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks to share</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto">
                                            Create a few tasks first so you can share your list with others.
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="btn btn-primary w-full py-3"
                                    >
                                        Got it
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Anyone with this link can view and import your current list of tasks. The data is encoded directly into the URL.
                                        </p>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={shareUrl}
                                                className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 outline-none"
                                            />
                                            <button
                                                onClick={handleCopy}
                                                className={`shrink-0 p-2.5 rounded-xl border transition-all flex items-center gap-2 ${copied
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500'
                                                    }`}
                                            >
                                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleCopy}
                                            className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                                        >
                                            {copied ? 'Copied Link' : 'Copy Share Link'}
                                        </button>
                                        <a
                                            href={shareUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary w-full py-3 flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Test Link
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
