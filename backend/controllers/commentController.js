const Comment = require("../models/Comment");
const Post = require('../models/Post'); 

// const createComment = async (req, res) => {
//   try {
//     const { content, userId, userDp, sentiment } = req.body; // Changed userID to userId for consistency
//     const { postId } = req.params;

//     // Validate that the required fields are provided
//     if (!content || !userId) {
//       return res
//         .status(400)
//         .json({ message: "Content and User ID are required" });
//     }

//     // Create the comment object
//     const comment = new Comment({
//       postId,
//       content,
//       userId, // Use the correct field name
//       sentiment: sentiment || "Neutral", // Default to 'Neutral' if not provided
//       userDp: userDp || "https://via.placeholder.com/50", // Default profile picture
//     });

//     // Save the comment to the database
//     await comment.save(); 

//     // Update the post to include the new comment (optional)
//     const post = await Post.findById(postId);
//     post.comments.push(Comment._id);
//     await post.save();

//     console.log("Saving comment:", { postId, userId, content, userDp, sentiment });


//     // Return success response with the saved comment
//     res.status(201).json({
//       message: "Comment created successfully",
//       comment,
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     res.status(500).json({ message: "Error creating comment" });
//   }
// };

// const createComment = async (req, res) => {
//   try {
//     const { content, userDp, sentiment } = req.body;
//     const { postId } = req.params;

//     // Create the comment object
//     const comment = new Comment({
//       postId,
//       content,
//       userId: req.body.userId,
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
// };

// const createComment = async (req, res) => {
//   try {
//     const { content, userDp, userId, sentiment } = req.body;
//     const postId = req.params.id; // Assuming you send the postId in the URL
   

//     // Create a new comment
//     const newComment = new Comment({
//       postId,
//       userId,
//       content,
//       userDp: userDp || "https://via.placeholder.com/50",
//       sentiment,
//     });

//     const savedComment = await newComment.save();

//     // Push the new comment to the corresponding post's comments array
//     await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });

//     res.status(201).json(savedComment);
//   } catch (error) {
//     console.error('Error creating comment:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = createComment;
