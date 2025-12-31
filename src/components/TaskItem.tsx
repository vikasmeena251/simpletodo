import React, { useState } from 'react';
import { Check, Trash2, Edit, Save, GripVertical, Plus, List, AlignLeft, Calendar, Clock, Repeat, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority, ChecklistItem, Category, CATEGORIES, Recurrence } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DatePicker } from './DatePicker';
import { isToday, isTomorrow, isOverdue } from '../utils/date';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority: Priority, category: Category, checklist: ChecklistItem[], notes?: string, dueDate?: number, recurrence?: Recurrence) => void;
  isOverlay?: boolean;
}

export const TaskItem = React.forwardRef<HTMLLIElement, TaskItemProps>(({
  task,
  onToggle,
  onDelete,
  onUpdate,
  isOverlay,
}, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<Category>(task.category);
  const [showChecklist, setShowChecklist] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState(task.notes || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: (isDragging || isOverlay || showDatePicker) ? 60 : 1,
  };

  // Merge refs
  const setRef = (node: HTMLLIElement) => {
    setNodeRef(node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      // @ts-ignore
      ref.current = node;
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editText.trim()) {
      onUpdate(task.id, editText, editPriority, editCategory, task.checklist, notes, task.dueDate, task.recurrence);
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
      onUpdate(task.id, task.text, task.priority, task.category, newChecklist, notes, task.dueDate, task.recurrence);
      setNewChecklistItem('');
    }
  };

  const handleDateSelect = (date: number, recurrence?: Recurrence) => {
    onUpdate(task.id, task.text, task.priority, task.category, task.checklist, notes, date, recurrence);
    setShowDatePicker(false);
  };

  const checklistProgress = task.checklist.length > 0
    ? Math.round((task.checklist.filter(item => item.completed).length / task.checklist.length) * 100)
    : 0;

  const priorityColor = {
    high: 'bg-rose-500 text-rose-50 shadow-rose-500/20',
    medium: 'bg-amber-500 text-amber-50 shadow-amber-500/20',
    low: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };

  const getDateBadgeStyle = (date: number) => {
    if (isOverdue(date) && !isToday(date)) return 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30';
    if (isToday(date)) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
    if (isTomorrow(date)) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
  };

  const formatDateText = (date: number) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <motion.li
      ref={setRef}
      style={style}
      layout
      whileTap={{ scale: 0.995 }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: isDragging ? 1.02 : 1,
        y: 0,
        zIndex: (isDragging || isOverlay || showDatePicker) ? 60 : 0
      }}
      exit={{ opacity: 0, scale: 0.9, height: 0 }}
      className={`
        group relative glass-card rounded-xl mb-2 transition-all duration-300
        ${(isDragging || isOverlay) ? 'shadow-2xl ring-1 ring-indigo-500/30 cursor-grabbing' : 'hover:shadow-md'}
        ${task.completed ? 'opacity-60' : 'opacity-100'}
        ${isOverlay ? 'bg-white dark:bg-[#1E293B]' : ''}
        ${isDragging ? 'opacity-80' : ''}
      `}
    >
      {/* Swipe Action Backgrounds */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity md:hidden pointer-events-none">
        <div className="flex items-center gap-2 text-emerald-500 font-medium opacity-0" style={{ opacity: 0 }}>
          <Check className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2 text-rose-500 font-medium opacity-0" style={{ opacity: 0 }}>
          <Trash2 className="w-5 h-5" />
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x > 100) {
            onToggle(task.id);
          } else if (info.offset.x < -100) {
            onDelete(task.id);
          }
        }}
        className="relative bg-inherit z-10"
      >
        <div className="flex items-start p-3 gap-3 bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-xl rounded-xl">

          {isEditing ? (
            <form onSubmit={handleSave} className="flex-1 space-y-3">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="input-field w-full text-sm"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="input-field flex-1 text-sm py-2"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Category)}
                  className="input-field flex-1 text-sm py-2"
                >
                  {Object.entries(CATEGORIES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center justify-center px-4 shrink-0 py-2"
                >
                  <Save className="h-4 w-4" />
                  <span className="ml-1">Save</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggle(task.id)}
                className={`checkbox shrink-0 mt-1 ${task.completed ? 'checkbox-checked' : ''}`}
              >
                {task.completed && <Check className="h-3 w-3 text-white" />}
              </motion.button>

              <div
                className="flex-1 min-w-0 py-1 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <p
                  className={`text-slate-700 dark:text-slate-200 text-[15px] font-medium break-words leading-relaxed transition-all duration-300
                  ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}
                `}
                >
                  {task.text}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${priorityColor[task.priority]} shadow-sm`}>
                    {task.priority}
                  </span>

                  <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full ${CATEGORIES[task.category].bg} ${CATEGORIES[task.category].color} shadow-sm`}>
                    {CATEGORIES[task.category].label}
                  </span>

                  {task.checklist.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-1.5 py-0.5 rounded-md">
                      <List className="w-3 h-3" />
                      <span>{checklistProgress}%</span>
                    </div>
                  )}

                  {task.dueDate && (
                    <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getDateBadgeStyle(task.dueDate)}`}>
                      {task.recurrence ? <Repeat className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{formatDateText(task.dueDate)}</span>
                      {task.recurrence && <span className="opacity-75 text-[9px] uppercase ml-0.5">{task.recurrence}</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Interaction Indicators */}
              <div className="flex items-center gap-1 shrink-0">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="text-slate-300 dark:text-slate-500"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>

                <div
                  {...listeners}
                  {...attributes}
                  className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 p-2 -mr-2 transition-colors touch-none"
                >
                  <GripVertical className="h-4 w-4" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Expanded Action Bar */}
        <AnimatePresence>
          {!isEditing && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100 dark:border-slate-800/50"
            >
              <div className="flex items-center justify-between p-2 px-3 gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowChecklist(!showChecklist); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showChecklist ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                    Checklist
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showNotes ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    Notes
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDatePicker(!showDatePicker); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showDatePicker ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Date
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
              {showDatePicker && (
                <div className="p-2 border-t border-slate-100 dark:border-slate-800/50">
                  <DatePicker
                    onSelect={(date, recurrence) => { handleDateSelect(date, recurrence); }}
                    onClose={() => setShowDatePicker(false)}
                    currentDate={task.dueDate}
                    currentRecurrence={task.recurrence}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showChecklist && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-slate-800/50"
          >
            <div className="p-4 pl-12">
              <ul className="space-y-2 mb-3">
                {task.checklist.map(item => (
                  <li key={item.id} className="flex items-center gap-2 group/item">
                    <button
                      onClick={() => {
                        const newChecklist = task.checklist.map(i =>
                          i.id === item.id ? { ...i, completed: !i.completed } : i
                        );
                        onUpdate(task.id, task.text, task.priority, task.category, newChecklist, notes, task.dueDate);
                      }}
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center transition-colors
                        ${item.completed
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
                        }
                      `}
                    >
                      {item.completed && <Check className="h-2.5 w-2.5 text-white" />}
                    </button>
                    <span className={`text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => {
                        const newChecklist = task.checklist.filter(i => i.id !== item.id);
                        onUpdate(task.id, task.text, task.priority, task.category, newChecklist, notes, task.dueDate);
                      }}
                      className="ml-auto opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add subtask..."
                  className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-sm focus:border-primary-500 outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                />
                <button type="submit" className="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 p-1 rounded">
                  <Plus className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {showNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-slate-800/50"
          >
            <div className="p-4 pl-12">
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  onUpdate(task.id, task.text, task.priority, task.category, task.checklist, e.target.value, task.dueDate);
                }}
                placeholder="Add notes..."
                className="w-full h-24 bg-transparent resize-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
});