import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/api/events/${id}`).then(res => setEvent(res.data));
  }, [id]);

  const handleBook = async () => {
  if (!user) return setMessage('Please login to book');
  if (!selectedTier) return setMessage('Please select a ticket tier');
  setBooking(true);
  try {
    await api.post('/api/tickets/book', {
      eventId: id,
      tierName: selectedTier.name,
      paymentMethodId: 'pm_card_visa'  // Stripe test payment method
    });
    setMessage('✅ Ticket booked successfully! Check My Tickets.');
  } catch (err) {
    setMessage('❌ Booking failed: ' + err.response?.data?.message);
  }
  setBooking(false);
};

  if (!event) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-64 bg-indigo-200 flex items-center justify-center">
          {event.banner
            ? <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
            : <span className="text-8xl">🎟️</span>
          }
        </div>
        <div className="p-6">
          <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
            {event.category}
          </span>
          <h1 className="text-3xl font-bold mt-3">{event.title}</h1>
          <p className="text-gray-500 mt-1">By {event.organizer?.name}</p>
          <div className="flex gap-6 mt-4 text-gray-600">
            <span>📅 {new Date(event.date).toLocaleString()}</span>
            <span>📍 {event.venue?.name}, {event.venue?.city}</span>
          </div>
          <p className="mt-4 text-gray-700">{event.description}</p>

          {/* Ticket Tiers */}
          <h2 className="text-xl font-bold mt-6 mb-3">Select Tickets</h2>
          <div className="grid gap-3">
            {event.ticketTiers.map(tier => (
              <div key={tier.name}
                onClick={() => setSelectedTier(tier)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition
                  ${selectedTier?.name === tier.name
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{tier.name}</h3>
                    <p className="text-sm text-gray-500">
                      {tier.totalSeats - tier.bookedSeats} seats left
                    </p>
                  </div>
                  <span className="text-xl font-bold text-indigo-600">₹{tier.price}</span>
                </div>
              </div>
            ))}
          </div>

          {message && <p className="mt-4 text-center font-semibold">{message}</p>}

          <button onClick={handleBook} disabled={booking}
            className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-lg text-lg
              font-bold hover:bg-indigo-700 disabled:opacity-50">
            {booking ? 'Processing...' : `Book Now ${selectedTier ? `— ₹${selectedTier.price}` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}