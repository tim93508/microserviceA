// backend/server
import express from "express";
const app = express();
const PORT = 3000;

// JSON parsing with middleware
app.use(express.json());

// TESTING data
const users = [{ email: "user@email.com", password: "test1234", id: 909 }];

// POST endpoint
app.post("/login", (req, res) => {
  // Get values of email and password
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ Error: "Invalid Request" });
  }

  // Find data
});
