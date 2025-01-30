const express = require("express");
const router = express.Router();
const { Post } = require("../models/Post"); // Adjust the path based on your file structure
const imagekit = require("../config/imageKit"); // Import ImageKit configuration
const {User} = require("../models/User");
const mongoose = require("mongoose");



// const createPost = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const userId = req.userId; // Ensure this is correctly passed from middleware

//     // Check if userId exists
//     if (!userId) {
//       return res.status(403).json({ message: "User is not authenticated" });
//     }

//     // Initialize an array to store image URLs
//     let imageUrls = [];

//     // Check if multiple files are provided
//     if (req.files && req.files.length > 0) {
//       try {
//         // Iterate over each file and upload it to ImageKit
//         for (const file of req.files) {
//           const uploadedImage = await imagekit.upload({
//             file: file.buffer, // File content (buffer from multer memoryStorage)
//             fileName: file.originalname, // Original file name
//             folder: "/posts", // Specify folder in ImageKit
//           });
//           imageUrls.push(uploadedImage.url); // Store image URL in the array
//         }
//       } catch (uploadError) {
//         console.error("Image upload failed:", uploadError);
//         return res.status(500).json({ message: "Image upload failed" });
//       }
//     }

//     // Create a new post instance with multiple image URLs
//     const newPost = new Post({
//       userId, // Associate post with userId
//       content,
//       images: imageUrls, // Store array of ImageKit URLs
//       comments: [], // Initialize empty comments array
//     });

//     // Save the post in the database
//     const savedPost = await newPost.save();

//     // Populate user details in the saved post
//     const populatedPost = await Post.findById(savedPost._id).populate('userId', 'username profilePicture');

//      // Update the user's posts array
//      await User.findByIdAndUpdate(
//       userId,
//       { $push: { posts: populatedPost._id } }, // Push the new post's ID into the user's posts array
//       { new: true }
//     );


//     // Send the created post in the response
//     res.status(201).json(populatedPost);
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ message: "An error occurred while creating the post" });
//   }
// };

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ message: "User is not authenticated" });
    }

    let imageUrls = [];

    console.log("Uploaded Files:", req.files); // ✅ Debugging step

    if (req.files && req.files.length > 0) {
      try {
        // ✅ Upload all images in parallel using Promise.all
        imageUrls = await Promise.all(
          req.files.map(async (file) => {
            const uploadedImage = await imagekit.upload({
              file: file.buffer,
              fileName: file.originalname,
              folder: "/posts",
            });
            return uploadedImage.url;
          })
        );
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    console.log("Final Image URLs:", imageUrls); // ✅ Debugging step

    const newPost = new Post({
      userId,
      content,
      images: imageUrls, // ✅ This should now have multiple image URLs
      comments: [],
    });

    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id).populate(
      "userId",
      "username profilePicture"
    );

    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: populatedPost._id } },
      { new: true }
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "An error occurred while creating the post" });
  }
};


const getPosts = async (req, res) => {
  try {
      const currentUserId = req.userId; // Get authenticated user's ID

      const posts = await Post.find()
          .populate("userId", "username profilePicture") // Populate post owner details
          .populate({
              path: "comments",
              populate: { path: "userId", select: "username profilePicture" },
          })
          .populate("likes", "username _id") // Populate likes with usernames & IDs
          .lean(); // Convert Mongoose docs to plain objects

      // Format posts to return likedUsers and correctly calculate hasLiked
      const enrichedPosts = posts.map((post) => ({
          ...post,
          likedUsers: post.likes.map(user => user.username), // Convert likes to usernames
          hasLiked: post.likes.some(like => like._id.toString() === currentUserId.toString()), // Check if current user has liked
      }));

      res.status(200).json(enrichedPosts);
  } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "An error occurred while fetching the posts" });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasLiked = post.likes.includes(userId);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      hasLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } }, 
      { new: true }
    ).populate("likes", "username"); // Populate usernames of users who liked

    return res.status(200).json({
      postId: updatedPost._id,
      hasLiked: !hasLiked,
      likedUsers: updatedPost.likes.map(user => user.username), // Return liked users
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




module.exports = { createPost, getPosts, toggleLike };
