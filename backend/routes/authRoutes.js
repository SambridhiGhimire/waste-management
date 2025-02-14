const express = require("express");
const passport = require("passport");
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
  res.json({ user: req.user.user, token: req.user.token });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.logout(() => {
    res.redirect("http://localhost:3000/");
  });
});

module.exports = router;
