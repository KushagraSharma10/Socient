const express = require('express');
const { RegisterUser, LoginUser, getUsers, SpecificUser } = require('../controllers/userController');
const router = express.Router();

router.post("/login", LoginUser);

router.post("/register", RegisterUser);

router.get("/", getUsers);

router.get("/:userId", SpecificUser)

module.exports = router;