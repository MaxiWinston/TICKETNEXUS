import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TicketCard = ({ title, price, features, delay, popular }) => {
    const navigate = useNavigate();

    const handleSelect = () => {
        navigate('/payment', { state: { ticketType: title, price: price } });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 border border-white/20 flex flex-col h-full group
        ${popular ? 'border-accent/50 shadow-[0_0_30px_rgba(204,255,0,0.1)]' : 'hover:border-white/40'}
        hover:shadow-[0_0_20px_rgba(46,91,255,0.3)]
      `}
        >
            {/* {popular && (
                <div className="absolute top-0 right-0 -mt-3 -mr-3 px-4 py-1 bg-accent text-black text-xs font-bold uppercase tracking-wider rounded-full">
                    Best Value
                </div>
            )} */}

            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2">{title}</h3>
            <div className="flex items-baseline mb-8">
                <span className="text-4xl md:text-5xl font-bold text-white mr-2">GH₵{price}</span>
                <span className="text-gray-400">/person </span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
                        <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                onClick={handleSelect}
                className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 
        ${popular
                        ? 'bg-accent text-black hover:bg-white hover:text-black'
                        : 'bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black'}
      `}>
                Select Ticket
            </button>
        </motion.div>
    );
};

const TicketCards = ({ basePrice, ticketTiers }) => {
    // Default tiers if no custom tiers are provided
    // Default tickets removed to prevent mock data display
    const defaultTickets = [];

    // Use custom tiers if available, otherwise use default
    // We map custom tiers to the format expected by TicketCard
    const displayTickets = (ticketTiers && ticketTiers.length > 0)
        ? ticketTiers.map((tier, idx) => ({
            title: tier.title || tier.name, // Handle potential naming differences
            price: tier.price,
            features: tier.features || [],
            delay: 0.1 * (idx + 1),
            popular: idx === 1
        }))
        : [];

    return (
        <section id="tickets" className="py-24 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Secure Your Access</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Choose your tier. Limited availability for all ticket types.</p>
                </motion.div>

                <div className={`grid grid-cols-1 md:grid-cols-${Math.min(displayTickets.length || 1, 3)} gap-8 justify-center`}>
                    {displayTickets.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 col-span-full border border-dashed border-white/10 rounded-xl">
                            <p>No ticket tiers available for this event.</p>
                        </div>
                    ) : (
                        displayTickets.map((ticket, idx) => (
                            <TicketCard key={idx} {...ticket} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default TicketCards;
