import React from 'react';
import { CheckSquare } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-full mb-4">
        <CheckSquare className="h-8 w-8 text-primary-600 dark:text-primary-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        No tasks yet
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
        Add your first task using the form above. You can organize, prioritize, and track your tasks easily.
      </p>
    </div>
  );
};