const mongoose = require("mongoose");

const WasteReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    description: { type: String, required: true },
    wasteType: {
      type: String,
      enum: ["E-waste", "Paper waste", "Metal waste", "Plastic waste", "Stationary waste", "Organic waste", "Others"],
      required: true,
    },
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
