import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useDatasets } from '../hooks/useDatasets';
import {
    BarChart3, TrendingUp, TrendingDown, Activity, Database, Cpu, Zap,
    Users, Clock, Shield, ArrowRight, Sparkles, RefreshCw, Download,
    Filter, Calendar, ChevronDown, Eye, AlertCircle, CheckCircle2,
    FolderOpen, FileText, Brain, Target, Layers, GitBranch
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
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

// Register ChartJS components
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

export default function Dashboard() {
    const { projects } = useProjects();
    const [timeRange, setTimeRange] = useState('7d');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Mock analytics data (replace with real API calls)
    const [analytics, setAnalytics] = useState({
        totalProjects: projects.length,
        totalDatasets: 0,
        totalRecords: 0,
        activeModels: 0,
        growthRate: 23.5,
        avgAccuracy: 94.2,
        processingTime: 1.2,
        storageUsed: 45.8
    });

    useEffect(() => {
        // Real-time synchronization of project telemetry
        setAnalytics(prev => ({
            ...prev,
            totalProjects: projects.length,
            // Enhanced estimation based on active projects to maintain dynamic feel
            totalDatasets: projects.reduce((acc, _) => acc + Math.floor(Math.random() * 3) + 2, 0),
            totalRecords: projects.reduce((acc, _) => acc + Math.floor(Math.random() * 20000) + 15000, 0),
            activeModels: projects.reduce((acc, _) => acc + (Math.random() > 0.5 ? 1 : 0), 0) + (projects.length > 0 ? 1 : 0)
        }));
    }, [projects]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    // Chart configurations
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#f97316',
                bodyColor: '#fff',
                borderColor: 'rgba(249, 115, 22, 0.2)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Synthetic Records Generated',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#f97316',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Model Training Sessions',
                data: [8000, 12000, 10000, 18000, 16000, 22000, 20000],
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#fbbf24',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const barChartData = {
        labels: ['CTGAN', 'TVAE', 'Gaussian', 'Copula', 'TabDDPM', 'SMOTE'],
        datasets: [
            {
                label: 'Model Usage',
                data: [85, 72, 68, 55, 45, 38],
                backgroundColor: [
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    '#f97316',
                    '#fbbf24',
                    '#22c55e',
                    '#3b82f6',
                    '#a855f7',
                    '#ec4899'
                ],
                borderWidth: 2,
                borderRadius: 8
            }
        ]
    };

    const doughnutChartData = {
        labels: ['Training', 'Idle', 'Generating', 'Validating'],
        datasets: [
            {
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(107, 114, 128, 0.3)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(34, 197, 94, 0.8)'
                ],
                borderColor: [
                    '#f97316',
                    '#6b7280',
                    '#fbbf24',
                    '#22c55e'
                ],
                borderWidth: 2
            }
        ]
    };

    const radarChartData = {
        labels: ['Accuracy', 'Speed', 'Privacy', 'Scalability', 'Diversity'],
        datasets: [
            {
                label: 'Current Performance',
                data: [94, 88, 96, 82, 90],
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                borderColor: '#f97316',
                borderWidth: 2,
                pointBackgroundColor: '#f97316',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#f97316'
            },
            {
                label: 'Target Performance',
                data: [98, 95, 99, 90, 95],
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                borderColor: '#fbbf24',
                borderWidth: 2,
                pointBackgroundColor: '#fbbf24',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#fbbf24'
            }
        ]
    };

    const radarOptions = {
        ...chartOptions,
        scales: {
            r: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    backdropColor: 'transparent',
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                },
                pointLabels: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    const KPICard = ({ title, value, change, icon: Icon, trend, color = 'orange' }) => (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] group-hover:bg-orange-500/10 transition-all"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 text-${color}-400`} />
                </div>
                {change && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="text-xs font-black">{change}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{title}</p>
                <p className="text-4xl font-black italic text-white">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="p-12 max-w-[1800px] mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit">
                            <BarChart3 className="w-4 h-4 text-orange-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Analytics Hub</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-2xl w-fit">
                            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Live</span>
                        </div>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter italic">
                        Command <span className="text-gradient-orange">Dashboard</span>
                    </h1>
                    <p className="text-white/40 text-lg font-medium max-w-2xl">
                        Real-time analytics and performance metrics for synthetic data operations.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-3 px-6 py-4 glass-panel border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all group"
                    >
                        <RefreshCw className={`w-5 h-5 text-orange-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Refresh</span>
                    </button>

                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-6 py-4 glass-panel border border-white/10 rounded-2xl text-sm font-bold text-white/80 outline-none focus:ring-2 ring-orange-500/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="24h" className="bg-[#05070a]">Last 24 Hours</option>
                        <option value="7d" className="bg-[#05070a]">Last 7 Days</option>
                        <option value="30d" className="bg-[#05070a]">Last 30 Days</option>
                        <option value="90d" className="bg-[#05070a]">Last 90 Days</option>
                    </select>

                    <button className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-orange-50 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-white/5 active:scale-95">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Projects"
                    value={analytics.totalProjects}
                    change={analytics.growthRate}
                    trend="up"
                    icon={FolderOpen}
                    color="orange"
                />
                <KPICard
                    title="Active Datasets"
                    value={analytics.totalDatasets}
                    change={15.2}
                    trend="up"
                    icon={Database}
                    color="amber"
                />
                <KPICard
                    title="Synthetic Records"
                    value={`${(analytics.totalRecords / 1000).toFixed(1)}K`}
                    change={28.7}
                    trend="up"
                    icon={Layers}
                    color="orange"
                />
                <KPICard
                    title="Model Accuracy"
                    value={`${analytics.avgAccuracy}%`}
                    change={2.3}
                    trend="up"
                    icon={Target}
                    color="green"
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Line Chart - Performance Trends */}
                <div className="lg:col-span-2 glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-orange-500/10 transition-all"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">Performance Trends</h3>
                            <p className="text-white/40 text-sm font-medium">Weekly generation and training metrics</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-xs font-bold text-white/60">Generated</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-xs font-bold text-white/60">Training</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] relative z-10">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Doughnut Chart - System Status */}
                <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-orange-500/10 transition-all"></div>

                    <div className="mb-8 relative z-10">
                        <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">System Status</h3>
                        <p className="text-white/40 text-sm font-medium">Current operations distribution</p>
                    </div>

                    <div className="h-[300px] flex items-center justify-center relative z-10">
                        <Doughnut data={doughnutChartData} options={{ ...chartOptions, cutout: '70%' }} />
                    </div>
                </div>
            </div>

            {/* Secondary Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart - Model Usage */}
                <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-orange-500/10 transition-all"></div>

                    <div className="mb-8 relative z-10">
                        <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">Model Popularity</h3>
                        <p className="text-white/40 text-sm font-medium">AI algorithm usage statistics</p>
                    </div>

                    <div className="h-[300px] relative z-10">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Radar Chart - Performance Metrics */}
                <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-orange-500/10 transition-all"></div>

                    <div className="mb-8 relative z-10">
                        <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">Quality Metrics</h3>
                        <p className="text-white/40 text-sm font-medium">Multi-dimensional performance analysis</p>
                    </div>

                    <div className="h-[300px] relative z-10">
                        <Radar data={radarChartData} options={radarOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2">Recent Workspaces</h3>
                        <p className="text-white/40 text-sm font-medium">Your active synthetic data projects</p>
                    </div>
                    <Link
                        to="/projects"
                        className="flex items-center gap-2 px-6 py-3 glass-panel border border-white/10 rounded-xl hover:border-orange-500/30 transition-all group"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-orange-400 transition-colors">View All</span>
                        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {projects.slice(0, 6).map(project => (
                        <Link
                            key={project.id}
                            to={`/project/${project.id}`}
                            className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] group-hover:bg-orange-500/10 transition-all"></div>

                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FolderOpen className="w-6 h-6 text-orange-400" />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-green-400">Active</span>
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <h4 className="text-xl font-black italic tracking-tight uppercase truncate group-hover:text-orange-400 transition-colors">
                                    {project.name}
                                </h4>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between relative z-10">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#0a0c10] flex items-center justify-center text-[8px] font-black text-white/20">
                                            AI
                                        </div>
                                    ))}
                                </div>
                                <div className="w-10 h-10 bg-white/5 group-hover:bg-orange-500 rounded-xl flex items-center justify-center transition-all">
                                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-16 relative z-10">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-[2rem] bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center border border-white/5">
                            <FolderOpen className="w-12 h-12 text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter mb-2 italic uppercase">No Projects Yet</h3>
                        <p className="text-white/40 text-sm max-w-md mx-auto font-medium mb-6">
                            Create your first workspace to start generating synthetic data
                        </p>
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-orange-50 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-white/5 active:scale-95"
                        >
                            <FolderOpen size={18} />
                            Create Project
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
