const express = require("express");
const serverless = require("serverless-http");
const Razorpay = require("razorpay");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const app = express();

// ✅ Vercel doesn’t need app.listen()
app.get("/", (req, res) => {
  res.send("Backend is running on Vercel 🚀");
});

// All your existing middleware, Razorpay, Cloudinary, routes...
// (copy-paste your routes here, but REMOVE app.listen)

// Example endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", time: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
