import { useCallback, useEffect, useState } from 'react';
import { Filter, Priority, Task, ChecklistItem } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (!savedTasks) return [];
    
    // Ensure all tasks have required properties
    return JSON.parse(savedTasks).map((task: Partial<Task>) => ({
      id: task.id || crypto.randomUUID(),
      text: task.text || '',
      completed: task.completed || false,
      createdAt: task.createdAt || Date.now(),
      priority: task.priority || 'low',
      checklist: Array.isArray(task.checklist) ? task.checklist : [],
      notes: task.notes || '',
    }));
  });
  
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
    }
    return sortTasks(filtered);
  }, [tasks, filter, sortTasks]);

  const addTask = useCallback((text: string, priority: Priority = 'low') => {
    if (text.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
        priority,
        checklist: [],
        notes: '',
      };
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks, newTask];
        return sortTasks(newTasks);
      });
    }
  }, [sortTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      return sortTasks(newTasks);
    });
  }, [sortTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setUserSortOrder((prev) => prev.filter((taskId) => taskId !== id));
  }, []);

  const updateTask = useCallback(
    (id: string, text: string, priority: Priority, checklist: ChecklistItem[], notes?: string) => {
      setTasks((prevTasks) => {
        const newTasks = prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                text: text || task.text,
                priority: priority || task.priority,
                checklist,
                notes,
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
  };
};