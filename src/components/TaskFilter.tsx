import React from 'react';
import { Filter } from '../types';
import { Trash2 } from 'lucide-react';

interface TaskFilterProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  tasksCount: {
    all: number;
    active: number;
    completed: number;
    high: number;
    today: number;
    upcoming: number;
  };
  onClearCompleted: () => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  filter,
  onFilterChange,
  tasksCount,
  onClearCompleted,
}) => {
  const allFilters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'high', label: 'High Priority' },
  ];

  const getFilterCount = (filterId: Filter) => {
    switch (filterId) {
      case 'all': return tasksCount.all;
      case 'active': return tasksCount.active;
      case 'completed': return tasksCount.completed;
      case 'high': return tasksCount.high;
      case 'today': return tasksCount.today;
      case 'upcoming': return tasksCount.upcoming;
      default: return 0;
    }
  };

  const visibleFilters = allFilters.filter(f => {
    // Always show core filters
    if (['all', 'active', 'completed'].includes(f.value)) return true;
    // Show dynamic filters only if they have items
    return getFilterCount(f.value) > 0;
  });

  return (
    <div className="glass-panel p-2 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
      <div className="flex p-1 bg-slate-100 dark:bg-slate-950/50 rounded-lg w-full sm:w-auto overflow-x-auto selection-none">
        {visibleFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`
              relative px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap
              ${filter === f.value
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }
            `}
          >
            {f.label}
            {getFilterCount(f.value) > 0 && (
              <span className={`ml-2 text-[10px] py-0.5 px-1.5 rounded-full ${filter === f.value
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'bg-slate-200 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                }`}>
                {getFilterCount(f.value)}
              </span>
            )}
          </button>
        ))}
      </div>

      {tasksCount.completed > 0 && (
        <button
          onClick={onClearCompleted}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear completed</span>
        </button>
      )}
    </div>
  );
};