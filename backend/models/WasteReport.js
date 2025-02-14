const mongoose = require("mongoose");

const WasteReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: { lat: Number, lng: Number },
    description: String,
    imageUrl: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteReport", WasteReportSchema);
