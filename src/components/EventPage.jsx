import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';
import Hero from './Hero';
import EventDetails from './EventDetails';
import TicketCards from './TicketCards';
import Footer from './Footer';

const EventPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            // No ID means we are on the homepage (landing). 
            // We can optionally fetch a "featured" event or just show defaults.
            setLoading(false);
            return;
        }

        const fetchEvent = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setEvent(data);
            setLoading(false);
        };

        fetchEvent();
    }, [id]);

    // Mock event data for immediate display (Fallback)
    const mockEvent = {
        title: "NEXUS NIGHT",
        date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        location: "Secret Warehouse, Accra",
        ticket_price: 89
    };

    const [manualDate, setManualDate] = useState(null);
    const eventData = event || mockEvent;
    const finalDate = manualDate || eventData.date;

    return (
        <>
            <Navbar />

            {/* Demo Date Picker */}
            <div className="fixed top-24 right-6 z-50 animate-fade-in">
                <div className="glass-card p-2 rounded-lg border border-accent/20 flex flex-col items-end">
                    <label className="text-[10px] uppercase tracking-widest text-accent mb-1 font-bold">Set Target Date</label>
                    <input
                        type="datetime-local"
                        className="bg-black/80 text-white text-xs p-2 rounded border border-white/10 outline-none focus:border-accent"
                        onChange={(e) => setManualDate(e.target.value)}
                    />
                </div>
            </div>

            <Hero title={eventData.title} eventDate={finalDate} />
            <EventDetails location={eventData.location} date={finalDate} />
            <TicketCards basePrice={eventData.ticket_price} />
            <Footer />
        </>
    );
};

export default EventPage;
