import { useState, useEffect, useRef } from 'react';

const Chat = ({ messages, onSendMessage, alias, theme }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className={`p-4 flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="font-semibold mb-2">Chat</h3>
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${msg.alias === alias ? (theme === 'dark' ? 'bg-blue-900' : 'bg-blue-200') : (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}`}
            >
              <div className="flex justify-between items-baseline">
                <span className={`font-semibold ${msg.alias === alias ? 'text-white' : (theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}`}>
                  {msg.alias}
                </span>
                <span className="text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-1">{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className={`p-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`flex-1 px-3 py-2 rounded-l border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r transition-colors`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;