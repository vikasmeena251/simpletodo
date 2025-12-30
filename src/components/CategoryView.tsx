import React from 'react';
import { Task, Priority, ChecklistItem, Category, CATEGORIES } from '../types';
import { TaskItem } from './TaskItem';
import { AnimatePresence } from 'framer-motion';

interface CategoryViewProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, text: string, priority: Priority, category: Category, checklist: ChecklistItem[], notes?: string, dueDate?: number) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
    tasks,
    onToggle,
    onDelete,
    onUpdate,
}) => {
    // Group tasks by category
    const groupedTasks = tasks.reduce((acc, task) => {
        const cat = task.category || 'personal'; // fallback
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(task);
        return acc;
    }, {} as Record<Category, Task[]>);

    // Filter out categories with no tasks
    const activeCategories = (Object.keys(CATEGORIES) as Category[]).filter(
        (cat) => groupedTasks[cat] && groupedTasks[cat].length > 0
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {activeCategories.map((category) => (
                <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${CATEGORIES[category].bg} ${CATEGORIES[category].color}`}>
                            {CATEGORIES[category].label}
                        </span>
                        <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                            {groupedTasks[category].length}
                        </span>
                    </div>

                    <ul className="space-y-2">
                        <AnimatePresence mode="popLayout">
                            {groupedTasks[category].map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                />
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            ))}

            {activeCategories.length === 0 && (
                <div className="glass-panel text-center py-12 animate-fade-in">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No tasks found.</p>
                </div>
            )}
        </div>
    );
};
