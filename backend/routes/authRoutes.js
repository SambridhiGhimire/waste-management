const express = require("express");
const { googleLogin, logout, getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/google-login", googleLogin); // Public
router.get("/logout", authMiddleware, logout); // Protected
router.get("/me", authMiddleware, getUserProfile); // Protected

module.exports = router;
