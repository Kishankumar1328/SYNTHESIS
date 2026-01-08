import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, BarChart3, AlertCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useDatasets } from '../hooks/useDatasets';

export default function Datasets() {
    const { projects, loading: projectLoading, error: projectError, refresh: refreshProjects } = useProjects();
    const activeProject = projects[0];
    const {
        datasets,
        loading: datasetsLoading,
        uploadDataset,
        deleteDataset,
        refresh: refreshDatasets
    } = useDatasets(activeProject?.id);

    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !activeProject) return;
        setUploading(true);
        try {
            await uploadDataset(selectedFile);
            setSelectedFile(null);
        } catch (e) {
            console.error('Upload failed:', e);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this dataset?')) return;
        try {
            await deleteDataset(id);
        } catch (e) {
            console.error('Delete failed:', e);
        }
    };

    return (
        <div className="p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <header>
                <h1 className="text-5xl font-black tracking-tighter mb-3 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                    Datasets
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    Upload and manage your datasets for synthetic data generation
                </p>
            </header>

            {/* Error Banner */}
            {projectError && (
                <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-bold text-red-400 mb-1">Connection Error</h3>
                        <p className="text-sm text-muted-foreground">{projectError}</p>
                        <button
                            onClick={refreshProjects}
                            className="mt-3 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl font-bold text-sm transition-all"
                        >
                            Retry Connection
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Section */}
            <div className="glass-panel p-8 rounded-[2rem] border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Upload className="w-6 h-6 text-blue-500" />
                    Upload Dataset
                </h2>

                <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-all">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".csv,.json,.xlsx"
                            onChange={handleFileSelect}
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center gap-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <FileText className="w-10 h-10 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xl font-bold mb-2">
                                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    CSV, JSON, or Excel files (Max 100MB)
                                </p>
                            </div>
                        </label>
                    </div>

                    {selectedFile && (
                        <div className="flex gap-4">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload Dataset'}
                            </button>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="px-8 py-4 text-muted-foreground font-bold hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Datasets List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-green-500" />
                    Your Datasets ({datasets.length})
                </h2>

                {datasets.length === 0 ? (
                    <div className="glass-panel p-12 rounded-[2rem] border border-white/10 text-center">
                        <p className="text-muted-foreground text-lg">
                            No datasets uploaded yet. Upload your first dataset to get started!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {datasets.map((dataset) => (
                            <div
                                key={dataset.id}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{dataset.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Uploaded: {new Date(dataset.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-3 rounded-xl bg-white/5 hover:bg-blue-500/20 text-blue-400 transition-all"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dataset.id)}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
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
