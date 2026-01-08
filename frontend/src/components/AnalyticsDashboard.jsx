import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AnalyticsDashboard({ stats }) {
    if (!stats) return null;

    // Premium Color Palette for Charts
    const chartPalette = [
        'rgba(59, 130, 246, 0.7)',   // Blue
        'rgba(139, 92, 246, 0.7)',  // Violet
        'rgba(236, 72, 153, 0.7)',  // Pink
        'rgba(249, 115, 22, 0.7)',  // Orange
        'rgba(16, 185, 129, 0.7)',  // Emerald
        'rgba(6, 182, 212, 0.7)',   // Cyan
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="bx-table" label="Total Records" value={stats.rowCount.toLocaleString()} color="blue" />
                <StatCard icon="bx-columns" label="Dimensions" value={stats.columnCount} color="indigo" />
                <StatCard icon="bx-check-double" label="Completeness" value={`${(100 - stats.columns.reduce((a, b) => a + b.nullPercentage, 0) / stats.columnCount).toFixed(1)}%`} color="green" />
                <StatCard icon="bx-unite" label="Unique Signals" value={stats.columns.reduce((a, b) => a + (b.uniqueCount > 0 ? 1 : 0), 0)} color="purple" />
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Column Distribution */}
                <div className="col-span-12 lg:col-span-8 glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                    <h3 className="text-xl font-black tracking-tight flex items-center mb-6">
                        <i className='bx bx-bar-chart-alt-2 mr-3 text-cyan-400 text-2xl'></i>
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Feature Distributions</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {stats.columns.slice(0, 4).map((col, idx) => (
                            <div key={idx} className="bg-[#0a0c10]/50 p-6 rounded-3xl border border-white/5 space-y-4 hover:border-white/10 transition-all group">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-white/90 truncate max-w-[150px]" title={col.name}>{col.name}</p>
                                    <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-1 rounded-lg font-black uppercase tracking-widest border border-white/5">{col.type}</span>
                                </div>
                                {col.distribution ? (
                                    <div className="h-48">
                                        <Bar
                                            data={{
                                                labels: col.distribution.labels,
                                                datasets: [{
                                                    label: 'Count',
                                                    data: col.distribution.values,
                                                    backgroundColor: col.distribution.values.map((_, i) => chartPalette[i % chartPalette.length]),
                                                    borderRadius: 6,
                                                    borderSkipped: false,
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: { display: false },
                                                    x: {
                                                        display: false // Cleaner look without messy labels
                                                    }
                                                },
                                                plugins: {
                                                    legend: { display: false },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                                        titleFont: { size: 10, weight: 'bold' },
                                                        bodyFont: { size: 12 },
                                                        padding: 10,
                                                        cornerRadius: 8,
                                                        displayColors: false
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 flex flex-col items-center justify-center text-muted-foreground/30 italic text-sm border-2 border-dashed border-white/5 rounded-2xl">
                                        <i className='bx bx-ghost text-2xl mb-2'></i>
                                        No visual signal
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Quality / Null Analysis */}
                <div className="col-span-12 lg:col-span-4 glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                    <h3 className="text-xl font-black tracking-tight flex items-center mb-6">
                        <i className='bx bx-shield-x mr-3 text-red-500 text-2xl'></i>
                        <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">Quality Audit</span>
                    </h3>
                    <div className="space-y-6">
                        {stats.columns.slice(0, 8).map((col, idx) => (
                            <div key={idx} className="space-y-2 group">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                                    <span className="text-muted-foreground truncate w-32" title={col.name}>{col.name}</span>
                                    <span className={col.nullPercentage > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                        {col.nullPercentage > 0 ? `${col.nullPercentage}% Missing` : 'Perfect'}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${col.nullPercentage > 0
                                                ? 'bg-gradient-to-r from-red-500 to-pink-600'
                                                : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                                            }`}
                                        style={{ width: `${Math.max(5, 100 - col.nullPercentage)}%` }} // Always show at least some bar
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Correlation Insights (Unique visualization) */}
                {stats.correlation && (
                    <div className="col-span-12 glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-8 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight flex items-center">
                                <i className='bx bx-scatter-chart mr-3 text-violet-500 text-2xl'></i>
                                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">Feature Correlation Matrix</span>
                            </h3>
                            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span> Pos
                                <span className="w-2 h-2 rounded-full bg-rose-500 ml-2"></span> Neg
                            </div>
                        </div>

                        <div className="overflow-x-auto pb-6 custom-scrollbar">
                            <table className="w-full border-separate border-spacing-1">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 bg-[#0a0c10] z-20"></th>
                                        {stats.correlation.columns.map(c => (
                                            <th key={c} className="h-32 align-bottom p-2">
                                                <div className="w-8">
                                                    <p className="transform -rotate-45 origin-bottom-left text-[10px] font-black uppercase tracking-wider text-muted-foreground whitespace-nowrap w-32 truncate">{c}</p>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.correlation.columns.map((r, i) => (
                                        <tr key={r}>
                                            <td className="sticky left-0 z-10 bg-[#0a0c10]/95 backdrop-blur-sm pr-4 py-2 text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap max-w-[120px] truncate ml-auto" title={r}>{r}</p>
                                            </td>
                                            {stats.correlation.values[i].map((v, j) => (
                                                <td
                                                    key={j}
                                                    title={`${r} vs ${stats.correlation.columns[j]}: ${v}`}
                                                    className="w-12 h-12 rounded-lg text-[10px] font-bold transition-all hover:scale-110 hover:z-20 cursor-default text-center relative group"
                                                    style={{
                                                        // Diverging color scale: Green for positive, Red for negative
                                                        backgroundColor: v > 0
                                                            ? `rgba(16, 185, 129, ${Math.max(0.1, v)})`
                                                            : `rgba(244, 63, 94, ${Math.max(0.1, Math.abs(v))})`,
                                                        color: Math.abs(v) > 0.4 ? 'white' : 'transparent'
                                                    }}
                                                >
                                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">{v}</span>
                                                    <span className="group-hover:opacity-0">{v > 0 ? v.toString().substring(1) : v}</span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
        indigo: "from-indigo-500 to-purple-600 shadow-indigo-500/20",
        green: "from-emerald-500 to-green-600 shadow-emerald-500/20",
        purple: "from-purple-500 to-pink-600 shadow-purple-500/20",
    };

    return (
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:scale-105 transition-all active:scale-95 cursor-default">
            <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-br ${colors[color]} opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-all`}></div>
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-all`}>
                    <i className={`bx ${icon} text-2xl`}></i>
                </div>
                <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
                    <p className="text-2xl font-black italic tracking-tighter leading-none">{value}</p>
                </div>
            </div>
        </div>
    );
}
