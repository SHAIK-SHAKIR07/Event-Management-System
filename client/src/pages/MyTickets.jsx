import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PageWrapper, AnimatedEmoji, StaggerContainer, StaggerItem } from '../components/AnimatedElements';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/tickets/my-tickets')
      .then(res => setTickets(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl mb-4 inline-block"
        >
          🎟️
        </motion.div>
        <p className="text-gray-500">Loading your tickets...</p>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <AnimatedEmoji className="text-4xl block mb-2">🎟️</AnimatedEmoji>
            <h1 className="text-3xl font-extrabold">My Tickets</h1>
            <p className="text-indigo-200 mt-1">Your booked events and entry passes</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow"
            >
              <AnimatedEmoji className="text-6xl block mb-4">🎪</AnimatedEmoji>
              <p className="text-gray-600 text-xl font-semibold">No tickets yet!</p>
              <p className="text-gray-400 mt-2">Browse events and book your first ticket</p>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Browse Events
              </motion.a>
            </motion.div>
          ) : (
            <StaggerContainer className="grid gap-6">
              {tickets.map(ticket => (
                <StaggerItem key={ticket._id}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-white">
                      <h2 className="text-xl font-bold">{ticket.event?.title}</h2>
                      <p className="text-indigo-200 text-sm mt-1">
                        <AnimatedEmoji>📅</AnimatedEmoji> {new Date(ticket.event?.date).toLocaleDateString('en-IN', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="p-6 flex gap-6 items-center">
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-6 flex-wrap">
                          {[
                            { label: 'Ticket Type', value: ticket.tierName, emoji: '🎫' },
                            { label: 'Amount Paid', value: `₹${ticket.price}`, emoji: '💰' },
                            { label: 'Venue', value: ticket.event?.venue?.city || 'TBA', emoji: '📍' },
                          ].map(({ label, value, emoji }) => (
                            <div key={label}>
                              <p className="text-xs text-gray-400 uppercase font-semibold">{label}</p>
                              <p className="font-bold text-gray-800">
                                <AnimatedEmoji>{emoji}</AnimatedEmoji> {value}
                              </p>
                            </div>
                          ))}
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold cursor-default
                            ${ticket.status === 'checked-in' ? 'bg-green-100 text-green-700'
                            : ticket.status === 'cancelled' ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'}`}
                        >
                          {ticket.status === 'checked-in' ? '✅ Checked In'
                            : ticket.status === 'cancelled' ? '❌ Cancelled'
                            : '🎟️ Confirmed'}
                        </motion.span>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="flex flex-col items-center bg-gray-50 p-3 rounded-xl border"
                      >
                        <img src={ticket.qrCode} alt="QR Code" className="w-28 h-28" />
                        <p className="text-xs text-gray-400 mt-2 text-center">Show at entry</p>
                      </motion.div>
                    </div>

                    <div className="border-t px-6 py-3 bg-gray-50 flex justify-between items-center">
                      <p className="text-xs text-gray-400">
                        Ticket ID: {ticket._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Booked on {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}