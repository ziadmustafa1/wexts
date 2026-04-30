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
        className: 'border-sky-300/20 bg-sky-300/[0.06]',
        iconClassName: 'text-sky-200',
        titleClassName: 'text-sky-100',
    },
    warning: {
        icon: AlertTriangle,
        className: 'border-amber-300/25 bg-amber-300/[0.07]',
        iconClassName: 'text-amber-200',
        titleClassName: 'text-amber-100',
    },
    success: {
        icon: CheckCircle2,
        className: 'border-emerald-300/20 bg-emerald-300/[0.06]',
        iconClassName: 'text-emerald-200',
        titleClassName: 'text-emerald-100',
    },
    error: {
        icon: AlertCircle,
        className: 'border-red-300/20 bg-red-300/[0.06]',
        iconClassName: 'text-red-200',
        titleClassName: 'text-red-100',
    },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const config = types[type];
    const Icon = config.icon;

    return (
        <div className={`my-6 rounded-2xl border p-4 ${config.className}`}>
            <div className="flex gap-3">
                <div className="flex-shrink-0 pt-0.5">
                    <Icon className={`h-5 w-5 ${config.iconClassName}`} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                    {title && (
                        <h4 className={`font-semibold text-sm leading-tight ${config.titleClassName}`}>
                            {title}
                        </h4>
                    )}
                    <div className="text-sm leading-relaxed text-slate-300">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
