const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // Adjust the path based on your file structure

// Route to create a new post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;
    const image = req.file ? req.file.buffer.toString('base64') : null;

    
    if (!userId) {
       return res.status(403).json({ message: "User ID is missing" }); // Handle case if userId is not found
   }
    // Create a new post instance
    const newPost = new Post({
      userId,
      content,
      image,
    });

    console.log(newPost); 

    // Save the post to the database
    const savedPost = await newPost.save();

    // Send the created post as a response
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Route to get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("comments");
    // Send the posts as a response
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createPost, getPosts };
