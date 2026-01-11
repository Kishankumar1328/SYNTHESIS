import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    ShieldCheck,
    Activity,
    BrainCircuit,
    BookOpen,
    LifeBuoy,
    Box,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:sticky top-0 left-0 h-screen w-72 
                border-r border-white/5 glass-panel flex flex-col p-6 space-y-8
                transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                bg-[#0a0c10] md:bg-transparent
            `}>
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-4">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 animate-pulse-glow group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform-gpu group-hover:scale-110 transition-transform duration-300">
                                <Box className="text-white w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tighter block leading-none gradient-text">SYNTHESIS</span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Intelligence</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 px-1 overflow-y-auto custom-scrollbar">
                    <SidebarLink
                        icon={LayoutDashboard}
                        label="Dashboard"
                        to="/"
                        active={location.pathname === '/'}
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={Database}
                        label="Datasets"
                        to="/datasets"
                        active={location.pathname === '/datasets'}
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={ShieldCheck}
                        label="Privacy Audit"
                        to="/security"
                        active={location.pathname === '/security'}
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={Activity}
                        label="Anomaly Hub"
                        to="/anomalies"
                        active={location.pathname === '/anomalies'}
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={BrainCircuit}
                        label="AI Training"
                        to="/ai-training"
                        active={location.pathname === '/ai-training'}
                        onClick={onClose}
                    />
                </nav>

                <div className="p-5 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-3 tracking-widest">Enterprise Support</p>
                    <div className="text-sm space-y-3 relative z-10">
                        <a href="#" className="flex items-center text-muted-foreground hover:text-white transition-all font-medium group/link">
                            <BookOpen className="mr-3 w-4 h-4 group-hover/link:text-blue-400" /> Docs
                        </a>
                        <a href="#" className="flex items-center text-muted-foreground hover:text-white transition-all font-medium group/link">
                            <LifeBuoy className="mr-3 w-4 h-4 group-hover/link:text-blue-400" /> Live Help
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
};

function SidebarLink({ icon: Icon, label, to, active, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`
                flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group
                ${active
                    ? "bg-white/10 text-white shadow-lg shadow-black/20 border border-white/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                }
            `}
        >
            <Icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-blue-400' : ''}`}
            />
            <span className={`font-medium tracking-tight ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                {label}
            </span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] animate-pulse" />
            )}
        </Link>
    );
}

export default Sidebar;
