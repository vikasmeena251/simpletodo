import React, { useState } from 'react';
import { Plus, ArrowUp } from 'lucide-react';
import { Priority, Category, CATEGORIES } from '../types';

interface TaskInputProps {
  onAddTask: (text: string, priority: Priority, category: Category) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('low');
  const [category, setCategory] = useState<Category>('personal');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text, priority, category);
      setText('');
      setPriority('low'); // Reset to default
      setCategory('personal');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group z-10">
      <div
        className={`
          flex flex-col sm:flex-row gap-2 p-2 rounded-2xl transition-all duration-300
          ${isFocused ? 'bg-white shadow-xl ring-2 ring-primary-500/20 dark:bg-slate-800' : 'bg-white/80 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800'}
          backdrop-blur-md border border-slate-200 dark:border-slate-700/50
        `}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          required
        />

        <div className="flex items-center gap-2 px-2 sm:px-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2 sm:pt-0">
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={`
                appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors outline-none
                ${priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' :
                  priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}
              `}
              aria-label="Priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ArrowUp className={`w-3 h-3 ${priority === 'high' ? 'text-rose-500' :
                priority === 'medium' ? 'text-amber-500' : 'text-slate-400'
                }`} />
            </div>
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={`
                appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors outline-none
                ${CATEGORIES[category].bg} ${CATEGORIES[category].color} hover:bg-opacity-80
              `}
              aria-label="Category"
            >
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ArrowUp className={`w-3 h-3 ${CATEGORIES[category].color}`} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="btn btn-primary ml-auto py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all"
            aria-label="Add task"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Add</span>
          </button>
        </div>
      </div>
    </form>
  );
};