import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "Problems", path: "/problems", icon: "💻" },
  { label: "Playground", path: "/playground", icon: "🛝" },
  { label: "Leaderboard", path: "/leaderboard", icon: "🏆" },
  { label: "Profile", path: "/profile", icon: "👤" },
];

const radius = 160; // Distance from center button
const itemSize = 56; // Increased size for better touch targets

export default function RadialNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.radial-menu-container')) {
      setOpen(false);
    }
  };

  // Add/remove event listener for outside clicks
  React.useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleItemClick = (path) => {
    setOpen(false);
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className="radial-menu-container fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      {/* Central toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          open 
            ? 'bg-gradient-to-br from-blue-700 to-blue-900 text-white' 
            : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {open ? "✕" : "☰"}
        </motion.span>
      </motion.button>

      {/* Radial menu items */}
      <AnimatePresence>
        {open && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
            {navItems.map((item, i) => {
              const totalItems = navItems.length;
              const angleDeg = -90 + (180 / (totalItems - 1)) * i;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.div
                  key={item.path}
                  className={`absolute flex flex-col items-center justify-center rounded-full ${
                    location.pathname === item.path
                      ? 'bg-blue-100 ring-2 ring-blue-500'
                      : 'bg-white hover:bg-blue-50'
                  } shadow-md cursor-pointer pointer-events-auto`}
                  style={{
                    width: itemSize,
                    height: itemSize,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{
                    x,
                    y: -y,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    },
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.5,
                    transition: {
                      delay: (totalItems - 1 - i) * 0.03,
                    },
                  }}
                  onClick={() => handleItemClick(item.path)}
                  whileHover={{ scale: 1.1, transition: { type: "spring" } }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={item.label}
                >
                  <span className="text-xl">{item.icon}</span>
                  <motion.span
                    className="text-xs font-medium text-blue-800 whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: i * 0.05 + 0.2 }
                    }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
