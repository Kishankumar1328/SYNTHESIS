const QuickStat = ({ label, value, icon: Icon }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-5 h-5 text-blue-400" />}
                <span className="text-sm font-semibold text-muted-foreground">{label}</span>
            </div>
            <span className="text-lg font-black">{value}</span>
        </div>
    );
};

export default QuickStat;
