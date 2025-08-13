import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { useTheme } from "../components/RT_Pairing/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Trophy,
  Award,
  Medal,
  Crown,
  Star,
  Rocket,
  Flame,
  Gem,
  ShieldCheck,
  ThumbsUp,
  Brain,
} from "lucide-react";

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
  },
};

const flipVariants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.1 },
  }),
  hover: {
    scale: 1.1,
    y: -3,
    transition: { duration: 0.2 },
  },
};

const problemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
  hover: {
    y: -5,
    zIndex: 1,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ user: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const API_ROOT = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");
  // Theme configuration with fallbacks
  const themeConfig = {
    light: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-gray-800",
      title: "text-indigo-700",
      accent: "text-indigo-600",
      button:
        "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white",
      rank: "text-indigo-600",
      premium: "text-yellow-600",
      badge: "bg-indigo-100 text-indigo-800",
    },
    dark: {
      bg: "bg-gray-800",
      border: "border-gray-700",
      text: "text-white",
      title: "text-indigo-300",
      accent: "text-indigo-200",
      button:
        "bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white",
      rank: "text-indigo-300",
      premium: "text-yellow-400",
      badge: "bg-cyan-900/50 text-cyan-100",
    },
    ocean: {
      bg: "bg-blue-800",
      border: "border-blue-700",
      text: "text-white",
      title: "text-cyan-300",
      accent: "text-cyan-200",
      button:
        "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white",
      rank: "text-cyan-300",
      premium: "text-yellow-300",
    },
    forest: {
      bg: "bg-green-800",
      border: "border-green-700",
      text: "text-white",
      title: "text-emerald-300",
      accent: "text-emerald-200",
      button:
        "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white",
      rank: "text-emerald-300",
      premium: "text-yellow-300",
    },
  };

  const currentTheme = themeConfig[theme] || themeConfig.light;

  // Badge icons
  const badgeIcons = [
    <Trophy className="w-8 h-8 text-yellow-400" />,
    <Award className="w-8 h-8 text-blue-400" />,
    <Medal className="w-8 h-8 text-purple-400" />,
    <Crown className="w-8 h-8 text-green-400" />,
    <Star className="w-8 h-8 text-orange-400" />,
    <Rocket className="w-8 h-8 text-pink-400" />,
    <Flame className="w-8 h-8 text-red-500" />,
    <Gem className="w-8 h-8 text-teal-400" />,
    <ShieldCheck className="w-8 h-8 text-indigo-500" />,
    <ThumbsUp className="w-8 h-8 text-lime-400" />,
    <Brain className="w-8 h-8 text-rose-400" />,
  ];

  // Generate meta description based on user data
  const metaDescription = userData?.user
    ? `${userData.user.username}'s coding dashboard - Level ${
        userData.user.level || 0
      }, ${userData.user.totalSolved || 0} problems solved, ${
        userData.user.streak || 0
      }-day streak`
    : "Personal coding dashboard to track your programming progress, achievements, and stats";

  // Safe theme color extraction
  const getThemeColor = (type) => {
    if (!currentTheme?.accent) return "indigo-500";
    const parts = currentTheme.accent.split(" ");
    if (type === "from") return parts[0]?.replace("from-", "") || "indigo-500";
    if (type === "to") return parts[2]?.replace("to-", "") || "purple-500";
    return "indigo-500";
  };

  // Safe gradient application
  const applyGradient = (element) => {
    return currentTheme?.accent
      ? `${currentTheme.accent} ${element}`
      : `from-indigo-500 to-purple-500 ${element}`;
  };

  const calculateXpProgress = () => {
    if (!userData?.user?.level || userData.user.level <= 0) return 0;
    const xpForNextLevel = 1000;
    const currentXp =
      (userData.user.xp || 0) - (userData.user.level - 1) * 1000;
    return (currentXp / xpForNextLevel) * 100;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_ROOT}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        console.log("API Response:", data);

        const rank =
          data.rank ||
          data.user?.rank ||
          data.leaderboard?.yourRank ||
          data.leaderboard?.rank ||
          "--";

        setUserData({
          user: {
            ...data.user,
            streak: data.user.streak || 0,
            totalSolved: data.user.totalSolved || 0,
            userRank:
              typeof rank === "number"
                ? rank
                : rank === "--"
                ? rank
                : parseInt(rank) || "--",
            quizAttempts: data.user.quizAttempts || 0,
          },
          quizStats: data.quizStats,
          leaderboard: data.leaderboard,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDailyChallenge = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_ROOT}/api/problems`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }

        const data = await response.json();
        const dailyProblem = data.find((problem) => problem.isDaily);
        setDailyChallenge(dailyProblem || null);
      } catch (err) {
        console.error("Error fetching daily challenge:", err);
        setDailyChallenge(null);
      } finally {
        setLoadingDaily(false);
      }
    };

    fetchDashboardData();
    fetchDailyChallenge();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${currentTheme.loading}`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 border-4 border-t-transparent border-indigo-400 rounded-full shadow-lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${currentTheme.loading} ${currentTheme.text}`}
      >
        <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p className="mb-4 text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-lg ${currentTheme.button}`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${currentTheme.loading} ${currentTheme.text}`}
      >
        <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">No User Data Found</h2>
          <p>Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}
    >
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          {userData?.user
            ? `${userData.user.username}'s Dashboard`
            : "My Coding Dashboard"}
        </title>
        <meta name="description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:title"
          content={
            userData?.user
              ? `${userData.user.username}'s Coding Progress`
              : "Coding Dashboard"
          }
        />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content="https://yourdomain.com/images/dashboard-preview.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta
          property="twitter:title"
          content={
            userData?.user
              ? `${userData.user.username}'s Coding Progress`
              : "Coding Dashboard"
          }
        />
        <meta property="twitter:description" content={metaDescription} />
        <meta
          property="twitter:image"
          content="https://yourdomain.com/images/dashboard-preview.png"
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute rounded-full bg-${getThemeColor(
              "from"
            )} blur-sm`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <motion.header
          className={`relative overflow-hidden rounded-3xl border border-opacity-20 p-8 ${currentTheme.card}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
          <div
            className={`absolute -top-32 -right-32 w-64 h-64 rounded-full bg-${getThemeColor(
              "from"
            )} blur-3xl opacity-20`}
          ></div>
          <div className="rounded-3xl flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Welcome back,{" "}
                <span className={`bg-clip-text ${applyGradient("")}`}>
                  {userData.user.username.toUpperCase()}
                </span>
                !
              </h1>
              <p className={`text-lg mt-2 ${currentTheme.subtitle}`}>
                Here's your coding progress
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const themes = ["light", "dark", "ocean", "forest"];
                const currentIndex = themes.indexOf(theme);
                const nextIndex = (currentIndex + 1) % themes.length;
                toggleTheme(themes[nextIndex]);
              }}
              className={`p-3 rounded-full shadow-md border ${currentTheme.card}`}
            >
              {theme === "light"
                ? "🌙"
                : theme === "dark"
                ? "🌞"
                : theme === "ocean"
                ? "🌲"
                : "🌊"}
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Leaderboard Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onClick={() => navigate("/leaderboard")}
            className={`rounded-3xl p-6 shadow-lg ${currentTheme.card} border border-opacity-20 cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${currentTheme.title}`}>
                🏆 Leaderboard
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-70"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mt-4 flex items-center">
              <div
                className={`w-12 h-12 rounded-full ${applyGradient(
                  "flex items-center justify-center text-white text-xl"
                )}`}
              >
                {typeof userData.user.userRank === "number"
                  ? userData.user.userRank <= 3
                    ? ["🥇", "🥈", "🥉"][userData.user.userRank - 1]
                    : "🏅"
                  : "👑"}
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-80">Your rank</p>
                <p className="text-xl font-bold">
                  {typeof userData.user.userRank === "number"
                    ? `#${userData.user.userRank}`
                    : userData.user.userRank}
                </p>
              </div>
            </div>
          </motion.div>

          {/* XP Progress Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`rounded-3xl p-6 shadow-lg ${currentTheme.card} border border-opacity-20`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${currentTheme.title}`}>
              XP Progress
            </h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 rounded-full bg-gray-200/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateXpProgress()}%` }}
                  className={`h-full rounded-full relative ${applyGradient(
                    ""
                  )}`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span>Level {userData.user.level || 0}</span>
                <span className="font-bold">
                  {userData.user.xp || 0}/1000 XP
                </span>
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            whileHover="hover"
            className={`rounded-3xl p-6 shadow-lg ${currentTheme.card} border border-opacity-20`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${currentTheme.title}`}>
              🔥 Streak
            </h3>
            <div className="flex items-center justify-center">
              <div
                className={`text-5xl font-bold ${applyGradient(
                  "bg-clip-text"
                )}`}
              >
                {userData.user.streak !== undefined ? userData.user.streak : 0}
              </div>
              <span className="ml-2 text-lg">days</span>
            </div>
            {(!userData.user.streak || userData.user.streak === 0) && (
              <p className="text-xs text-center mt-2 opacity-70">
                Start solving problems to build your streak!
              </p>
            )}
          </motion.div>
        </div>

        {/* Full-width Interactive Quiz Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.01 }}
          transition={{ delay: 0.6 }}
          className={`rounded-3xl w-full p-6 sm:p-8 shadow-xl ${currentTheme.card} border border-opacity-20 relative overflow-hidden group`}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to bottom right, ${getThemeColor(
                "from"
              )}1A, ${getThemeColor("to")}1A)`,
            }}
          ></div>
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300"
            style={{ backgroundColor: getThemeColor("from") }}
          ></div>
          <div
            className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full opacity-10 blur-lg group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: getThemeColor("to") }}
          ></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-4 rounded-2xl flex items-center justify-center ${applyGradient(
                    "text-white shadow-lg"
                  )}`}
                >
                  <span className="text-3xl">🧠</span>
                </motion.div>

                <div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${currentTheme.title}`}
                  >
                    Quiz Progress
                  </h2>
                  <p className={`text-sm ${currentTheme.subtitle} opacity-80`}>
                    Test your knowledge and track your improvement
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/quiz")}
                className={`px-6 py-3 rounded-lg ${currentTheme.button} font-medium flex items-center gap-2`}
              >
                <Rocket className="w-5 h-5" />
                {userData.user.quizAttempts > 0 ? "New Quiz" : "Start Quiz"}
              </motion.button>
            </div>

            {userData.user.quizAttempts > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className={`p-5 rounded-xl ${currentTheme.badge} flex flex-col items-center`}
                >
                  <div className="text-4xl font-bold mb-2 flex items-center">
                    {userData.user.quizAttempts}
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="ml-2 text-2xl"
                    >
                      📊
                    </motion.span>
                  </div>
                  <p className="text-sm opacity-80">Total Attempts</p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className={`p-5 rounded-xl bg-green-100/30 dark:bg-green-900/30 text-green-800 dark:text-green-100 flex flex-col items-center`}
                >
                  <div className="text-4xl font-bold mb-2 flex items-center">
                    {userData.quizStats?.totalCorrect || 0}
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="ml-2 text-2xl"
                    >
                      ✅
                    </motion.span>
                  </div>
                  <p className="text-sm opacity-80">Correct Answers</p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className={`p-5 rounded-xl bg-red-100/30 dark:bg-red-900/30 text-red-800 dark:text-red-100 flex flex-col items-center`}
                >
                  <div className="text-4xl font-bold mb-2 flex items-center">
                    {userData.quizStats?.totalIncorrect || 0}
                    <motion.span
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-2 text-2xl"
                    >
                      ❌
                    </motion.span>
                  </div>
                  <p className="text-sm opacity-80">Incorrect Answers</p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className={`p-5 rounded-xl ${currentTheme.badge} flex flex-col items-center`}
                >
                  <div className="text-4xl font-bold mb-2 flex items-center">
                    {userData.quizStats
                      ? `${Math.round(
                          (userData.quizStats.totalCorrect /
                            (userData.quizStats.totalCorrect +
                              userData.quizStats.totalIncorrect)) *
                            100
                        )}%`
                      : "0%"}
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="ml-2 text-2xl"
                    >
                      🎯
                    </motion.span>
                  </div>
                  <p className="text-sm opacity-80">Accuracy Rate</p>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8 py-6">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-40 h-40 flex items-center justify-center"
                >
                  <div
                    className={`relative w-full h-full ${applyGradient(
                      "rounded-full opacity-20"
                    )}`}
                  ></div>
                  <div
                    className={`absolute text-6xl ${applyGradient(
                      "bg-clip-text text-transparent"
                    )}`}
                  >
                    ?
                  </div>
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <h3
                    className={`text-2xl font-bold ${currentTheme.title} mb-3`}
                  >
                    Ready for Your First Quiz Challenge?
                  </h3>
                  <p
                    className={`text-lg mb-6 ${currentTheme.subtitle} opacity-90 max-w-lg mx-auto md:mx-0`}
                  >
                    Test your knowledge with our interactive coding quizzes.
                    Track your progress, earn achievements, and climb the
                    leaderboard!
                  </p>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 5px 15px rgba(${getThemeColor(
                        "from"
                      )}, 0.3)`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/quiz")}
                    className={`px-8 py-4 rounded-xl ${currentTheme.button} font-semibold text-lg flex items-center justify-center gap-3 mx-auto md:mx-0`}
                  >
                    <Rocket className="w-6 h-6" />
                    Start Quiz Journey
                  </motion.button>
                </div>
              </div>
            )}

            {userData.user.quizAttempts > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Quiz Mastery Progress
                  </span>
                  <span className="text-sm font-medium">
                    Level {Math.floor(userData.user.quizAttempts / 5) + 1}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(userData.user.quizAttempts % 5) * 20}%`,
                      backgroundColor: getThemeColor("from"),
                    }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="h-3 rounded-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <div className="flex justify-between text-xs mt-2 opacity-70">
                  <span>{userData.user.quizAttempts} quizzes taken</span>
                  <span>
                    {5 - (userData.user.quizAttempts % 5)} to next level
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl border border-opacity-20 shadow-md p-6 mb-8 ${currentTheme.card}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${currentTheme.title}`}>
              🔥 Daily Challenge
            </h2>
            <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
              {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </span>
          </div>

          {loadingDaily ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : dailyChallenge ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold ${currentTheme.title}`}>
                    {dailyChallenge.title}
                  </h3>
                  <p className={`${currentTheme.text} mt-2`}>
                    {dailyChallenge.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    dailyChallenge.difficulty === "Easy"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100"
                      : dailyChallenge.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100"
                  }`}
                >
                  {dailyChallenge.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100 rounded-full text-sm">
                  {dailyChallenge.category}
                </span>
                {dailyChallenge.hints?.length > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-100 rounded-full text-sm">
                    {dailyChallenge.hints.length} Hint
                    {dailyChallenge.hints.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  to={`/problems/${dailyChallenge._id}`}
                  className={`px-6 py-2 rounded-lg font-medium ${currentTheme.button} flex items-center gap-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Solve Challenge
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                No Challenge Today
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Check back tomorrow for a new challenge
              </p>
            </div>
          )}
        </motion.div>

        {/* Badges Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mb-8 w-full p-6 border border-opacity-20 rounded-xl ${currentTheme.card}`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${currentTheme.title}`}>
            🏅 Earned Badges
          </h2>
          {userData.user.badges?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {userData.user.badges.map((badge, i) => (
                  <motion.div
                    key={badge}
                    custom={i}
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`flex flex-col items-center p-4 rounded-lg ${currentTheme.badge}`}
                  >
                    {badgeIcons[i % badgeIcons.length]}
                    <p className="mt-2 text-lg text-center">{badge}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className={`${currentTheme.text} opacity-80`}>
              No badges earned yet. Solve problems to earn badges!
            </p>
          )}
        </motion.section>

        {/* Subscription Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className={`rounded-3xl p-6 sm:p-8 shadow-lg ${currentTheme.card} border border-opacity-20`}
        >
          <h2
            className={`text-xl sm:text-2xl font-bold mb-5 ${currentTheme.title}`}
          >
            💎 Subscription
          </h2>
          {userData.user.subscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-lg font-semibold ${currentTheme.title}`}>
                    {userData.user.subscription.plan}
                  </h3>
                  <p className={`text-sm ${currentTheme.subtitle}`}>
                    {userData.user.subscription.status === "active" ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-yellow-500">
                        {userData.user.subscription.status}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${currentTheme.subtitle} opacity-70`}>
                    Started
                  </p>
                  <p className="font-medium">
                    {new Date(
                      userData.user.subscription.startDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${currentTheme.subtitle} opacity-70`}>
                    {userData.user.subscription.status === "active"
                      ? "Renews"
                      : "Expires"}
                  </p>
                  <p className="font-medium">
                    {new Date(
                      userData.user.subscription.endDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div
                className={`w-16 h-16 mx-auto rounded-full ${applyGradient(
                  "flex items-center justify-center text-white text-2xl mb-4"
                )}`}
              >
                💎
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${currentTheme.title}`}
              >
                No Active Subscription
              </h3>
              <p className={`text-sm mb-4 ${currentTheme.subtitle} opacity-80`}>
                Upgrade to unlock premium features
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-lg ${currentTheme.button}`}
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    const pricingSection = document.getElementById("Pricing");
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                }}
              >
                View Plans
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Recently Solved Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className={`rounded-3xl p-6 sm:p-8 shadow-lg ${currentTheme.card} border border-opacity-20`}
        >
          <h2
            className={`text-xl sm:text-2xl font-bold mb-5 ${currentTheme.title}`}
          >
            📘 Recently Solved
          </h2>
          <div className="space-y-4">
            {userData.user.recentSolved?.length ? (
              userData.user.recentSolved.map((problem, index) => (
                <motion.div
                  key={`${problem.title}-${index}`}
                  custom={index}
                  variants={problemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={`rounded-xl p-4 sm:p-5 border ${currentTheme.card} transition-all duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-base sm:text-lg font-semibold ${currentTheme.title}`}
                      >
                        {problem.title}
                      </h3>
                      <div className="flex gap-2 mt-2 flex-wrap text-xs">
                        <span
                          className={`px-2.5 py-1 rounded-full ${currentTheme.badge}`}
                        >
                          {problem.category}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full font-medium ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100/70 text-green-800"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-100/70 text-yellow-800"
                              : "bg-red-100/70 text-red-800"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(problem.solvedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-sm opacity-60"
              >
                You haven't solved anything yet.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
