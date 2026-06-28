import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, AnimatedEmoji, StaggerContainer, StaggerItem } from '../components/AnimatedElements';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/events/my-events');
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMyEvents(); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/events/${deleteId}`);
      setEvents(events.filter(e => e._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert('Error deleting event');
    }
    setDeleting(false);
  };

  const statusColors = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  const statusEmojis = {
    published: '✅',
    draft: '📝',
    cancelled: '❌',
    completed: '🏁',
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-10">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <AnimatedEmoji className="text-4xl block mb-2">🎪</AnimatedEmoji>
              <h1 className="text-3xl font-extrabold">My Events</h1>
              <p className="text-indigo-200 mt-1">Manage your created events</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/create-event"
                className="bg-white text-indigo-600 px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition">
                + Create New
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow"
            >
              <AnimatedEmoji className="text-6xl block mb-4">🎪</AnimatedEmoji>
              <p className="text-gray-600 text-xl font-semibold">No events yet!</p>
              <p className="text-gray-400 mt-2">Create your first event to get started</p>
              <motion.div whileHover={{ scale: 1.05 }} className="inline-block mt-6">
                <Link to="/create-event"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Create Event
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <StaggerContainer className="space-y-4">
              {events.map(event => (
                <StaggerItem key={event._id}>
                  <motion.div
                    whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(99,102,241,0.15)' }}
                    className="bg-white rounded-2xl shadow p-5 flex gap-5 items-center"
                  >
                    {/* Event Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      {event.banner
                        ? <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
                        : <span className="text-3xl">🎪</span>
                      }
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-800 truncate">{event.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[event.status]}`}>
                          {statusEmojis[event.status]} {event.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        📍 {event.venue?.city || 'No venue'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        🎟️ {event.ticketTiers.reduce((sum, t) => sum + t.bookedSeats, 0)} tickets sold
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/edit-event/${event._id}`)}
                        className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition"
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteId(event._id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-100 transition"
                      >
                        🗑️ Delete
                      </motion.button>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link to={`/events/${event._id}`}
                          className="block text-center bg-gray-50 text-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition">
                          👁️ View
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
              onClick={() => setDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
              >
                <AnimatedEmoji className="text-5xl block mb-4">⚠️</AnimatedEmoji>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Event?</h2>
                <p className="text-gray-500 mb-6">
                  This will permanently delete the event and cancel all tickets. This cannot be undone!
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteId(null)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}