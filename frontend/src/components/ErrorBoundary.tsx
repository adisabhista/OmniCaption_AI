import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
                    <div className="max-w-md w-full bg-card border border-destructive/50 rounded-lg p-6 shadow-lg text-center space-y-4">
                        <h2 className="text-xl font-bold text-destructive">Terjadi Kesalahan</h2>
                        <p className="text-muted-foreground">
                            Maaf, aplikasi mengalami masalah saat menampilkan data.
                        </p>
                        <div className="bg-muted p-3 rounded text-xs text-left overflow-auto max-h-32 font-mono">
                            {this.state.error?.toString()}
                        </div>
                        <button
                            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Muat Ulang Halaman
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
