const express = require('express');
const { RegisterUser, LoginUser, getUsers, SpecificUser, logoutUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

router.post("/login", LoginUser);

router.post("/logout", logoutUser )

router.post("/register", RegisterUser);

router.get("/", getUsers);

router.get("/:userId", SpecificUser)

module.exports = router;