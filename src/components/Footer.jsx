import React from 'react';
import { Ticket, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-6 md:mb-0">
                        <Ticket className="w-6 h-6 text-accent" />
                        <span className="text-xl font-bold font-display tracking-wider text-white">
                            NEXUS<span className="text-accent">.</span>EVENT
                        </span>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
                    </div>
                </div>

                <div className="mt-8 text-center md:text-left text-gray-600 text-sm">
                    &copy; 2025 Nexus Events. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
