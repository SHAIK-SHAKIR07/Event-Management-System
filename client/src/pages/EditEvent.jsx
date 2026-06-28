import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper, AnimatedEmoji, AnimatedButton } from '../components/AnimatedElements';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/events/${id}`).then(res => {
      setForm(res.data);
      setImagePreview(res.data.banner);
    });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let bannerUrl = form.banner;
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('banner', imageFile);
        const { data } = await axios.post('/api/events/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        bannerUrl = data.url;
        setUploading(false);
      }
      await axios.put(`/api/events/${id}`, { ...form, banner: bannerUrl });
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating event');
    }
    setSubmitting(false);
  };

  const updateTier = (i, field, value) => {
    const tiers = [...form.ticketTiers];
    tiers[i] = { ...tiers[i], [field]: value };
    setForm({ ...form, ticketTiers: tiers });
  };

  const removeTier = (i) => {
    setForm({ ...form, ticketTiers: form.ticketTiers.filter((_, idx) => idx !== i) });
  };

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatedEmoji className="text-5xl">⏳</AnimatedEmoji>
    </div>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <AnimatedEmoji className="text-4xl block mb-2">✏️</AnimatedEmoji>
            <h1 className="text-3xl font-extrabold">Edit Event</h1>
            <p className="text-yellow-100 mt-1">Update your event details</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h2 className="font-bold text-lg mb-4">
                <AnimatedEmoji>🖼️</AnimatedEmoji> Event Banner
              </h2>
              <div
                onClick={() => document.getElementById('bannerInput').click()}
                className="border-2 border-dashed border-indigo-300 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 transition"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview"
                    className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div>
                    <AnimatedEmoji className="text-4xl block mb-2">📸</AnimatedEmoji>
                    <p className="text-gray-500">Click to change banner</p>
                  </div>
                )}
              </div>
              <input id="bannerInput" type="file" accept="image/*"
                className="hidden" onChange={handleImageChange} />
            </motion.div>

            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">
                <AnimatedEmoji>📝</AnimatedEmoji> Basic Information
              </h2>
              <input type="text" placeholder="Event Title" required
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea placeholder="Description" rows={4}
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Music','Tech','Sports','Art','Food','Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <input type="datetime-local" required
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.date ? new Date(form.date).toISOString().slice(0, 16) : ''}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </motion.div>

            {/* Venue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">
                <AnimatedEmoji>📍</AnimatedEmoji> Venue Details
              </h2>
              <input type="text" placeholder="Venue Name"
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.venue?.name || ''}
                onChange={e => setForm({ ...form, venue: { ...form.venue, name: e.target.value } })} />
              <input type="text" placeholder="Address"
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.venue?.address || ''}
                onChange={e => setForm({ ...form, venue: { ...form.venue, address: e.target.value } })} />
              <input type="text" placeholder="City"
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.venue?.city || ''}
                onChange={e => setForm({ ...form, venue: { ...form.venue, city: e.target.value } })} />
            </motion.div>

            {/* Ticket Tiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">
                <AnimatedEmoji>🎟️</AnimatedEmoji> Ticket Tiers
              </h2>
              {form.ticketTiers.map((tier, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-3 gap-3 p-4 bg-orange-50 rounded-xl relative"
                >
                  <input type="text" placeholder="Tier Name"
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={tier.name}
                    onChange={e => updateTier(i, 'name', e.target.value)} />
                  <input type="number" placeholder="Price (₹)"
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={tier.price}
                    onChange={e => updateTier(i, 'price', Number(e.target.value))} />
                  <input type="number" placeholder="Total Seats"
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={tier.totalSeats}
                    onChange={e => updateTier(i, 'totalSeats', Number(e.target.value))} />
                  {form.ticketTiers.length > 1 && (
                    <button type="button" onClick={() => removeTier(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                      ✕
                    </button>
                  )}
                </motion.div>
              ))}
              <motion.button type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setForm({ ...form, ticketTiers: [...form.ticketTiers, { name: '', price: 0, totalSeats: 50 }] })}
                className="w-full border-2 border-dashed border-orange-300 text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition"
              >
                + Add Ticket Tier
              </motion.button>
            </motion.div>

            {error && (
              <p className="text-red-500 text-center bg-red-50 py-3 rounded-xl">❌ {error}</p>
            )}

            <div className="flex gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/my-events')}
                className="flex-1 border-2 border-gray-300 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </motion.button>
              <AnimatedButton
                type="submit"
                disabled={submitting || uploading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 shadow-lg"
              >
                {uploading ? '📸 Uploading...'
                  : submitting ? '⏳ Saving...'
                  : '✅ Save Changes'}
              </AnimatedButton>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}