import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, LogOut, Ticket, Share2, Trash2 } from 'lucide-react';

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
        description: '',
        ticket_tiers: [] // Array of { name, price, perks }
    });

    // Temporary state for adding a new tier
    const [currentTier, setCurrentTier] = useState({
        name: '',
        price: '',
        perks: ''
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Determine if we should redirect or just let them be (if there's a guest mode?)
                // For now, redirect to login if no valid supabase session
                navigate('/login');
            } else {
                setUser(session.user);
                fetchEvents(session.user.id);
            }

            // Set up listener for auth changes (e.g. sign out in another tab)
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (!session) {
                    navigate('/login');
                } else {
                    setUser(session.user);
                }
            });

            return () => subscription.unsubscribe();
        };

        checkUser();
    }, [navigate]);

    const fetchEvents = async (userId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('organizer_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            // Fallback to local storage only if DB fails completely (optional, maybe better to just show error)
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const addTier = () => {
        if (!currentTier.name || !currentTier.price) {
            alert("Please enter at least a name and price for the tier.");
            return;
        }

        const tierToAdd = {
            ...currentTier,
            price: parseFloat(currentTier.price),
            features: currentTier.perks.split(',').map(p => p.trim()).filter(p => p)
        };

        setNewEvent({
            ...newEvent,
            ticket_tiers: [...newEvent.ticket_tiers, tierToAdd]
        });
        setCurrentTier({ name: '', price: '', perks: '' });
    };

    const removeTier = (index) => {
        const updatedTiers = newEvent.ticket_tiers.filter((_, i) => i !== index);
        setNewEvent({ ...newEvent, ticket_tiers: updatedTiers });
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to create an event");
            return;
        }

        if (newEvent.ticket_tiers.length === 0) {
            alert("Please add at least a General Admission tier.");
            return;
        }

        try {
            const lowestPrice = Math.min(...newEvent.ticket_tiers.map(t => t.price));

            const { data, error } = await supabase
                .from('events')
                .insert([
                    {
                        title: newEvent.title,
                        date: new Date(newEvent.date).toISOString(),
                        location: newEvent.location,
                        description: newEvent.description || '',
                        organizer_id: user.id,
                        ticket_tiers: newEvent.ticket_tiers,
                        ticket_price: lowestPrice
                    }
                ])
                .select();

            if (error) throw error;

            console.log("Event created successfully:", data);

            // Refresh list
            fetchEvents(user.id);
            setShowCreate(false);
            setNewEvent({ title: '', date: '', location: '', description: '', ticket_tiers: [] });
            setCurrentTier({ name: '', price: '', perks: '' });
            alert("Event created successfully!");
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Error creating event: ' + error.message);
        }
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
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 p-8 rounded-2xl max-w-2xl mx-auto mb-12 animate-fade-in">
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
                                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                        value={newEvent.location}
                                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Ticket Tiers Section */}
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <h3 className="text-lg font-semibold mb-3">Ticket Tiers</h3>
                                <p className="text-gray-400 text-sm mb-4">Create different ticket types (e.g., Early Bird, VIP) with unique perks.</p>

                                <div className="space-y-3 mb-4">
                                    {newEvent.ticket_tiers.length === 0 && (
                                        <div className="text-center py-4 bg-white/5 rounded border border-dashed border-white/10">
                                            <span className="text-sm text-gray-500">No ticket tiers added yet. Add at least one below.</span>
                                        </div>
                                    )}
                                    {newEvent.ticket_tiers.map((tier, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                                            <div>
                                                <div className="font-bold text-accent flex items-center gap-2">
                                                    {tier.name}
                                                    <span className="text-white font-normal bg-white/10 px-2 py-0.5 rounded text-xs">GH₵{tier.price}</span>
                                                </div>
                                                {tier.features.length > 0 && (
                                                    <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-1">
                                                        {tier.features.map((f, i) => (
                                                            <span key={i} className="bg-white/5 px-1 rounded">{f}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeTier(idx)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded transition-colors"
                                                title="Remove Tier"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                    <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Add New Tier</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Name (e.g. VIP)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-accent outline-none transition-colors"
                                                value={currentTier.name}
                                                onChange={e => setCurrentTier({ ...currentTier, name: e.target.value })}
                                                placeholder="Tier Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Price (GH₵)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-accent outline-none transition-colors"
                                                value={currentTier.price}
                                                onChange={e => setCurrentTier({ ...currentTier, price: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs text-gray-400 mb-1">Perks (comma separated)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-accent outline-none transition-colors"
                                            value={currentTier.perks}
                                            onChange={e => setCurrentTier({ ...currentTier, perks: e.target.value })}
                                            placeholder="e.g. Skip the line, Free Drink, Meet & Greet"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addTier}
                                        className="w-full bg-white/10 hover:bg-accent hover:text-black text-white py-2 rounded font-bold text-sm flex justify-center items-center transition-all duration-300"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Ticket Tier
                                    </button>
                                </div>
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
                            <div key={event.id} className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 p-6 rounded-xl hover:border-accent/50 transition-colors group relative">
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
                                        {/* Display logic for price range or simple price */}
                                        {event.ticket_tiers && event.ticket_tiers.length > 0 ? (
                                            <>
                                                GH₵{Math.min(...event.ticket_tiers.map(t => t.price))}
                                                {event.ticket_tiers.length > 1 && ` - GH₵${Math.max(...event.ticket_tiers.map(t => t.price))}`}
                                            </>
                                        ) : (
                                            <>GH₵{event.ticket_price}</>
                                        )}
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
