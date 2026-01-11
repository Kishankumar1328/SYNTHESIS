const StatCard = ({ icon: Icon, label, value, color, trend, subtitle, progress, animated, delay }) => {
    const colors = {
        blue: "from-blue-500 to-indigo-600 shadow-blue-500/30",
        indigo: "from-indigo-500 to-purple-600 shadow-indigo-500/30",
        green: "from-emerald-500 to-green-600 shadow-emerald-500/30",
        purple: "from-purple-500 to-pink-600 shadow-purple-500/30",
    };

    return (
        <div
            className={`glass-panel-strong p-6 rounded-[2rem] border border-white/10 relative overflow-hidden group card-hover cursor-default ${animated ? 'animate-slide-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-10 rounded-full blur-3xl group-hover:opacity-30 transition-all duration-500`}></div>
            <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {Icon && <Icon className="w-8 h-8" />}
                    </div>
                    {trend && (
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
                    <p className="text-3xl font-black tracking-tighter leading-none mb-1">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground font-semibold">{subtitle}</p>}
                </div>
                {progress && (
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-1000`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
