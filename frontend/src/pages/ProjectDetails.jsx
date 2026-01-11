import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectAPI, DatasetAPI, ModelAPI } from '../api';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [models, setModels] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('engines');
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('CTGAN');
    const [error, setError] = useState(null);

    const algorithms = [
        { id: 'CTGAN', name: 'CTGAN', desc: 'Neural network GAN for mixed tabular data' },
        { id: 'TVAE', name: 'TVAE', desc: 'Variational Autoencoder - fast and accurate' },
        { id: 'GaussianCopula', name: 'Gaussian Copula', desc: 'Statistical model - ultra fast' },
        { id: 'CopulaGAN', name: 'CopulaGAN', desc: 'Hybrid GAN-Copula for complex distributions' }
    ];

    const loadProject = useCallback(async () => {
        try {
            const res = await ProjectAPI.getOne(id);
            setProject(res.data);
            setError(null);
        } catch (e) {
            console.error('Failed to load project:', e);
            setError('Failed to load project');
            navigate('/');
        }
    }, [id, navigate]);

    const loadDatasets = useCallback(async () => {
        try {
            const res = await DatasetAPI.getByProject(id);
            const data = res.data;
            setDatasets(data);
            if (data.length > 0 && !selectedDataset) {
                setSelectedDataset(data[0]);
            }
            setError(null);
        } catch (e) {
            console.error('Failed to load datasets:', e);
            setError('Failed to load datasets');
        }
    }, [id, selectedDataset]);

    const loadModels = useCallback(async () => {
        if (!selectedDataset) return;
        try {
            const res = await ModelAPI.getByDataset(selectedDataset.id);
            setModels(res.data);
            setError(null);
        } catch (e) {
            console.error('Failed to load models:', e);
            setError('Failed to load models');
        }
    }, [selectedDataset]);

    const loadStats = useCallback(async () => {
        if (!selectedDataset) return;
        setLoadingStats(true);
        try {
            const res = await DatasetAPI.getStats(selectedDataset.id);
            setStats(typeof res.data === 'string' ? JSON.parse(res.data) : res.data);
            setError(null);
        } catch (e) {
            console.error("Failed to load stats", e);
            setStats(null);
            setError('Failed to load statistics');
        } finally {
            setLoadingStats(false);
        }
    }, [selectedDataset]);

    useEffect(() => {
        loadProject();
        loadDatasets();
    }, [loadProject, loadDatasets]);

    useEffect(() => {
        if (selectedDataset) {
            loadModels();
            loadStats();
        }
    }, [selectedDataset, loadModels, loadStats]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', id);

        try {
            await DatasetAPI.upload(formData);
            await loadDatasets();
        } catch (e) {
            console.error('Upload failed:', e);
            setError('Failed to upload dataset');
        } finally {
            setUploading(false);
        }
    };

    const handleTrain = async () => {
        if (!selectedDataset) return;
        setError(null);
        try {
            await ModelAPI.train({
                datasetId: selectedDataset.id,
                algorithm: selectedAlgorithm
            });
            await loadModels();
        } catch (e) {
            console.error('Training failed:', e);
            setError('Failed to initiate training');
        }
    };

    const handleGenerate = async (modelId) => {
        setError(null);
        try {
            const res = await ModelAPI.generate(modelId, { count: 1000 });
            const blob = new Blob([res.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `synthetic_gen_${modelId}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Generation failed:', e);
            setError('Failed to generate synthetic data');
        }
    };

    if (!project) return (
        <div className="flex items-center justify-center h-screen">
            <i className='bx bx-loader-alt animate-spin text-6xl text-teal-500'></i>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center space-x-3">
                    <i className='bx bx-error-circle text-red-500 text-2xl'></i>
                    <p className="text-red-400 font-semibold">{error}</p>
                </div>
            )}

            <header className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate('/')}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
                    >
                        <i className='bx bx-chevron-left text-3xl group-hover:-translate-x-1 transition-transform'></i>
                    </button>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">{project.name}</h1>
                            <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-black text-teal-400 uppercase tracking-widest">Active Workspace</span>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center">
                            <i className='bx bx-network-chart mr-2 text-teal-500/50'></i>
                            Distributed Synthetic Intelligence Environment
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-10">
                {/* Left Panel: Datasets */}
                <div className="col-span-3 space-y-8">
                    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10 px-2">
                            <h2 className="text-lg font-black tracking-tight flex items-center">
                                <i className='bx bx-data mr-2 text-teal-500 text-xl'></i> Base Signals
                            </h2>
                            <label className="cursor-pointer bg-white group hover:scale-105 active:scale-95 transition-all w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                                <i className='bx bx-upload text-black text-sm'></i>
                                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                        </div>

                        {uploading && (
                            <div className="flex items-center justify-center py-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl animate-pulse">
                                <i className='bx bx-loader-alt animate-spin mr-2 text-teal-500 text-xl'></i>
                                <span className="text-xs font-black text-teal-400 uppercase tracking-tighter">Uploading...</span>
                            </div>
                        )}

                        <div className="space-y-2 relative z-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {datasets.map(ds => (
                                <button
                                    key={ds.id}
                                    onClick={() => setSelectedDataset(ds)}
                                    className={`w-full text-left p-3 rounded-2xl transition-all border group relative ${selectedDataset?.id === ds.id
                                        ? "bg-white/10 border-white/20 shadow-[-5px_0_15px_-5px_rgba(20,184,166,0.5)]"
                                        : "hover:bg-white/5 border-transparent hover:border-white/5"
                                        }`}
                                >
                                    <div className="flex items-center justify-between pointer-events-none">
                                        <div className="truncate">
                                            <p className={`text-sm font-bold transition-colors ${selectedDataset?.id === ds.id ? 'text-white' : 'text-muted-foreground group-hover:text-white'}`}>
                                                {ds.name}
                                            </p>
                                        </div>
                                        {selectedDataset?.id === ds.id && (
                                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full shadow-[0_0_10px_#14b8a6]"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Algorithm Selector Section */}
                    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/5 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Engine Settings</h3>
                        <div className="space-y-2">
                            {algorithms.map(algo => (
                                <button
                                    key={algo.id}
                                    onClick={() => setSelectedAlgorithm(algo.id)}
                                    className={`w-full text-left p-3 rounded-2xl transition-all border text-xs ${selectedAlgorithm === algo.id
                                        ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                                        : "border-transparent text-muted-foreground hover:bg-white/5"
                                        }`}
                                >
                                    <p className="font-black uppercase tracking-tighter">{algo.name}</p>
                                    <p className="opacity-50 mt-1 font-medium">{algo.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Content Tabs */}
                <div className="col-span-9 space-y-8">
                    {selectedDataset ? (
                        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                            {/* Tabs Header */}
                            <div className="flex items-center space-x-4 border-b border-white/5 pb-2">
                                <TabButton
                                    active={activeTab === 'engines'}
                                    onClick={() => setActiveTab('engines')}
                                    icon="bx-chip"
                                    label="Logic Engines"
                                />
                                <TabButton
                                    active={activeTab === 'analytics'}
                                    onClick={() => setActiveTab('analytics')}
                                    icon="bx-bar-chart-alt-2"
                                    label="Data Insights"
                                />
                            </div>

                            {activeTab === 'engines' ? (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tight mb-2">Generative Engines</h2>
                                            <p className="text-muted-foreground text-sm font-medium">Active algorithmic models learning from <span className="text-white italic">{selectedDataset.name}</span></p>
                                        </div>
                                        <button
                                            onClick={handleTrain}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-600/20"
                                        >
                                            <i className='bx bx-brain text-xl'></i>
                                            <span>Train {selectedAlgorithm}</span>
                                        </button>
                                    </div>

                                    <div className="grid gap-6">
                                        {models.map(model => (
                                            <div key={model.id} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 flex justify-between items-center group relative overflow-hidden transition-all hover:border-white/10">
                                                <div className="flex items-center space-x-6 relative z-10">
                                                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground shadow-lg group-hover:bg-teal-500/10 transition-all duration-500">
                                                        <i className={`bx ${model.status === 'COMPLETED' ? 'bx-chip' : 'bx-cog bx-spin'} text-4xl`}></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black tracking-tight leading-none mb-2">
                                                            {model.algorithm} <span className="text-muted-foreground text-sm font-black italic ml-2">v{model.id}</span>
                                                        </h4>
                                                        <StatusBadge status={model.status} />
                                                    </div>
                                                </div>

                                                <div className="relative z-10">
                                                    {model.status === 'COMPLETED' && (
                                                        <button
                                                            onClick={() => handleGenerate(model.id)}
                                                            className="bg-white/10 hover:bg-white text-muted-foreground hover:text-black px-6 py-3 rounded-2xl flex items-center space-x-3 text-xs font-black uppercase tracking-widest transition-all duration-300 transform-gpu active:scale-95"
                                                        >
                                                            <i className='bx bx-play-circle text-xl'></i>
                                                            <span>Sample Generation</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 min-h-[500px]">
                                    {loadingStats ? (
                                        <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
                                            <i className='bx bx-loader-alt animate-spin text-6xl text-teal-500'></i>
                                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse text-center">Synthesizing Statistical Insights<br />Analyzing Data Patterns...</p>
                                        </div>
                                    ) : (
                                        <AnalyticsDashboard stats={stats} />
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-dashed border-white/5 rounded-[3rem] h-full min-h-[500px] flex flex-col items-center justify-center text-center p-20 relative overflow-hidden group">
                            <i className='bx bx-selection text-6xl text-muted-foreground/20 mb-6'></i>
                            <h3 className="text-2xl font-black text-muted-foreground tracking-tight mb-2">Signal Required</h3>
                            <p className="text-xs text-muted-foreground/60 max-w-xs uppercase tracking-tighter">Select a source dataset from the explorer to initialize engine bays and view intelligence insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all
                ${active
                    ? "bg-white/5 text-teal-400 border-t-2 border-teal-500"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
        >
            <i className={`bx ${icon} text-lg`}></i>
            <span>{label}</span>
        </button>
    );
}

function StatusBadge({ status }) {
    switch (status) {
        case 'COMPLETED':
            return <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-green-400"><i className='bx bxs-check-shield mr-1 text-xs'></i> Stable</span>;
        case 'TRAINING':
            return <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-teal-400"><i className='bx bx-sync bx-spin mr-1 text-xs'></i> Learning</span>;
        case 'FAILED':
            return <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-red-500"><i className='bx bxs-error-alt mr-1 text-xs'></i> Disrupted</span>;
        default:
            return <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground"><i className='bx bx-timer mr-1 text-xs'></i> Queue</span>;
    }
}
