// imports
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { clear } from "console";

const app = express();
const PORT = 3000;

// TESTING data
const testData = [{ email: "user@email.com", password: "test1234" }];

// Define Mongoose schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Microuser = mongoose.model("Microuser", userSchema);

// Generate test user
const createTestUser = async () => {
  try {
    // Find user by email and overwrite. Create if not found
    console.log("Attempting to create Test User...");

    const result = await Microuser.create(testData);

    console.log("Test user data added successfully", result);
  } catch (err) {
    if (err.code === 11000) {
      console.log("Test user data already exists.");
    } else {
      console.error("Error:", err);
    }
  }
};

// Search for user
const findUser = async (email, password) => {
  try {
    // Find user by email
    console.log("Attempting to find User in database...");

    const user = await Microuser.findOne({ email });

    if (!user) {
      return { message: "No such email exists.", id: undefined };
    }

    if (user.password !== password) {
      return { message: "Wrong password.", id: undefined };
    }

    return { message: "Login Successful", id: user._id };
  } catch (err) {
    return { message: err };
  }
};

// Database connection
mongoose.connect(process.env.MONGODB_CONNECT_STRING);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB using Mongoose.");
  createTestUser();
});

// JSON parsing middleware
app.use(express.json());

// POST endpoint
app.post("/login", async (req, res) => {
  // Get values of email and password
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid Request", id: undefined });
  } else {
    console.log("Login information received.");
  }

  // Check database for user credentials
  const result = await findUser(email, password);

  // If findUser failed, return error result
  if (result === undefined) {
    return res.status(500).json({ message: "Error", id: undefined });
  }

  return res.status(201).json(result);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
