// authApp.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/authDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ✅ Register API
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // password hash
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPass });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
});

// ✅ Login API
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // JWT token generate
    const token = jwt.sign({ id: user._id }, "mySecretKey", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Start server
app.listen(5000, () => {
  console.log("Auth server running on http://localhost:5000");
});