import type { SVGProps } from 'react';

export function ArrowUpRight({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M5 15L15 5M7 5H15V13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ArrowRight({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M4 10H15M11 6L15 10L11 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ArrowLeft({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M15 10H5M9 6L5 10L9 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function PlusIcon({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function CheckIcon({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M5 10.5L8.5 14L15 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function UserIcon({
    className = 'h-5 w-5',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <circle
                cx="10"
                cy="7"
                r="3"
                stroke="currentColor"
                strokeWidth="1.3"
            />

            <path
                d="M4.5 16C5.2 13.7 7.2 12.5 10 12.5C12.8 12.5 14.8 13.7 15.5 16"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function GlobeIcon({
    className = 'h-5 w-5',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <circle
                cx="10"
                cy="10"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.3"
            />

            <path
                d="M3.8 10H16.2M10 3.5C11.7 5.2 12.5 7.4 12.5 10C12.5 12.6 11.7 14.8 10 16.5C8.3 14.8 7.5 12.6 7.5 10C7.5 7.4 8.3 5.2 10 3.5Z"
                stroke="currentColor"
                strokeWidth="1.1"
            />
        </svg>
    );
}

export function LogoutIcon({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M8 4H4.5C3.67 4 3 4.67 3 5.5V14.5C3 15.33 3.67 16 4.5 16H8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />

            <path
                d="M11 6L15 10L11 14M15 10H7"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function MenuIcon({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M4 6H16M4 10H16M4 14H16"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function CloseIcon({
    className = 'h-4 w-4',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function LockIcon({
    className = 'h-3.5 w-3.5',
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <rect
                x="4.5"
                y="8"
                width="11"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
            />

            <path
                d="M7 8V6.5C7 4.84315 8.34315 3.5 10 3.5C11.6569 3.5 13 4.84315 13 6.5V8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function FolderIcon({
    className = 'h-5 w-5',
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h4l2 2h6a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-10Z" />
        </svg>
    );
}
