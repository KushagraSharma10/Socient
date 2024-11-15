import React, { useState, useEffect } from 'react';

const Notification = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's dark mode preference on initial load
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode and save preference to localStorage
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newDarkMode = !prev;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', newDarkMode);
      return newDarkMode;
    });
  };

  const notifications = [
    {
      id: 1,
      type: 'Like',
      user: 'John Doe',
      message: 'liked your photo',
      time: '5 minutes ago',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      type: 'Comment',
      user: 'Jane Smith',
      message: 'commented on your post',
      time: '10 minutes ago',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 3,
      type: 'Mention',
      user: 'Sarah Lee',
      message: 'mentioned you in a story',
      time: '15 minutes ago',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      {/* Sidebar */}
      <div className={`w-1/5 p-6 shadow-lg flex flex-col items-start border-r ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
        <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
        <ul className="w-full space-y-4">
          <li className="text-lg cursor-pointer hover:text-blue-600">All</li>
          <li className="text-lg cursor-pointer hover:text-blue-600">Mentions</li>
          <li className="text-lg cursor-pointer hover:text-blue-600">Likes</li>
          <li className="text-lg cursor-pointer hover:text-blue-600">Comments</li>
        </ul>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="mt-auto text-sm px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Notification List */}
      <div className={`w-4/5 p-6 overflow-y-auto ${darkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-300`}>
        <h1 className={`text-3xl font-semibold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Notifications</h1>

        {/* Notification Items */}
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center justify-between p-4 mb-4 rounded-lg shadow-md hover:bg-gray-50 ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}
          >
            <div className="flex items-center space-x-4">
              <img
                src={notification.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{notification.user}</p>
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
            <p className="text-sm">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
