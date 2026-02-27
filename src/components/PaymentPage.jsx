import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '../supabaseClient';


const PaymentPage = () => {
    const location = useLocation();
    const event_id = location.state?.event_id
    const navigate = useNavigate();
    const { ticketType, price } = location.state || { ticketType: 'General', price: '89' };

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [successData, setSuccessData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Calculate total amount (adding fee) - Paystack amount is in kobo
    const baseAmount = parseInt(price);
    const fee = 5;
    const totalAmount = baseAmount + fee;
    const amountInKobo = totalAmount * 100;

    const componentProps = {
        email,
        amount: amountInKobo,
        currency: 'GHS',
        metadata: {
            name,
            phone,
            custom_fields: [
                {
                    display_name: "Ticket Type",
                    variable_name: "ticket_type",
                    value: ticketType
                }
            ]
        },
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        text: "Pay Now",
        onSuccess: (reference) => handleSuccess(reference),
        onClose: () => alert("Transaction cancelled"),
    };

    const handleSuccess = async (reference) => {
        setLoading(true);
        try {
            // Save ticket to Supabase
            const { data: ticketData, error } = await supabase
                .from('tickets')
                .insert([
                    {
                        event_title: "TICKET MOST", // Dynamic if needed
                        ticket_type: ticketType,
                        price: totalAmount,
                        customer_name: name,
                        customer_email: email,
                        customer_phone: phone,
                        payment_reference: reference.reference,
                        status: 'paid'
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            // Now we have the ticket ID to generate the viewable ticket URL & QR Code
            const ticketId = ticketData.id;
            const ticketUrl = `${window.location.origin}/ticket/${ticketId}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketUrl)}`;

            // Send EmailJS Email
            try {
                // To enable this, add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your .env file
                const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
                const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
                const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
                
                if (publicKey) {
                    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            service_id: serviceId,
                            template_id: templateId,
                            user_id: publicKey,
                            template_params: {
                                to_email: email,
                                user_name: name,
                                ticket_type: ticketType,
                                ticket_link: ticketUrl,
                                qr_code_url: qrCodeUrl
                            }
                        })
                    });
                }
            } catch (emailError) {
                console.error("Failed to send email:", emailError);
            }

            setSuccessData({ ticketId, ticketUrl, qrCodeUrl });
        } catch (error) {
            console.error('Error saving ticket:', error);
            alert('Payment successful but failed to save ticket. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    const initializePayment = usePaystackPayment(componentProps);

    const handleSubmit = (e) => {
        e.preventDefault();
        initializePayment(handleSuccess, componentProps.onClose);
    };

    if (successData) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 max-w-md w-full p-8 text-center relative z-10 rounded-2xl border-accent/30"
                >
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Access Granted</h2>
                    <p className="text-gray-400 mb-6">Your {ticketType} ticket has been confirmed. An email with this QR code has been sent to {email}.</p>
                    
                    <div className="bg-white p-4 rounded-xl mx-auto w-48 h-48 mb-6 flex items-center justify-center">
                        <img 
                            src={successData.qrCodeUrl} 
                            alt="Ticket QR Code" 
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <button
                        onClick={() => navigate(`/ticket/${successData.ticketId}`)}
                        className="w-full py-3 bg-transparent border border-accent text-accent font-bold uppercase tracking-wider hover:bg-accent hover:text-black transition-colors rounded-lg mb-4"
                    >
                        View Digital Ticket
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-accent text-black font-bold uppercase tracking-wider hover:bg-white transition-colors rounded-lg"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <button
                    onClick={() => navigate(`/events/${event_id}`)}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Event
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
                        <p className="text-gray-400 mb-8">Complete your purchase to secure your spot.</p>

                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 p-8 rounded-2xl mb-8">
                            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6">Order Summary</h3>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                <div>
                                    <h4 className="text-xl font-bold">{ticketType} Access</h4>
                                    <p className="text-sm text-gray-400">Entry & Privileges included</p>
                                </div>
                                <div className="text-2xl font-bold">GH₵{price}</div>
                            </div>
                            <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
                                <span>Fees & Taxes</span>
                                <span>GH₵{fee}.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-accent pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span>GH₵{totalAmount}.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 p-8 rounded-2xl">
                        <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6">Customer Details</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-400">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="024 123 4567"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-accent text-black font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 rounded-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                ) : <CreditCard className="w-5 h-5 mr-2" />}
                                {loading ? 'Processing...' : `Pay GH₵${totalAmount}.00`}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
                            <Lock className="w-3 h-3" />
                            <span>Secured by Paystack</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
