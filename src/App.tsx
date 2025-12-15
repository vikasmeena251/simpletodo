import React, { useEffect, useState } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { TaskFilter } from './components/TaskFilter';
import { EmptyState } from './components/EmptyState';
import { OnboardingModal } from './components/OnboardingModal';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { useTasks } from './hooks/useTasks';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferences } from './types';

function App() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : { hasOnboarded: false };
  });

  const {
    tasks,
    allTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    clearCompleted,
  } = useTasks();

  const tasksCount = {
    all: allTasks.length,
    active: allTasks.filter(task => !task.completed).length,
    completed: allTasks.filter(task => task.completed).length,
    high: allTasks.filter(task => task.priority === 'high').length,
  };

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  };

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Helmet>
          <title>Simple Todo - Modern Task Management App</title>
          <meta name="description" content="Simple Todo is a modern, intuitive task management application that helps you stay organized and productive. Create tasks, set priorities, add checklists, and track your progress." />
        </Helmet>

        {!userPreferences.hasOnboarded && (
          <OnboardingModal onComplete={handleOnboardingComplete} />
        )}

        {userPreferences.hasOnboarded && userPreferences.name && (
          <WelcomeOverlay name={userPreferences.name} />
        )}

        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <Header userName={userPreferences.name} />
          
          <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
            <TaskInput onAddTask={addTask} />
            
            {allTasks.length > 0 && (
              <TaskFilter
                filter={filter}
                onFilterChange={setFilter}
                tasksCount={tasksCount}
                onClearCompleted={clearCompleted}
              />
            )}
            
            {allTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
                onReorder={reorderTasks}
              />
            )}
          </main>
          
          <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Simple Todo &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;