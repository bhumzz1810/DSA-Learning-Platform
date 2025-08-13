import React, { useState, useEffect } from "react";
import TopThreeUsers from "../components/TopThreeUsers";
import UserStatsCard from "../components/UserStatsCard";
import LeaderboardTable from "../components/LeaderboardTable";
import { useTheme } from "../components/RT_Pairing/ThemeContext";

const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const API_ROOT = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");
  const themeConfig = {
    light: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-200",
      text: "text-gray-900",
      card: "bg-white border-gray-200",
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
    },
    ocean: {
      bg: "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950",
      text: "text-blue-50",
      card: "bg-blue-800 border-blue-700",
    },
    forest: {
      bg: "bg-gradient-to-br from-green-900 via-green-800 to-green-950",
      text: "text-green-50",
      card: "bg-green-800 border-green-700",
    },
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_ROOT}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${currentTheme.bg}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${currentTheme.bg} ${currentTheme.text}`}
      >
        <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Error Loading Leaderboard</h2>
          <p className="mb-4 text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-8 py-10 ${currentTheme.bg} ${currentTheme.text}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">LeaderBoard</h1>

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

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Top Users + Table */}
        <div className="flex-1 space-y-10">
          <TopThreeUsers topUsers={data?.leaderboard?.topUsers} theme={theme} />
          <LeaderboardTable leaderboard={data?.leaderboard} theme={theme} />
        </div>

        {/* Right: User Stats */}
        <div className="w-full lg:max-w-sm">
          <UserStatsCard
            user={data?.user}
            leaderboard={data?.leaderboard}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
