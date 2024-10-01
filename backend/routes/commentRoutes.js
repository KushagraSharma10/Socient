const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // Import the Comment model
const createComment = require('../controllers/commentController');
const authenticateToken = require('../middlewares/authenticateToken');
const Post = require('../models/Post');
const axios = require('axios')

// router.post('/:postId/comments', authenticateToken, async (req, res) => {

//   try {
//     const { content, userDp, sentiment } = req.body; 
//     const { postId } = req.params;

//     console.log("Post ID:", postId); // Debugging line to log the postId

//     const comment = new Comment({
//       postId,
//       content,
//       userId: req.userId, // Use the user ID from JWT
//       sentiment: sentiment || "Neutral",
//       userDp: userDp || "https://via.placeholder.com/50",
//     });

//     // Save the comment to the database
//     await comment.save();

//     // Update the post with the new comment
//     const post = await Post.findOneAndUpdate(postId);
    
//     if (!post) {
//       console.error(`Post not found for ID: ${postId}`); // Log the error for debugging
//       return res.status(404).json({ message: "Post not found" });
//     }

//     post.comments.push(comment._id); // Use the saved comment's ID
//     await post.save();

//     console.log("Saving comment:", { postId, userId: req.userId, content, userDp, sentiment });
//     console.log('Request body:', req.body);

//     // Return success response with the saved comment
//     res.status(201).json({
//       message: "Comment created successfully",
//       comment,
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Error creating comment" });
//   }
// });


// Example route for creating a comment
// router.post('/:postId/comments',createComment);
// router.post('/:postId/comments', async (req, res) => {
//   try {
//     const { content, userId, userDp, sentiment } = req.body;
//     const { postId } = req.params;

//     // Create the comment object
//     const comment = new Comment({
//       postId,
//       content,
//       userId,
//       sentiment: sentiment || "Neutral", // Default to 'Neutral' if not provided
//       userDp: userDp || "https://via.placeholder.com/50", // Default profile picture
//     });

//     // Save the comment to the database
//     await comment.save();

//     // Update the post to include the new comment
//     const post = await Post.findById(postId);
//     post.comments.push(comment._id); // Use the saved comment's ID
//     await post.save();

//     console.log("Saving comment:", { postId, userId, content, userDp, sentiment });
//     console.log('Request body:', req.body);

//     // Return success response with the saved comment
//     res.status(201).json({
//       message: "Comment created successfully",
//       comment,
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Error creating comment" });
//   }
// });

// router.post('/:postId/comments', authenticateToken, async (req, res) => {
//   try {
//     const { content, userDp, sentiment } = req.body; // Do not extract userId from req.body
//     const { postId } = req.params;

//     // Use req.userId instead of the userId passed in the body
//     const comment = new Comment({
//       postId,
//       content,
//       userId: req.userId, // Use the user ID from JWT
//       sentiment: sentiment || "Neutral",
//       userDp: userDp || "https://via.placeholder.com/50",
//     });

//     // Save the comment to the database
//     await comment.save();

//     // Update the post with the new comment
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     post.comments.push(comment._id); // Use the saved comment's ID
//     await post.save();

//     console.log("Post ID:", postId); // Add this line for debugging
//     console.log("Saving comment:", { postId, userId: req.userId, content, userDp, sentiment });
//     console.log('Request body:', req.body);

//     // Return success response with the saved comment
//     res.status(201).json({
//       message: "Comment created successfully",
//       comment,
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Error creating comment" });
//   }
// });

// router.post('/:postId/comments', authenticateToken, async (req, res) => {
//   try {
//     const { content, userDp, sentiment } = req.body; 
//     const { postId } = req.params;

//     const comment = new Comment({
//       postId,
//       content,
//       userId: req.userId, // Use the user ID from JWT
//       sentiment: sentiment || "Neutral",
//       userDp: userDp || "https://via.placeholder.com/50",
//     });

//     // Save the comment to the database
//     await comment.save();

