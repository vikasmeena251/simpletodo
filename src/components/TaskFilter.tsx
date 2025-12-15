import React from 'react';
import { Filter } from '../types';

interface TaskFilterProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  tasksCount: {
    all: number;
    active: number;
    completed: number;
    high: number;
  };
  onClearCompleted: () => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  filter,
  onFilterChange,
  tasksCount,
  onClearCompleted,
}) => {
  return (
    <div className="mb-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-slide-down">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => onFilterChange('all')}
          >
            All ({tasksCount.all})
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'high'
                ? 'bg-error-100 dark:bg-error-900/50 text-error-600 dark:text-error-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => onFilterChange('high')}
          >
            High ({tasksCount.high})
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'active'
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => onFilterChange('active')}
          >
            Active ({tasksCount.active})
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => onFilterChange('completed')}
          >
            Completed ({tasksCount.completed})
          </button>
        </div>
        
        {tasksCount.completed > 0 && (
          <div className="flex justify-end">
            <button
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-error-600 dark:hover:text-error-500 transition-colors"
              onClick={onClearCompleted}
            >
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};