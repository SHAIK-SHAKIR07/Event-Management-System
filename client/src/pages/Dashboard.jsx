import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { PageWrapper, AnimatedEmoji, StatCard } from '../components/AnimatedElements';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/api/events/analytics').then(res => setData(res.data));
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AnimatedEmoji className="text-5xl block mb-4">📊</AnimatedEmoji>
        <p className="text-gray-500 text-lg">Loading analytics...</p>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AnimatedEmoji className="text-4xl block mb-2">📊</AnimatedEmoji>
              <h1 className="text-3xl font-extrabold">Organizer Dashboard</h1>
              <p className="text-indigo-200 mt-1">Track your events and revenue</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon="🎪" value={data.totalEvents} label="Total Events" color="from-blue-500 to-indigo-500" delay={0} />
            <StatCard icon="🎟️" value={data.totalTicketsSold} label="Tickets Sold" color="from-purple-500 to-pink-500" delay={0.1} />
            <StatCard icon="💰" value={`₹${data.totalRevenue.toLocaleString()}`} label="Total Revenue" color="from-green-500 to-teal-500" delay={0.2} />
            <StatCard icon="✅" value={data.checkedIn} label="Checked In" color="from-orange-500 to-yellow-500" delay={0.3} />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h2 className="font-bold text-lg mb-4 text-gray-800">
                <AnimatedEmoji>💰</AnimatedEmoji> Revenue by Event
              </h2>
              {data.byEvent.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <AnimatedEmoji className="text-4xl block mb-2">📭</AnimatedEmoji>
                  No data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.byEvent}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h2 className="font-bold text-lg mb-4 text-gray-800">
                <AnimatedEmoji>✅</AnimatedEmoji> Check-In Rate
              </h2>
              {data.totalTicketsSold === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <AnimatedEmoji className="text-4xl block mb-2">🎟️</AnimatedEmoji>
                  No tickets sold yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Checked In', value: data.checkedIn },
                        { name: 'Not Yet', value: data.totalTicketsSold - data.checkedIn }
                      ]}
                      dataKey="value" cx="50%" cy="50%" outerRadius={90}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* Tickets per Event */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow p-6"
          >
            <h2 className="font-bold text-lg mb-4 text-gray-800">
              <AnimatedEmoji>🎟️</AnimatedEmoji> Tickets Sold per Event
            </h2>
            {data.byEvent.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <AnimatedEmoji className="text-4xl block mb-2">🎪</AnimatedEmoji>
                No events yet
              </div>
            ) : (
              <div className="space-y-4">
                {data.byEvent.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-32 text-sm text-gray-600 truncate">{event.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.totalTicketsSold > 0 ? (event.sold / data.totalTicketsSold) * 100 : 0}%` }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                        className="bg-indigo-500 h-4 rounded-full"
                      />
                    </div>
                    <div className="text-sm font-bold text-gray-700 w-16 text-right">
                      {event.sold} sold
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}