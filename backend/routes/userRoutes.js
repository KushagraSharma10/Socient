const express = require('express');
const { RegisterUser, LoginUser, getUsers, SpecificUser, logoutUser, followUser, unfollowUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const upload = require('../config/multer-config');
const authenticateUser = require('../middlewares/authenticateUser');
const router = express.Router();

router.post("/login", LoginUser);

router.post("/logout", logoutUser )

router.post("/register", upload.uploadSingle, RegisterUser);

router.get("/", getUsers);

router.get("/:id", SpecificUser)

router.put('/:userId/follow', authenticateUser, followUser);

router.put('/:userId/unfollow', authenticateUser, unfollowUser);

module.exports = router;