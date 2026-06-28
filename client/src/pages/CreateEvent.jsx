import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper, AnimatedEmoji, AnimatedButton } from '../components/AnimatedElements';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Tech',
    date: '', venue: { name: '', address: '', city: '' },
    ticketTiers: [{ name: 'General', price: 0, totalSeats: 100 }],
    status: 'published', banner: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

      // Upload image if selected
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

      await axios.post('/api/events', { ...form, banner: bannerUrl });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
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

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <AnimatedEmoji className="text-4xl block mb-2">🎪</AnimatedEmoji>
            <h1 className="text-3xl font-extrabold">Create New Event</h1>
            <p className="text-indigo-200 mt-1">Fill in the details to publish your event</p>
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
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                  ${imagePreview ? 'border-indigo-400' : 'border-gray-300 hover:border-indigo-400'}`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview"
                    className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div>
                    <AnimatedEmoji className="text-4xl block mb-2">📸</AnimatedEmoji>
                    <p className="text-gray-500">Click to upload event banner</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              <input id="bannerInput" type="file" accept="image/*"
                className="hidden" onChange={handleImageChange} />
              {imagePreview && (
                <button type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="mt-2 text-red-500 text-sm hover:underline">
                  Remove image
                </button>
              )}
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
              <textarea placeholder="Event Description" rows={4}
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
                </select>
              </div>
              <input type="datetime-local" required
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.date}
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
                value={form.venue.name}
                onChange={e => setForm({ ...form, venue: { ...form.venue, name: e.target.value } })} />
              <input type="text" placeholder="Address"
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.venue.address}
                onChange={e => setForm({ ...form, venue: { ...form.venue, address: e.target.value } })} />
              <input type="text" placeholder="City"
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.venue.city}
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="grid grid-cols-3 gap-3 p-4 bg-indigo-50 rounded-xl relative"
                >
                  <input type="text" placeholder="Tier Name (e.g VIP)"
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={tier.name}
                    onChange={e => updateTier(i, 'name', e.target.value)} />
                  <input type="number" placeholder="Price (₹)"
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={tier.price}
                    onChange={e => updateTier(i, 'price', Number(e.target.value))} />
                  <input type="number" placeholder="Total Seats"
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={tier.totalSeats}
                    onChange={e => updateTier(i, 'totalSeats', Number(e.target.value))} />
                  {form.ticketTiers.length > 1 && (
                    <button type="button" onClick={() => removeTier(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center hover:bg-red-600">
                      ✕
                    </button>
                  )}
                </motion.div>
              ))}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setForm({ ...form, ticketTiers: [...form.ticketTiers, { name: '', price: 0, totalSeats: 50 }] })}
                className="w-full border-2 border-dashed border-indigo-300 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
              >
                + Add Ticket Tier
              </motion.button>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center bg-red-50 py-3 px-4 rounded-xl"
              >
                ❌ {error}
              </motion.p>
            )}

            <AnimatedButton
              type="submit"
              disabled={submitting || uploading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition shadow-lg"
            >
              {uploading ? '📸 Uploading image...'
                : submitting ? '⏳ Creating event...'
                : '🎪 Create Event'}
            </AnimatedButton>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}