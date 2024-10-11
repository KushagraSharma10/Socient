const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const imagekit = require("../config/imageKit");
const { mongoose } = require("mongoose");

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Server Error" });
      }

      if (result) {
        // Password matched
        const token = generateToken(user);
        res.cookie("token", token);
        return res.json({
          message: "Logged in successfully",
          token,
          userId: user._id,  // Send userId in the response
        });
      } else {
        // Invalid credentials
        return res.status(401).json({ message: "Invalid credentials" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


const RegisterUser = async (req, res) => {
  try {
    const { name, bio, username, email, password } = req.body;
    const file = req.file;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile picture upload
    let profilePictureUrl = "";
    if (file) {
      try {
        const uploadedImage = await imagekit.upload({
          file: req.file.buffer,
          fileName: `${Date.now()}_${req.file.originalname}`,
          folder: "/UsersDP",
        });
        profilePictureUrl = uploadedImage.url;
      } catch (uploadError) {
        console.error("ImageKit upload failed:", uploadError);
        return res.status(500).json({ message: "Image upload failed." });
      }
    }

    // Create new user in MongoDB
    const newUser = await User.create({
      name,
      bio,
      profilePicture: profilePictureUrl,
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser);

    // Set cookie and respond
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,   // Send userId in the response
      token,
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};


const logoutUser = function (req, res) {
  res.clearCookie("token"); // Clear the authentication cookie
  res.status(200).json({ message: "Logged out successfully" });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const SpecificUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if 'id' is a valid MongoDB ObjectId using Mongoose's isValidObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch the user, excluding sensitive fields like password and tokens
    const user = await User.findById(id)
      .select("-password -tokens")
      .populate('posts', 'images content createdAt') // Assuming user has posts, adjust as per your schema
      .populate('followers', 'username profilePicture') // Adjust this as needed
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  LoginUser,
  RegisterUser,
  getUsers,
  SpecificUser,
  logoutUser,
};
