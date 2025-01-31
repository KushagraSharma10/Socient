const {Comment} = require("../models/Comment");
const {Post} = require('../models/Post'); 
const axios = require("axios");


const createComment = async (req, res) => {
    try {
      const { content, userDp } = req.body;
      const { postId } = req.params;
  
      console.log("Post ID:", postId); // Debugging line to log the postId
  
      // Send comment content to AI model for sentiment analysis
      const sentimentResponse = await axios.post(
        "http://127.0.0.1:5000/analyze-comment",
        { content }
      );
      const sentiment = sentimentResponse.data.sentiment;
  
      const comment = new Comment({
        postId,
        content,
        userId: req.userId, // Use the user ID from JWT
        sentiment: sentiment, // Save the sentiment from the AI model
        userDp: userDp || "https://via.placeholder.com/50",
      });
  
      // Save the comment to the database
      await comment.save();
  
      // Fetch the post to ensure it exists and to update comments
      const post = await Post.findById(postId);
  
      if (!post) {
        console.error(`Post not found for ID: ${postId}`); // Log the error for debugging
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Ensure that the comments array exists
      if (!post.comments) {
        post.comments = []; // Initialize the array if undefined
      }
  
      post.comments.push(comment._id); // Use the saved comment's ID
      await post.save();
  
      // Fetch all comments for the post to calculate overall sentiment
      const commentsData = await Comment.find({ postId }).select("content");
  
      // Extract comment strings
      const comments = commentsData.map((comment) => comment.content);
  
      // Send the comments to the Flask API for overall sentiment analysis
      const overallSentimentResponse = await axios.post(
        "http://127.0.0.1:5000/analyze-sentiment",
        { comments }
      );
      const overallSentiment = overallSentimentResponse.data.overall;
  
      // Update the post's overall sentiment
      post.overallSentiment = overallSentiment;
      await post.save();
  
      // ** Populate the user data in the comment response **
      const populatedComment = await Comment.findById(comment._id).populate('userId', 'username profilePicture');
  
  
      console.log("Comment saved with sentiment:", populatedComment);
      console.log("Saving comment:", {
        postId,
        userId: req.userId,
        content,
        userDp,
        sentiment,
      });
      console.log("Request body:", req.body);
  
      // Return success response with the saved comment and overall sentiment
      res.status(201).json({
        message: "Comment created successfully",
        comment: populatedComment,  // Now returns the populated comment with username and profile picture
        overallSentiment,           // Return the overall sentiment
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Error creating comment" });
    }
  }

  const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.userId; // set by authenticateUser
  
      // 1. Find the comment
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      // 2. Check if current user is the owner
      if (comment.userId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not allowed to delete this comment" });
      }
  
      // 3. Delete the comment
      await Comment.findByIdAndDelete(commentId);
  
      // 4. Return success response
      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

const getAllComments = async (req, res) => {
  try {
    const { postId } = req.query;
    
    // ✅ Convert `postId` to ObjectId if provided
    const filter = postId ? { postId: new mongoose.Types.ObjectId(postId) } : {}; 

    const comments = await Comment.find(filter)
      .populate("userId", "username profilePicture")
      .sort({ timestamp: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const specificComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate("userId", "username profilePicture");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

  module.exports = {
    createComment,
    deleteComment,
    getAllComments,
    specificComment,  
  };