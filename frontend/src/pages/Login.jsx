import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Cpu, Sparkles, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', { username: formData.username });
            const response = await axios.post('/api/auth/login', {
                username: formData.username,
                password: formData.password
            });

            console.log('Login response:', response.data);

            if (response.data && response.data.accessToken) {
                login(response.data.accessToken, formData.username);
                navigate('/');
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || 'AUTHENTICATION FAILED: Invalid credentials detected';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[120px] rounded-full animate-pulse delay-75"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[1000px] flex glass-panel border border-white/10 rounded-[4rem] overflow-hidden backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] z-10"
            >
                {/* Left Side: Branding */}
                <div className="w-1/2 bg-gradient-to-br from-orange-600/20 via-orange-900/10 to-transparent p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex border-r border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent)]"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-12 group cursor-pointer">
                            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-all duration-300">
                                <Cpu className="text-white w-7 h-7" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter italic uppercase text-white">
                                SYNTH<span className="text-orange-500">ESIS</span>
                            </span>
                        </div>

                        <h2 className="text-5xl font-black leading-tight mb-6 italic tracking-tighter">
                            Architect the <br />
                            <span className="text-gradient-orange">Future of Privacy.</span>
                        </h2>

                        <p className="text-white/40 text-lg font-medium leading-relaxed max-w-sm">
                            Access the world's leading synthetic data engine. Generate high-fidelity datasets with 100% privacy guarantees.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex -space-x-4 mb-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0c10] bg-white/10 backdrop-blur-md overflow-hidden flex items-center justify-center">
                                    <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="user" className="opacity-80" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#0a0c10] bg-orange-600/20 backdrop-blur-md flex items-center justify-center text-[10px] font-black text-orange-400">
                                +2k
                            </div>
                        </div>
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Join the enterprise network</p>
                    </div>

                    <div className="absolute bottom-10 right-10 opacity-20">
                        <Activity size={120} className="text-orange-500 animate-pulse" />
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex-1 p-12 md:p-16 flex flex-col justify-center bg-black/40 backdrop-blur-3xl relative">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 text-center md:text-left">
                            <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit mb-6">
                                <Sparkles className="w-4 h-4 text-orange-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Control Center</span>
                            </div>
                            <h3 className="text-5xl font-black italic tracking-tighter text-white mb-2">
                                Initialize <span className="text-gradient-orange">Session</span>
                            </h3>
                            <p className="text-white/30 text-sm font-medium uppercase tracking-tighter">Access Command Center</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm font-bold"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Username / ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-6 flex items-center text-white/20 group-focus-within:text-orange-500 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full glass-panel border border-white/10 rounded-2xl px-16 py-5 text-white outline-none focus:ring-2 ring-orange-500/50 transition-all font-bold placeholder-white/10"
                                        placeholder="admin"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Secure Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-6 flex items-center text-white/20 group-focus-within:text-orange-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="w-full glass-panel border border-white/10 rounded-2xl px-16 py-5 text-white outline-none focus:ring-2 ring-orange-500/50 transition-all font-bold placeholder-white/10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded-md border border-white/10 flex items-center justify-center transition-colors group-hover:bg-white/5">
                                        <div className="w-2 h-2 bg-orange-500 rounded-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    </div>
                                    <span className="text-white/40 group-hover:text-white transition-colors">Keep Session Active</span>
                                </label>
                                <a href="#" className="text-orange-500/60 hover:text-orange-400 transition-colors underline decoration-orange-500/20 underline-offset-4">Forgot ID?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white hover:bg-orange-50 text-black py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-white/5 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Sparkles className="animate-spin" size={20} />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Authorize Access <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-[11px] font-black uppercase tracking-widest text-white/20">
                                New operative? <Link to="/signup" className="text-orange-500 hover:text-orange-400 transition-colors ml-2 underline decoration-orange-500/20 underline-offset-4 italic">Request Credentials</Link>
                            </p>
                        </div>

                        {/* Demo Credentials */}
                        <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                            <p className="text-[10px] font-black text-orange-400 mb-2 uppercase tracking-widest">Demo Credentials:</p>
                            <p className="text-xs text-white/60 font-medium">Username: <span className="text-white font-mono font-bold">admin</span></p>
                            <p className="text-xs text-white/60 font-medium">Password: <span className="text-white font-mono font-bold">admin123</span></p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Decoration */}
            <div className="fixed bottom-12 left-12 flex flex-col gap-4 text-white/10 font-mono text-[10px] font-black uppercase tracking-[0.5em] italic">
                <span>// SECURITY_PROTOCOL: ACTIVATED</span>
                <span>// ENCRYPTION: AES-256-GCM</span>
                <span>// SESSION_MONITOR: ACTIVE</span>
            </div>
        </div>
    );
};

export default LoginPage;
