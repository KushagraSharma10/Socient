const express = require('express');
const { RegisterUser, LoginUser, getUsers, SpecificUser, logoutUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const upload = require('../config/multer-config');
const router = express.Router();

router.post("/login", LoginUser);

router.post("/logout", logoutUser )

router.post("/register", upload.single('profilePicture'), RegisterUser);

router.get("/", getUsers);

router.get("/:id", SpecificUser)

module.exports = router;