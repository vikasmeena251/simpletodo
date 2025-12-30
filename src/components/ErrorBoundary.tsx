import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        localStorage.removeItem('tasks'); // Last resort: clear potentially corrupt data
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                    <div className="max-w-md w-full glass-panel p-8 rounded-3xl text-center space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
                            <AlertTriangle className="w-10 h-10" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Oops! Something went wrong</h1>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                The application encountered an unexpected error. This usually happens due to a temporary glitch or corrupted data.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Try Refreshing
                            </button>

                            <button
                                onClick={this.handleReset}
                                className="w-full text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors py-2"
                            >
                                Reset Data & Restart (Atomic Fix)
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-left overflow-auto max-h-40">
                                <code className="text-xs text-rose-500 dark:text-rose-400">
                                    {this.state.error?.toString()}
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
