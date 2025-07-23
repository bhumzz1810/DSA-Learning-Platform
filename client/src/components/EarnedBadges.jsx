import { motion } from "framer-motion";

const EarnedBadges = ({ badges, theme, badgeIcons }) => {
  const themeConfig = {
    light: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-gray-800",
      title: "text-indigo-700",
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-800",
    },
    dark: {
      bg: "bg-gray-800",
      border: "border-gray-700",
      text: "text-white",
      title: "text-indigo-300",
      badgeBg: "bg-indigo-900/50",
      badgeText: "text-indigo-100",
    },
    ocean: {
      bg: "bg-blue-800",
      border: "border-blue-700",
      text: "text-white",
      title: "text-cyan-300",
      badgeBg: "bg-cyan-900/50",
      badgeText: "text-cyan-100",
    },
    forest: {
      bg: "bg-green-800",
      border: "border-green-700",
      text: "text-white",
      title: "text-emerald-300",
      badgeBg: "bg-emerald-900/50",
      badgeText: "text-emerald-100",
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!badges || badges.length === 0) {
    return (
      <div className={`rounded-xl p-6 border ${currentTheme.border} ${currentTheme.bg}`}>
        <h2 className={`text-xl font-semibold mb-4 ${currentTheme.title}`}>
          Earned Badges
        </h2>
        <p className={`text-sm ${currentTheme.text}`}>No badges earned yet</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border ${currentTheme.border} ${currentTheme.bg}`}>
      <h2 className={`text-xl font-semibold mb-4 ${currentTheme.title}`}>
        Earned Badges ({badges.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.1 }}
            className={`flex flex-col items-center p-3 rounded-lg ${currentTheme.badgeBg}`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-600/20 flex items-center justify-center mb-2">
              {badgeIcons[i % badgeIcons.length]}
            </div>
            <p className={`text-xs text-center ${currentTheme.badgeText}`}>
              {badge}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EarnedBadges;
