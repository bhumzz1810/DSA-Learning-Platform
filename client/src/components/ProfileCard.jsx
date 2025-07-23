const ProfileCard = ({ user, leaderboard, theme }) => {
  const themeConfig = {
    light: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-gray-800",
      title: "text-indigo-700",
      accent: "text-indigo-600",
      button: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white",
      rank: "text-indigo-600",
      premium: "text-yellow-600",
    },
    dark: {
      bg: "bg-gray-800",
      border: "border-gray-700",
      text: "text-white",
      title: "text-indigo-300",
      accent: "text-indigo-200",
      button: "bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white",
      rank: "text-indigo-300",
      premium: "text-yellow-400",
    },
    ocean: {
      bg: "bg-blue-800",
      border: "border-blue-700",
      text: "text-white",
      title: "text-cyan-300",
      accent: "text-cyan-200",
      button: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white",
      rank: "text-cyan-300",
      premium: "text-yellow-300",
    },
    forest: {
      bg: "bg-green-800",
      border: "border-green-700",
      text: "text-white",
      title: "text-emerald-300",
      accent: "text-emerald-200",
      button: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white",
      rank: "text-emerald-300",
      premium: "text-yellow-300",
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subscriptionEndDate = new Date(user.subscription?.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      className={`rounded-xl p-6 flex flex-col md:flex-row justify-between items-center border ${currentTheme.border} ${currentTheme.bg}`}
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-500" />
          <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${currentTheme.rank} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
            #{user.rank}
          </div>
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
            {user.username.toUpperCase()}
          </h2>
          <p className={`text-sm ${currentTheme.text} -mt-1`}>
            Member Since {joinDate}
          </p>
          <p className={`text-sm mt-1 ${currentTheme.text}`}>
            Email: <span className={currentTheme.accent}>{user.email}</span>
          </p>
          {user.subscription?.isActive && (
            <p className={`text-sm mt-1 ${currentTheme.premium}`}>
              {user.subscription.plan} (ends {subscriptionEndDate})
            </p>
          )}
          <div className="flex gap-4 mt-3">
            <button className={`px-4 py-1 rounded border ${currentTheme.button}`}>
              Github
            </button>
            <button className={`px-4 py-1 rounded border ${currentTheme.button}`}>
              LinkedIn
            </button>
          </div>
        </div>
      </div>

      

      <button className={`mt-6 md:mt-0 text-sm px-4 py-2 rounded ${currentTheme.button}`}>
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;