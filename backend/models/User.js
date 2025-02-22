const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true },
    profileImage: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    points: { type: Number, default: 0 },
    resetToken: { type: String, required: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
