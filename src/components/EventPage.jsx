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
            // Priority 1: Supabase (Real Data)
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (data) {
                    setEvent(data);
                    setLoading(false);
                    return;
                }

                if (error) {
                    console.warn("Supabase fetch error (might be offline or invalid key):", error);
                }
            } catch (err) {
                console.error("Fetch exception:", err);
            }

            // Priority 2: Local Storage (Fallback for demo/offline)
            const storedEvents = JSON.parse(localStorage.getItem('ticket_nexus_events') || '[]');
            const localEvent = storedEvents.find(e => e.id.toString() === id);

            if (localEvent) {
                console.log("Found event in Local Storage:", localEvent);
                setEvent(localEvent);
            } else {
                console.log("Event not found anywhere for ID:", id);
            }

            setLoading(false);
        };

        fetchEvent();
    }, [id]);

    // Mock event data for immediate display (Fallback)
    // const mockEvent = {
    //     title: "TICKET MOST",
    //     date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    //     location: "Secret Warehouse, Accra",
    //     ticket_price: 89
    // };

    const [manualDate, setManualDate] = useState(null);
    const [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('ticket_nexus_session');
        setIsOrganizer(!!session);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-accent mt-4 font-bold tracking-widest uppercase">Loading Event...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
                <p className="text-gray-400">This event may have been removed or the link is invalid.</p>
            </div>
        );
    }

    const eventData = event;
    const finalDate = eventData.date;

    return (
        <>
            <Navbar />

            <Hero title={eventData.title} eventDate={finalDate} />
            <EventDetails location={eventData.location} date={finalDate} dressCode={eventData.dress_code} />
            <TicketCards basePrice={eventData.ticket_price} ticketTiers={eventData.ticket_tiers} event_id={id} />
            <Footer />
        </>
    );
};

export default EventPage;
