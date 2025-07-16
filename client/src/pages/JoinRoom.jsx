import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/RT_Pairing/ThemeContext';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId.trim() || !alias.trim()) {
      setError('Please enter both room ID and your alias');
      return;
    }
    navigate(`/coding-room?roomId=${roomId}&alias=${alias}`);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-3xl font-bold mb-6 text-center">Pair Coding</h1>
        
        <form onSubmit={handleJoinRoom} className="space-y-6">
          <div>
            
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className={`w-full px-4 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter room ID"
            />
          </div>
          
          <div>
            
            <input
              type="text"
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className={`w-full px-4 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your alias"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Join Room
          </button>
        </form>
        
        <div className="mt-6">
          <ThemeSelector theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
};

const ThemeSelector = ({ theme, toggleTheme }) => {
  const themes = [
    { name: 'light', label: 'Light', bg: 'bg-gray-100' },
    { name: 'dark', label: 'Dark', bg: 'bg-gray-900' },
    { name: 'ocean', label: 'Ocean', bg: 'bg-blue-50' },
    { name: 'forest', label: 'Forest', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-2">
      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Theme</p>
      <div className="flex space-x-2">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => toggleTheme(t.name)}
            className={`w-8 h-8 rounded-full ${t.bg} border-2 ${theme === t.name ? 'border-blue-500' : 'border-transparent'}`}
            title={t.label}
            aria-label={t.label}
          />
        ))}
      </div>
    </div>
  );
};

export default JoinRoom;