import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, AnimatedEmoji, StaggerContainer, StaggerItem } from '../components/AnimatedElements';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    date: '',
    sortBy: 'date-asc',
  });

  const categories = ['Music','Tech','Sports','Art','Food','Other'];
  const categoryEmojis = { Music:'🎵', Tech:'💻', Sports:'⚽', Art:'🎨', Food:'🍕', Other:'🎪' };

  const fetchEvents = async (resetPage = false) => {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);
      const { data } = await api.get('/api/events', {
        params: { ...filters, page: currentPage, limit: 9 }
      });
      setEvents(data.events);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(true); }, [filters]);
  useEffect(() => { fetchEvents(); }, [page]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '', category: '', city: '',
      minPrice: '', maxPrice: '', date: '', sortBy: 'date-asc'
    });
  };

  const activeFilterCount = Object.entries(filters)
    .filter(([k, v]) => v !== '' && k !== 'sortBy').length;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">

        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedEmoji className="text-6xl block mb-4">🎟️</AnimatedEmoji>
              <h1 className="text-5xl font-extrabold mb-3">
                Discover & Book <br />
                <span className="text-yellow-300">Amazing Events</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Find the best events happening around you
              </p>
            </motion.div>

            {/* Main Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 max-w-2xl mx-auto"
            >
              <input
                type="text"
                placeholder="🔍 Search events by name..."
                className="flex-1 p-4 rounded-xl text-gray-800 text-lg focus:outline-none shadow-lg"
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-4 rounded-xl font-bold shadow-lg flex items-center gap-2 transition
                  ${showFilters ? 'bg-white text-indigo-600' : 'bg-yellow-400 text-gray-900'}`}
              >
                🔧 Filters
                {activeFilterCount > 0 && (
                  <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-b shadow-md overflow-hidden"
            >
              <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                  {/* City */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                      📍 City
                    </label>
                    <input type="text" placeholder="e.g. Hyderabad"
                      className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      value={filters.city}
                      onChange={e => updateFilter('city', e.target.value)} />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                      📅 From Date
                    </label>
                    <input type="date"
                      className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      value={filters.date}
                      onChange={e => updateFilter('date', e.target.value)} />
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                      💰 Min Price (₹)
                    </label>
                    <input type="number" placeholder="0"
                      className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      value={filters.minPrice}
                      onChange={e => updateFilter('minPrice', e.target.value)} />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                      💰 Max Price (₹)
                    </label>
                    <input type="number" placeholder="10000"
                      className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      value={filters.maxPrice}
                      onChange={e => updateFilter('maxPrice', e.target.value)} />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                      🔃 Sort By
                    </label>
                    <select
                      className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      value={filters.sortBy}
                      onChange={e => updateFilter('sortBy', e.target.value)}
                    >
                      <option value="date-asc">Date (Earliest)</option>
                      <option value="date-desc">Date (Latest)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>

                  {/* Clear Button */}
                  <div className="flex items-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={clearFilters}
                      className="w-full bg-red-50 text-red-600 border border-red-200 p-2.5 rounded-lg font-semibold text-sm hover:bg-red-100 transition"
                    >
                      🗑️ Clear All Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilter('category', '')}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition
                ${filters.category === '' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-indigo-50'}`}
            >
              🌟 All
            </motion.button>
            {categories.map((c) => (
              <motion.button key={c}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateFilter('category', c)}
                className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition
                  ${filters.category === c ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-indigo-50'}`}
              >
                {categoryEmojis[c]} {c}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {filters.category
                ? `${categoryEmojis[filters.category]} ${filters.category} Events`
                : '🔥 All Events'}
              <span className="text-gray-400 font-normal text-base ml-2">
                ({total} found)
              </span>
            </h2>
            {activeFilterCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={clearFilters}
                className="text-sm text-red-500 hover:underline"
              >
                Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
              </motion.button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
              <AnimatedEmoji className="text-6xl block mb-4">🔍</AnimatedEmoji>
              <p className="text-gray-600 text-xl font-semibold">No events found</p>
              <p className="text-gray-400 mt-2">Try different filters or search terms</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={clearFilters}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <StaggerItem key={event._id}>
                    <Link to={`/events/${event._id}`}>
                      <motion.div
                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(99,102,241,0.2)' }}
                        className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer h-full"
                      >
                        <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden relative">
                          {event.banner
                            ? <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            : <AnimatedEmoji className="text-7xl">{categoryEmojis[event.category]}</AnimatedEmoji>
                          }
                          <div className="absolute top-3 right-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow">
                            {event.category}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">
                            {event.title}
                          </h3>
                          <div className="space-y-1 mb-3">
                            <p className="text-gray-500 text-sm">
                              <AnimatedEmoji>📅</AnimatedEmoji> {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-gray-500 text-sm">
                              <AnimatedEmoji>📍</AnimatedEmoji> {event.venue?.city || 'Online'}
                            </p>
                            <p className="text-gray-500 text-sm">
                              <AnimatedEmoji>👤</AnimatedEmoji> {event.organizer?.name}
                            </p>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t">
                            <p className="text-indigo-600 font-bold text-lg">
                              ₹{Math.min(...event.ticketTiers.map(t => t.price))}
                              <span className="text-gray-400 text-sm font-normal"> onwards</span>
                            </p>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
                            >
                              Book Now →
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center gap-2 mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border font-semibold disabled:opacity-40 hover:bg-indigo-50 transition"
                  >
                    ← Prev
                  </motion.button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <motion.button
                      key={p}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-semibold transition
                        ${page === p ? 'bg-indigo-600 text-white shadow-lg' : 'border hover:bg-indigo-50'}`}
                    >
                      {p}
                    </motion.button>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border font-semibold disabled:opacity-40 hover:bg-indigo-50 transition"
                  >
                    Next →
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}