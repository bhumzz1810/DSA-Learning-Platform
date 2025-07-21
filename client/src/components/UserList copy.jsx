import React from 'react';

const UserList = ({ users, theme, currentUser }) => {
  const themeConfig = {
    light: {
      border: 'border-gray-200',
      text: 'text-gray-700',
      title: 'text-gray-700',
      itemBg: 'bg-gray-50',
      itemHover: 'hover:bg-gray-100',
      itemText: 'text-gray-800',
      activeRing: 'ring-2 ring-blue-400',
      activeText: 'text-blue-600',
      onlineDot: 'bg-green-500',
      offlineDot: 'bg-gray-500'
    },
    dark: {
      border: 'border-gray-700',
      text: 'text-gray-200',
      title: 'text-gray-200',
      itemBg: 'bg-gray-800',
      itemHover: 'hover:bg-gray-700',
      itemText: 'text-gray-100',
      activeRing: 'ring-2 ring-blue-500',
      activeText: 'text-blue-300',
      onlineDot: 'bg-green-500',
      offlineDot: 'bg-gray-500'
    },
    ocean: {
      border: 'border-blue-700',
      text: 'text-blue-100',
      title: 'text-blue-100',
      itemBg: 'bg-blue-800',
      itemHover: 'hover:bg-blue-700',
      itemText: 'text-white',
      activeRing: 'ring-2 ring-cyan-400',
      activeText: 'text-cyan-300',
      onlineDot: 'bg-green-400',
      offlineDot: 'bg-blue-500'
    },
    forest: {
      border: 'border-green-700',
      text: 'text-green-100',
      title: 'text-green-100',
      itemBg: 'bg-green-800',
      itemHover: 'hover:bg-green-700',
      itemText: 'text-white',
      activeRing: 'ring-2 ring-emerald-400',
      activeText: 'text-emerald-300',
      onlineDot: 'bg-green-400',
      offlineDot: 'bg-green-500'
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  return (
    <div className={`p-4 border-b ${currentTheme.border}`}>
      <h3 className={`font-semibold mb-2 ${currentTheme.title}`}>
        Online Users ({users.length})
      </h3>
      <ul className="space-y-2">
        {users.map(user => (
          <li 
            key={user.id} 
            className={`flex items-center py-2 px-3 rounded-md ${currentTheme.itemBg} ${currentTheme.itemHover} ${currentTheme.itemText} ${
              user.alias === currentUser ? currentTheme.activeRing : ''
            }`}
          >
            <span className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
              user.isActive ? currentTheme.onlineDot : currentTheme.offlineDot
            }`}></span>
            <span className="flex-1 font-medium">
              {user.alias}
            </span>
            {user.alias === currentUser && (
              <span className={`text-xs ${currentTheme.activeText}`}>
                (You)
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;