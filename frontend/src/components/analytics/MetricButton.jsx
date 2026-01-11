const MetricButton = ({ active, onClick, icon: Icon, label }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${active
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/10'
                }`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{label}</span>
        </button>
    );
};

export default MetricButton;
