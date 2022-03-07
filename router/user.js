//jshint esversion:9

const express = require("express");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const router = express.Router();
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const errors = require("../middlewares/errors");

// Register New User

router.post("/registerUser", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
  } catch (error) {
    errors(error, req, res, next);
  }

  sendToken(user, 200, res);
});

// Login User
router.post("/loginUser", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter valid email or password", 400));
  }
  // Finding user in database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // Check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Updating the User

router.put("/updateUser/:id", async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// Delete the User

router.delete("/deleteUser/:id", async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }
  user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted sucessfully",
  });
});

// Logout user

router.get("/logout", async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

module.exports = router;
