// jshint esversion:9

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.MONGO_DB_CONNECTION_URL).then((con) => {
    console.log(`MongoDB connected with Host: ${con.connection.host}`);
  });
};

module.exports = connectDatabase;
