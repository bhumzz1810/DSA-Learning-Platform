const ProfileCard = ({ user, leaderboard, theme }) => {
  const themeConfig = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-800',
      accent: 'text-blue-600',
      secondary: 'text-gray-600',
      button: 'bg-gray-200 hover:bg-gray-300 border-gray-400',
      rank: 'text-blue-500',
      premium: 'text-yellow-600',
    },
    dark: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-white',
      accent: 'text-cyan-400',
      secondary: 'text-gray-400',
      button: 'bg-gray-700 hover:bg-gray-600 border-gray-500',
      rank: 'text-cyan-400',
      premium: 'text-yellow-400',
    },
    ocean: {
      bg: 'bg-blue-800',
      border: 'border-blue-700',
      text: 'text-white',
      accent: 'text-cyan-300',
      secondary: 'text-blue-200',
      button: 'bg-blue-700 hover:bg-blue-600 border-blue-500',
      rank: 'text-cyan-300',
      premium: 'text-yellow-300',
    },
    forest: {
      bg: 'bg-green-800',
      border: 'border-green-700',
      text: 'text-white',
      accent: 'text-emerald-300',
      secondary: 'text-green-200',
      button: 'bg-green-700 hover:bg-green-600 border-green-500',
      rank: 'text-emerald-300',
      premium: 'text-yellow-300',
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subscriptionEndDate = new Date(user.subscription.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      className={`rounded-xl p-6 flex flex-col md:flex-row justify-between items-center border ${currentTheme.border}`}
      style={{
        background: theme === 'light' 
          ? 'radial-gradient(100% 100% at 15% 47%, rgba(56,182,255,0.15) 17%, rgba(255,255,255,0) 100%)'
          : 'radial-gradient(100% 100% at 15% 47%, rgba(68,193,255,0.25) 17%, rgba(26,35,51,0) 100%)'
      }}
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-500" />
          <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${currentTheme.rank} bg-opacity-90 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
            #{user.rank}
          </div>
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
            {user.username}
          </h2>
          <p className={`text-sm ${currentTheme.secondary} -mt-1`}>
            Member Since {joinDate}
          </p>
          <p className={`text-sm mt-1 ${currentTheme.secondary}`}>
            Email: <span className={currentTheme.accent}>{user.email}</span>
          </p>
          {user.subscription?.isActive && (
            <p className={`text-sm mt-1 ${currentTheme.premium}`}>
              {user.subscription.plan} (ends {subscriptionEndDate})
            </p>
          )}
          <div className="flex gap-4 mt-3">
            <button className={`${currentTheme.button} px-4 py-1 rounded border`}>
              Github
            </button>
            <button className={`${currentTheme.button} px-4 py-1 rounded border`}>
              LinkedIn
            </button>
          </div>
        </div>
      </div>

      <button className={`mt-6 md:mt-0 text-sm px-4 py-2 rounded ${currentTheme.button} border`}>
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;