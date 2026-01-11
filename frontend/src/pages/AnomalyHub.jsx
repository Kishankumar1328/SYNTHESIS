import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Activity, Zap, Filter, FileText, Search } from 'lucide-react';
import { AIAPI } from '../api';
import { useProjects } from '../hooks/useProjects';
import { useDatasets } from '../hooks/useDatasets';

export default function AnomalyHub() {
    const { projects } = useProjects();
    const activeProject = projects[0];
    const { datasets } = useDatasets(activeProject?.id);

    const [selectedDataset, setSelectedDataset] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [filter, setFilter] = useState('all'); // all, high, medium, low
    const [isScanning, setIsScanning] = useState(false);

    const scanForAnomalies = async () => {
        if (!selectedDataset) {
            alert('Please select a dataset first');
            return;
        }

        setIsScanning(true);
        try {
            const response = await AIAPI.detectAnomalies(selectedDataset);
            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            const rowCount = data.results?.rowCount || 0;
            const columns = data.results?.columns || [];
            const generatedAnomalies = [];
            let idCounter = 1;

            columns.forEach(col => {
                // 1. Data Integrity: Missing Values
                if (col.nullPercentage > 0) {
                    const severity = col.nullPercentage > 20 ? 'high' : (col.nullPercentage > 5 ? 'medium' : 'low');
                    generatedAnomalies.push({
                        id: idCounter++,
                        type: 'Data Integrity',
                        severity: severity,
                        field: col.name,
                        description: `Missing values detected in ${col.nullPercentage}% of records (${Math.floor((col.nullPercentage / 100) * rowCount)} rows).`,
                        timestamp: new Date().toISOString(),
                        affectedRecords: Math.floor((col.nullPercentage / 100) * rowCount),
                        confidence: 100
                    });
                }

                // 2. Statistical Outliers (Numeric only)
                if (col.stats) {
                    const { max, mean, min } = col.stats;
                    // simple heuristic: extreme spread
                    if (max > mean * 4 && mean > 0) {
                        generatedAnomalies.push({
                            id: idCounter++,
                            type: 'Statistical Outlier',
                            severity: 'medium',
                            field: col.name,
                            description: `Extreme maximum value (${max.toFixed(2)}) detected, significantly deviating from the mean (${mean.toFixed(2)}).`,
                            timestamp: new Date().toISOString(),
                            affectedRecords: Math.floor(rowCount * 0.01), // Estimate
                            confidence: 85
                        });
                    }
                }

                // 3. Pattern Deviation: Low Variance / Constant
                if (col.uniqueCount === 1) {
                    generatedAnomalies.push({
                        id: idCounter++,
                        type: 'Pattern Deviation',
                        severity: 'low',
                        field: col.name,
                        description: 'Column contains a single constant value across all records.',
                        timestamp: new Date().toISOString(),
                        affectedRecords: rowCount,
                        confidence: 100
                    });
                }
            });

            setAnomalies(generatedAnomalies);
        } catch (e) {
            console.error('Scan failed:', e);
            alert('Failed to scan for anomalies. Check dataset health.');
        } finally {
            setIsScanning(false);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-500/10 text-red-400 border-red-500/30';
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            case 'low':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'high':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'medium':
                return <TrendingUp className="w-5 h-5 text-yellow-500" />;
            case 'low':
                return <Activity className="w-5 h-5 text-blue-500" />;
            default:
                return <Zap className="w-5 h-5 text-gray-500" />;
        }
    };

    const filteredAnomalies = filter === 'all'
        ? anomalies
        : anomalies.filter(a => a.severity === filter);

    const stats = {
        total: anomalies.length,
        high: anomalies.filter(a => a.severity === 'high').length,
        medium: anomalies.filter(a => a.severity === 'medium').length,
        low: anomalies.filter(a => a.severity === 'low').length
    };

    return (
        <div className="p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <header>
                <h1 className="text-5xl font-black tracking-tighter mb-3 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                    Anomaly Hub
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    Detect and analyze anomalies in your datasets
                </p>
            </header>

            {/* Selection & Trigger */}
            <div className="glass-panel p-8 rounded-[2rem] border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div>
                        <label className="block text-sm font-bold mb-3 text-muted-foreground uppercase tracking-widest">
                            Target Dataset
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <select
                                value={selectedDataset || ''}
                                onChange={(e) => setSelectedDataset(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-orange-500/50 outline-none appearance-none transition-all"
                            >
                                <option value="" className="bg-[#0a0c10]">Choose a dataset...</option>
                                {datasets.map((dataset) => (
                                    <option key={dataset.id} value={dataset.id} className="bg-[#0a0c10]">
                                        {dataset.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={scanForAnomalies}
                        disabled={isScanning || !selectedDataset}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 flex items-center justify-center gap-3 h-[60px]"
                    >
                        {isScanning ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing Patterns...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                Scan for Anomalies
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats */}
            {anomalies.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Total</p>
                            <Activity className="w-5 h-5 text-white/40" />
                        </div>
                        <p className="text-4xl font-black">{stats.total}</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-red-400 font-bold uppercase tracking-widest">High</p>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-4xl font-black text-red-400">{stats.high}</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-yellow-400 font-bold uppercase tracking-widest">Medium</p>
                            <TrendingUp className="w-5 h-5 text-yellow-500" />
                        </div>
                        <p className="text-4xl font-black text-yellow-400">{stats.medium}</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">Low</p>
                            <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-4xl font-black text-blue-400">{stats.low}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">
                {anomalies.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-muted-foreground" />
                            <div className="flex gap-2">
                                {['all', 'high', 'medium', 'low'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filter === f
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                            }`}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Anomalies List */}
                <div className="space-y-4">
                    {filteredAnomalies.length === 0 ? (
                        <div className="glass-panel p-20 rounded-[3rem] border border-white/5 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="w-32 h-32 mx-auto mb-8 rounded-[2.5rem] bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-700">
                                <Search className="w-16 h-16 text-orange-400" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter mb-4 italic">Anomaly Scan Pending</h3>
                            <p className="text-muted-foreground text-xl max-w-lg mx-auto font-medium leading-relaxed">
                                Select a dataset and initiate a scan to detect outliers, pattern deviations, and data integrity issues.
                            </p>
                        </div>
                    ) : (
                        filteredAnomalies.map((anomaly) => (
                            <div
                                key={anomaly.id}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-orange-500/10 transition-all"></div>

                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {getSeverityIcon(anomaly.severity)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-xl">{anomaly.type}</h3>
                                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter border ${getSeverityColor(anomaly.severity)}`}>
                                                        {anomaly.severity}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Feature Focus: <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded italic">{anomaly.field}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-muted-foreground mb-1 uppercase font-black tracking-widest">Confidence Score</p>
                                                <p className="text-3xl font-black text-orange-400 italic">{anomaly.confidence}%</p>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground mb-6 font-medium leading-relaxed">{anomaly.description}</p>

                                        <div className="flex items-center gap-8 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground font-bold uppercase tracking-widest">Impact:</span>
                                                <span className="font-black text-orange-400 italic text-sm">{anomaly.affectedRecords} Records</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground font-bold uppercase tracking-widest">Timestamp:</span>
                                                <span className="font-bold text-white/60">{new Date(anomaly.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="px-8 py-4 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white rounded-2xl font-bold transition-all border border-orange-500/20">
                                        Investigate
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
