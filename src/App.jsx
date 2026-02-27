import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventPage from './components/EventPage';
import PaymentPage from './components/PaymentPage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import PlatformHome from './components/PlatformHome';
import TicketVerification from './components/TicketVerification';
import Receipt from './components/Receipt';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PlatformHome />} /> {/* Platform Landing Page (Clients) */}
        <Route path="/events/:id" element={<EventPage />} /> {/* Customer Event Page */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/ticket/:id" element={<TicketVerification />} />
        <Route path="/receipt/:id" element={<Receipt />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
