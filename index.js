// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
  fullName: String,
  amount: Number,
});

const User = mongoose.model("User", userSchema);
app.post("/", (req, res) => {
  res.status(200).json({ message: "all working okay" });
});
// Route to add a user
app.post("/api/users", async (req, res) => {
  const { fullName, amount } = req.body;

  try {
    const newUser = new User({ fullName, amount });
    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});
// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Update a user
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { fullName, amount } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, amount },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
