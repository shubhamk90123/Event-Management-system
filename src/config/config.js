const dotenv   = require("dotenv");

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not set in environmental variables");
}

const config = {
  mongo_url: process.env.MONGO_URI,
};

module.exports = config;
