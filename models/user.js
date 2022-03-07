// jshint esversion:9

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
    maxLength: [30, "Name cannot exceed 30 characters."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: [isEmail, "Email should be a valid email"],
    unique: [true, "Please enter unique email."],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: [6, "Password must contain 6 characters."],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Encrypt the password before saving user

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare user password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

module.exports = mongoose.model("User", userSchema);
