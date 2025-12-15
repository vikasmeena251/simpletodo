import React, { useState } from 'react';
import { Check, Trash2, Edit, Save, GripVertical, Plus, List, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority, ChecklistItem } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority: Priority, checklist: ChecklistItem[], notes?: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [showChecklist, setShowChecklist] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editText.trim()) {
      onUpdate(task.id, editText, editPriority, task.checklist, notes);
      setIsEditing(false);
    }
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistItem.trim()) {
      const newChecklist = [
        ...task.checklist,
        { id: crypto.randomUUID(), text: newChecklistItem, completed: false }
      ];
      onUpdate(task.id, task.text, task.priority, newChecklist, notes);
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const newChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate(task.id, task.text, task.priority, newChecklist, notes);
  };

  const checklistProgress = task.checklist.length > 0
    ? Math.round((task.checklist.filter(item => item.completed).length / task.checklist.length) * 100)
    : 0;

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none'
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ 
        duration: 0.5,
        type: 'spring',
        stiffness: 400,
        damping: 40
      }}
      className={`group relative bg-white dark:bg-slate-900/60 backdrop-blur-sm shadow-md hover:shadow-lg 
        rounded-lg mb-3 transition-all duration-300 ${isDragging ? 'shadow-xl dark:shadow-slate-900/50' : ''}`}
      layout
    >
      <div className="flex items-start p-4 gap-3">
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 mt-1 shrink-0"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="flex-1 space-y-3">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="input-field w-full"
              autoFocus
            />
            <div className="flex gap-2">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                className="input-field flex-1"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                type="submit"
                className="btn btn-primary flex items-center justify-center px-3 shrink-0"
              >
                <Save className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">Save</span>
              </button>
            </div>
          </form>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggle(task.id)}
              className={`checkbox shrink-0 mt-1 ${task.completed ? 'checkbox-checked' : ''}`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-3.5 w-3.5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <div className="flex-1 min-w-0">
              <motion.p
                animate={{
                  opacity: task.completed ? 0.6 : 1,
                }}
                className={`text-slate-800 dark:text-slate-200 text-sm font-normal break-words ${
                  task.completed ? 'line-through' : ''
                }`}
              >
                {task.text}
              </motion.p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full capitalize shrink-0 ${
                    task.priority === 'high' 
                      ? 'bg-rose-500/80 text-white'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/80 text-white'
                      : 'bg-slate-200/80 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {task.priority}
                </span>
                {task.checklist.length > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    {checklistProgress}% complete
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChecklist(!showChecklist)}
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-500 transition-colors"
                aria-label="Toggle checklist"
              >
                <List className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotes(!showNotes)}
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-500 transition-colors"
                aria-label="Toggle notes"
              >
                <FileText className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-500 transition-colors"
                aria-label="Edit task"
              >
                <Edit className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-2 text-slate-500 hover:text-error-600 dark:text-slate-400 dark:hover:text-error-500 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showChecklist && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add checklist item..."
                className="input-field flex-1"
              />
              <button type="submit" className="btn btn-primary shrink-0">
                <Plus className="h-4 w-4" />
              </button>
            </form>
            <ul className="space-y-2">
              {task.checklist.map(item => (
                <li key={item.id} className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleChecklistItem(item.id)}
                    className={`checkbox shrink-0 ${item.completed ? 'checkbox-checked' : ''}`}
                  >
                    {item.completed && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <span className={`text-sm break-words ${item.completed ? 'line-through opacity-60' : ''}`}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {showNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                onUpdate(task.id, task.text, task.priority, task.checklist, e.target.value);
              }}
              placeholder="Add notes..."
              className="input-field w-full h-24 resize-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};