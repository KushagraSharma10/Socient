import React, { useState } from 'react';

const Messenger = ({ isDarkMode }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: 'Alice', lastMessage: 'Hey! How are you?' },
    { id: 2, name: 'Bob', lastMessage: 'Wanna catch up later?' },
    { id: 3, name: 'Charlie', lastMessage: 'Got it, thanks!' },
  ];

  const messages = [
    { sender: 'Alice', content: 'Hey! How are you?' },
    { sender: 'You', content: 'I’m doing well, thanks!' },
    { sender: 'Alice', content: 'Great to hear! Let’s meet up soon.' },
  ];

  return (
    <div className={`flex h-[calc(100vh-4rem)] ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          Messages
        </h2>
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedUser?.id === user.id ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-gray-200">
                {user.name[0]}
              </div>
              <div className="ml-4">
                <p className="text-md font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-3/5 flex flex-col bg-gray-50 dark:bg-gray-900">
        {selectedUser ? (
          <>
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-gray-200">
                {selectedUser.name[0]}
              </div>
              <h2 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {selectedUser.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.sender === 'You'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
