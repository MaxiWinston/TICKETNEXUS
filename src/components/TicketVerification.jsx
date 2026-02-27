import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Calendar, MapPin, User, ArrowLeft, Ticket as TicketIcon, Receipt } from 'lucide-react';

const TicketVerification = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const { data, error } = await supabase
                    .from('tickets')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setTicket(data);
            } catch (err) {
                console.error("Error fetching ticket:", err);
                setError(err.message || 'Ticket not found or invalid.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTicket();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-accent mt-4 font-bold tracking-widest uppercase">Loading Ticket...</p>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-center">
                <div className="bg-white/5 backdrop-blur-md border border-red-500/30 p-8 rounded-2xl max-w-md w-full">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid Ticket</h2>
                    <p className="text-gray-400 mb-6">{error || 'This ticket could not be found.'}</p>
                    <Link to="/" className="inline-block py-3 px-6 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`;

    return (
        <div className="min-h-screen bg-primary text-white p-6 relative overflow-hidden flex items-center justify-center">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full relative z-10 my-10">
                <Link to="/" className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group w-fit">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Platform
                </Link>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header Strip */}
                    <div className="bg-gradient-to-r from-accent to-yellow-600 p-6 text-center relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                        <div className="relative z-10 flex flex-col items-center">
                            <TicketIcon className="w-10 h-10 text-black mb-2 opacity-90" />
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">{ticket.event_title}</h2>
                            <span className="bg-black text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-3">
                                {ticket.ticket_type} Pass
                            </span>
                        </div>
                    </div>

                    {/* Cutout details (like a real ticket notch) */}
                    <div className="relative bg-zinc-900">
                        <div className="absolute top-0 -left-4 w-8 h-8 bg-primary rounded-full -translate-y-1/2" />
                        <div className="absolute top-0 -right-4 w-8 h-8 bg-primary rounded-full -translate-y-1/2" />
                        <div className="absolute top-0 left-4 right-4 h-[1px] border-t-2 border-dashed border-white/10 -translate-y-1/2" />
                    </div>

                    <div className="p-8">
                        {/* Status */}
                        <div className="flex justify-center mb-8">
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-sm ${ticket.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {ticket.status === 'paid' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                <span>{ticket.status === 'paid' ? 'VALID TICKET' : 'PAYMENT PENDING'}</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-4 rounded-xl mx-auto w-48 h-48 mb-8 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            <img
                                src={qrCodeUrl}
                                alt="Ticket QR Code"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Ticket Details */}
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center space-x-3 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                                <User className="w-5 h-5 text-accent opacity-70" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Attendee Name</p>
                                    <p className="font-semibold text-white">{ticket.customer_name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                                    <p className="font-semibold text-white">GH₵{ticket.price}</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ref No</p>
                                    <p className="font-mono text-xs mt-1 text-gray-400">{ticket.payment_reference?.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-black/30 p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Powered by TicketNexus</p>
                    </div>
                </motion.div>

                {/* Secondary Actions */}
                <div className="mt-6 flex justify-center relative z-10">
                    <Link to={`/receipt/${id}`} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-white/10 shadow-lg">
                        <Receipt className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">View Receipt</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TicketVerification;
