import React from 'react';
import { Calendar, Clock, MapPin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetails = ({ location, date }) => {
    const details = [
        {
            icon: <Calendar className="w-6 h-6 text-accent" />,
            label: "Date",
            value: date ? new Date(date).toLocaleDateString() : "December 31, 2025"
        },
        {
            icon: <Clock className="w-6 h-6 text-accent" />,
            label: "Time",
            value: date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "10:00 PM - Late"
        },
        {
            icon: <MapPin className="w-6 h-6 text-accent" />,
            label: "Location",
            value: location || "Secret Warehouse, Accra"
        },
        {
            icon: <Instagram className="w-6 h-6 text-accent" />,
            label: "Dress Code",
            value: "Cyberpunk / Black Tie"
        }
    ];

    return (
        <section className="py-20 bg-black text-white relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {details.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 p-6 rounded-xl border border-white/10 hover:border-accent/40 transition-colors group"
                        >
                            <div className="mb-4 bg-white/5 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">{item.label}</h3>
                            <p className="text-xl font-bold">{item.value}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
