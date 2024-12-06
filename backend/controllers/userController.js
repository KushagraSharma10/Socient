const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const imagekit = require("../config/imageKit");
const { mongoose } = require("mongoose");
const Notification = require("../models/Notifications");
const { emitNotification } = require("../config/socketio");

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

// const RegisterUser = async (req, res) => {
//   try {
//     const { name, bio, username, email, password, followers,  following } = req.body;
//     const file = req.file;

//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "User already exists. Please log in." });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Handle profile picture upload
//     let profilePictureUrl = "";
//     if (file) {
//       try {
//         const uploadedImage = await imagekit.upload({
//           file: req.file.buffer,
//           fileName: `${Date.now()}_${req.file.originalname}`,
//           folder: "/UsersDP",
//         });
//         profilePictureUrl = uploadedImage.url;
//       } catch (uploadError) {
//         console.error("ImageKit upload failed:", uploadError);
//         return res.status(500).json({ message: "Image upload failed." });
//       }
//     }

//     // Create new user in MongoDB
//     const newUser = await User.create({
//       name,
//       bio,
//       profilePicture: profilePictureUrl,
//       username,
//       followers,
//       following,
//       email,
//       password: hashedPassword,
//     });

//     // Generate token
//     const token = generateToken(newUser);

//     // Set cookie and respond
//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "Strict",
//     });

//     return res.status(201).json({
//       message: "User created successfully",
//       userId: newUser._id,   // Send userId in the response
//       token,
//     });
//   } catch (err) {
//     console.error("Error during user registration:", err);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

