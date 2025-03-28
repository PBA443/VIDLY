const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { validate, User } = require("../models/user");
const _ = require("lodash");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  try {
    // Validate the request body
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message }); // Return validation error
    const isOldUser = await User.findOne({ email: req.body.email });
    if (isOldUser) return res.status(400).send("User is already registered.");

    // Create a new user object
    const user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    // Save the genre to the database
    await user.save();
    // Return the new genre
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(201)
      .send(_.pick(user, ["name", "email"])); // 201 Created status code
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
});

module.exports = router;
