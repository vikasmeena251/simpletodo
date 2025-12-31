import { Moon, Sun, Sparkles, LayoutList, BarChart3, Calendar, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  userName?: string;
  currentView: 'tasks' | 'analytics' | 'calendar';
  onViewChange: (view: 'tasks' | 'analytics' | 'calendar') => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, currentView, onViewChange, onShare }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass-panel border-t-0 border-x-0 rounded-none">
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              Simple Todo
            </h1>
            {userName && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hello, {userName}</p>}
          </div>
        </div>

        {/* Desktop Nav & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl shrink-0">
            <button
              onClick={() => onViewChange('tasks')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${currentView === 'tasks'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>Tasks</span>
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${currentView === 'calendar'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${currentView === 'analytics'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Insights</span>
            </button>
          </div>

          <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 shrink-0"></div>

          <button
            onClick={onShare}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
            aria-label="Share tasks"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 shrink-0"></div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};