const UserList = ({ users, theme }) => {
  return (
    <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className="font-semibold mb-2">Online Users ({users.length})</h3>
      <ul className="space-y-1">
        {users.map(user => (
          <li 
            key={user.id} 
            className={`flex items-center py-1 px-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            <span>{user.alias}</span>
            {user.isHost && <span className="ml-2 text-xs bg-yellow-500 text-white px-1 rounded">Host</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;