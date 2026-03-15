import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Something went wrong</h2>
          <p className="text-sm text-[var(--outline)] mb-8 max-w-xs">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--primary)] text-white px-8 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
          >
            Refresh App
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-4 bg-black/5 rounded-xl text-left overflow-auto max-w-full">
              <p className="text-[10px] font-mono text-[#EA4335] whitespace-pre-wrap">
                {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
