import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';

export default function Dashboard() {
    const { projects, createProject } = useProjects();
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProject(newName);
            setNewName("");
            setIsCreating(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter mb-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent italic">
                        Workspaces
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">Manage and generate synthetic environments.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center space-x-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                    <i className='bx bx-plus-circle text-2xl'></i>
                    <span>Generate Workspace</span>
                </button>
            </header>

            {isCreating && (
                <div className="glass-panel p-8 rounded-[2rem] border border-white/10 animate-in slide-in-from-top-8 duration-500">
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <div className="flex-1 relative">
                            <i className='bx bx-rename absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground'></i>
                            <input
                                autoFocus
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-teal-500/50 outline-none transition-all placeholder:text-muted-foreground/50"
                                placeholder="Environment Name (e.g. Fraud Detection 2024)"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                            />
                        </div>
                        <button className="bg-teal-600 hover:bg-teal-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-teal-600/20">Init</button>
                        <button onClick={() => setIsCreating(false)} type="button" className="px-6 py-4 text-muted-foreground font-bold hover:text-white transition-colors">Cancel</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(project => (
                    <Link
                        key={project.id}
                        to={`/project/${project.id}`}
                        className="group glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-teal-500/30 transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-teal-500/10 transition-all"></div>

                        <div className="space-y-6 relative z-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-muted-foreground group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white group-hover:border-transparent transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl transform-gpu">
                                <i className='bx bx-folder-open text-3xl'></i>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight leading-tight mb-2 group-hover:text-teal-400 transition-colors">
                                    {project.name}
                                </h3>
                                <div className="flex items-center space-x-4">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center">
                                        <i className='bx bx-calendar-event mr-2 text-lg text-teal-500/50'></i>
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="h-1 w-1 bg-white/20 rounded-full"></div>
                                    <p className="text-[10px] bg-white/5 px-2 py-1 rounded text-muted-foreground font-black tracking-tighter uppercase">ID: {project.id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
                            <div className="flex -space-x-2">
                                <i className='bx bxs-user-circle text-2xl text-white/20 border-2 border-[#0a0c10] rounded-full'></i>
                                <div className="w-6 h-6 rounded-full bg-teal-500/20 border-2 border-[#0a0c10] flex items-center justify-center text-[8px] font-bold text-teal-400">+</div>
                            </div>
                            <i className='bx bx-right-arrow-alt text-3xl text-teal-500 group-hover:translate-x-2 transition-transform duration-500'></i>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
