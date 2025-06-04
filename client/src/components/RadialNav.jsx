import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "Problems", path: "/problems", icon: "💻" },
  { label: "Playground", path: "/playground", icon: "🛝" },
  { label: "Leaderboard", path: "/leaderboard", icon: "🏆" },
  { label: "Profile", path: "/profile", icon: "👤" },
];

const radius = 160;
const itemSize = 48;

export default function RadialNav() {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    setActivePath(path);
    setTimeout(() => {
      setOpen(false);
      navigate(path);
    }, 800); // Match this with animation duration
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring" }}
        >
          {open ? "✕" : "☰"}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            {navItems.map((item, i) => {
              const total = navItems.length - 1;
              const angleDeg = -90 + (180 / total) * i;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.div
                  key={item.path}
                  className={`absolute flex items-center justify-center rounded-full ${
                    activePath === item.path
                      ? "bg-blue-100 ring-2 ring-blue-500"
                      : "bg-white hover:bg-blue-50"
                  } shadow-md cursor-pointer`}
                  style={{
                    width: itemSize,
                    height: itemSize,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
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
                    scale: 0,
                    transition: {
                      delay: (total - i) * 0.03,
                      type: "tween",
                      ease: "easeIn",
                    },
                  }}
                  onClick={() => handleItemClick(item.path)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg">{item.icon}</span>
                    <motion.span
                      className="text-xs font-medium text-blue-800 whitespace-nowrap"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 + 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
