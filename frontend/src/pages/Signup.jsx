import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Cpu, Activity, AlertCircle, CheckCircle, Sparkles, Terminal, KeyRound } from 'lucide-react';
import axios from 'axios';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('MISMATCH: Password validation failed');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('SECURITY: Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                password: formData.password
            });

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || 'SIGNAL LOST: Registration failed. Try another ID.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[120px] rounded-full animate-pulse delay-75"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[1100px] flex glass-panel border border-white/10 rounded-[4rem] overflow-hidden backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] z-10"
            >
                {/* Left Side: Signup Form */}
                <div className="flex-1 p-12 md:p-16 flex flex-col justify-center bg-black/40 backdrop-blur-3xl relative">
                    <div className="max-w-md mx-auto w-full">
                        {/* Header */}
                        <div className="mb-10 text-center md:text-left">
                            <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit mb-6">
                                <KeyRound className="w-4 h-4 text-orange-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Identity Deployment</span>
                            </div>
                            <h3 className="text-5xl font-black italic tracking-tighter text-white mb-2">
                                Create <span className="text-gradient-orange">Operative ID</span>
                            </h3>
                            <p className="text-white/30 text-sm font-medium">Initialize neural access credentials</p>
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

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 p-6 bg-orange-500/20 border border-orange-500/30 rounded-3xl flex flex-col items-center gap-4 text-orange-400 text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center animate-bounce">
                                    <CheckCircle size={32} />
                                </div>
                                <div>
                                    <p className="font-black uppercase tracking-widest italic">Identity Validated</p>
                                    <p className="text-xs opacity-60 mt-1 uppercase font-bold tracking-widest">Routing to command center...</p>
                                </div>
                            </motion.div>
                        )}

                        {!success && (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full glass-panel border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-orange-500/50 transition-all font-bold placeholder-white/10"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            autoComplete="name"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Operative ID</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full glass-panel border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-orange-500/50 transition-all font-bold placeholder-white/10"
                                            placeholder="johndoe_01"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Communication Signal</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-6 flex items-center text-white/20 group-focus-within:text-orange-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full glass-panel border border-white/10 rounded-2xl pl-16 pr-8 py-4 text-white outline-none focus:ring-2 ring-orange-500/50 transition-all font-bold placeholder-white/10"
                                            placeholder="operative@synthesis.ai"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Key Phrase</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-6 flex items-center text-white/20 group-focus-within:text-orange-500 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full glass-panel border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white outline-none focus:ring-2 ring-orange-500/50 transition-all font-bold placeholder-white/10"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Validate Key</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-6 flex items-center text-white/20 group-focus-within:text-orange-500 transition-colors">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full glass-panel border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white outline-none focus:ring-2 ring-orange-500/50 transition-all font-bold placeholder-white/10"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="py-4">
                                    <label className="flex items-start gap-4 cursor-pointer group">
                                        <div className="mt-1 w-5 h-5 rounded-md border border-white/10 flex items-center justify-center transition-colors group-hover:bg-white/5 shrink-0">
                                            <div className="w-2 h-2 bg-orange-500 rounded-sm opacity-100 shadow-[0_0_8px_#f97316]"></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-relaxed">
                                            I agree to the <span className="text-orange-500">Neural Protocol</span> and data non-disclosure agreements.
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white hover:bg-orange-50 text-black py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-white/5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <Activity className="animate-spin" size={20} />
                                            Deploying...
                                        </>
                                    ) : (
                                        <>
                                            Deploy Identity <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="mt-12 text-center md:text-left">
                            <p className="text-[11px] font-black uppercase tracking-widest text-white/20">
                                Already enlisted? <Link to="/login" className="text-orange-500 hover:text-orange-400 transition-colors ml-2 underline decoration-orange-500/20 underline-offset-4 italic">Initialize Session</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visual/Status */}
                <div className="w-[45%] bg-gradient-to-bl from-orange-600/20 via-orange-900/10 to-transparent p-12 flex flex-col justify-between relative overflow-hidden hidden lg:flex border-l border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent)]"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-16">
                            <div className="w-10 h-10 bg-orange-600/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                                <Terminal className="text-orange-400 w-6 h-6 animate-pulse" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.5em] text-orange-400/80 uppercase italic">Nodes Active: 2,401</span>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: 'Differential Privacy', status: 'Optimal', val: 99 },
                                { title: 'Signal Integrity', status: 'Stable', val: 100 },
                                { title: 'Neural Capacity', status: 'Nominal', val: 84 }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">{stat.title}</h4>
                                        <span className="text-[10px] font-black text-orange-400/60 uppercase tracking-widest">{stat.status}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.val}%` }}
                                            transition={{ delay: 0.8 + (i * 0.2), duration: 1.5 }}
                                            className="h-full bg-gradient-to-r from-orange-600 to-amber-400 shadow-[0_0_10px_#f97316]"
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 glass-panel p-6 rounded-3xl border border-white/5 mt-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                            </div>
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Network Status: Verified</span>
                        </div>
                        <p className="text-[10px] text-white/20 font-medium leading-relaxed italic">
                            "By entering the network, you acknowledge the responsibility of handling high-fidelity synthetic signals in accordance with global privacy directives."
                        </p>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute bottom-10 right-10 opacity-10">
                        <Sparkles size={120} className="text-orange-500 animate-pulse" />
                    </div>
                </div>
            </motion.div>

            {/* Floating Decoration */}
            <div className="fixed top-12 right-12 flex flex-col items-end gap-2 text-white/5 font-mono text-[8px] font-black uppercase tracking-[0.8em]">
                <span>ARCHITECTURE_V.4.2</span>
                <span>SYSTEM_OVERRIDE_ENABLED</span>
            </div>
        </div>
    );
};

export default SignupPage;
