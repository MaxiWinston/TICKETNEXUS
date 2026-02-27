import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, CheckCircle, Ticket as TicketIcon, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const Receipt = () => {
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
                setError(err.message || 'Ticket not found.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTicket();
        }
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        const receiptElement = document.getElementById('receipt-download-target');
        if (!receiptElement) return;

        try {
            // Provide visual feedback before processing
            const originalStyle = receiptElement.style.transform;
            receiptElement.style.transform = 'none'; // Temporarily disable transforms for clean render

            const canvas = await html2canvas(receiptElement, {
                backgroundColor: '#18181b', // Match dark backdrop 
                scale: 2, // High resolution
                useCORS: true
            });

            receiptElement.style.transform = originalStyle; // Restore

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `TicketNexus_Receipt_${ticket.id.split('-')[0].toUpperCase()}.png`;
            link.click();
        } catch (err) {
            console.error("Failed to download receipt:", err);
            alert("Failed to generate download. You can still use the Print functionality.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-accent mt-4 font-bold tracking-widest uppercase">Fetching Receipt...</p>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-center">
                <div className="bg-white/5 backdrop-blur-md border border-red-500/30 p-8 rounded-2xl max-w-md w-full">
                    <h2 className="text-2xl font-bold text-white mb-2">Receipt Unavailable</h2>
                    <p className="text-gray-400 mb-6">{error || 'Could not load receipt details.'}</p>
                    <Link to="/" className="inline-block py-3 px-6 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary text-white p-6 md:p-12 relative print:bg-white print:text-black">
            {/* Background effects (hidden on print) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none print:hidden" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none print:hidden" />

            {/* Print styles inserted directly to override dark classes */}
            <style>
                {`
                    @media print {
                        body { background: white !important; color: black !important; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        .no-print { display: none !important; }
                        .print-border { border-color: #e5e7eb !important; }
                        .print-bg-white { background-color: #ffffff !important; }
                        .print-text-black { color: #000000 !important; }
                        .print-text-gray { color: #6b7280 !important; }
                    }
                `}
            </style>

            <div className="max-w-3xl mx-auto relative z-10 w-full flex flex-col items-center">

                {/* Actions (hidden on print) */}
                <div className="w-full flex justify-between items-center mb-8 no-print">
                    <Link to={`/ticket/${id}`} className="flex items-center text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Ticket
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors uppercase tracking-wider text-sm border border-white/20"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center space-x-2 bg-accent text-black font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors uppercase tracking-wider text-sm"
                        >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">Print</span>
                        </button>
                    </div>
                </div>

                {/* Receipt Card */}
                <motion.div
                    id="receipt-download-target"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full bg-zinc-900 border border-white/10 shadow-2xl rounded-2xl p-8 md:p-12 print:shadow-none print:border-none print-bg-white print-text-black"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-white/10 print-border">
                        <div className="flex items-center space-x-3 mb-6 md:mb-0">
                            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                                <TicketIcon className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight">TicketNexus</h1>
                                <p className="text-sm text-gray-400 print-text-gray tracking-widest uppercase">Transaction Receipt</p>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-sm text-gray-400 print-text-gray uppercase tracking-wider mb-1">Receipt Number</p>
                            <p className="font-mono text-lg font-bold">{ticket.id.split('-')[0].toUpperCase()}</p>
                            <p className="text-sm text-gray-400 print-text-gray mt-2">
                                {new Date(ticket.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Customer & Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 pb-10 border-b border-white/10 print-border">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Billed To</p>
                            <h2 className="text-xl font-bold mb-1">{ticket.customer_name}</h2>
                            <p className="text-gray-400 print-text-gray mb-1">{ticket.customer_email}</p>
                            <p className="text-gray-400 print-text-gray">{ticket.customer_phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Event Details</p>
                            <h2 className="text-xl font-bold mb-1 uppercase">{ticket.event_title}</h2>
                            <p className="text-gray-400 print-text-gray mb-1">Ticket: {ticket.ticket_type} Pass</p>
                            <div className="flex items-center space-x-2 mt-4 inline-flex px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">{ticket.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Breakdown */}
                    <div className="mb-10">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 print-border text-xs text-gray-500 uppercase tracking-widest">
                                    <th className="pb-4 font-normal">Description</th>
                                    <th className="pb-4 font-normal text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/5 print-border">
                                    <td className="py-6">
                                        <p className="font-bold text-lg mb-1">{ticket.ticket_type} Admission</p>
                                        <p className="text-sm text-gray-400 print-text-gray font-mono">Ref: {ticket.payment_reference}</p>
                                    </td>
                                    <td className="py-6 text-right font-bold text-lg">
                                        GH₵{ticket.price}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end items-center">
                        <div className="text-right">
                            <p className="text-sm text-gray-400 print-text-gray uppercase tracking-widest mb-2">Total Paid</p>
                            <p className="text-4xl font-black text-accent print:text-black">GH₵{ticket.price}</p>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="mt-16 text-center text-sm text-gray-500 print-text-gray">
                        <p>If you have any questions concerning this receipt, please contact support at support@ticketnexus.com.</p>
                        <p className="mt-2 text-xs uppercase tracking-widest">Thank you for your purchase!</p>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default Receipt;
