export type Priority = 'low' | 'medium' | 'high';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'finance' | 'general';

export const CATEGORIES: Record<Category, { label: string; color: string; bg: string }> = {
  work: { label: 'Work', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  personal: { label: 'Personal', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  shopping: { label: 'Shopping', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  health: { label: 'Health', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  finance: { label: 'Finance', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  general: { label: 'General', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
};

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
  category: Category;
  checklist: ChecklistItem[];
  notes?: string;
  dueDate?: number;
  recurrence?: Recurrence;
  completedAt?: number;
}

export type Recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type Filter = 'all' | 'active' | 'completed' | 'high' | 'today' | 'upcoming';

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface UserPreferences {
  name: string;
  pronouns: string;
  hasOnboarded: boolean;
}