const RegisterUser = async (req, res) => {
  try {
    const { name, bio, username, email, password, followers, following } =
      req.body;
    const file = req.file;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile picture upload
    let profilePictureUrl = "";
    if (file) {
      try {
        console.log("Attempting to upload image...");

        // Check buffer size to confirm it's populated
        console.log("Buffer size:", file.buffer.length);

        const uploadedImage = await imagekit.upload({
          file: file.buffer, // file.buffer from multer
          fileName: `${Date.now()}_${file.originalname}`,
          folder: "/UsersDP",
        });

        profilePictureUrl = uploadedImage.url;
      } catch (uploadError) {
        console.error(
          "ImageKit upload failed:",
          uploadError.message || uploadError
        );
        return res.status(500).json({ message: "Image upload failed." });
      }
    }

    // Create new user in MongoDB
    const newUser = await User.create({
      name,
      bio,
      profilePicture: profilePictureUrl,
      username,
      followers,
      following,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser);

    // Set cookie and respond
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
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
  res.clearCookie("token"); // Clear the authentication cookie
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

    // Validate if 'id' is a valid MongoDB ObjectId using Mongoose's isValidObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch the user, excluding sensitive fields like password and tokens
    const user = await User.findById(id)
      .select("-password -tokens")
      .populate("posts", "images content createdAt") // Assuming user has posts, adjust as per your schema
      .populate("followers", "username profilePicture") // Adjust this as needed
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

// const followUser = async (req, res) => {
//   try {
//     const { userId } = req.params; // User to be followed
//     const currentUserId = req.userId; // Authenticated user's ID

//     // Check if authenticated userId exists
//     if (!currentUserId) {
//       return res.status(401).json({ message: "Unauthorized: User ID missing" });
//     }

//     // Check if user is trying to follow themselves
//     if (userId === currentUserId) {
//       return res.status(400).json({ message: "You can't follow yourself" });
//     }

//     // Fetch documents from the database
//     const userToFollow = await User.findById(userId);
//     const currentUserDoc = await User.findById(currentUserId);

//     // Log the fetched user documents
//     console.log("User to Follow:", userToFollow);
//     console.log("Current User Doc:", currentUserDoc);

//     if (!userToFollow) {
//       return res.status(404).json({ message: "User to follow not found" });
//     }

//     if (!currentUserDoc) {
//       return res.status(404).json({ message: "Authenticated user not found" });
//     }

//     // Check if already following
//     if (currentUserDoc.following.includes(userId)) {
//       return res
//         .status(400)
//         .json({ message: "You're already following this user" });
//     }

//     // Update following/followers lists
//     currentUserDoc.following.push(userId);
//     userToFollow.followers.push(currentUserId);

//     // Save the updated documents
//     await currentUserDoc.save();
//     await userToFollow.save();

//     // Create a notification for the user being followed
//     const notification = new Notification({
//       user: userId,
//       sender: currentUserId,
//       type: "follow",
//       message: `${currentUserDoc.username} started following you`,
//       createdAt: new Date(),
//     });

//     await notification.save();

//     // Emit real-time notification
//     emitNotification(userId, {
//       sender: {
//         username: currentUserDoc.username,
//         profilePicture: currentUserDoc.profilePicture,
//       },
//       type: "follow",
//       message: `${currentUserDoc.username} started following you`,
//       createdAt: new Date(),
//     });

//     // Respond with success and the updated documents for debugging
//     res.status(200).json({
//       message: "Followed successfully",
//       currentUser: currentUserDoc,
//       followedUser: userToFollow,
//       notification,
//     });
//   } catch (error) {
//     // Log the error message for debugging
//     console.error("Error in followUser:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

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
};

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
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate('followers', 'id name profilePicture')
      .populate('following', 'id name profilePicture');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const followersFollowing = [
      ...user.followers.map(follower => ({ id: follower._id, ...follower.toObject() })),
      ...user.following.map(following => ({ id: following._id, ...following.toObject() })),
    ];

    res.status(200).json(followersFollowing);
  } catch (error) {
    console.error('Error fetching followers/following:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


const sendFollowRequest = async (req, res) => {
  try {
    const { userId } = req.params; // Target user to send follow request
    const currentUserId = req.userId; // Authenticated user ID

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You can't send a follow request to yourself" });
    }

    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a request already exists
    const existingRequest = targetUser.followRequests.find((req) => req.from.toString() === currentUserId);
    if (existingRequest) {
      return res.status(400).json({ message: "Follow request already sent" });
    }

    // Add follow request
    targetUser.followRequests.push({ from: currentUserId });
    await targetUser.save();

    // Create a notification for the receiving user
    const notification = new Notification({
      user: userId,
      sender: currentUserId,
      type: "requested",
      message: `${currentUser.username} has sent you a follow request.`,
    });

    await notification.save();

    // Add notification to the receiving user's notifications array
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
    const { userId } = req.params; // ID of the requester
    const currentUserId = req.userId; // ID of the current logged-in user

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(userId);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the follow request
    const requestIndex = currentUser.followRequests.findIndex(
      (req) => req.from.toString() === userId
    );

    if (requestIndex === -1) {
      return res.status(400).json({ message: "Follow request not found" });
    }

    // Accept the follow request
    currentUser.followRequests.splice(requestIndex, 1);
    currentUser.followers.push(userId);
    requester.following.push(currentUserId);

    // Update the corresponding notification
    const notification = await Notification.findOne({
      user: currentUserId,
      sender: userId,
      type: "requested",
    });

    if (notification) {
      notification.type = "follow";
      notification.message = `${requester.username} started following you.`;
      await notification.save();
    }

    await currentUser.save();
    await requester.save();

    res.status(200).json({ message: "Follow request accepted successfully" });
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

    const requestIndex = currentUser.followRequests.findIndex(
      (req) => req.from.toString() === userId
    );

    if (requestIndex === -1) {
      return res.status(400).json({ message: "Follow request not found" });
    }

    // Reject the request
    currentUser.followRequests.splice(requestIndex, 1);
    await currentUser.save();

    res.status(200).json({ message: "Follow request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    res.status(500).json({ message: "Server error" });
  }
};


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
};
