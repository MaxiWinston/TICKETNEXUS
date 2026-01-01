import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Dummy Authentication Logic
        setTimeout(() => {
            if (email && password) {
                // Set a mock session in localStorage if needed, or just navigate
                localStorage.setItem('ticket_nexus_session', 'true');
                navigate('/dashboard');
            } else {
                setError("Please enter a valid email and password");
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card max-w-md w-full p-8 relative z-10 rounded-2xl border-accent/20"
            >
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
                <p className="text-gray-400 mb-8 text-center">Login to manage your events</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-accent text-black font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? 'Loading...' : 'Sign In'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            localStorage.setItem('ticket_nexus_session', 'true');
                            navigate('/dashboard');
                        }}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-all duration-300 rounded-lg mt-4"
                    >
                        Login as Guest
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400 text-sm">
                    Don't have an account? <Link to="/signup" className="text-accent hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
