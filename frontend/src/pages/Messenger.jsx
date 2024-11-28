import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const Messenger = ({ isDarkMode }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);

  // Initialize Socket.IO
  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Fetch users (followers and following)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated.');
        }

        const response = await axios.get(`http://localhost:3000/api/users/followers-following/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.users); // Assuming the backend sends users in response.data.users
      } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);

    // Fetch messages for the selected user
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messenger/messages/${user.id}`);
        setMessages(response.data); // Assuming the backend sends messages in response.data
      } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
      }
    };

    fetchMessages();
  };

  // Send a message
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const messageData = {
        roomId: selectedUser.id,
        sender: 'You',
        content: newMessage,
      };

      // Emit the message to the server
      socketRef.current.emit('send-message', messageData);

      // Update the local messages list
      setMessages((prevMessages) => [...prevMessages, { ...messageData }]);
      setNewMessage('');
    }
  };

  // Receive messages
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('receive-message', (message) => {
        if (message.roomId === selectedUser?.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }
  }, [selectedUser]);

  return (
    <div className={`flex h-[calc(100vh-4rem)] ${isDarkMode ? 'dark' : ''}`}>
      {/* User List */}
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
              onClick={() => handleUserSelect(user)}
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-gray-200">
                {user.name[0]}
              </div>
              <div className="ml-4">
                <p className="text-md font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.lastMessage || 'Start chatting!'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-3/5 flex flex-col bg-gray-50 dark:bg-gray-900">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-gray-200">
                {selectedUser.name[0]}
              </div>
              <h2 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {selectedUser.name}
              </h2>
            </div>

            {/* Messages */}
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

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
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
