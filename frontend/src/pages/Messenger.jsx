// import React, { useState, useEffect } from 'react';
// import socket from '../utils/Socket'; // Import the socket instance
// import axios from 'axios';

// const Messenger = ({ isDarkMode }) => {
//   const [selectedChatId, setSelectedChatId] = useState(null); // Selected chat ID
//   const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
//   const [users, setUsers] = useState([]); // Chat list
//   const [searchResults, setSearchResults] = useState([]); // Search results
//   const [messages, setMessages] = useState([]); // Messages in the chat window
//   const [newMessage, setNewMessage] = useState(''); // New message input
//   const [searchQuery, setSearchQuery] = useState(''); // Search bar query
//   const [followersFollowing, setFollowersFollowing] = useState([]); // Followers and following
//   const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup for starting chat

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('User is not authenticated.');
//         }
//         const userId = localStorage.getItem('userId');

//         // Fetch existing chats
//         const chatResponse = await axios.get('http://localhost:3000/api/messenger/chats', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(chatResponse.data);

//         // Fetch followers and following
//         const response = await axios.get(`http://localhost:3000/api/users/followers-following/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log('Followers/Following data:', response.data);
//         setFollowersFollowing(response.data);
//       } catch (error) {
//         console.error('Error fetching initial data:', error.response?.data || error.message);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Initialize Socket.IO
//   useEffect(() => {
//     socket.connect();

//     socket.on('connect', () => {
//       console.log('Socket connected:', socket.id);
//     });

//     socket.on('receiveMessage', (message) => {
//       console.log('Message received from server:', message);

//       if (message.chatId === selectedChatId) {
//         setMessages((prevMessages) => [...prevMessages, message]);
//       } else {
//         setUsers((prevUsers) => {
//           const updatedUsers = prevUsers.map((user) =>
//             user.chatId === message.chatId
//               ? { ...user, lastMessage: message.content, isBold: true }
//               : user
//           );
//           return updatedUsers;
//         });
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [selectedChatId]);

//   useEffect(() => {
//     if (selectedChatId) {
//       socket.emit('joinChat', selectedChatId);
//     }
//   }, [selectedChatId]);

//   const startNewChat = async (user) => {
//     try {
//       console.log('User object:', user); // Log the user object
//       const token = localStorage.getItem('token');

//       // Use _id instead of id
//       if (!user._id) {
//         console.error('Receiver ID is missing');
//         return;
//       }

//       const response = await axios.post(
//         `http://localhost:3000/api/messenger/chats`,
//         { receiverId: user._id }, // Use _id as receiverId
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const chatId = response.data.chatId;

//       setSelectedUser(user);
//       setSelectedChatId(chatId);

//       if (!users.some((u) => u.chatId === chatId)) {
//         setUsers((prevUsers) => [
//           { ...user, chatId, lastMessage: '', isBold: false },
//           ...prevUsers,
//         ]);
//       }
//     } catch (error) {
//       console.error('Error initializing chat:', error.response?.data || error.message);
//     }
//   };




//   const handleUserSelect = async (user) => {
//     // Ensure startNewChat is complete before proceeding
//     await startNewChat(user);

//     // Use the selectedChatId after it is set
//     if (!selectedChatId) {
//       console.error('Chat ID not set. Cannot fetch messages.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:3000/api/messenger/chats/${selectedChatId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessages(response.data.messages);
//     } catch (error) {
//       console.error('Error fetching messages:', error.response?.data || error.message);
//     }
//   };


//   const handleSendMessage = async () => {
//     console.log('Chat ID:', selectedChatId); // Check if chatId is present
//     console.log('New Message:', newMessage); // Check the message content

//     if (!newMessage.trim()) {
//       console.error('Cannot send an empty message');
//       return;
//     }

//     if (!selectedChatId) {
//       console.error('Chat ID is missing');
//       return;
//     }

//     const messageData = {
//       sender: 'You',
//       content: newMessage,
//       createdAt: new Date(),
//     };

//     socket.emit('sendMessage', { chatId: selectedChatId, message: messageData });
//     setMessages((prevMessages) => [...prevMessages, messageData]);
//     setNewMessage('');
//   };

//   const openNewChatPopup = () => {
//     setIsPopupOpen(true);
//   };

//   const closePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);

//     if (e.target.value.trim() === '') {
//       setSearchResults([]);
//     } else {
//       const filteredResults = followersFollowing.filter((user) =>
//         user.name.toLowerCase().includes(e.target.value.toLowerCase())
//       );
//       setSearchResults(filteredResults);
//     }
//   };

