import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/RT_Pairing/ThemeContext';

const THEME_COLORS = {
  light: {
    bg: 'bg-theme-light-bg',
    text: 'text-theme-light-text',
    card: 'bg-theme-light-card',
    input: 'bg-theme-light-input border-theme-light-border text-theme-light-text',
  },
  dark: {
    bg: 'bg-theme-dark-bg',
    text: 'text-theme-dark-text',
    card: 'bg-theme-dark-card',
    input: 'bg-theme-dark-input border-theme-dark-border text-theme-dark-text',
  },
  ocean: {
    bg: 'bg-theme-ocean-bg',
    text: 'text-theme-ocean-text',
    card: 'bg-theme-ocean-card',
    input: 'bg-theme-ocean-input border-theme-ocean-border text-theme-ocean-text',
  },
  forest: {
    bg: 'bg-theme-forest-bg',
    text: 'text-theme-forest-text',
    card: 'bg-theme-forest-card',
    input: 'bg-theme-forest-input border-theme-forest-border text-theme-forest-text',
  },
};

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

  const currentTheme = THEME_COLORS[theme] || THEME_COLORS.light;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${currentTheme.card}`}>
        <h1 className="text-3xl font-bold mb-6 text-center">Pair Coding</h1>

        <form onSubmit={handleJoinRoom} className="space-y-6">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.input}`}
          />
          <input
            type="text"
            placeholder="Enter your alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.input}`}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
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
    { name: 'light', label: 'Light', bg: 'bg-theme-light-bg' },
    { name: 'dark', label: 'Dark', bg: 'bg-theme-dark-bg' },
    { name: 'ocean', label: 'Ocean', bg: 'bg-theme-ocean-bg' },
    { name: 'forest', label: 'Forest', bg: 'bg-theme-forest-bg' },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Theme</p>
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
