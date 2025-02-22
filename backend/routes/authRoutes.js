const express = require("express");
const passport = require("passport");
const crypto = require("crypto");
const User = require("../models/User");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const sendResetEmail = require("../utils/emailService").sendResetEmail;
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:3000/" }), (req, res) => {
  res.cookie("token", req.user.token, { httpOnly: true, secure: false });
  res.redirect("http://localhost:3000/dashboard");
});

router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({
    user: {
      name: req.user.user.name,
      email: req.user.user.email,
      profileImage: req.user.user.profileImage,
      role: req.user.user.role,
      points: req.user.user.points,
    },
    token: req.user.token,
  });
});

// Email/Password Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    user = new User({ name, email, password });
    await user.save();
    res.status(200).json({ message: "Signup successful. Please login." });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err.message });
  }
});

// Email/Password Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: info.message });

    res.cookie("token", user.token, { httpOnly: true });
    res.json({ message: "Login successful", user });
  })(req, res, next);
});

// Forgot Password (Request Reset)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    await user.save();

    // Send reset email
    await sendResetEmail(email, resetToken);

    res.json({ message: "Password reset email sent." });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err.message });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetToken: token });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.password = newPassword;
    user.resetToken = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/edit-profile", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update profile picture if uploaded
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
