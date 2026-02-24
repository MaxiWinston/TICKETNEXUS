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

    const [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('ticket_nexus_session');
        setIsOrganizer(!!session);
    }, []);

if (loading) {
    return <div className="text-white p-10">Loading...</div>;
}
    if (!event && !loading) {
  return <div className="text-white p-10">Event not found.</div>;
}
    const eventData = event;

    

    

    return (
        <>
            {/* <Navbar /> */}

            <Navbar />

            <Hero title={eventData.title} eventDate={eventData.date} />
            <EventDetails location={eventData.location} date={eventData.date} dressCode={eventData.dress_code} />
            <TicketCards basePrice={eventData.ticket_price} ticketTiers={eventData.ticket_tiers} event_id ={id}/>
            <Footer />
        </>
    );
};

export default EventPage;
