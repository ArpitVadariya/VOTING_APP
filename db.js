const mongoose = require("mongoose");
require("dotenv").config();

// Define the MongoDB URL
const mongoURL = process.env.MONGODB_URL_LOCAL;

// MongoDB Atlas Connection URL Added
// const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL, {
  useNewURLParser: true,
  useUnifiedTopology: true,
  tlsAllowInvalidCertificates: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

db.on("error", (err) => {
  console.log("MongoDB connection error: " + err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = db;
