const MiniMetric = ({ icon: Icon, label, value, color }) => {
    const colors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    };

    return (
        <div className={`${colors[color]} border rounded-2xl p-4 flex items-center gap-3 hover:scale-105 transition-all cursor-default`}>
            {Icon && <Icon className="w-6 h-6" />}
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-xl font-black">{value}</p>
            </div>
        </div>
    );
};

export default MiniMetric;
