// jshint esversion:6
const express = require("express");
const connectDatabase = require("./utils/db");
const dotenv = require("dotenv").config({ path: "./config.env" });
const cookieParser = require("cookie-parser");
const user = require("./router/user");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Handle Uncaught Excretion

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");

  process.exit(1);
});

//connecting database
connectDatabase();

//Home route for all users
app.use("/api", user);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on Port:${port} `);
});

// Handle Unhandled Promise  Rejections

// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to unhandled Promise Rejections");
//   server.close(() => {
//     process.exit(1);
//   });
// });
