// src/pages/Profilepage.jsx
import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import LearningProgress from "../components/LearningProgress";
import XPProgressChart from "../components/XPProgressChart";
import EarnedBadges from "../components/EarnedBadges";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../components/RT_Pairing/ThemeContext";
import {
  User,
  Mail,
  MapPin,
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

const Profilepage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const API_ROOT = (
    import.meta.env.VITE_API_URL ||
    "https://dsa-learning-platform-five.vercel.app"
  ).replace(/\/+$/, "");
  // Theme configuration

  const themeConfig = {
    light: { bg: "bg-gray-50", text: "text-gray-900" },
    dark: { bg: "bg-gray-900", text: "text-white" },
    ocean: { bg: "bg-blue-900", text: "text-white" },
    forest: { bg: "bg-green-900", text: "text-white" },
  };
  const currentTheme = themeConfig[theme] || themeConfig.dark;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch(`${API_ROOT}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          return navigate("/login");
        }

        if (!res.ok) throw new Error("Failed to fetch dashboard");

        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

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

  const handleContinueLearning = () => navigate("/problems");

  if (loading)
    return (
      <div className={`min-h-screen ${currentTheme.bg} text-white p-10`}>
        Loading...
      </div>
    );
  if (error)
    return (
      <div className={`min-h-screen ${currentTheme.bg} text-red-400 p-10`}>
        Error: {error}
      </div>
    );
  if (!dashboardData)
    return (
      <div className={`min-h-screen ${currentTheme.bg} p-10`}>No data</div>
    );

  const user = {
    ...dashboardData.user,
    username:
      dashboardData.user.username.charAt(0).toUpperCase() +
      dashboardData.user.username.slice(1),
    rank: dashboardData.leaderboard.yourRank,
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} px-6 md:px-16 py-10 space-y-12`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Your Profile</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm opacity-60">Theme:</span>
          <button
            onClick={() => {
              const themes = ["light", "dark", "ocean", "forest"];
              const currentIndex = themes.indexOf(theme);
              const nextIndex = (currentIndex + 1) % themes.length;
              toggleTheme(themes[nextIndex]); // ✅ Changes theme without reload
            }}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20"
            title={`Current: ${theme} — Click to change`}
          >
            <span>
              {theme === "light"
                ? "🌙"
                : theme === "dark"
                ? "🌞"
                : theme === "ocean"
                ? "🌊"
                : "🌲"}
            </span>
            <span className="capitalize">{theme}</span>
          </button>
        </div>
      </div>

      <ProfileCard
        user={user}
        leaderboard={dashboardData.leaderboard}
        theme={theme}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6">
          <LearningProgress
            user={user}
            theme={theme}
            onContinueLearning={handleContinueLearning}
          />
          <XPProgressChart user={user} theme={theme} />
        </div>

        <EarnedBadges
          badges={user.badges}
          theme={theme}
          badgeIcons={badgeIcons}
        />
      </div>
    </div>
  );
};

export default Profilepage;
