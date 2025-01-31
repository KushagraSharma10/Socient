const express = require('express');
const { RegisterUser, LoginUser, getUsers, SpecificUser, logoutUser, followUser, unfollowUser, notifyUser, getUserNotifications, getFollowersAndFollowing, sendFollowRequest, acceptFollowRequest, rejectFollowRequest, getFollowRequests, RequestedUsers, RecievedRequests, loginLimiter, getSentFollowRequests } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const upload = require('../config/multer-config');
const authenticateUser = require('../middlewares/authenticateUser');
const router = express.Router();

router.post("/login", LoginUser);

router.post("/logout", logoutUser)

router.post("/register", upload.uploadSingle, RegisterUser);

router.get("/", getUsers);

router.get("/:id", SpecificUser)

router.get("/notifications/:userId", authenticateUser, getUserNotifications)

router.get('/followers-following/:userId', authenticateUser, getFollowersAndFollowing);

router.post("/notifications", authenticateUser, notifyUser)

router.put('/:userId/follow', authenticateUser, followUser);

router.put('/:userId/unfollow', authenticateUser, unfollowUser);

router.post('/:userId/request-follow', authenticateUser, sendFollowRequest);

router.get('/:userId/sent-requests', authenticateUser, getSentFollowRequests);

router.put('/:userId/accept-follow', authenticateUser, acceptFollowRequest);

router.put('/:userId/reject-follow', authenticateUser, rejectFollowRequest);

router.get("/:userId/follow-requests", authenticateUser, getFollowRequests);

router.get("/requests/sent", authenticateUser, RequestedUsers);

router.get("/requests/received", authenticateUser, RecievedRequests);

module.exports = router;