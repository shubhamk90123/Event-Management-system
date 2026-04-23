const mongoose = require("mongoose");
const config = require("./config.js");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;


