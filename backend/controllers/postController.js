const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // Adjust the path based on your file structure
const imagekit = require('../config/imageKit'); // Import ImageKit configuration

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ message: "User ID is missing" });
    }

    let imageUrl = null;
    if (req.file) {
      // Upload the image to ImageKit
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer, // file is a base64 or binary
        fileName: req.file.originalname, // original file name
        folder: "/posts", // optional folder in ImageKit
      });
      imageUrl = uploadedImage.url; // Get the URL from ImageKit response
    }

    // Create a new post instance
    const newPost = new Post({
      userId,
      content,
      image: imageUrl, // Store ImageKit URL in the post model
      comments: [],
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    // Send the created post as a response
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username') // Populate userId with username
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username' }, // Populate userId for each comment
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};


const likePost = async (req, res) => {
  try {
      const userId = req.userId; // Assuming the middleware sets req.userId
      const postId = req.params.id; // Get post ID from request parameters

      // Fetch the post by ID
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });

      // Ensure the likes array is initialized
      if (!post.likes) {
          post.likes = []; // Initialize as an empty array if undefined
      }

      // Check if the user has liked the post
      if (post.likes.includes(userId)) {
          // User already liked the post, so unlike it
          post.likes.pull(userId);
          post.hasLiked = false; // Update hasLiked status
      } else {
          // User has not liked the post, so like it
          post.likes.push(userId);
          post.hasLiked = true; // Update hasLiked status
      }

      // Save the updated post
      const updatedPost = await post.save();  

      // Return the updated post
      return res.status(200).json({ post: updatedPost, hasLiked: post.hasLiked });
  } catch (error) {
      console.error("Error liking post:", error);
      return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createPost, getPosts, likePost };

