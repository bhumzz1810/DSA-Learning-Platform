const LearningProgress = ({ user, theme }) => {
  const themeConfig = {
    light: {
      text: 'text-gray-800',
      secondary: 'text-gray-600',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-blue-600',
      positive: 'text-green-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    dark: {
      text: 'text-white',
      secondary: 'text-gray-400',
      progressBg: 'bg-gray-700',
      progressFill: 'bg-cyan-500',
      positive: 'text-green-400',
      button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    },
    ocean: {
      text: 'text-white',
      secondary: 'text-blue-200',
      progressBg: 'bg-blue-700',
      progressFill: 'bg-cyan-400',
      positive: 'text-green-300',
      button: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    },
    forest: {
      text: 'text-white',
      secondary: 'text-green-200',
      progressBg: 'bg-green-700',
      progressFill: 'bg-emerald-400',
      positive: 'text-green-300',
      button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!user) return null;

  const progressPercentage = Math.min(100, Math.floor((user.xp / 1000) * 100));
  const levelProgress = user.level ? `${user.level}` : "1";

  return (
    <div className={`rounded-xl p-6 border ${currentTheme.border} ${themeConfig[theme]?.bg || themeConfig.dark.bg}`}>
      <h2 className={`text-xl font-semibold mb-4 text-left ${currentTheme.text}`}>
        Learning Progress
      </h2>
      <div className="mb-6">
        <p className={`text-sm ${currentTheme.secondary} mb-1`}>Level {levelProgress}</p>
        <div className={`h-2 w-full ${currentTheme.progressBg} rounded mb-2`}>
          <div 
            className={`h-full ${currentTheme.progressFill} rounded`} 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className={`text-sm ${currentTheme.positive}`}>
          {user.xp} / 1000 XP ({progressPercentage}%)
        </p>
      </div>
      <div className="flex justify-between text-sm mb-4">
        <p className={currentTheme.text}>Problems Solved:</p>
        <p className={currentTheme.text}>{user.totalSolved || 0}</p>
      </div>
      <button className={`${currentTheme.button} px-4 py-2 rounded-full w-full`}>
        Continue Learning
      </button>
    </div>
  );
};

export default LearningProgress;