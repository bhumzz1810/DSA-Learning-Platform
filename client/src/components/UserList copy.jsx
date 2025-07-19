// UserList.jsx
import React from 'react';

const UserList = ({ users, theme, currentUser }) => {
  return (
    <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        Online Users ({users.length})
      </h3>
      <ul className="space-y-2">
        {users.map(user => (
          <li 
            key={user.id} 
            className={`flex items-center py-2 px-3 rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-100' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
            } ${
              user.alias === currentUser 
                ? (theme === 'dark' ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-400') 
                : ''
            }`}
          >
            <span className={`w-3 h-3 rounded-full mr-3 ${
              user.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
            }`}></span>
            <span className="flex-1 font-medium">
              {user.alias}
            </span>
            {user.alias === currentUser && (
              <span className={`text-xs ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
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