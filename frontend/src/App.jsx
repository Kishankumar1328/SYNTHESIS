import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useProjects } from './hooks/useProjects';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Datasets from './pages/Datasets';
import DataInsights from './pages/DataInsights';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import PrivacyAudit from './pages/PrivacyAudit';
import AnomalyHub from './pages/AnomalyHub';
import AITraining from './pages/AITraining';
import HybridAIAnalyst from './pages/HybridAIAnalyst';
import AICopilotButton from './components/AICopilotButton';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!isAuthenticated) return <Navigate to="/login" />;

    return children;
};

function App() {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const { createProject } = useProjects();

    // Check if current page is an auth page
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    if (isAuthPage) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <div className="min-h-screen flex text-white bg-[#05070a] font-sans selection:bg-orange-500/30">
            {/* Sidebar */}
            <aside className="w-80 border-r border-white/5 glass-panel flex flex-col p-8 space-y-10 sticky top-0 h-screen shrink-0 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-orange-500/5 blur-[120px] pointer-events-none"></div>

                <div className="flex items-center space-x-4 px-2 group cursor-pointer relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-all duration-500">
                        <i className='bx bxs-layer text-2xl text-white group-hover:animate-pulse'></i>
                    </div>
                    <div>
                        <span className="text-2xl font-black tracking-tighter block leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">SYNTH<span className="text-orange-500 text-shadow-glow-orange">ESIS</span></span>
                        <span className="text-[10px] font-black text-amber-400/50 uppercase tracking-[0.2em] leading-none block mt-1 italic">Intelligence Engine</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 px-1 relative z-10 custom-scrollbar overflow-y-auto">
                    <SidebarLink
                        icon="bx-grid-alt"
                        label="Dashboard"
                        to="/"
                        active={location.pathname === '/'}
                        activeColor="orange"
                    />
                    <SidebarLink
                        icon="bx-data"
                        label="Datasets"
                        to="/datasets"
                        active={location.pathname === '/datasets'}
                        activeColor="orange"
                    />
                    <SidebarLink
                        icon="bx-bar-chart-alt-2"
                        label="Data Insights"
                        to="/insights"
                        active={location.pathname === '/insights'}
                        activeColor="orange"
                    />
                    <SidebarLink
                        icon="bx-line-chart"
                        label="Advanced Analytics"
                        to="/analytics"
                        active={location.pathname === '/analytics'}
                        activeColor="orange"
                    />
                    <SidebarLink
                        icon="bx-shield-quarter"
                        label="Privacy Audit"
                        to="/security"
                        active={location.pathname === '/security'}
                        activeColor="orange"
                    />
                    <SidebarLink
                        icon="bx-analyse"
                        label="Anomaly Hub"
                        to="/anomalies"
                        active={location.pathname === '/anomalies'}
                        activeColor="orange"
                    />
                    <SidebarLink
                        icon="bx-brain"
                        label="AI Training"
                        to="/ai-training"
                        active={location.pathname === '/ai-training'}
                        activeColor="orange"
                    />
                    <SidebarLink
                        icon="bx-terminal"
                        label="Hybrid AI Analyst"
                        to="/ai-analyst"
                        active={location.pathname === '/ai-analyst'}
                        activeColor="orange"
                    />
                </nav>

                <div className="pt-4 border-t border-white/5 relative z-10">
                    <button
                        onClick={async () => {
                            const name = prompt("Enter workspace name:");
                            if (name) {
                                try {
                                    const newProj = await createProject(name);
                                    window.location.href = `/project/${newProj.id}`;
                                } catch (e) {
                                    alert("Failed to create workspace: " + e.message);
                                }
                            }
                        }}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 group"
                    >
                        <i className='bx bx-plus text-lg group-hover:rotate-90 transition-transform duration-500'></i>
                        New Workspace
                    </button>
                </div>

                <div
                    onClick={() => logout()}
                    className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 relative overflow-hidden group hover:bg-orange-500/10 transition-all cursor-pointer relative z-10"
                >
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
                    <p className="text-[9px] text-orange-500 uppercase font-black mb-4 tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div> Session Active
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500/20 transition-all">
                            <i className='bx bx-power-off text-xl text-orange-400'></i>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black text-white truncate">{user?.username || 'Operative'}</p>
                            <p className="text-[10px] text-white/30 truncate uppercase font-bold tracking-tight">Click to Terminate</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto relative custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent">
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
                    <Route path="/datasets" element={<ProtectedRoute><Datasets /></ProtectedRoute>} />
                    <Route path="/insights" element={<ProtectedRoute><DataInsights /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><AdvancedAnalytics /></ProtectedRoute>} />
                    <Route path="/security" element={<ProtectedRoute><PrivacyAudit /></ProtectedRoute>} />
                    <Route path="/anomalies" element={<ProtectedRoute><AnomalyHub /></ProtectedRoute>} />
                    <Route path="/ai-training" element={<ProtectedRoute><AITraining /></ProtectedRoute>} />
                    <Route path="/ai-analyst" element={<ProtectedRoute><HybridAIAnalyst /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>

            {/* AI Copilot Floating Button */}
            <AICopilotButton />
        </div>
    );
};

function SidebarLink({ icon, label, to, active, activeColor = "orange" }) {
    const activeStyles = {
        blue: "bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent text-white border-white/5",
        orange: "bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent text-white border-white/5"
    };

    const activeIconColor = {
        blue: "text-sky-400",
        orange: "text-orange-400"
    };

    const activeDotColor = {
        blue: "bg-sky-500 shadow-[0_0_10px_#38bdf8]",
        orange: "bg-orange-500 shadow-[0_0_10px_#f97316]"
    };

    const activeBarColor = {
        blue: "bg-gradient-to-b from-transparent via-blue-500 to-transparent shadow-[0_0_15px_#3b82f6]",
        orange: "bg-gradient-to-b from-transparent via-orange-500 to-transparent shadow-[0_0_15px_#f97316]"
    };

    return (
        <Link
            to={to}
            className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group relative
        ${active
                    ? activeStyles[activeColor] + " border"
                    : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
        >
            <i className={`bx ${icon} text-2xl transition-colors duration-300 ${active ? activeIconColor[activeColor] + ' scale-110' : 'group-hover:text-white group-hover:scale-110'}`}></i>
            <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{label}</span>
            {active && (
                <>
                    <div className={`ml-auto w-1.5 h-1.5 rounded-full ${activeDotColor[activeColor]}`}></div>
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3/5 rounded-r-full ${activeBarColor[activeColor]}`}></div>
                </>
            )}
        </Link>
    );
}

export default App;
