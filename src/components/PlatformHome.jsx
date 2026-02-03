import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const PlatformHome = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-black font-sans">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-tighter">
                        TICKET<span className="text-accent">MOST</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                            LOG IN
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                            START SELLING
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                            The Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Event Ticketing</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Empower your concerts, parties, and raves with a premium ticketing platform.
                            Stunning event pages, secure payments, and instant payouts.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="w-full md:w-auto px-8 py-4 bg-accent text-black font-bold rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 group"
                            >
                                <Zap className="w-5 h-5 fill-black" />
                                Create Your Event
                            </Link>
                            <Link
                                to="/events/demo"
                                className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                View Demo Page <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white/5 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-black/50 border border-white/10 hover:border-accent/40 transition-colors">
                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Setup</h3>
                            <p className="text-gray-400">Create a stunning, "Cyber-Elegance" event page in seconds. No coding required.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-black/50 border border-white/10 hover:border-accent/40 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                            <p className="text-gray-400">Accept Mobile Money and Cards securely via Paystack. Automated receipts.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-black/50 border border-white/10 hover:border-accent/40 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Global Reach</h3>
                            <p className="text-gray-400">Share your unique event link anywhere. Optimize for high conversion.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PlatformHome;
