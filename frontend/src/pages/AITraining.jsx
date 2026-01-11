import React, { useState, useEffect } from 'react';
import { Brain, Zap, Download, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useDatasets } from '../hooks/useDatasets';
import { useAI } from '../hooks/useAI';

export default function AITraining() {
    const { projects } = useProjects();
    const activeProject = projects[0];
    const { datasets } = useDatasets(activeProject?.id);
    const {
        isTraining,
        currentModel,
        models: trainedModels,
        trainModel,
        generateData,
        loadModels
    } = useAI();

    const [selectedDataset, setSelectedDataset] = useState(null);
    const [algorithm, setAlgorithm] = useState('CTGAN');
    const [hyperparameters, setHyperparameters] = useState({
        epochs: 300,
        batch_size: 500,
        learning_rate: 0.0002
    });

    useEffect(() => {
        if (selectedDataset) {
            loadModels(selectedDataset);
        }
    }, [selectedDataset, loadModels]);

    const handleTrainModel = async () => {
        if (!selectedDataset) {
            alert('Please select a dataset first');
            return;
        }

        try {
            await trainModel(selectedDataset, algorithm, {
                epochs: hyperparameters.epochs,
                batchSize: hyperparameters.batch_size,
                learningRate: hyperparameters.learning_rate
            });
            alert('Model training started! Check status below.');
        } catch (e) {
            console.error('Training failed:', e);
            alert('Failed to start training.');
        }
    };

    const handleGenerateDataUI = async (modelId) => {
        const count = prompt('How many records to generate?', '1000');
        if (!count) return;
        try {
            await generateData(modelId, parseInt(count));
        } catch (e) {
            alert('Generation failed.');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'TRAINING':
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
            case 'FAILED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-500/10 text-green-400 border-green-500/30';
            case 'TRAINING':
            case 'PENDING':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            case 'FAILED':
                return 'bg-red-500/10 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <header>
                <h1 className="text-5xl font-black tracking-tighter mb-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    AI Model Training
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    Train AI models and generate synthetic data
                </p>
            </header>

            {/* Training Configuration */}
            <div className="glass-panel p-8 rounded-[2rem] border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Brain className="w-6 h-6 text-emerald-500" />
                    Train New Model
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    {/* Dataset Selection */}
                    <div>
                        <label className="block text-sm font-bold mb-2 text-muted-foreground">
                            Select Dataset
                        </label>
                        <select
                            value={selectedDataset || ''}
                            onChange={(e) => setSelectedDataset(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500/50 outline-none"
                        >
                            <option value="">Choose a dataset...</option>
                            {datasets.map((dataset) => (
                                <option key={dataset.id} value={dataset.id}>
                                    {dataset.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Algorithm Selection */}
                    <div>
                        <label className="block text-sm font-bold mb-2 text-muted-foreground">
                            Algorithm
                        </label>
                        <select
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500/50 outline-none"
                        >
                            <option value="CTGAN">CTGAN (Recommended)</option>
                            <option value="TVAE">TVAE</option>
                            <option value="GaussianCopula">Gaussian Copula</option>
                            <option value="CopulaGAN">Copula GAN</option>
                        </select>
                    </div>

                    {/* Hyperparameters */}
                    <div>
                        <label className="block text-sm font-bold mb-2 text-muted-foreground">
                            Epochs
                        </label>
                        <input
                            type="number"
                            value={hyperparameters.epochs}
                            onChange={(e) => setHyperparameters({ ...hyperparameters, epochs: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500/50 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-muted-foreground">
                            Batch Size
                        </label>
                        <input
                            type="number"
                            value={hyperparameters.batch_size}
                            onChange={(e) => setHyperparameters({ ...hyperparameters, batch_size: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500/50 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-muted-foreground">
                            Learning Rate
                        </label>
                        <input
                            type="number"
                            step="0.0001"
                            value={hyperparameters.learning_rate}
                            onChange={(e) => setHyperparameters({ ...hyperparameters, learning_rate: parseFloat(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-emerald-500/50 outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={handleTrainModel}
                    disabled={isTraining || !selectedDataset}
                    className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {isTraining ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Training...
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5" />
                            Start Training
                        </>
                    )}
                </button>
            </div>

            {/* Current Training Status */}
            {currentModel && (
                <div className="glass-panel p-8 rounded-[2rem] border border-white/10 animate-in slide-in-from-bottom-8">
                    <h3 className="text-xl font-bold mb-4">Current Training Status</h3>
                    <div className="flex items-center gap-4">
                        {getStatusIcon(currentModel.status)}
                        <div className="flex-1">
                            <p className="font-bold">Model ID: {currentModel.id}</p>
                            <p className="text-sm text-muted-foreground">Algorithm: {currentModel.algorithm}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-xl font-bold text-sm border ${getStatusColor(currentModel.status)}`}>
                            {currentModel.status}
                        </span>
                    </div>
                </div>
            )}

            {/* Trained Models */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    Trained Models ({trainedModels.length})
                </h2>

                {trainedModels.length === 0 ? (
                    <div className="glass-panel p-12 rounded-[2rem] border border-white/10 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Brain className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">No Models Trained Yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Select a dataset and start training your first AI model!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {trainedModels.map((model) => (
                            <div
                                key={model.id}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                            {getStatusIcon(model.status)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Model #{model.id}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Algorithm: {model.algorithm} • Created: {new Date(model.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-4 py-2 rounded-xl font-bold text-sm border ${getStatusColor(model.status)}`}>
                                            {model.status}
                                        </span>
                                        {model.status === 'COMPLETED' && (
                                            <button
                                                onClick={() => handleGenerateDataUI(model.id)}
                                                className="px-6 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl font-bold transition-all flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Generate Data
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
