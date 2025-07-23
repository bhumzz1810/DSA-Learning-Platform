// src/components/XPProgressChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const XPProgressChart = ({ user, theme }) => {
  const themeConfig = {
    light: {
      bg: "bg-white", border: "border-gray-300", text: "text-gray-800",
      chartBg: "bg-gray-200", borderColor: "#4f46e5", fill: "rgba(79, 70, 229, 0.2)"
    },
    dark: {
      bg: "bg-gray-800", border: "border-gray-700", text: "text-white",
      chartBg: "bg-gray-700", borderColor: "#38bdf8", fill: "rgba(56, 189, 248, 0.2)"
    },
    ocean: {
      bg: "bg-blue-800", border: "border-blue-700", text: "text-white",
      chartBg: "bg-blue-700", borderColor: "#06b6d4", fill: "rgba(6, 182, 212, 0.2)"
    },
    forest: {
      bg: "bg-green-800", border: "border-green-700", text: "text-white",
      chartBg: "bg-green-700", borderColor: "#10b981", fill: "rgba(16, 185, 129, 0.2)"
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "XP Progress",
      data: [100, 200, 350, 400, 500, 550, user?.xp ?? 600],
      borderColor: currentTheme.borderColor,
      backgroundColor: currentTheme.fill,
      tension: 0.4,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
      x: {},
    },
  };

  return (
    <div className={`rounded-xl p-6 border ${currentTheme.border} ${currentTheme.bg}`}>
      <h2 className={`text-xl font-semibold mb-4 ${currentTheme.text}`}>XP Progress</h2>
      <p className={`text-4xl font-bold mb-2 ${currentTheme.text}`}>{user?.xp ?? 0}</p>
      <p className={`text-green-400 text-sm mb-4`}>
        Current XP +{Math.floor(((user?.xp ?? 0) / 1000) * 100)}%
      </p>
      <div className="h-40"><Line data={data} options={options} /></div>
    </div>
  );
};

export default XPProgressChart;
