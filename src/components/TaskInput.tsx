import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Priority } from '../types';

interface TaskInputProps {
  onAddTask: (text: string, priority: Priority) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text, priority || 'low');
      setText('');
      setPriority('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6 animate-slide-down">
      <div className="flex flex-col gap-3">
        <div className="w-full">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="input-field w-full"
            required
          />
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="input-field w-full appearance-none"
              aria-label="Priority"
            >
              <option value="" disabled>Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary flex items-center justify-center px-4 py-2 shrink-0"
            aria-label="Add task"
          >
            <Plus className="h-5 w-5" />
            <span className="ml-1 hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </form>
  );
};