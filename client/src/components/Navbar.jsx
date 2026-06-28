import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const navItems = (user) => {
  const items = [
    { path: '/', label: 'Events', emoji: '🎪' },
  ];
  if (user) {
    items.push({ path: '/my-tickets', label: 'My Tickets', emoji: '🎟️' });
    if (user.role === 'organizer' || user.role === 'admin') {
      items.push({ path: '/create-event', label: 'Create', emoji: '➕' });
      items.push({ path: '/dashboard', label: 'Dashboard', emoji: '📊' });
      items.push({ path: '/checkin', label: 'Check-In', emoji: '📷' });
      items.push({ path: '/my-events', label: 'My Events', emoji: '🎪' });
    }
  }
  return items;
};

function DockNavItem({ item, mouseX, isActive }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const scaleSync = useTransform(distance, [-120, 0, 120], [1, 1.4, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center"
    >
      <Link to={item.path}>
        <motion.div
          animate={{ y: isHovered ? -6 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all
            ${isActive
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
              : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
        >
          <span className="text-lg">{item.emoji}</span>
          <span>{item.label}</span>
        </motion.div>
      </Link>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.8 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
          >
            {item.label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active dot */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1"
        />
      )}
    </motion.div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mouseX = useMotionValue(Infinity);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const items = navItems(user);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 py-1">
      <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">


        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="text-2xl font-extrabold text-indigo-600 flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              🎟️
            </motion.span>
            EventHub
          </Link>
        </motion.div>

        {/* Desktop Dock Nav */}
        <motion.div
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="hidden md:flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-2xl border border-gray-100 shadow-inner"
        >
          {items.map(item => (
            <DockNavItem
              key={item.path}
              item={item}
              mouseX={mouseX}
              isActive={location.pathname === item.path}
            />
          ))}
        </motion.div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl"
              >
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium text-sm">{user.name}</span>
              </motion.div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-100 transition"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login"
                  className="text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition block">
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition block">
                  Register
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-2xl text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t px-4 py-4 space-y-2 overflow-hidden"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition
                    ${location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-indigo-50'}`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}

            {user ? (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: items.length * 0.05 }}
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50"
              >
                <span>🚪</span>
                <span>Logout</span>
              </motion.button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center border border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl font-semibold">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold">
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}