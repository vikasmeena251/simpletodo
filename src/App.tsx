import { useState } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { CategoryView } from './components/CategoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { TaskFilter } from './components/TaskFilter';
import { EmptyState } from './components/EmptyState';
import { OnboardingModal } from './components/OnboardingModal';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { ShareModal } from './components/ShareModal';
import { ImportModal } from './components/ImportModal';
import { Toast } from './components/Toast';
import { useTasks } from './hooks/useTasks';
import { encodeTasks, decodeTasks, clearShareHash, getShareUrl, generateFingerprint } from './utils/share';
import { Task } from './types';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferences } from './types';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEOContent } from './components/SEOContent';
import { isToday, isUpcoming, isOverdue } from './utils/date';

function App() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : { hasOnboarded: false, name: '', pronouns: '' };
  });

  const [activeView, setActiveView] = useState<'tasks' | 'analytics' | 'calendar'>('tasks');
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');

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
    importTasks,
  } = useTasks();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTasksData, setImportTasksData] = useState<Task[]>([]);
  const [importTimestamp, setImportTimestamp] = useState<number>();
  const [importError, setImportError] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; visible: boolean; onUndo?: () => void }>({
    message: '',
    visible: false,
  });

  const [lastStateBeforeImport, setLastStateBeforeImport] = useState<Task[] | null>(null);

  const [importedFingerprints, setImportedFingerprints] = useState<string[]>(() => {
    const saved = localStorage.getItem('importedFingerprints');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentImportFingerprint, setCurrentImportFingerprint] = useState<string | null>(null);

  // Detect Import Payload in Hash
  useEffect(() => {
    const checkHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#import=')) {
        const payload = hash.replace('#import=', '');
        setIsImportModalOpen(true);
        setImportError(null);
        try {
          const { tasks: decodedTasks, timestamp } = await decodeTasks(payload);
          setImportTasksData(decodedTasks);
          setImportTimestamp(timestamp);
          const fingerprint = await generateFingerprint(decodedTasks);
          setCurrentImportFingerprint(fingerprint);
        } catch (err) {
          setImportError(err instanceof Error ? err.message : 'Invalid import link');
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleShare = async () => {
    try {
      const encoded = await encodeTasks(allTasks);
      setShareUrl(getShareUrl(encoded));
      setIsShareModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate share link');
    }
  };

  const handleImport = (strategy: 'replace' | 'merge') => {
    setLastStateBeforeImport([...allTasks]);
    importTasks(importTasksData, strategy);
    setIsImportModalOpen(false);
    clearShareHash();

    // Save fingerprint
    if (currentImportFingerprint) {
      const newFingerprints = [...new Set([...importedFingerprints, currentImportFingerprint])];
      setImportedFingerprints(newFingerprints);
      localStorage.setItem('importedFingerprints', JSON.stringify(newFingerprints));
    }

    setToast({
      message: `${strategy === 'replace' ? 'Replaced with' : 'Imported'} ${importTasksData.length} tasks successfully!`,
      visible: true,
      onUndo: () => {
        if (lastStateBeforeImport) {
          importTasks(lastStateBeforeImport, 'replace');
          setToast({ message: 'Import undone', visible: true });
        }
      }
    });
  };

  const tasksCount = {
    all: allTasks.length,
    active: allTasks.filter(task => !task.completed).length,
    completed: allTasks.filter(task => task.completed).length,
    high: allTasks.filter(task => task.priority === 'high').length,
    today: allTasks.filter(task => task.dueDate && (isToday(task.dueDate) || isOverdue(task.dueDate)) && !task.completed).length,
    upcoming: allTasks.filter(task => task.dueDate && isUpcoming(task.dueDate) && !task.completed).length,
  };

  const handleAddTaskClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) input.focus();
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
  };

  const getPageSeo = () => {
    switch (activeView) {
      case 'analytics':
        return {
          title: "Focus Rings & Productivity Tracker | Simple Todo",
          description: "Visualize your focus and track your daily progress. The best planning tracker for students and founders to juggle tasks with ease."
        };
      case 'calendar':
        return {
          title: "The Simplest Daily & Weekly Schedule | Simple Todo",
          description: "A calm, visual calendar for juggling multiple tasks. Perfect for teachers, mothers, and coaches planning a busy day."
        };
      default:
        return {
          title: "The Simplest Daily Planner & Task Manager | Simple Todo",
          description: "Effortless planning for students, founders, and moms. The simplest way to juggle multiple things each day and stay organized."
        };
    }
  };

  const seo = getPageSeo();

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <Helmet>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <link rel="canonical" href={`https://simpletodo.app/${activeView !== 'tasks' ? activeView : ''}`} />
          </Helmet>

          {!userPreferences.hasOnboarded && (
            <OnboardingModal onComplete={handleOnboardingComplete} />
          )}

          {userPreferences.hasOnboarded && userPreferences.name && (
            <WelcomeOverlay name={userPreferences.name} />
          )}

          <SEOContent />

          <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30">
            <Header
              userName={userPreferences.name}
              currentView={activeView}
              onViewChange={setActiveView}
              onShare={handleShare}
            />

            <main className={`flex-1 w-full mx-auto px-4 py-6 sm:py-12 pb-24 md:pb-12 transition-all duration-500 ease-spring ${activeView === 'tasks' ? 'max-w-xl md:max-w-2xl' : 'max-w-5xl'
              }`}>
              {activeView === 'analytics' ? (
                <AnalyticsView tasks={allTasks} />
              ) : activeView === 'calendar' ? (
                <CalendarView tasks={allTasks} />
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-2 text-center sm:text-left animate-fade-in relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                      Focus on what matters
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                      {allTasks.length > 0
                        ? `You have ${tasksCount.active} active tasks remaining.`
                        : "Ready to organize your day?"}
                    </p>
                  </div>

                  <div className="sticky top-[80px] z-30 md:static">
                    <TaskInput onAddTask={addTask} />
                  </div>

                  {allTasks.length > 0 && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <TaskFilter
                          filter={filter}
                          onFilterChange={setFilter}
                          tasksCount={tasksCount}
                          onClearCompleted={clearCompleted}
                        />

                        <div className="hidden sm:flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg">
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            title="List View"
                          >
                            <ListIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode('grouped')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grouped' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            title="Grouped View"
                          >
                            <LayoutGrid className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {viewMode === 'list' ? (
                        <TaskList
                          tasks={tasks}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                          onUpdate={updateTask}
                          onReorder={reorderTasks}
                        />
                      ) : (
                        <CategoryView
                          tasks={tasks}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                          onUpdate={updateTask}
                        />
                      )}
                    </div>
                  )}

                  {allTasks.length === 0 && (
                    <EmptyState />
                  )}
                </div>
              )}
            </main>

            <BottomNav
              currentView={activeView}
              onViewChange={setActiveView}
              onAddTask={handleAddTaskClick}
            />

            <footer className="hidden md:block py-6 text-center text-sm text-slate-400 dark:text-slate-600">
              <p className="hover:text-indigo-500 transition-colors cursor-default">
                Simple Todo &copy; {new Date().getFullYear()}
              </p>
            </footer>

            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              shareUrl={shareUrl}
              isEmpty={allTasks.length === 0}
            />

            <ImportModal
              isOpen={isImportModalOpen}
              onClose={() => {
                setIsImportModalOpen(false);
                clearShareHash();
              }}
              tasks={importTasksData}
              error={importError}
              timestamp={importTimestamp}
              onImport={handleImport}
              isAlreadyImported={!!currentImportFingerprint && importedFingerprints.includes(currentImportFingerprint)}
              isUpdate={importedFingerprints.length > 0 && !!currentImportFingerprint && !importedFingerprints.includes(currentImportFingerprint)}
              isLocalEmpty={allTasks.length === 0}
            />

            <Toast
              isVisible={toast.visible}
              message={toast.message}
              onUndo={toast.onUndo}
              onDismiss={() => setToast(prev => ({ ...prev, visible: false }))}
            />
          </div>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;