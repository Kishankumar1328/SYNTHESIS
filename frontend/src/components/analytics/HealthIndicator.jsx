import { CheckCircle, Info, AlertCircle } from 'lucide-react';

const HealthIndicator = ({ label, status }) => {
    const statusConfig = {
        excellent: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', Icon: CheckCircle },
        good: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', Icon: Info },
        poor: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', Icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.good;
    const { Icon } = config;

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">{label}</span>
            <div className={`flex items-center gap-2 ${config.bg} ${config.border} border px-3 py-1.5 rounded-full`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className={`text-xs font-black uppercase ${config.color}`}>{status}</span>
            </div>
        </div>
    );
};

export default HealthIndicator;
