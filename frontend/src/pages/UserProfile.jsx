
const UserProfile = ({ user }) => {
    const defaultImage = "https://via.placeholder.com/150"; // Default DP

    return (
        
      <div className="max-w-4xl mx-auto p-4 mt-5">
        {/* Header Section */}
        <div className="flex  lg:flex lg:items-start  lg:justify-between mb-4">
          
          {/* Profile Picture */}
          <div className="mb-4 lg:mb-0 lg:mr-8">
            <img
              src={user.profilePicture || defaultImage}
              alt={user.username}
              className="w-28 h-28 lg:w-40 lg:h-40 rounded-full object-cover"
            />
          </div>
  
          {/* User Info Section */}
          <div className="flex flex-col lg:flex-1">
            
            {/* Username and Edit Profile Button */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl lg:text-3xl lg:pl-4 font-bold">{user.username}</h1>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Edit Profile
              </button>
            </div>
  
            {/* User Stats (Posts, Followers, Following) */}
            <div className="flex justify-between lg:justify-start lg:space-x-6 lg:mt-2 mb-2">
              <div className="text-center">
                <p className="font-bold">{user.posts.length}</p>
                <p className="text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{user.followers}</p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{user.following}</p>
                <p className="text-gray-500">Following</p>
              </div>
            </div>
  
            {/* Full Name */}
            <div className="text-lg font-semibold">{user.fullName}</div>
  
            {/* Bio */}
            <div className="text-gray-700">{user.bio}</div>
          </div>
        </div>
  
        {/* Posts Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {user.posts.map((post, index) => (
              <div key={index} className="w-full h-[20vw] bg-gray-100">
                <img
                  src={post.image}
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default UserProfile