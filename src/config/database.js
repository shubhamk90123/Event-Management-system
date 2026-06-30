const mongoose = require("mongoose");
const config = require("./config.js");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_url, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database.");
    console.error(
      "Please check your MONGO_URI and network connection and try again.",
    );
    throw error;
  }
};

module.exports = connectDB;


