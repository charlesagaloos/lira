import {
    Component,
    type ErrorInfo,
    type ReactNode,
} from "react";

type WebGLErrorBoundaryProps = {
    children: ReactNode;
    fallback: ReactNode;
};

type WebGLErrorBoundaryState = {
    hasError: boolean;
};

export class WebGLErrorBoundary extends Component<
    WebGLErrorBoundaryProps,
    WebGLErrorBoundaryState
> {
    state: WebGLErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(): WebGLErrorBoundaryState {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error(
            "Liquid Glass Carousel WebGL error:",
            error,
            errorInfo,
        );
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export function WebGLFallback({
    className = "",
    message = "This carousel needs WebGL, which is unavailable in this browser.",
}: {
    className?: string;
    message?: string;
}) {
    return (
        <div
            className={`flex h-full w-full items-center justify-center bg-white px-6 text-center text-sm text-black/60 ${className}`}
            role="status"
        >
            {message}
        </div>
    );
}
