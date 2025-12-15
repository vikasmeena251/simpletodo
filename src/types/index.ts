export type Priority = 'low' | 'medium' | 'high';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
  checklist: ChecklistItem[];
  notes?: string;
}

export type Filter = 'all' | 'active' | 'completed' | 'high';

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface UserPreferences {
  name: string;
  pronouns: string;
  hasOnboarded: boolean;
}