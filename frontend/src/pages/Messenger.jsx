// import React, { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const Messenger = ({ isDarkMode }) => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const socketRef = useRef(null);

//   // Initialize Socket.IO
//   useEffect(() => {
//     socketRef.current = io('http://localhost:3000');

//     // Cleanup on component unmount
//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []);

//   // Fetch users (followers and following)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('User is not authenticated.');
//         }

//         const response = await axios.get(`http://localhost:3000/api/users/followers-following/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUsers(response.data.users); // Assuming the backend sends users in response.data.users
//       } catch (error) {
//         console.error('Error fetching users:', error.response?.data || error.message);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Handle user selection
//   const handleUserSelect = (user) => {
//     setSelectedUser(user);

//     // Fetch messages for the selected user
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/messenger/messages/${user.id}`);
//         setMessages(response.data); // Assuming the backend sends messages in response.data
//       } catch (error) {
//         console.error('Error fetching messages:', error.response?.data || error.message);
//       }
//     };

//     fetchMessages();
//   };

//   // Send a message
//   const handleSendMessage = () => {
//     if (newMessage.trim() && selectedUser) {
//       const messageData = {
//         roomId: selectedUser.id,
//         sender: 'You',
//         content: newMessage,
//       };

//       // Emit the message to the server
//       socketRef.current.emit('send-message', messageData);

//       // Update the local messages list
//       setMessages((prevMessages) => [...prevMessages, { ...messageData }]);
//       setNewMessage('');
//     }
//   };

//   // Receive messages
//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on('receive-message', (message) => {
//         if (message.roomId === selectedUser?.id) {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         }
//       });
//     }
//   }, [selectedUser]);

//   return (
//     <div className={`flex h-[calc(100vh-4rem)] ${isDarkMode ? 'dark' : ''}`}>
//       {/* User List */}
//       <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
//         <h2 className="text-xl font-semibold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
//           Messages
//         </h2>
//         <div>
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
//                 selectedUser?.id === user.id ? 'bg-gray-200 dark:bg-gray-700' : ''
//               }`}
//               onClick={() => handleUserSelect(user)}
//             >
//               <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-gray-200">
//                 {user.name[0]}
//               </div>
//               <div className="ml-4">
//                 <p className="text-md font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.lastMessage || 'Start chatting!'}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="w-3/5 flex flex-col bg-gray-50 dark:bg-gray-900">
//         {selectedUser ? (
//           <>
//             {/* Chat Header */}
//             <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
//               <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-gray-200">
//                 {selectedUser.name[0]}
//               </div>
//               <h2 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
//                 {selectedUser.name}
//               </h2>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-3">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`p-3 rounded-lg max-w-xs ${
//                       msg.sender === 'You'
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-200'
//                     }`}
//                   >
//                     {msg.content}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Message Input */}
//             <div className="border-t border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex">
//                 <input
//                   type="text"
//                   placeholder="Type a message..."
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
//             <p>Select a user to start chatting</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Messenger;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const Messenger = () => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch user chats
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/messenger/chats');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const openChat = async (chatId) => {
    setCurrentChat(chatId);
    try {
      const response = await axios.get(`http://localhost:3000/api/messenger/chats/${chatId}`);
      setMessages(response.data.messages);
      socket.emit('joinChat', chatId);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() && currentChat) {
      try {
        const newMsg = { content: newMessage };
        await axios.post(`/api/messenger/chats/${currentChat}/messages`, newMsg);
        setMessages([...messages, { sender: 'You', content: newMessage }]);
        setNewMessage('');
        socket.emit('sendMessage', { chatId: currentChat, message: newMsg });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel: User List */}
      <div className="w-1/4 bg-white shadow-md p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Chats</h2>
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center p-3 mb-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition duration-150"
            onClick={() => openChat(user._id)}
          >
            <img
              src={user.profilePicture || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-800">{user.username}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel: Chat Window */}
      <div className="flex flex-col flex-grow bg-white shadow-md">
        {currentChat ? (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50 flex">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-150"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-grow text-gray-500">
            <h2>Select a chat to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;

