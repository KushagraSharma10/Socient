const express = require('express');
const { RegisterUser, LoginUser, getUsers, SpecificUser, logoutUser, followUser, unfollowUser, notifyUser, getUserNotifications, getFollowersAndFollowing, sendFollowRequest, acceptFollowRequest, rejectFollowRequest, getFollowRequests, RequestedUsers, RecievedRequests, loginLimiter, getSentFollowRequests, getUserSentimentStats, getFollowStatus, getMe, getCurrentUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const upload = require('../config/multer-config');
const authenticateUser = require('../middlewares/authenticateUser');
const router = express.Router();
const {User, validateUser} = require("../models/User")

router.post("/login", LoginUser);

router.post("/logout", logoutUser)

router.post("/register", upload.uploadSingle, RegisterUser);

router.get("/", getUsers);

router.get("/:id", SpecificUser)

router.get('/:userId/edit', authenticateUser, getCurrentUser);

router.put('edit/:userId', authenticateUser, async (req, res) => {
    try {
        // Authorization check
        if (req.params.userId !== req.userId) {
            return res.status(403).json({ message: "Unauthorized update attempt" });
        }

        // Validation
        const { error } = validateUserUpdate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
})
// Update current user



router.get("/notifications/:userId", authenticateUser, getUserNotifications)

router.get('/followers-following/:userId', authenticateUser, getFollowersAndFollowing);

router.get('/user/:userId/sentiment-stats', authenticateUser, getUserSentimentStats);


router.post("/notifications", authenticateUser, notifyUser)

router.put('/:userId/follow', authenticateUser, followUser);

router.put('/:userId/unfollow', authenticateUser, unfollowUser);

router.post('/:userId/request-follow', authenticateUser, sendFollowRequest);

router.get('/:userId/sent-requests', authenticateUser, getSentFollowRequests);

router.put('/:userId/accept-follow', authenticateUser, acceptFollowRequest);

router.put('/:userId/reject-follow', authenticateUser, rejectFollowRequest);

router.get("/:userId/follow-requests", authenticateUser, getFollowRequests);

// router.get('/:userId/follow-status', authenticateUser, getFollowStatus);

router.get("/requests/sent", authenticateUser, RequestedUsers);
router.get('/:userId/follow-status', authenticateUser, async (req, res) => {
    try {
        const { userId } = req.params; // Profile user ID
        const currentUserId = req.userId; // Logged-in user ID

        const profileUser = await User.findById(userId);

        if (!profileUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = profileUser.followers.includes(currentUserId);
        const hasSentRequest = profileUser.followRequests.some(req => req.from.toString() === currentUserId);

        res.status(200).json({
            isFollowing,
            hasSentRequest,
        });
    } catch (error) {
        console.error("Error fetching follow status:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/requests/received", authenticateUser, RecievedRequests);

module.exports = router;