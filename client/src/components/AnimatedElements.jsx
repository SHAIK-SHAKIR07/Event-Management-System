import { motion } from 'framer-motion';

// Animated emoji/icon that bounces on hover
export function AnimatedEmoji({ children, className = '', delay = 0 }) {
  return (
    <motion.span
      className={className}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
      whileHover={{
        scale: 1.3,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.4 }
      }}
      whileTap={{ scale: 0.9 }}
      style={{ display: 'inline-block', cursor: 'default' }}
    >
      {children}
    </motion.span>
  );
}

// Animated card that lifts on hover
export function AnimatedCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
    >
      {children}
    </motion.div>
  );
}

// Animated button
export function AnimatedButton({ children, className = '', onClick, type = 'button', disabled }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

// Page entrance animation wrapper
export function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Fade in from left
export function SlideIn({ children, delay = 0, direction = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animations
export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
      }}
    >
      {children}
    </motion.div>
  );
}

// Stat card with count animation
export function StatCard({ icon, value, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5 shadow-lg cursor-default`}
    >
      <AnimatedEmoji className="text-4xl block mb-2">{icon}</AnimatedEmoji>
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="text-sm opacity-80 mt-1">{label}</div>
    </motion.div>
  );
}