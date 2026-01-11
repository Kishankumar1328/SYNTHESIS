import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex text-foreground bg-[#0a0c10] font-sans selection:bg-primary/30 relative">

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center p-4 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-lg gradient-text">SYNTHESIS</span>
                </header>

                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
