const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

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
        return res.json({ message: "Logged in successfully", token });
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
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.json("You already have an account, Please login");
    }

    // Generate salt and hash password
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return res.status(500).send(err.message);
      }

      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return res.status(500).send(err.message);
        }

        // Create new user
        let newUser = await User.create({
          username,
          email,
          password: hash,
        });

        // Generate token
        let token = generateToken(newUser);
        res.cookie("token", token);
        return res.send("User created successfully");
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getUsers = async (req,res) =>{
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const SpecificUser = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = { LoginUser, RegisterUser, getUsers, SpecificUser };
