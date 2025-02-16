const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const User = require("./../models/user");
const { jwtAuthmiddleware, generateToken } = require("./../jwt");

// Post route to add a user
router.post("/signup", async (req, res) => {
  try {
    // Assuming request body contains the user data
    const data = req.body;

    // Create a new user document using the Mongoose model
    const newUser = new User(data);

    // Only one admin code
    if (newUser.role === "admin") {
      console.log("One Admin availabel second admin can't add");

      return res
        .status(403)
        .json({ message: "One Admin availabel second admin can't add" });
    }

    // save the new user to the database
    const response = await newUser.save();
    console.log("User data saved ");

    const payload = {
      id: response.id,
    };

    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is : ", token);

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

// Login Route

router.post("/login", async (req, res) => {
  try {
    // Extract the aadharCardNumber and password from the request body
    const { aadharCardNumber, password } = req.body;

    // Find the user by aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    // If user doesn't exist or password doesn't match return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Inavalid username or Password" });
    }

    // generate token
    const payload = {
      id: user.id,
    };

    const token = generateToken(payload);

    // return token as a response
    res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

// Profile route

router.get("/profile", jwtAuthmiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("User Data: ", userData);

    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

router.put("/profile/password", jwtAuthmiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract id from the token

    // Extract current and new password from request body
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    // If password doesn't match return error
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Inavalid Password" });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    console.log("password updated");
    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

module.exports = router;
