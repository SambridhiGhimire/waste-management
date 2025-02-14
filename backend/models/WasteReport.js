const mongoose = require("mongoose");

const WasteReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { lat: Number, lng: Number, required: true },
    description: { type: String, required: true },
    imagePath: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    pointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteReport", WasteReportSchema);
