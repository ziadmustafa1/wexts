import { AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

interface CalloutProps {
    type?: 'info' | 'warning' | 'success' | 'error';
    title?: string;
    children: ReactNode;
}

const types = {
    info: {
        icon: Info,
        className: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20',
        iconClassName: 'text-blue-500',
        titleClassName: 'text-blue-900 dark:text-blue-100',
    },
    warning: {
        icon: AlertTriangle,
        className: 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20',
        iconClassName: 'text-yellow-600',
        titleClassName: 'text-yellow-900 dark:text-yellow-100',
    },
    success: {
        icon: CheckCircle2,
        className: 'border-green-500/50 bg-green-50 dark:bg-green-950/20',
        iconClassName: 'text-green-600',
        titleClassName: 'text-green-900 dark:text-green-100',
    },
    error: {
        icon: AlertCircle,
        className: 'border-red-500/50 bg-red-50 dark:bg-red-950/20',
        iconClassName: 'text-red-600',
        titleClassName: 'text-red-900 dark:text-red-100',
    },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const config = types[type];
    const Icon = config.icon;

    return (
        <div className={`my-4 rounded-lg border-l-4 p-4 ${config.className} shadow-sm`}>
            <div className="flex gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.iconClassName}`} />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                    {title && (
                        <h4 className={`font-semibold text-sm leading-tight ${config.titleClassName}`}>
                            {title}
                        </h4>
                    )}
                    <div className="text-sm leading-relaxed text-muted-foreground">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
