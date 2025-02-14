const mongoose = require("mongoose");

const WasteReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { lat: Number, lng: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteReport", WasteReportSchema);
