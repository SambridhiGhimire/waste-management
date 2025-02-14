const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    googleId: { type: String, unique: true, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
