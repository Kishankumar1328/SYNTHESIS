import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-gray-900 text-white min-h-screen font-mono">
                    <h1 className="text-3xl text-red-500 mb-4">Something went wrong.</h1>
                    <div className="bg-black p-4 rounded border border-red-500/30 overflow-auto">
                        <p className="font-bold text-red-400 mb-2">{this.state.error?.toString()}</p>
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
