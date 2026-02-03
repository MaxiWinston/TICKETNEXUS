import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = ({ title, eventDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const targetDate = eventDate ? new Date(eventDate) : new Date();
        if (!eventDate) targetDate.setDate(targetDate.getDate() + 14); // Default 2 weeks

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [eventDate]);

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center mx-4">
            <span className="text-4xl md:text-6xl font-bold font-mono text-white mb-2">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="text-xs md:text-sm uppercase tracking-widest text-gray-400">{label}</span>
        </div>
    );

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-primary">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-accent text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-bold">
                        The Exclusive Experience
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter shadow-xl">
                        {title || "TICKET MOST"}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex justify-center flex-wrap mb-12"
                >
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <TimeUnit value={timeLeft.seconds} label="Secs" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <motion.a
                        href="#tickets"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-bold text-lg uppercase tracking-wider hover:bg-white transition-colors duration-300"
                    >
                        Get Tickets
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