//     // Update the post with the new comment
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     post.comments.push(comment._id); // Use the saved comment's ID
//     await post.save();

//     console.log("Saving comment:", { postId, userId: req.userId, content, userDp, sentiment });
//     console.log('Request body:', req.body);

//     // Return success response with the saved comment
//     res.status(201).json({
//       message: "Comment created successfully",
//       comment,
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Error creating comment" });
//   }
// });




// Example route for getting comments for a post
// router.post('/:postId/comments', authenticateToken, async (req, res) => {
//   try {
//     const { content, userDp,} = req.body; 
//     const { postId } = req.params;

//     console.log("Post ID:", postId); // Debugging line to log the postId
//     const sentimentResponse = await axios.post('http://127.0.0.1:5000/analyze-sentiment', { comment: content });
//     const sentiment = sentimentResponse.data.sentiment;


//     const comment = new Comment({
//       postId,
//       content,
//       userId: req.userId, // Use the user ID from JWT
//       sentiment: sentiment,
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

//     console.log("Comment saved with sentiment:", comment);
//     console.log("Saving comment:", { postId, userId: req.userId, content, userDp, sentiment });
//     console.log('Request body:', req.body);

//     // Return success response with the saved comment
//     res.status(201).json({
//       message: "Comment created successfully",
//       comment,
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Error creating comment" });
//   }
// });

// router.post('/:postId/comments', authenticateToken, async (req, res) => {
//   try {
//       const { content, userDp } = req.body; 
//       const { postId } = req.params;

//       console.log("Post ID:", postId); // Debugging line to log the postId
//       // Send comment content to AI model for sentiment analysis
//       const sentimentResponse = await axios.post('http://127.0.0.1:5000/analyze-sentiment', { comment: content });
//       const sentiment = sentimentResponse.data.sentiment;

//       const comment = new Comment({
//           postId,
//           content,
//           userId: req.userId, // Use the user ID from JWT
//           sentiment: sentiment, // Save the sentiment from the AI model
//           userDp: userDp || "https://via.placeholder.com/50",
//       });

//       // Save the comment to the database
//       await comment.save();

//       // Fetch the post to ensure it exists and to update comments
//       const post = await Post.findById(postId);
      
//       if (!post) {
//           console.error(`Post not found for ID: ${postId}`); // Log the error for debugging
//           return res.status(404).json({ message: "Post not found" });
//       }

//       // Ensure that the comments array exists
//       if (!post.comments) {
//           post.comments = []; // Initialize the array if undefined
//       }

//       post.comments.push(comment._id); // Use the saved comment's ID
//       await post.save();

//       console.log("Comment saved with sentiment:", comment);
//       console.log("Saving comment:", { postId, userId: req.userId, content, userDp, sentiment });
//       console.log('Request body:', req.body);

//       // Return success response with the saved comment
//       res.status(201).json({
//           message: "Comment created successfully",
//           comment,
//       });
//   } catch (error) {
//       console.error("Error creating comment:", error);
//       res.status(500).json({ message: "Error creating comment" });
//   }
// });

router.post('/:postId/comments', authenticateToken, async (req, res) => {
  try {
      const { content, userDp } = req.body; 
      const { postId } = req.params;

      console.log("Post ID:", postId); // Debugging line to log the postId
      // Send comment content to AI model for sentiment analysis
      const sentimentResponse = await axios.post('http://127.0.0.1:5000/analyze-comment', { content });
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

      console.log("Comment saved with sentiment:", comment);
      console.log("Saving comment:", { postId, userId: req.userId, content, userDp, sentiment });
      console.log('Request body:', req.body);

      // Return success response with the saved comment
      res.status(201).json({
          message: "Comment created successfully",
          comment,
      });
  } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Error creating comment" });
  }
});



router.get('/:postId/comments', async (req, res) => {
  // Logic to fetch comments for a specific post
});

// Example route for deleting a comment
router.delete('/:postId/comments/:commentId', async (req, res) => {
  // Logic to delete a comment
});

// Other comment-related routes...

module.exports = router;
