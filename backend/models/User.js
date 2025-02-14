const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  googleId: { type: String, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
