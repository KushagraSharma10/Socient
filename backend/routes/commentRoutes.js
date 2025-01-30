const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment"); // Import the Comment model
const createComment = require("../controllers/commentController");
const authenticateToken = require("../middlewares/authenticateToken");
const Post = require("../models/Post");
const axios = require("axios");


// router.post("/:postId/comments", authenticateToken, async (req, res) => {
//   try {
//     const { content, userDp } = req.body;
//     const { postId } = req.params;

//     console.log("Post ID:", postId); // Debugging line to log the postId

//     // Send comment content to AI model for sentiment analysis
//     const sentimentResponse = await axios.post(
//       "http://127.0.0.1:5000/analyze-comment",
//       { content }
//     );
//     const sentiment = sentimentResponse.data.sentiment;

//     const comment = new Comment({
//       postId,
//       content,
//       userId: req.userId, // Use the user ID from JWT
//       sentiment: sentiment, // Save the sentiment from the AI model
//       userDp: userDp || "https://via.placeholder.com/50",
//     });

//     // Save the comment to the database
//     await comment.save();

//     // Fetch the post to ensure it exists and to update comments
//     const post = await Post.findById(postId);

//     if (!post) {
//       console.error(`Post not found for ID: ${postId}`); // Log the error for debugging
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Ensure that the comments array exists
//     if (!post.comments) {
//       post.comments = []; // Initialize the array if undefined
//     }

//     post.comments.push(comment._id); // Use the saved comment's ID
//     await post.save();
//     // Fetch all comments for the post to calculate overall sentiment
//     const commentsData = await Comment.find({ postId }).select("content");

//     // Extract comment strings
//     const comments = commentsData.map((comment) => comment.content);

//     // Send the comments to the Flask API for overall sentiment analysis
//     const overallSentimentResponse = await axios.post(
//       "http://127.0.0.1:5000/analyze-sentiment",
//       { comments }
//     );
//     const overallSentiment = overallSentimentResponse.data.overall;

//     // Update the post's overall sentiment
//     post.overallSentiment = overallSentiment;
//     await post.save();

//     console.log("Comment saved with sentiment:", comment);
//     console.log("Saving comment:", {
//       postId,
//       userId: req.userId,
//       content,
//       userDp,
//       sentiment,
//     });
//     console.log("Request body:", req.body);

//     // Return success response with the saved comment and overall sentiment
//     res.status(201).json({
//       message: "Comment created successfully",
//       comment,
//       overallSentiment, // Return the overall sentiment
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Error creating comment" });
//   }
// });

router.post("/:postId/comments", authenticateToken, createComment);


router.get("/:postId/comments", async (req, res) => {
  // Logic to fetch comments for a specific post
});

// Example route for deleting a comment
router.delete("/:postId/comments/:commentId", async (req, res) => {
  // Logic to delete a comment
});

// Other comment-related routes...

module.exports = router;
