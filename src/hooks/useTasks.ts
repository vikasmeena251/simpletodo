import { useCallback, useEffect, useState } from 'react';
import { Task, Priority, ChecklistItem, Category, Filter, Recurrence } from '../types';
import { isToday, isUpcoming, isOverdue, getNextRecurrenceDate } from '../utils/date';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (!savedTasks) return [];

      const parsed = JSON.parse(savedTasks);
      if (!Array.isArray(parsed)) return [];

      return parsed.map((task: Partial<Task>) => ({
        id: task.id || crypto.randomUUID(),
        text: task.text || '',
        completed: task.completed || false,
        createdAt: task.createdAt || Date.now(),
        priority: task.priority || 'low',
        category: task.category || 'personal',
        checklist: Array.isArray(task.checklist) ? task.checklist : [],
        notes: task.notes || '',
        dueDate: task.dueDate,
        completedAt: task.completedAt,
        recurrence: task.recurrence,
        updatedAt: task.updatedAt || task.createdAt || Date.now(),
      }));
    } catch (e) {
      console.error("Failed to parse tasks from localStorage:", e);
      return [];
    }
  });

  // Multi-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tasks' && e.newValue) {
        try {
          const newTasks = JSON.parse(e.newValue);
          setTasks(newTasks);
        } catch (err) {
          console.error("Failed to sync tasks from another tab:", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [userSortOrder, setUserSortOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem('taskOrder');
    return savedOrder ? JSON.parse(savedOrder) : [];
  });

  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskOrder', JSON.stringify(userSortOrder));
  }, [userSortOrder]);

  const sortTasks = useCallback((tasksToSort: Task[]) => {
    if (userSortOrder.length === 0) {
      return [...tasksToSort].sort((a, b) => {
        // First sort by completion status
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Then sort by priority for non-completed tasks
        if (!a.completed && !b.completed) {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
        }

        // Finally sort by creation date
        return b.createdAt - a.createdAt;
      });
    }

    return [...tasksToSort].sort((a, b) => {
      // Always keep completed tasks at the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      const orderMap = new Map(userSortOrder.map((id, index) => [id, index]));
      const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [userSortOrder]);

  const filteredTasks = useCallback(() => {
    let filtered = tasks;
    switch (filter) {
      case 'active':
        filtered = tasks.filter((task) => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter((task) => task.completed);
        break;
      case 'high':
        filtered = tasks.filter((task) => task.priority === 'high');
        break;
      case 'today':
        filtered = tasks.filter((task) => (task.dueDate && (isToday(task.dueDate) || isOverdue(task.dueDate)) && !task.completed));
        break;
      case 'upcoming':
        filtered = tasks.filter((task) => (task.dueDate && isUpcoming(task.dueDate) && !task.completed));
        break;
    }
    return sortTasks(filtered);
  }, [tasks, filter, sortTasks]);



  const toggleTask = useCallback((id: string) => {
    setTasks((prevTasks) => {
      const taskToToggle = prevTasks.find(t => t.id === id);

      // Handle recurrence when marking as completed
      if (taskToToggle && !taskToToggle.completed && taskToToggle.recurrence && taskToToggle.dueDate) {
        const nextDate = getNextRecurrenceDate(taskToToggle.dueDate, taskToToggle.recurrence);

        const nextTask: Task = {
          ...taskToToggle,
          id: crypto.randomUUID(),
          completed: false,
          createdAt: Date.now(),
          dueDate: nextDate,
          completedAt: undefined, // Ensure new task doesn't have completedAt
          // Recurrence continues to the next task
        };

        // Return tasks with original marked completed AND new next task
        return sortTasks([
          ...prevTasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : undefined, updatedAt: Date.now() } : task
          ),
          nextTask
        ]);
      }

      const newTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : undefined, updatedAt: Date.now() } : task
      );
      return sortTasks(newTasks);
    });
  }, [sortTasks]);

  const addTask = useCallback((text: string, priority: Priority = 'low', category: Category = 'personal', dueDate?: number, recurrence?: Recurrence) => {
    if (text.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
        priority,
        category,
        checklist: [],
        notes: '',
        dueDate,
        recurrence,
        updatedAt: Date.now(),
      };
      setTasks((prevTasks) => sortTasks([...prevTasks, newTask]));
    }
  }, [sortTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setUserSortOrder((prev) => prev.filter((taskId) => taskId !== id));
  }, []);

  const updateTask = useCallback(
    (id: string, text: string, priority: Priority, category: Category, checklist: ChecklistItem[], notes?: string, dueDate?: number, recurrence?: Recurrence) => {
      setTasks((prevTasks) => {
        const newTasks = prevTasks.map((task) =>
          task.id === id
            ? {
              ...task,
              text: text || task.text,
              priority: priority || task.priority,
              category: category || task.category,
              checklist,
              notes,
              dueDate: dueDate !== undefined ? dueDate : task.dueDate,
              recurrence: recurrence !== undefined ? recurrence : task.recurrence,
              updatedAt: Date.now(),
            }
            : task
        );
        return sortTasks(newTasks);
      });
    },
    [sortTasks]
  );

  const reorderTasks = useCallback((newOrder: Task[]) => {
    setTasks(newOrder);
    setUserSortOrder(newOrder.map(task => task.id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prevTasks) => {
      const remainingTasks = prevTasks.filter((task) => !task.completed);
      return sortTasks(remainingTasks);
    });
    setUserSortOrder((prev) =>
      prev.filter((id) => tasks.find(t => t.id === id && !t.completed))
    );
  }, [tasks, sortTasks]);

  const importTasks = useCallback((newTasks: Task[], strategy: 'replace' | 'merge') => {
    setTasks(prevTasks => {
      if (strategy === 'replace') {
        return sortTasks(newTasks);
      }

      const merged = [...prevTasks];
      newTasks.forEach(newTask => {
        const existingIndex = merged.findIndex(t => t.id === newTask.id);
        if (existingIndex !== -1) {
          // Conflict: compare updatedAt
          if (newTask.updatedAt > merged[existingIndex].updatedAt) {
            merged[existingIndex] = newTask;
          }
        } else {
          merged.push(newTask);
        }
      });
      return sortTasks(merged);
    });
  }, [sortTasks]);

  return {
    tasks: filteredTasks(),
    allTasks: tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    clearCompleted,
    importTasks,
  };
};