import React, { useState } from 'react';
import {
    X,
    Rocket,
    FileText,
    FileSpreadsheet,
    FileJson,
    CheckCircle,
    Download,
    Loader2,
    ShieldCheck,
    Database,
    Sparkles
} from 'lucide-react';

/**
 * Export Dialog Component
 * Allows users to export synthetic datasets in multiple formats with privacy reports
 */
const ExportDialog = ({ isOpen, onClose, dataset, syntheticDataset }) => {
    const [exportFormat, setExportFormat] = useState('excel');
    const [includePrivacyReport, setIncludePrivacyReport] = useState(true);
    const [numberOfRecords, setNumberOfRecords] = useState(1000);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsExporting(true);
        setExportProgress(0);

        try {
            const exportRequest = {
                datasetId: dataset.id,
                syntheticDatasetId: syntheticDataset?.id || null,
                format: exportFormat.toUpperCase(),
                includePrivacyReport: includePrivacyReport,
                numberOfRecords: numberOfRecords
            };

            setExportProgress(30);

            const endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/export/${exportFormat}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exportRequest),
            });

            setExportProgress(70);

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Get filename from response headers
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : `export.${exportFormat}`;

            // Download file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setExportProgress(100);

            setTimeout(() => {
                setIsExporting(false);
                setExportProgress(0);
                onClose();
            }, 1000);

        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const formatOptions = [
        { value: 'excel', label: 'Excel Workbook', icon: FileSpreadsheet, description: 'Report + data in sheets' },
        { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Professional privacy report' },
        { value: 'json', label: 'JSON Data', icon: FileJson, description: 'Structured data format' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative glass-panel-strong w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 z-20 flex justify-between items-center p-8 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white">Export Dataset</h2>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Generate & Download</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 flex items-center justify-center transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Dataset Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Database className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="overflow-hidden">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Source Dataset</span>
                                <span className="text-white font-bold truncate block">{dataset?.name}</span>
                            </div>
                        </div>
                        {syntheticDataset && (
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-500/20 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Synthetic Version</span>
                                    <span className="text-white font-bold truncate block">{syntheticDataset.name}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Format Selection */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            Select Format
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {formatOptions.map((format) => {
                                const Icon = format.icon;
                                const isSelected = exportFormat === format.value;
                                return (
                                    <div
                                        key={format.value}
                                        onClick={() => setExportFormat(format.value)}
                                        className={`cursor-pointer group relative p-6 rounded-2xl border transition-all duration-300 ${isSelected
                                                ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500/50'
                                                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 text-blue-400">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-muted-foreground group-hover:text-white'
                                            }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h4 className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{format.label}</h4>
                                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{format.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                                Export Settings
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={includePrivacyReport}
                                        onChange={(e) => setIncludePrivacyReport(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-[#0a0c10]"
                                    />
                                    <div>
                                        <span className="block font-bold text-white">Include Privacy Report</span>
                                        <span className="text-xs text-muted-foreground">Detailed metrics & certificates</span>
                                    </div>
                                </label>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-white">Record Limit</span>
                                        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Max: {numberOfRecords}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100"
                                        max="100000"
                                        step="100"
                                        value={numberOfRecords}
                                        onChange={(e) => setNumberOfRecords(parseInt(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                                Privacy Guarantees
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Zero Leakage', 'GDPR Compliant', '100% Synthetic', 'Privacy Safe'].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        <ShieldCheck className="w-4 h-4 shrink-0" />
                                        <span className="text-xs font-bold">{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {isExporting && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-blue-400">Generating Export...</span>
                                <span className="text-white">{exportProgress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 relative"
                                    style={{ width: `${exportProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-lg uppercase tracking-wider transition-all shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processing Request...
                            </>
                        ) : (
                            <>
                                <Download className="w-6 h-6" />
                                Download {formatOptions.find(f => f.value === exportFormat)?.label}
                            </>
                        )}
                    </button>

                    {/* Footer Info */}
                    <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10 text-center">
                        <p className="text-xs text-emerald-400/80 font-medium">
                            <ShieldCheck className="w-3 h-3 inline mr-1.5 align-text-bottom" />
                            This export is cryptographically signed and verified for privacy compliance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportDialog;
