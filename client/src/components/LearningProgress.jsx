const LearningProgress = ({ user, theme, onContinueLearning }) => {
  const themeConfig = {
    light: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-gray-800",
      title: "text-indigo-700",
      progressBg: "bg-gray-200",
      progressFill: "bg-gradient-to-r from-indigo-500 to-purple-600",
      button: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white",
    },
    dark: {
      bg: "bg-gray-800",
      border: "border-gray-700",
      text: "text-white",
      title: "text-indigo-300",
      progressBg: "bg-gray-700",
      progressFill: "bg-gradient-to-r from-indigo-500 to-purple-500",
      button: "bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white",
    },
    ocean: {
      bg: "bg-blue-800",
      border: "border-blue-700",
      text: "text-white",
      title: "text-cyan-300",
      progressBg: "bg-blue-700",
      progressFill: "bg-gradient-to-r from-cyan-400 to-blue-500",
      button: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white",
    },
    forest: {
      bg: "bg-green-800",
      border: "border-green-700",
      text: "text-white",
      title: "text-emerald-300",
      progressBg: "bg-green-700",
      progressFill: "bg-gradient-to-r from-emerald-400 to-teal-500",
      button: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white",
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!user) return null;

  const progressPercentage = Math.min(100, Math.floor((user.xp / 1000) * 100));

  return (
    <div className={`rounded-xl p-6 border ${currentTheme.border} ${currentTheme.bg}`}>
      <h2 className={`text-xl font-semibold mb-4 ${currentTheme.title}`}>
        Learning Progress
      </h2>
      <div className="mb-6">
        <p className={`text-sm mb-1 ${currentTheme.text}`}>Level {user.level || 1}</p>
        <div className={`h-2 w-full ${currentTheme.progressBg} rounded mb-2`}>
          <div 
            className={`h-full rounded ${currentTheme.progressFill}`} 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className={`text-sm text-green-400`}>
          {user.xp} / 1000 XP ({progressPercentage}%)
        </p>
      </div>
      <div className="flex justify-between text-sm mb-4">
        <p className={currentTheme.text}>Problems Solved:</p>
        <p className={currentTheme.text}>{user.totalSolved || 0}</p>
      </div>
      <button 
        onClick={onContinueLearning}
        className={`px-4 py-2 rounded-full w-full ${currentTheme.button}`}
      >
        Continue Learning
      </button>
    </div>
  );
};

export default LearningProgress;