//   return (
//     <div className={`flex h-[calc(100vh-4rem)] ${isDarkMode ? 'dark' : ''}`}>
//       {/* User List */}
//       <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
//         <h2 className="text-xl font-semibold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
//           Messages
//         </h2>
//         <div className="p-4">
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchQuery}
//             onChange={handleSearch}
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-400"
//           />
//         </div>
//         <div>
//           {users.map((user) => (
//             <div
//               key={user.chatId}
//               className="flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//               onClick={() => handleUserSelect(user)}
//             >
//               <img
//                 src={user.profilePicture || 'https://via.placeholder.com/50'}
//                 alt={`${user.name}'s profile`}
//                 className="w-10 h-10 rounded-full"
//               />
//               <div className="ml-4">
//                 <p className="text-md font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
//                 <p
//                   className={`text-sm ${
//                     user.isBold ? 'font-bold text-gray-900' : 'text-gray-600 dark:text-gray-400'
//                   } truncate`}
//                 >
//                   {user.lastMessage || 'Start chatting!'}
//                 </p>
//               </div>
//             </div>
//           ))}
//           {!users.length && (
//             <div className="flex items-center justify-center p-4">
//               <button
//                 onClick={openNewChatPopup}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
//               >
//                 <span className="text-lg mr-2">+</span> Start Chatting
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="w-3/5 flex flex-col bg-gray-50 dark:bg-gray-900">
//         {selectedUser ? (
//           <>
//             <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
//               <img
//                 src={selectedUser.profilePicture || 'https://via.placeholder.com/50'}
//                 alt={`${selectedUser.name}'s profile`}
//                 className="w-10 h-10 rounded-full"
//               />
//               <h2 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">{selectedUser.name}</h2>
//             </div>

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

//             <div className="border-t border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex">
//                 <input
//                   type="text"
//                   placeholder="Type a message..."
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-400"
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

//       {/* New Chat Popup */}
//       {isPopupOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Start a New Chat</h2>
//             <div className="space-y-3">
//               {followersFollowing.map((user) => (
//                 <div
//                   key={user.id}
//                   className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//                   onClick={() => {
//                     console.log('Selected user:', user); // Log the selected user
//                     startNewChat(user); // Call the startNewChat function
//                     closePopup();
//                   }}
//                 >
//                   <img
//                     src={user.profilePicture || 'https://via.placeholder.com/50'}
//                     alt={`${user.name}'s profile`}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <p className="ml-4 text-md font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={closePopup}
//               className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Messenger;

import React, { useState, useEffect } from 'react';
import socket from '../utils/Socket'; // Import the socket instance
import axios from 'axios';

