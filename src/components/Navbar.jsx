import React, { useState, useEffect } from 'react';
import { Menu, X, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Lineup', href: '#lineup' },
        { name: 'Details', href: '#details' },
        { name: 'Tickets', href: '#tickets' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Ticket className="w-8 h-8 text-accent" />
                    <span className="text-2xl font-bold font-display tracking-wider text-white">
                        TICKET<span className="text-accent">MOST</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-accent transition-colors duration-200 text-sm tracking-widest uppercase font-semibold"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#tickets"
                        className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 rounded-none font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform duration-200 active:scale-95"
                    >
                        Get Access
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-300 hover:text-accent text-lg font-semibold"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="#tickets"
                                className="w-full text-center px-6 py-3 bg-accent text-black font-bold uppercase tracking-wider"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Access
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
