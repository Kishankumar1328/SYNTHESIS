import { Link } from 'react-router-dom';
import { FolderOpen, Edit3, Trash2, Calendar, Database, CheckCircle, ArrowRight, UserCircle } from 'lucide-react';
import { useState } from 'react';

const ProjectCard = ({ project, onRename, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");

    const handleStartRename = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
        setEditName(project.name);
    };

    const handleSaveRename = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (editName.trim()) {
            onRename(project.id, editName);
            setIsEditing(false);
        }
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(project.id);
    };

    return (
        <div className="group glass-panel p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/40 card-hover relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-700 pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-muted-foreground group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl transform-gpu">
                            <FolderOpen className="w-7 h-7" />
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button
                            onClick={handleStartRename}
                            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center transition-all hover:scale-110"
                            title="Rename"
                        >
                            <Edit3 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all hover:scale-110"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>

                <div>
                    {isEditing ? (
                        <form onSubmit={handleSaveRename} className="space-y-2" onClick={e => e.stopPropagation()}>
                            <input
                                autoFocus
                                className="w-full bg-white/5 border border-blue-500/50 rounded-xl px-3 py-2 text-lg font-bold focus:ring-2 ring-blue-500/50 outline-none text-white"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onBlur={() => setIsEditing(false)}
                                onClick={e => e.stopPropagation()}
                            />
                        </form>
                    ) : (
                        <Link to={`/project/${project.id}`} className="block">
                            <h3 className="text-2xl font-black tracking-tight leading-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all truncate">
                                {project.name}
                            </h3>
                        </Link>
                    )}

                    <div className="flex items-center space-x-3 mt-3">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center">
                            <Calendar className="w-3 h-3 mr-1.5 text-blue-500/50" />
                            {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                            <span className="text-blue-400 font-bold">Ready</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full">
                            <Database className="w-3 h-3 text-purple-400" />
                            <span className="text-purple-400 font-bold">Datasets</span>
                        </div>
                    </div>
                </div>
            </div>

            <Link
                to={`/project/${project.id}`}
                className="mt-6 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity"
            >
                <div className="flex -space-x-2">
                    <div className="relative">
                        <UserCircle className="w-8 h-8 text-white/20 bg-[#0a0c10] rounded-full border-2 border-[#0a0c10]" />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-blue-400 font-bold group/link">
                    <span className="text-sm">Launch</span>
                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </div>
            </Link>
        </div>
    );
};

export default ProjectCard;
