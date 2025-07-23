import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../components/RT_Pairing/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
  }
};

const flipVariants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      type: 'spring',
      stiffness: 100
    }
  }
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
    transition: { duration: 0.2 }
  }
};

const problemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: 'easeOut' },
  }),
  hover: {
    y: -5,
    zIndex: 1,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
  }
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

  // Theme configuration with fallbacks
  const themeConfig = {
    light: {
      bg: 'bg-gradient-to-br from-gray-50 to-gray-200',
      card: 'bg-white/90 border-gray-200',
      text: 'text-gray-900',
      title: 'text-indigo-700',
      subtitle: 'text-indigo-600',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      loading: 'bg-gradient-to-br from-gray-50 to-gray-200',
      accent: 'from-indigo-500 to-purple-600',
      badge: 'bg-indigo-100 text-indigo-800',
      flipFront: 'bg-white',
      flipBack: 'bg-indigo-50'
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950',
      card: 'bg-gray-800/90 border-gray-700',
      text: 'text-gray-100',
      title: 'text-indigo-300',
      subtitle: 'text-indigo-200',
      button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      loading: 'bg-gradient-to-br from-gray-900 to-gray-800',
      accent: 'from-indigo-500 to-purple-500',
      badge: 'bg-indigo-900/50 text-indigo-100',
      flipFront: 'bg-gray-800',
      flipBack: 'bg-gray-700'
    },
    ocean: {
      bg: 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950',
      card: 'bg-blue-800/90 border-blue-700',
      text: 'text-blue-50',
      title: 'text-cyan-300',
      subtitle: 'text-cyan-200',
      button: 'bg-cyan-600 hover:bg-cyan-500 text-white',
      loading: 'bg-gradient-to-br from-blue-900 to-blue-800',
      accent: 'from-cyan-400 to-blue-500',
      badge: 'bg-cyan-900/50 text-cyan-100',
      flipFront: 'bg-blue-800',
      flipBack: 'bg-blue-700'
    },
    forest: {
      bg: 'bg-gradient-to-br from-green-900 via-green-800 to-green-950',
      card: 'bg-green-800/90 border-green-700',
      text: 'text-green-50',
      title: 'text-emerald-300',
      subtitle: 'text-emerald-200',
      button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      loading: 'bg-gradient-to-br from-green-900 to-green-800',
      accent: 'from-emerald-400 to-teal-500',
      badge: 'bg-emerald-900/50 text-emerald-100',
      flipFront: 'bg-green-800',
      flipBack: 'bg-green-700'
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.light;

  // Safe theme color extraction
  const getThemeColor = (type) => {
    if (!currentTheme?.accent) return 'indigo-500';
    const parts = currentTheme.accent.split(' ');
    if (type === 'from') return parts[0]?.replace('from-', '') || 'indigo-500';
    if (type === 'to') return parts[2]?.replace('to-', '') || 'purple-500';
    return 'indigo-500';
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
    const currentXp = (userData.user.xp || 0) - ((userData.user.level - 1) * 1000);
    return (currentXp / xpForNextLevel) * 100;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        // Ensure streak and totalSolved have fallback values
        const userWithDefaults = {
          ...data.user,
          streak: data.user.streak || 0,
          totalSolved: data.user.totalSolved || 0,
          userRank: data.leaderboard?.yourRank || '--',
        };
        setUserData({ user: userWithDefaults });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  const fetchDailyChallenge = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/problems', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch problems');
    }

    const data = await response.json();
    
    // Find the problem where isDaily is true
    const dailyProblem = data.find(problem => problem.isDaily);
    
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
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.loading}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-4 border-t-transparent border-indigo-400 rounded-full shadow-lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.loading} ${currentTheme.text}`}>
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
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.loading} ${currentTheme.text}`}>
        <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">No User Data Found</h2>
          <p>Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute rounded-full bg-${getThemeColor('from')} blur-sm`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <motion.header
          className={`relative overflow-hidden rounded-3xl p-8 ${currentTheme.card}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
          <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full bg-${getThemeColor('from')} blur-3xl opacity-20`}></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Welcome back, <span className={`bg-clip-text ${applyGradient('')}`}>{userData.user.username.toUpperCase()}</span>!
              </h1>
              <p className={`text-lg mt-2 ${currentTheme.subtitle}`}>Here's your coding progress</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const themes = ['light', 'dark', 'ocean', 'forest'];
                const currentIndex = themes.indexOf(theme);
                const nextIndex = (currentIndex + 1) % themes.length;
                toggleTheme(themes[nextIndex]);
              }}
              className={`p-3 rounded-full shadow-md border ${currentTheme.card}`}
            >
              {theme === 'light' ? '🌙' :
                theme === 'dark' ? '🌞' :
                  theme === 'ocean' ? '🌲' : '🌊'}
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
            onClick={() => navigate('/leaderboard')}
            className={`rounded-3xl p-6 shadow-lg ${currentTheme.card} border border-opacity-20 cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${currentTheme.title}`}>🏆 Leaderboard</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-70"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`w-12 h-12 rounded-full ${applyGradient('flex items-center justify-center text-white text-xl')}`}>
                👑
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-80">Your rank</p>
                <p className="text-xl font-bold"># {userData.user.userRank}</p>
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
            <h3 className={`text-lg font-semibold mb-4 ${currentTheme.title}`}>XP Progress</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 rounded-full bg-gray-200/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateXpProgress()}%` }}
                  className={`h-full rounded-full relative ${applyGradient('')}`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span>Level {userData.user.level || 0}</span>
                <span className="font-bold">{userData.user.xp || 0}/1000 XP</span>
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
            <h3 className={`text-lg font-semibold mb-4 ${currentTheme.title}`}>🔥 Streak</h3>
            <div className="flex items-center justify-center">
              <div className={`text-5xl font-bold ${applyGradient('bg-clip-text')}`}>
                {userData.user.streak !== undefined ? userData.user.streak : 0}
              </div>
              <span className="ml-2 text-lg">days</span>
            </div>
            {/* Visual indicator for 0 streak */}
            {(!userData.user.streak || userData.user.streak === 0) && (
              <p className="text-xs text-center mt-2 opacity-70">Start solving problems to build your streak!</p>
            )}
          </motion.div>
        </div>

        {/* Daily Challenge Card */}
   {/* Daily Challenge Card */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className={`rounded-xl shadow-md p-6 mb-8 ${currentTheme.card}`}
>
  <div className="flex justify-between items-center mb-4">
    <h2 className={`text-2xl font-bold ${currentTheme.title}`}>
      🔥 Daily Challenge
    </h2>
    <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
      {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
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
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {dailyChallenge.description}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          dailyChallenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100' :
          dailyChallenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100' :
          'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100'
        }`}>
          {dailyChallenge.difficulty}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100 rounded-full text-sm">
          {dailyChallenge.category}
        </span>
        {dailyChallenge.hints?.length > 0 && (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-100 rounded-full text-sm">
            {dailyChallenge.hints.length} Hint{dailyChallenge.hints.length !== 1 ? 's' : ''}
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
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className={`rounded-3xl p-6 sm:p-8 shadow-lg ${currentTheme.card} border border-opacity-20`}
        >
          <h2 className={`text-xl sm:text-2xl font-bold mb-5 ${currentTheme.title}`}>🏅 Badges</h2>
          <AnimatePresence>
            <div className="flex flex-wrap gap-3">
              {userData.user.badges?.length ? (
                userData.user.badges.map((badge, i) => (
                  <motion.div
                    key={badge}
                    custom={i}
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`px-4 py-2 rounded-full text-sm font-medium ${currentTheme.badge}`}
                  >
                    🏆 {badge}
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm opacity-60"
                >
                  No badges earned yet.
                </motion.p>
              )}
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Subscription Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className={`rounded-3xl p-6 sm:p-8 shadow-lg ${currentTheme.card} border border-opacity-20`}
        >
          <h2 className={`text-xl sm:text-2xl font-bold mb-5 ${currentTheme.title}`}>💎 Subscription</h2>
          {userData.user.subscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-lg font-semibold ${currentTheme.title}`}>
                    {userData.user.subscription.plan}
                  </h3>
                  <p className={`text-sm ${currentTheme.subtitle}`}>
                    {userData.user.subscription.status === 'active' ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-yellow-500">{userData.user.subscription.status}</span>
                    )}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg ${currentTheme.button}`}
                  onClick={() => navigate('/subscription')}
                >
                  Manage
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${currentTheme.subtitle} opacity-70`}>Started</p>
                  <p className="font-medium">
                    {new Date(userData.user.subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${currentTheme.subtitle} opacity-70`}>
                    {userData.user.subscription.status === 'active' ? 'Renews' : 'Expires'}
                  </p>
                  <p className="font-medium">
                    {new Date(userData.user.subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className={`w-16 h-16 mx-auto rounded-full ${applyGradient('flex items-center justify-center text-white text-2xl mb-4')}`}>
                💎
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${currentTheme.title}`}>No Active Subscription</h3>
              <p className={`text-sm mb-4 ${currentTheme.subtitle} opacity-80`}>
                Upgrade to unlock premium features
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-lg ${currentTheme.button}`}
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const pricingSection = document.getElementById('pricing');
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth' });
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
          <h2 className={`text-xl sm:text-2xl font-bold mb-5 ${currentTheme.title}`}>📘 Recently Solved</h2>
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
                      <h3 className={`text-base sm:text-lg font-semibold ${currentTheme.title}`}>{problem.title}</h3>
                      <div className="flex gap-2 mt-2 flex-wrap text-xs">
                        <span className={`px-2.5 py-1 rounded-full ${currentTheme.badge}`}>
                          {problem.category}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full font-medium ${problem.difficulty === 'Easy' ? 'bg-green-100/70 text-green-800' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100/70 text-yellow-800' :
                              'bg-red-100/70 text-red-800'
                            }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(problem.solvedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
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