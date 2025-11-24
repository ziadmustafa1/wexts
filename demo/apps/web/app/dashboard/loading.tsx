import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
            </div>
        </div>
    );
}
