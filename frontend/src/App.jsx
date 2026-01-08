import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Datasets from './pages/Datasets';
import PrivacyAudit from './pages/PrivacyAudit';
import AnomalyHub from './pages/AnomalyHub';
import AITraining from './pages/AITraining';

function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex text-foreground bg-[#0a0c10] font-sans selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 glass-panel flex flex-col p-8 space-y-10 sticky top-0 h-screen">
                <div className="flex items-center space-x-4 px-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <i className='bx bxs-cube text-2xl text-white'></i>
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tighter block leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">SYNTHESIS</span>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Intelligence Engine</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-1">
                    <SidebarLink
                        icon="bx-grid-alt"
                        label="Dashboard"
                        to="/"
                        active={location.pathname === '/'}
                    />
                    <SidebarLink
                        icon="bx-data"
                        label="Datasets"
                        to="/datasets"
                        active={location.pathname === '/datasets'}
                    />
                    <SidebarLink
                        icon="bx-shield-quarter"
                        label="Privacy Audit"
                        to="/security"
                        active={location.pathname === '/security'}
                    />
                    <SidebarLink
                        icon="bx-analyse"
                        label="Anomaly Hub"
                        to="/anomalies"
                        active={location.pathname === '/anomalies'}
                    />
                    <SidebarLink
                        icon="bx-brain"
                        label="AI Training"
                        to="/ai-training"
                        active={location.pathname === '/ai-training'}
                    />
                </nav>

                <div className="p-5 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-3 tracking-widest">Enterprise Support</p>
                    <div className="text-sm space-y-3 relative z-10">
                        <a href="#" className="flex items-center text-muted-foreground hover:text-white transition-all font-medium">
                            <i className='bx bx-book-content mr-2 text-lg'></i> Docs
                        </a>
                        <a href="#" className="flex items-center text-muted-foreground hover:text-white transition-all font-medium">
                            <i className='bx bx-support mr-2 text-lg'></i> Live Help
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    <Route path="/datasets" element={<Datasets />} />
                    <Route path="/security" element={<PrivacyAudit />} />
                    <Route path="/anomalies" element={<AnomalyHub />} />
                    <Route path="/ai-training" element={<AITraining />} />
                </Routes>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, to, active }) {
    return (
        <Link
            to={to}
            className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group
        ${active
                    ? "bg-white/10 text-white shadow-xl shadow-black/20 border border-white/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                }`}
        >
            <i className={`bx ${icon} text-2xl transition-transform duration-300 group-hover:scale-110 ${active ? 'text-blue-400' : ''}`}></i>
            <span className={`font-semibold tracking-tight ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>}
        </Link>
    );
}

export default App;
