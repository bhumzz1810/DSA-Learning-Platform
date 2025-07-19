import React, { useState, useEffect, useRef } from 'react';

const Chat = ({ messages, onSendMessage, theme, currentUser, inputClassName }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className={`flex-1 overflow-y-auto p-3 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`mb-3 p-3 rounded-lg ${
              msg.isSystem
                ? theme === 'dark' 
                  ? 'bg-gray-900 border border-gray-700 text-center italic' 
                  : 'bg-gray-200 border border-gray-300 text-center italic'
                : msg.alias === currentUser
                  ? (theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100')
                  : (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')
            }`}
          >
            <p className={`font-semibold ${
              msg.isSystem
                ? theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                : theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {msg.alias}
            </p>
            <p className={theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}>
              {msg.message}
            </p>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form 
        onSubmit={handleSubmit} 
        className={`p-3 border-t ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-l border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-r bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;