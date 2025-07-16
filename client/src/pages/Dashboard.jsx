import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../components/RT_Pairing/ThemeContext';

const DashboardCards = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const userData = {
    username: "codeMaster",
    level: 3,
    xp: 2450,
    streak: 7,
    badges: ["First Problem", "XP Rookie", "Hard Hitter", "Streak Starter", "Weekend Warrior"],
    recentSolved: [
      { title: "Reverse Linked List", category: "Linked List", difficulty: "Medium", solvedAt: "2025-07-17T14:25:00.000Z" },
      { title: "Binary Tree Traversal", category: "Tree", difficulty: "Medium", solvedAt: "2025-07-16T11:20:00.000Z" },
      { title: "Palindromic Substring", category: "String", difficulty: "Hard", solvedAt: "2025-07-15T09:15:00.000Z" }
    ],
    leaderboard: [
      { username: "algoNinja", xp: 3850, level: 4 },
      { username: "codeMaster", xp: 2450, level: 3 },
      { username: "binaryQueen", xp: 2100, level: 2 }
    ]
  };

  // Updated professional color scheme:
  const bgLight = 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900';
  const cardBg = 'bg-white border border-gray-300 shadow-sm';
  const tabActive = 'bg-blue-600 text-white shadow-md';
  const tabInactive = 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300';

  return (
    <div className={`min-h-screen p-6 ${bgLight}`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-blue-700">
              Code Dashboard
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
              <span>Light</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                <motion.div className="w-5 h-5 bg-white rounded-full ml-auto shadow" layout />
              </div>
              <span>Dark</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {['overview', 'progress', 'achievements'].map(tab => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab ? tabActive : tabInactive
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className={`rounded-2xl p-8 ${cardBg}`}>
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                    {userData.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Lvl {userData.level}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{userData.username}</h2>
                  <p className="text-sm text-gray-500">Joined January 2025</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 rounded-lg text-center border border-blue-200 bg-blue-50">
                  <div className="text-2xl font-bold text-blue-700">{userData.streak}</div>
                  <div className="text-xs text-blue-600 uppercase tracking-wide">Day Streak</div>
                </div>
                <div className="p-4 rounded-lg text-center border border-indigo-200 bg-indigo-50">
                  <div className="text-2xl font-bold text-indigo-700">{userData.recentSolved.length}</div>
                  <div className="text-xs text-indigo-600 uppercase tracking-wide">This Week</div>
                </div>
                <div className="p-4 rounded-lg text-center border border-gray-300 bg-gray-100">
                  <div className="text-2xl font-bold text-gray-700">82%</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Accuracy</div>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 ${cardBg}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-gray-800">XP Progress</h2>
                <span className="text-sm text-gray-500">
                  Level {userData.level} → {userData.level + 1}
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-3 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userData.xp % 1000) / 10}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-blue-600 rounded-full shadow-md"
                />
              </div>
              <div className="flex justify-between text-sm text-blue-700 font-medium">
                <span>{userData.xp % 1000}/1000 XP</span>
                <span>{1000 - (userData.xp % 1000)} to next level</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`rounded-2xl p-6 ${cardBg}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg text-gray-800">Badges</h2>
                <span className="text-sm text-blue-600">{userData.badges.length} earned</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {userData.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBadge(badge)}
                    className="p-4 rounded-xl text-center cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-300 flex items-center justify-center text-2xl shadow text-white">
                      {index % 3 === 0 ? '🏅' : index % 3 === 1 ? '🏆' : '🎖️'}
                    </div>
                    <div className="text-sm font-medium text-blue-800 truncate">{badge}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 shadow-md">
              <h2 className="font-semibold text-lg mb-3">Weekly Goal</h2>
              <p className="text-sm opacity-90 mb-5">Complete 5 problems to earn bonus XP</p>
              <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-3">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(userData.recentSolved.length / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>{userData.recentSolved.length}/5 problems</span>
                <span>+200 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
