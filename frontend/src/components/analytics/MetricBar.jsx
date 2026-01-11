const MetricBar = ({ label, value, color }) => {
    const colors = {
        emerald: 'from-emerald-500 to-cyan-500',
        blue: 'from-blue-500 to-indigo-600',
        purple: 'from-purple-500 to-pink-600',
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-1000`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

export default MetricBar;
