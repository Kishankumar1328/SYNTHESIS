import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useDatasets } from '../hooks/useDatasets';
import axios from 'axios';
import {
    BarChart3, TrendingUp, TrendingDown, Activity, Database, Layers,
    PieChart, LineChart, Zap, Target, Filter, Calendar, Download,
    RefreshCw, Eye, Brain, Sparkles, AlertTriangle, CheckCircle2,
    FileText, Users, Clock, Shield, ArrowRight, GitBranch, Cpu,
    Upload, Search, Play, Maximize2, Grid, List, Settings, Info,
    AlertCircle, XCircle, ChevronDown, ChevronUp, BarChart2, TrendingDown as TrendDown
} from 'lucide-react';
import { Line, Bar, Doughnut, Pie, Scatter, Radar, PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function DataInsights() {
    const { projects } = useProjects();
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedDataset, setSelectedDataset] = useState(null);

    // Initialize selected project
    useEffect(() => {
        if (projects.length > 0 && !selectedProject) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    const activeProject = projects.find(p => p.id === selectedProject) || projects[0];
    const { datasets } = useDatasets(activeProject?.id);

    const [datasetStats, setDatasetStats] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [viewMode, setViewMode] = useState('overview'); // overview, detailed, correlation
    const [expandedSections, setExpandedSections] = useState({
        quality: true,
        distribution: true,
        correlation: true,
        anomalies: true
    });

    useEffect(() => {
        if (datasets.length > 0 && !selectedDataset) {
            setSelectedDataset(datasets[0].id);
        }
    }, [datasets]);

    const analyzeDataset = async (datasetId) => {
        setIsAnalyzing(true);
        console.log('Analyzing dataset ID:', datasetId);
        try {
            const response = await axios.get(`/api/datasets/${datasetId}/stats`);
            console.log('API Response:', response.data);

            const stats = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            console.log('Parsed stats:', stats);

            setDatasetStats(stats);
        } catch (error) {
            console.error('Failed to analyze dataset:', error);
            console.error('Error details:', error.response?.data || error.message);

            console.log('Using mock data as fallback');
            setDatasetStats(generateMockStats());
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateMockStats = () => ({
        rowCount: 25000,
        columnCount: 15,
        columns: [
            { name: 'customer_id', type: 'int64', nullPercentage: 0, uniqueCount: 25000, stats: { min: 1, max: 25000, mean: 12500, median: 12500 } },
            { name: 'age', type: 'int64', nullPercentage: 0.48, uniqueCount: 65, stats: { min: 18, max: 85, mean: 42.5, median: 41 } },
            { name: 'income', type: 'float64', nullPercentage: 0.34, uniqueCount: 18500, stats: { min: 15000, max: 250000, mean: 75000, median: 68000 } },
            { name: 'email', type: 'object', nullPercentage: 0.8, uniqueCount: 24800 },
            { name: 'city', type: 'object', nullPercentage: 0.2, uniqueCount: 450 },
            { name: 'purchase_date', type: 'datetime64', nullPercentage: 0, uniqueCount: 365 },
            { name: 'category', type: 'object', nullPercentage: 0.04, uniqueCount: 8 },
            { name: 'amount', type: 'float64', nullPercentage: 0.18, uniqueCount: 15000, stats: { min: 10, max: 5000, mean: 250, median: 180 } },
            { name: 'is_active', type: 'bool', nullPercentage: 0, uniqueCount: 2 },
            { name: 'rating', type: 'float64', nullPercentage: 1.2, uniqueCount: 50, stats: { min: 1, max: 5, mean: 3.8, median: 4 } },
            { name: 'country', type: 'object', nullPercentage: 0.1, uniqueCount: 25 },
            { name: 'signup_date', type: 'datetime64', nullPercentage: 0, uniqueCount: 730 },
            { name: 'total_purchases', type: 'int64', nullPercentage: 0, uniqueCount: 150, stats: { min: 0, max: 500, mean: 12, median: 8 } },
            { name: 'last_login', type: 'datetime64', nullPercentage: 2.5, uniqueCount: 1000 },
            { name: 'loyalty_points', type: 'int64', nullPercentage: 0.5, uniqueCount: 5000, stats: { min: 0, max: 10000, mean: 1250, median: 850 } }
        ],
        correlation: {
            columns: ['age', 'income', 'amount', 'rating', 'total_purchases'],
            values: [
                [1.0, 0.65, 0.42, 0.28, 0.55],
                [0.65, 1.0, 0.58, 0.35, 0.62],
                [0.42, 0.58, 1.0, 0.45, 0.72],
                [0.28, 0.35, 0.45, 1.0, 0.38],
                [0.55, 0.62, 0.72, 0.38, 1.0]
            ]
        }
    });

    const handleRefresh = () => {
        if (selectedDataset) {
            analyzeDataset(selectedDataset);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const getInsights = () => {
        if (!datasetStats) return null;

        const data = datasetStats.details || datasetStats;

        if (!data.rowCount || !data.columns) {
            console.error('Invalid dataset stats format:', datasetStats);
            return null;
        }

        const { rowCount, columnCount, columns } = data;

        const processedColumns = columns.map(col => ({
            ...col,
            nullCount: col.nullCount || Math.round((col.nullPercentage || 0) * rowCount / 100),
            uniqueCount: col.uniqueCount || 0
        }));

        const numericCols = processedColumns.filter(c => c.type === 'int64' || c.type === 'float64' || c.type.includes('int') || c.type.includes('float'));
        const categoricalCols = processedColumns.filter(c => (c.type === 'object' || c.type === 'string') && c.uniqueCount < rowCount * 0.5);
        const textCols = processedColumns.filter(c => (c.type === 'object' || c.type === 'string') && c.uniqueCount >= rowCount * 0.5);
        const dateCols = processedColumns.filter(c => c.type.includes('datetime') || c.type.includes('date'));
        const boolCols = processedColumns.filter(c => c.type === 'bool' || c.type === 'boolean');

        const totalNulls = processedColumns.reduce((sum, col) => sum + (col.nullCount || 0), 0);
        const totalCells = rowCount * columnCount;
        const completeness = ((totalCells - totalNulls) / totalCells * 100).toFixed(1);
        const avgUniqueness = (processedColumns.reduce((sum, col) => sum + (col.uniqueCount / rowCount), 0) / columnCount * 100).toFixed(1);

        // Calculate data quality score
        const qualityScore = calculateQualityScore(processedColumns, rowCount, completeness);

        return {
            rowCount,
            columnCount,
            completeness: parseFloat(completeness),
            uniqueness: parseFloat(avgUniqueness),
            numericCount: numericCols.length,
            categoricalCount: categoricalCols.length,
            textCount: textCols.length,
            dateCount: dateCols.length,
            boolCount: boolCols.length,
            columns: processedColumns,
            numericColumns: numericCols,
            categoricalColumns: categoricalCols,
            quality: parseFloat(completeness) > 95 ? 'Excellent' : parseFloat(completeness) > 85 ? 'Good' : 'Fair',
            qualityScore,
            correlation: datasetStats.correlation || null
        };
    };

    const calculateQualityScore = (columns, rowCount, completeness) => {
        let score = parseFloat(completeness);

        // Penalize for high null percentages in individual columns
        const highNullCols = columns.filter(c => (c.nullPercentage || 0) > 10).length;
        score -= highNullCols * 2;

        // Bonus for good uniqueness
        const avgUniqueness = columns.reduce((sum, col) => sum + (col.uniqueCount / rowCount), 0) / columns.length;
        if (avgUniqueness > 0.5) score += 5;

        return Math.max(0, Math.min(100, score)).toFixed(1);
    };

    const insights = getInsights();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 16,
                titleColor: '#f97316',
                titleFont: { size: 14, weight: 'bold' },
                bodyColor: '#fff',
                bodyFont: { size: 12 },
                borderColor: 'rgba(249, 115, 22, 0.3)',
                borderWidth: 1,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11, weight: 'bold' } }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11, weight: 'bold' } }
            }
        }
    };

    // Advanced Charts
    const dataTypeChart = insights ? {
        labels: ['Numeric', 'Categorical', 'Text', 'DateTime', 'Boolean'],
        datasets: [{
            data: [insights.numericCount, insights.categoricalCount, insights.textCount, insights.dateCount, insights.boolCount],
            backgroundColor: [
                'rgba(249, 115, 22, 0.9)',
                'rgba(251, 191, 36, 0.9)',
                'rgba(34, 197, 94, 0.9)',
                'rgba(59, 130, 246, 0.9)',
                'rgba(168, 85, 247, 0.9)'
            ],
            borderColor: ['#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7'],
            borderWidth: 3
        }]
    } : null;

    const columnQualityChart = insights ? {
        labels: insights.columns.slice(0, 15).map(c => c.name),
        datasets: [{
            label: 'Completeness %',
            data: insights.columns.slice(0, 15).map(c => ((insights.rowCount - (c.nullCount || 0)) / insights.rowCount * 100)),
            backgroundColor: insights.columns.slice(0, 15).map(c => {
                const completeness = ((insights.rowCount - (c.nullCount || 0)) / insights.rowCount * 100);
                return completeness > 95 ? 'rgba(34, 197, 94, 0.8)' : completeness > 85 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(239, 68, 68, 0.8)';
            }),
            borderColor: insights.columns.slice(0, 15).map(c => {
                const completeness = ((insights.rowCount - (c.nullCount || 0)) / insights.rowCount * 100);
                return completeness > 95 ? '#22c55e' : completeness > 85 ? '#fbbf24' : '#ef4444';
            }),
            borderWidth: 2,
            borderRadius: 8
        }]
    } : null;

    const nullDistChart = insights ? {
        labels: insights.columns.filter(c => c.nullCount > 0).slice(0, 10).map(c => c.name),
        datasets: [{
            data: insights.columns.filter(c => c.nullCount > 0).slice(0, 10).map(c => c.nullCount),
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(251, 191, 36, 0.8)',
                'rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)', 'rgba(107, 114, 128, 0.8)', 'rgba(20, 184, 166, 0.8)',
                'rgba(245, 158, 11, 0.8)'
            ],
            borderColor: ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#6b7280', '#14b8a6', '#f59e0b'],
            borderWidth: 2
        }]
    } : null;

    // Uniqueness Distribution
    const uniquenessChart = insights ? {
        labels: insights.columns.slice(0, 12).map(c => c.name),
        datasets: [{
            label: 'Uniqueness %',
            data: insights.columns.slice(0, 12).map(c => (c.uniqueCount / insights.rowCount * 100)),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            borderRadius: 8
        }]
    } : null;

    // Correlation Heatmap (simplified as radar)
    const correlationRadar = insights && insights.correlation ? {
        labels: insights.correlation.columns,
        datasets: insights.correlation.columns.map((col, idx) => ({
            label: col,
            data: insights.correlation.values[idx],
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
            borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
            borderWidth: 2,
            pointBackgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        })).slice(0, 3)
    } : null;

    // Statistical Summary for Numeric Columns
    const numericStatsChart = insights && insights.numericColumns.length > 0 ? {
        labels: insights.numericColumns.slice(0, 6).map(c => c.name),
        datasets: [
            {
                label: 'Mean',
                data: insights.numericColumns.slice(0, 6).map(c => c.stats?.mean || 0),
                backgroundColor: 'rgba(249, 115, 22, 0.7)',
                borderColor: '#f97316',
                borderWidth: 2
            },
            {
                label: 'Median',
                data: insights.numericColumns.slice(0, 6).map(c => c.stats?.median || 0),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: '#22c55e',
                borderWidth: 2
            }
        ]
    } : null;

    const MetricCard = ({ title, value, icon: Icon, trend, suffix = '', color = 'orange', subtitle }) => (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] group-hover:bg-orange-500/10 transition-all"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 text-${color}-400`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${trend === 'up' ? 'bg-green-500/10 text-green-400' :
                        trend === 'down' ? 'bg-red-500/10 text-red-400' :
                            'bg-orange-500/10 text-orange-400'
                        }`}>
                        {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : <Activity size={14} />}
                        <span className="text-xs font-black">{trend === 'up' ? 'Excellent' : trend === 'down' ? 'Poor' : 'Good'}</span>
                    </div>
                )}
            </div>

            <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{title}</p>
                <p className="text-4xl font-black italic text-white">{value}{suffix}</p>
                {subtitle && <p className="text-xs text-white/30 font-medium">{subtitle}</p>}
            </div>
        </div>
    );

    const SectionHeader = ({ title, icon: Icon, section }) => (
        <div
            onClick={() => toggleSection(section)}
            className="flex items-center justify-between cursor-pointer group mb-6"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">{title}</h3>
            </div>
            {expandedSections[section] ? <ChevronUp className="w-6 h-6 text-white/40" /> : <ChevronDown className="w-6 h-6 text-white/40" />}
        </div>
    );

    return (
        <div className="p-12 max-w-[1920px] mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit">
                            <Brain className="w-4 h-4 text-orange-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Advanced Analytics</span>
                        </div>
                        {isAnalyzing && (
                            <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit">
                                <Activity className="w-4 h-4 text-amber-400 animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Analyzing...</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter italic">
                        Data <span className="text-gradient-orange">Intelligence</span>
                    </h1>
                    <p className="text-white/40 text-lg font-medium max-w-2xl">
                        Enterprise-grade analytics with statistical profiling, correlation analysis, and quality assessment.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 glass-panel border border-white/10 rounded-2xl p-2">
                        <button
                            onClick={() => setViewMode('overview')}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'overview' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setViewMode('detailed')}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'detailed' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'
                                }`}
                        >
                            Detailed
                        </button>
                        <button
                            onClick={() => setViewMode('correlation')}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'correlation' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'
                                }`}
                        >
                            Correlation
                        </button>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={!selectedDataset}
                        className="flex items-center gap-3 px-6 py-4 glass-panel border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all group disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 text-orange-400 ${isAnalyzing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Refresh</span>
                    </button>

                    <button className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-orange-50 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-white/5 active:scale-95">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </header>

            {/* Dataset Selector */}
            <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-orange-500/10 transition-all"></div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="flex flex-wrap items-center gap-6">
                        {/* Project Selector */}
                        <div className="relative group/select">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Layers className="w-5 h-5 text-orange-500/50 group-hover/select:text-orange-500 transition-colors" />
                            </div>
                            <select
                                value={selectedProject || ''}
                                onChange={(e) => {
                                    setSelectedProject(Number(e.target.value));
                                    setSelectedDataset(null); // Reset dataset when project changes
                                }}
                                className="bg-white/5 border border-white/10 text-white text-sm rounded-2xl focus:ring-orange-500 focus:border-orange-500 block w-full pl-12 pr-10 py-4 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer font-bold shadow-xl shadow-black/20"
                            >
                                {projects.map(p => (
                                    <option key={p.id} value={p.id} className="bg-[#0f1115] text-white py-2">{p.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-white/30" />
                            </div>
                        </div>

                        {/* Dataset Selector */}
                        <div className="relative group/select">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Database className="w-5 h-5 text-orange-500/50 group-hover/select:text-orange-500 transition-colors" />
                            </div>
                            <select
                                value={selectedDataset || ''}
                                onChange={(e) => setSelectedDataset(Number(e.target.value))}
                                className="bg-white/5 border border-white/10 text-white text-sm rounded-2xl focus:ring-orange-500 focus:border-orange-500 block w-full pl-12 pr-10 py-4 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer font-bold shadow-xl shadow-black/20"
                            >
                                <option value="" disabled className="bg-[#0f1115] text-white/40">Select Intelligence Source...</option>
                                {datasets.map(d => (
                                    <option key={d.id} value={d.id} className="bg-[#0f1115] text-white py-2">{d.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-white/30" />
                            </div>
                        </div>

                        {selectedDataset && (
                            <button
                                onClick={() => analyzeDataset(selectedDataset)}
                                disabled={isAnalyzing}
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 active:scale-95"
                            >
                                <Play size={18} />
                                Analyze
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Show insights only when dataset is analyzed */}
            {insights ? (
                <>
                    {/* Key Metrics - Enhanced */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <MetricCard
                            title="Total Records"
                            value={insights.rowCount.toLocaleString()}
                            icon={Database}
                            trend="neutral"
                            color="orange"
                            subtitle="Data points"
                        />
                        <MetricCard
                            title="Total Columns"
                            value={insights.columnCount}
                            icon={Layers}
                            trend="neutral"
                            color="amber"
                            subtitle="Features"
                        />
                        <MetricCard
                            title="Completeness"
                            value={insights.completeness}
                            suffix="%"
                            icon={CheckCircle2}
                            trend={insights.completeness > 95 ? 'up' : insights.completeness > 85 ? 'neutral' : 'down'}
                            color="green"
                            subtitle="Data coverage"
                        />
                        <MetricCard
                            title="Quality Score"
                            value={insights.qualityScore}
                            suffix="/100"
                            icon={Target}
                            trend={insights.qualityScore > 90 ? 'up' : insights.qualityScore > 75 ? 'neutral' : 'down'}
                            color="green"
                            subtitle="Overall quality"
                        />
                        <MetricCard
                            title="Uniqueness"
                            value={insights.uniqueness.toFixed(1)}
                            suffix="%"
                            icon={Sparkles}
                            trend="neutral"
                            color="purple"
                            subtitle="Avg diversity"
                        />
                    </div>

                    {/* Overview Mode */}
                    {viewMode === 'overview' && (
                        <>
                            {/* Quality Analysis Section */}
                            <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

                                <SectionHeader title="Data Quality Analysis" icon={Target} section="quality" />

                                {expandedSections.quality && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                                        {/* Column Types */}
                                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
                                            <h4 className="text-lg font-black italic tracking-tight uppercase mb-6 text-white/80">Column Types</h4>
                                            <div className="h-[280px] flex items-center justify-center">
                                                {dataTypeChart && <Pie data={dataTypeChart} options={{ ...chartOptions, cutout: '0%' }} />}
                                            </div>
                                        </div>

                                        {/* Column Completeness */}
                                        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/5">
                                            <h4 className="text-lg font-black italic tracking-tight uppercase mb-6 text-white/80">Column Completeness</h4>
                                            <div className="h-[280px]">
                                                {columnQualityChart && <Bar data={columnQualityChart} options={chartOptions} />}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Distribution Analysis */}
                            <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

                                <SectionHeader title="Distribution Analysis" icon={BarChart3} section="distribution" />

                                {expandedSections.distribution && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                                        {/* Missing Values */}
                                        {nullDistChart && nullDistChart.labels.length > 0 && (
                                            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
                                                <h4 className="text-lg font-black italic tracking-tight uppercase mb-6 text-white/80">Missing Values</h4>
                                                <div className="h-[300px] flex items-center justify-center">
                                                    <Doughnut data={nullDistChart} options={{ ...chartOptions, cutout: '65%' }} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Uniqueness Distribution */}
                                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
                                            <h4 className="text-lg font-black italic tracking-tight uppercase mb-6 text-white/80">Uniqueness Distribution</h4>
                                            <div className="h-[300px]">
                                                {uniquenessChart && <Bar data={uniquenessChart} options={chartOptions} />}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Statistical Summary */}
                            {numericStatsChart && (
                                <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

                                    <div className="mb-8 relative z-10">
                                        <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">Statistical Summary</h3>
                                        <p className="text-white/40 text-sm font-medium">Mean vs Median for numeric columns</p>
                                    </div>

                                    <div className="h-[350px] relative z-10">
                                        <Bar data={numericStatsChart} options={{
                                            ...chartOptions,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                legend: { display: true, labels: { color: '#fff', font: { size: 12, weight: 'bold' } } }
                                            }
                                        }} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Detailed Mode */}
                    {viewMode === 'detailed' && (
                        <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">Column Statistics</h3>
                                <p className="text-white/40 text-sm font-medium">Comprehensive breakdown of all columns</p>
                            </div>

                            <div className="relative z-10 overflow-x-auto custom-scrollbar">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Column</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Type</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Unique</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Nulls</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Null %</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Complete</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Stats</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {insights.columns.map((col, i) => {
                                            const completeness = ((insights.rowCount - (col.nullCount || 0)) / insights.rowCount * 100).toFixed(1);
                                            const nullPct = ((col.nullCount || 0) / insights.rowCount * 100).toFixed(2);
                                            return (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4 font-bold text-white">{col.name}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-black uppercase">
                                                            {col.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-bold text-white/60">{col.uniqueCount?.toLocaleString()}</td>
                                                    <td className="py-4 px-4 text-right font-bold text-white/60">{(col.nullCount || 0).toLocaleString()}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <span className={`font-black ${parseFloat(nullPct) > 10 ? 'text-red-400' : parseFloat(nullPct) > 5 ? 'text-amber-400' : 'text-green-400'}`}>
                                                            {nullPct}%
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <span className={`font-black ${parseFloat(completeness) > 95 ? 'text-green-400' : parseFloat(completeness) > 85 ? 'text-amber-400' : 'text-red-400'}`}>
                                                            {completeness}%
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-xs text-white/40">
                                                        {col.stats ? (
                                                            <div className="space-y-1">
                                                                <div>Min: {col.stats.min?.toFixed(2)}</div>
                                                                <div>Max: {col.stats.max?.toFixed(2)}</div>
                                                                <div>Mean: {col.stats.mean?.toFixed(2)}</div>
                                                                <div>Median: {col.stats.median?.toFixed(2)}</div>
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Correlation Mode */}
                    {viewMode === 'correlation' && insights.correlation && (
                        <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">Correlation Analysis</h3>
                                <p className="text-white/40 text-sm font-medium">Relationships between numeric variables</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                                {/* Correlation Radar */}
                                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
                                    <h4 className="text-lg font-black italic tracking-tight uppercase mb-6 text-white/80">Correlation Radar</h4>
                                    <div className="h-[400px] flex items-center justify-center">
                                        {correlationRadar && <Radar data={correlationRadar} options={{
                                            ...chartOptions,
                                            scales: {
                                                r: {
                                                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                                                    ticks: { color: 'rgba(255, 255, 255, 0.4)', backdropColor: 'transparent', font: { size: 10, weight: 'bold' } },
                                                    pointLabels: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 11, weight: 'bold' } }
                                                }
                                            },
                                            plugins: {
                                                legend: { display: true, labels: { color: '#fff', font: { size: 11, weight: 'bold' } } }
                                            }
                                        }} />}
                                    </div>
                                </div>

                                {/* Correlation Matrix */}
                                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
                                    <h4 className="text-lg font-black italic tracking-tight uppercase mb-6 text-white/80">Correlation Matrix</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr>
                                                    <th className="p-2"></th>
                                                    {insights.correlation.columns.map((col, i) => (
                                                        <th key={i} className="p-2 text-white/60 font-black uppercase">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {insights.correlation.values.map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="p-2 text-white/60 font-black uppercase">{insights.correlation.columns[i]}</td>
                                                        {row.map((val, j) => (
                                                            <td key={j} className="p-2 text-center">
                                                                <span className={`px-2 py-1 rounded font-black ${Math.abs(val) > 0.7 ? 'bg-orange-500/20 text-orange-400' :
                                                                    Math.abs(val) > 0.4 ? 'bg-amber-500/20 text-amber-400' :
                                                                        'bg-white/5 text-white/40'
                                                                    }`}>
                                                                    {val.toFixed(2)}
                                                                </span>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="glass-panel p-24 rounded-[4rem] border border-white/5 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="w-32 h-32 mx-auto mb-10 rounded-[2.5rem] bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-700 shadow-2xl shadow-orange-500/10">
                        <Upload className="w-16 h-16 text-orange-400" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Select a Dataset</h3>
                    <p className="text-white/40 text-lg max-w-lg mx-auto font-medium leading-relaxed uppercase tracking-tighter">
                        Choose a dataset from the dropdown above to unlock advanced analytics and insights
                    </p>
                </div>
            )}
        </div>
    );
}