const Messenger = ({ isDarkMode }) => {
  const [selectedChatId, setSelectedChatId] = useState(null); // Selected chat ID
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
  const [users, setUsers] = useState([]); // Chat list
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [messages, setMessages] = useState([]); // Messages in the chat window
  const [newMessage, setNewMessage] = useState(''); // New message input
  const [searchQuery, setSearchQuery] = useState(''); // Search bar query
  const [followersFollowing, setFollowersFollowing] = useState([]); // Followers and following
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup for starting chat

  // Fetch initial data
useEffect(() => {
  const fetchInitialData = async () => {  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated.');
      }
      const userId = localStorage.getItem('userId');

      // Fetch existing chats
      const chatResponse = await axios.get('http://localhost:3000/api/messenger/chats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Process chats to include user details
      const formattedUsers = chatResponse.data.map((chat) => {
        // Find the other participant in the chat
        const otherUser = chat.participants.find(
          (participant) => participant._id !== userId
        );

        return {
          chatId: chat._id,
          name: otherUser?.username || 'Unknown User',
          profilePicture: otherUser?.profilePicture || 'https://via.placeholder.com/50',
          lastMessage: chat.lastMessage?.content || 'Start chatting!',
          isBold: false, // Add any additional fields if needed
        };
      });

      setUsers(formattedUsers);

      // Fetch followers and following
      const response = await axios.get(
        `http://localhost:3000/api/users/followers-following/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Followers/Following data:', response.data);
      setFollowersFollowing(response.data);
    } catch (error) {
      console.error('Error fetching initial data:', error.response?.data || error.message);
    }
  };

  fetchInitialData();
}, []);


  // Initialize Socket.IO
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    const handleMessageReceive = (message) => {
      console.log('Message received from server:', message);
    
      // Prevent adding duplicate messages
      if (message.chatId === selectedChatId && message.sender !== localStorage.getItem('userId')) {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.chatId === message.chatId
              ? { ...user, lastMessage: message.content, isBold: true }
              : user
          );
          return updatedUsers;
        });
      }
    };
    

    // Attach the listener
    socket.on('receiveMessage', handleMessageReceive);

    // Cleanup listener on component unmount or dependency change
    return () => {
      socket.off('receiveMessage', handleMessageReceive);
      socket.disconnect();
    };
  }, [selectedChatId]);

  // Emit joinChat only when selectedChatId changes
  useEffect(() => {
    if (selectedChatId) {
      socket.emit('joinChat', selectedChatId);
    }
  }, [selectedChatId]);

  const startNewChat = async (user) => {
    try {
      console.log('User object:', user); // Log the user object
      const token = localStorage.getItem('token');

      // Use _id instead of id
      if (!user._id) {
        console.error('Receiver ID is missing');
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/api/messenger/chats',
        { receiverId: user._id }, // Use _id as receiverId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const chatId = response.data.chatId;

      setSelectedUser(user);
      setSelectedChatId(chatId);

      if (!users.some((u) => u.chatId === chatId)) {
        setUsers((prevUsers) => [
          { ...user, chatId, lastMessage: '', isBold: false },
          ...prevUsers,
        ]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error.response?.data || error.message);
    }
  };

  const handleUserSelect = async (user) => {
    // Ensure startNewChat is complete before proceeding
    await startNewChat(user);

    // Use the selectedChatId after it is set
    if (!selectedChatId) {
      console.error('Chat ID not set. Cannot fetch messages.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/messenger/chats/${selectedChatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
    }
  };

  const handleSendMessage = async () => {
    console.log('Chat ID:', selectedChatId); // Debugging
    console.log('New Message:', newMessage); // Debugging
  
    if (!newMessage.trim()) {
      console.error('Cannot send an empty message');
      return;
    }
  
    if (!selectedChatId) {
      console.error('Chat ID is missing');
      return;
    }
  
    const userId = localStorage.getItem('userId'); // Assuming you store the authenticated user's ID
    const messageData = {
      sender: userId, // Use the authenticated user's ID
      content: newMessage,
      createdAt: new Date(),
    };
  
    socket.emit('sendMessage', { chatId: selectedChatId, message: messageData });
  
    // Optimistically update the message list
    setMessages((prevMessages) => [...prevMessages, { ...messageData, sender: 'You' }]);
    setNewMessage('');
  
    // Update the lastMessage in the users list
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.chatId === selectedChatId
          ? { ...user, lastMessage: messageData.content, isBold: false }
          : user
      )
    );
  };
  

  const openNewChatPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim(); // Trim whitespace from query
    setSearchQuery(query);

    if (query === '') {
      setSearchResults([]); // Clear results if query is empty
    } else {
      const filteredResults = followersFollowing.filter((user) =>
        user.name && user.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  };

  return (
    <div className={`flex h-[calc(100vh-4rem)] ${isDarkMode ? 'dark' : ''}`}>
      {/* User List */}
      <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          Messages
        </h2>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>
        <div>
          {users.map((user) => (
            <div
              key={user.chatId}
              className="flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={user.profilePicture || 'https://via.placeholder.com/50'}
                alt={`${user.name}'s profile`}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <p className="text-md font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                <p
                  className={`text-sm ${user.isBold ? 'font-bold text-gray-900' : 'text-gray-600 dark:text-gray-400'
                    } truncate`}
                >
                  {user.lastMessage?.content || 'Start chatting!'}
                </p>

              </div>
            </div>
          ))}
          {!users.length && (
            <div className="flex items-center justify-center p-4">
              <button
                onClick={openNewChatPopup}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <span className="text-lg mr-2">+</span> Start Chatting
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-3/5 flex flex-col bg-gray-50 dark:bg-gray-900">
        {selectedUser ? (
          <>
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <img
                src={selectedUser.profilePicture || 'https://via.placeholder.com/50'}
                alt={`${selectedUser.name}'s profile`}
                className="w-10 h-10 rounded-full"
              />
              <h2 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">{selectedUser.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${msg.sender === 'You'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-200'
                      }`}
                  >
                    {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                  </div>
                </div>
              ))}

            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-400"
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

      {/* New Chat Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Start a New Chat</h2>
            <div className="space-y-3">
              {followersFollowing.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    console.log('Selected user:', user); // Log the selected user
                    startNewChat(user); // Call the startNewChat function
                    closePopup();
                  }}
                >
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/50'}
                    alt={`${user.name}'s profile`}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="ml-4 text-md font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={closePopup}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;
