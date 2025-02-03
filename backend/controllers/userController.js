const { User, validateUser} = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const imagekit = require("../config/imageKit");
const  mongoose  = require("mongoose");
const {Notification} = require("../models/Notifications");
const { emitNotification } = require("../config/socketio");
const {Post} = require("../models/Post")
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Server Error" });
      }

      if (result) {
        // Password matched
        const token = generateToken(user);
        res.cookie("token", token);
        return res.json({
          message: "Logged in successfully",
          token,
          userId: user._id, // Send userId in the response
        });
      } else {
        // Invalid credentials
        return res.status(401).json({ message: "Invalid credentials" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const RegisterUser = async (req, res) => {
  try {
    // Validate user input using Joi
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, bio, username, email, password, followers, following } = req.body;
    const file = req.file;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile picture upload
    let profilePictureUrl = "";
    if (file) {
      try {
        console.log("Uploading image...");
        const uploadedImage = await imagekit.upload({
          file: file.buffer, // Multer buffer
          fileName: `${Date.now()}_${file.originalname}`,
          folder: "/UsersDP",
        });
        profilePictureUrl = uploadedImage.url;
      } catch (uploadError) {
        console.error("ImageKit upload failed:", uploadError.message || uploadError);
        return res.status(500).json({ message: "Image upload failed." });
      }
    }

    // Create new user in MongoDB
    const newUser = new User({
      name,
      bio,
      profilePicture: profilePictureUrl,
      username,
      followers,
      following,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Set secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
      token,
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const logoutUser = function (req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  });

  res.status(200).json({ message: "Logged out successfully" });
};


const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const SpecificUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if 'id' is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch the user and populate posts
    const user = await User.findById(id)
      .select("-password -tokens")
      .populate({
        path: "posts",
        select: "images content createdAt likes comments", // Populate only necessary fields
      })
      .populate("followers", "username profilePicture")
      .populate("following", "username profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const followUser = async (req, res) => {
  try {
    const { userId } = req.params; // User to be followed
    const currentUserId = req.userId; // Authenticated user's ID

    // Check if authenticated userId exists
    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Check if user is trying to follow themselves
    if (userId === currentUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    // Fetch documents from the database
    const userToFollow = await User.findById(userId);
    const currentUserDoc = await User.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    if (!currentUserDoc) {
      return res.status(404).json({ message: "Authenticated user not found" });
    }

    // Check if already following
    if (currentUserDoc.following.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You're already following this user" });
    }

    // Update following/followers lists
    currentUserDoc.following.push(userId);
    userToFollow.followers.push(currentUserId);

    // Save the updated documents
    await currentUserDoc.save();
    await userToFollow.save();

    // Create a notification for the user being followed
    const notificationMessage = `${currentUserDoc.username} started following you`;
    const notification = new Notification({
      user: userId,
      sender: currentUserId,
      type: "follow",
      message: notificationMessage,
    });

    const savedNotification = await notification.save();

    // Update the notifications array in the user being followed
    userToFollow.notifications.push(savedNotification._id);
    await userToFollow.save();

    // Emit real-time notification
    emitNotification(userId, {
      sender: {
        username: currentUserDoc.username,
        profilePicture: currentUserDoc.profilePicture,
      },
      type: "follow",
      message: notificationMessage,
      createdAt: new Date(),
    });

    // Respond with success and the updated documents for debugging
    res.status(200).json({
      message: "Followed successfully",
      currentUser: currentUserDoc,
      followedUser: userToFollow,
      notification: savedNotification,
    });
  } catch (error) {
    // Log the error message for debugging
    console.error("Error in followUser:", error);
    res.status(500).json({ error: error.message });
  }
};
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const userToUnfollow = await User.findById(userId);
    const currentUserDoc = await User.findById(currentUserId);

    if (!userToUnfollow)
      return res.status(404).json({ message: "User to unfollow not found" });

    // Check if already not following
    if (!currentUserDoc.following.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You're not following this user" });
    }

    // Remove from following/followers lists
    currentUserDoc.following = currentUserDoc.following.filter(
      (id) => id.toString() !== userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUserDoc.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    res.status(500).json({ error: error.message });
  }
}

;
const notifyUser = async (req, res) => {
  try {
    // Find the user who will receive the notification
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new notification in the Notification model
    const newNotification = new Notification({
      user: user._id,
      sender: req.body.senderId, // Sender's ID passed in the request
      type: req.body.type || 'follow', // Notification type, default to "follow"
      message: req.body.message || 'A new notification for you!', // Custom or default message
    });

    await newNotification.save(); // Save the notification in the database

    // Add the notification to the user's notifications array
    user.notifications.push(newNotification._id);
    await user.save();

    res.status(200).json({ message: 'Notification added successfully', notification: newNotification });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("User ID from params:", userId);

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid user ID format:", userId);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch user and populate notifications
    const user = await User.findById(userId).populate({
      path: "notifications",
      populate: { path: "sender", select: "name username profilePicture" },
    });

    if (!user) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched notifications:", user.notifications);

    res.status(200).json({ notifications: user.notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get followers and following of the logged-in user

const getFollowersAndFollowing = async (req, res) => {
  try {
    let userId = req.params.userId.replace(":", "");
    const { type } = req.query; // Get type from query params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Validate type parameter
    const validTypes = ['followers', 'following'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type specified. Use "followers" or "following".' });
    }

    // Find user and populate only the requested type
    const user = await User.findById(userId)
      .populate(type, 'id name profilePicture');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return only the requested type
    res.status(200).json({
      [type]: user[type].map(item => ({
        id: item._id,
        name: item.name,
        profilePicture: item.profilePicture,
      }))
    });

  } catch (error) {
    console.error('Error fetching followers/following:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// const sendFollowRequest = async (req, res) => {
//   try {
//     const { userId } = req.params; // Target user to send follow request
//     const currentUserId = req.userId; // Authenticated user ID

//     if (userId === currentUserId) {
//       return res.status(400).json({ message: "You can't send a follow request to yourself" });
//     }

//     const targetUser = await User.findById(userId);
//     const currentUser = await User.findById(currentUserId);

//     if (!targetUser || !currentUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // ✅ Check if already following
//     if (currentUser.following.includes(userId)) {
//       return res.status(400).json({ message: "You are already following this user" });
//     }

//     // ✅ Check if a request already exists (prevents duplicates)
//     const existingRequest = targetUser.followRequests.some(req => req.from.toString() === currentUserId);
//     if (existingRequest) {
//       return res.status(400).json({ message: "Follow request already sent" });
//     }

//     // Add follow request
//     targetUser.followRequests.push({ from: currentUserId });
//     await targetUser.save();

//     // Create a notification for the receiving user
//     const notification = new Notification({
//       user: userId,
//       sender: currentUserId,
//       type: "requested",
//       message: `has sent you a follow request.`,
//     });

//     await notification.save();

//     // Add notification to the receiving user's notifications array
//     targetUser.notifications.push(notification._id);
//     await targetUser.save();

//     res.status(200).json({ message: "Follow request sent successfully" });
//   } catch (error) {
//     console.error("Error in sendFollowRequest:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const sendFollowRequest = async (req, res) => {
  try {
    const { userId } = req.params; // Target user
    const currentUserId = req.userId; // Authenticated user

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You can't send a follow request to yourself" });
    }

    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if already following (prevents redundant requests)
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    // ✅ Check if request already exists (prevents duplicates)
    const existingRequest = targetUser.followRequests.some(req => req.from.toString() === currentUserId);
    if (existingRequest) {
      return res.status(400).json({ message: "Follow request already sent" });
    }

    // ✅ Add receiver to sender's sentRequests (NEW CODE)
    currentUser.sentRequests.push(userId);
    await currentUser.save();

    // ✅ Add new follow request
    targetUser.followRequests.push({ from: currentUserId });
    await targetUser.save();

    // ✅ Create notification for request
    const notification = new Notification({
      user: userId,
      sender: currentUserId,
      type: "requested",
      message: `has sent you a follow request.`,
    });

    await notification.save();

    // ✅ Add notification to user
    targetUser.notifications.push(notification._id);
    await targetUser.save();

    res.status(200).json({ message: "Follow request sent successfully" });
  } catch (error) {
    console.error("Error in sendFollowRequest:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const acceptFollowRequest = async (req, res) => {
  try {
    const { userId } = req.params; // Requester's ID
    const currentUserId = req.userId; // Authenticated user

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(userId);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure the requester is not already a follower
    if (currentUser.followers.includes(userId)) {
      return res.status(400).json({ message: "User is already a follower" });
    }

    // ✅ Find and remove the follow request
    currentUser.followRequests = currentUser.followRequests.filter(req => req.from.toString() !== userId);
    
    // ✅ Add user to followers and following
    currentUser.followers.push(userId);
    requester.following.push(currentUserId);

    await currentUser.save();
    await requester.save();

    // ✅ Remove the notification for the follow request
    await Notification.findOneAndDelete({
      user: currentUserId,
      sender: userId,
      type: "requested",
    });

    // ✅ Create a new notification for successful follow
    const newNotification = new Notification({
      user: currentUserId,
      sender: userId,
      type: "follow",
      message: "started following you",
    });

    await newNotification.save();
    currentUser.notifications.push(newNotification._id);
    await currentUser.save();

    res.status(200).json({ 
      message: "Follow request accepted successfully",
      updatedFollowers: currentUser.followers,
      updatedFollowRequests: currentUser.followRequests
    });

  } catch (error) {
    console.error("Error in accepting follow request:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const rejectFollowRequest = async (req, res) => {
  try {
    const { userId } = req.params; // Requester ID
    const currentUserId = req.userId;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Remove the follow request
    currentUser.followRequests = currentUser.followRequests.filter(req => req.from.toString() !== userId);
    await currentUser.save();

    // ✅ Remove the notification for this request
    await Notification.findOneAndDelete({
      user: currentUserId,
      sender: userId,
      type: "requested",
    });

    res.status(200).json({ message: "Follow request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getFollowRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("followRequests.from", "username profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Extract only sent requests
    const sentRequests = user.followRequests.map((req) => ({
      to: req.from._id,
      username: req.from.username,
      profilePicture: req.from.profilePicture,
    }));

    res.status(200).json({ sentRequests }); // ✅ Return as object
  } catch (error) {
    console.error("Error fetching follow requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const RequestedUsers  = async (req, res) => {
  try {
    // Notification model mein sender=current user aur type=requested dhoondo
    const sentNotifications = await Notification.find({
      sender: req.userId,  // AuthenticateUser middleware se aaya hai
      type: "requested"    // Kyuki friend request ka type 'requested' hai
    })
    .populate("user", "username profilePicture")  // Recipient ki details lekar aao
    .sort({ createdAt: -1 });  // Latest pehle

    // Sirf users ki list extract karo
    const sentUsers = sentNotifications.map(notif => notif.user);
    
    res.json(sentUsers);
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ error: "Server ki galti, phir try karein" });
  }
}

const RecievedRequests = async (req, res) => {
  try {
    // Notification model mein user=current user aur type=requested dhoondo
    const receivedNotifications = await Notification.find({
      user: req.userId,     // Jisne request receive ki hai
      type: "requested"     // Friend request type
    })
    .populate("sender", "username profilePicture")  // Sender ki details
    .sort({ createdAt: -1 });

    // Sender users ko extract karo
    const receivedUsers = receivedNotifications.map(notif => notif.sender);
    
    res.json(receivedUsers);
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ error: "Server mein dikkat, baad mein try karein" });
  }
}

// Backend: Get sent follow requests
const getSentFollowRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("sentRequests");
    res.status(200).json(user.sentRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserSentimentStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove the user ID comparison check unless you need strict ownership
    // if (req.userId !== userId) {
    //   return res.status(403).json({ error: 'Unauthorized access' });
    // }

    // Get all posts for the user with overallSentiment
    const userPosts = await Post.find({ 
      userId: userId,
      overallSentiment: { $exists: true } // Only count posts with sentiment analysis
    });

    if (!userPosts.length) {
      return res.json({ positive: 0, neutral: 0, negative: 0 });
    }

    // Count sentiments
    const sentimentCounts = userPosts.reduce((acc, post) => {
      acc[post.overallSentiment] += 1;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    // Calculate percentages
    const totalPosts = userPosts.length;
    const sentimentPercentages = {
      positive: ((sentimentCounts.positive / totalPosts) * 100).toFixed(1),
      neutral: ((sentimentCounts.neutral / totalPosts) * 100).toFixed(1),
      negative: ((sentimentCounts.negative / totalPosts) * 100).toFixed(1),
    };

    res.json(sentimentPercentages);

  } catch (error) {
    console.error('Error fetching sentiment stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getFollowStatus = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.userId;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    // Check existing relationship
    const status = {
      isFollowing: currentUser.following.includes(targetUserId),
      hasPendingRequest: targetUser.followRequests.some(
        req => req.from.toString() === currentUserId && req.status === 'pending'
      )
    };

    let finalStatus = 'none';
    if (status.isFollowing) finalStatus = 'following';
    else if (status.hasPendingRequest) finalStatus = 'requested';

    res.status(200).json({ status: finalStatus });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getCurrentUser =  async (req, res) => {
  try {

      const userId = req.params;
      // // Authorization check
      // if (req.params.userId !== req.userId) {
      //     return res.status(403).json({ message: "Unauthorized access" });
      // }

      const user = await User.findById(req.userId)
          .select('-password -followers -following -posts');
          
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  LoginUser,
  RegisterUser,
  getUsers,
  SpecificUser,
  logoutUser,
  followUser,
  unfollowUser,
  notifyUser,
  getUserNotifications,
  getFollowersAndFollowing,
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  getFollowRequests,
  RequestedUsers,
  RecievedRequests,
  getSentFollowRequests,
  getUserSentimentStats,
  getFollowStatus, 
  getCurrentUser,
};
