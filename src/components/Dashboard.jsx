import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, LogOut, Ticket, Share2 } from 'lucide-react';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        location: '',
        price: '',
        description: ''
    });

    useEffect(() => {
        const session = localStorage.getItem('ticket_nexus_session');
        if (!session) {
            navigate('/login');
        } else {
            fetchEvents();
        }
    }, [navigate]);

    const fetchEvents = async () => {
        // Mock Data Fallback
        const mockEvents = [
            {
                id: 1,
                title: "NEXUS NIGHT",
                date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
                location: "Secret Warehouse, Accra",
                ticket_price: 89,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                title: "Neon Horizon Rave",
                date: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
                location: "Underground Bunker, Tema",
                ticket_price: 150,
                created_at: new Date().toISOString()
            }
        ];

        setEvents(mockEvents);
        setLoading(false);
    };

    const handleLogout = async () => {
        // await supabase.auth.signOut();
        localStorage.removeItem('ticket_nexus_session');
        navigate('/login');
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        // Mock Creation
        const createdEvent = {
            id: Date.now(),
            title: newEvent.title,
            date: new Date(newEvent.date).toISOString(),
            location: newEvent.location,
            ticket_price: parseFloat(newEvent.price),
            description: newEvent.description,
            created_at: new Date().toISOString()
        };

        setEvents([createdEvent, ...events]);
        setShowCreate(false);
        setNewEvent({ title: '', date: '', location: '', price: '', description: '' });
    };

    if (loading) return <div className="text-white p-8">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-primary text-white p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Sign Out
                    </button>
                </header>

                {showCreate ? (
                    <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Ticker Price (GH₵)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                        value={newEvent.price}
                                        onChange={e => setNewEvent({ ...newEvent, price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                    value={newEvent.location}
                                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="bg-accent text-black px-6 py-3 rounded-lg font-bold"
                                >
                                    Create Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreate(false)}
                                    className="border border-white/20 px-6 py-3 rounded-lg font-bold hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-semibold">Your Events</h2>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center bg-accent text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            New Event
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                            <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No events found. Create your first event!</p>
                        </div>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className="glass-card p-6 rounded-xl hover:border-accent/50 transition-colors group relative">
                                <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
                                            alert("Event link copied to clipboard!");
                                        }}
                                        className="text-gray-400 hover:text-white transition-colors"
                                        title="Copy Link"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <Link to={`/events/${event.id}`} className="text-blue-400 text-sm hover:underline">Preview</Link>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                <div className="text-gray-400 space-y-2 text-sm">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center text-accent">
                                        <Ticket className="w-4 h-4 mr-2" />
                                        GH₵{event.ticket_price}
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                                    <span className="text-green-400">Active</span>
                                    <span className="text-gray-500">{(Math.random() * 100).toFixed(0)} sold (Mock)</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
