import React from 'react';
import { Layers } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in text-center px-4">
      <div className="relative mb-6 group cursor-default">
        <div className="absolute -inset-4 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/30 p-6 rounded-3xl shadow-glow relative z-10 transition-transform duration-300 hover:scale-105">
          <Layers className="h-12 w-12 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        Master your daily flow
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-base max-w-sm leading-relaxed">
        The ultimate simple daily planner for <span className="text-indigo-500 dark:text-indigo-400 font-medium">students, founders, and busy professionals</span>. Capture your tasks and juggle your responsibilities with ease.
      </p>
    </div>
  );
};