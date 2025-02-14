const WasteReport = require("../models/WasteReport");
const User = require("../models/User");

// Submit Waste Report
const submitReport = async (req, res) => {
  const { location, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    const newReport = new WasteReport({
      user: req.user.id,
      location: JSON.parse(location),
      description,
      imagePath: req.file.path,
      status: "pending",
    });

    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully!", report: newReport });
  } catch (err) {
    res.status(500).json({ error: "Error submitting report" });
  }
};

// Get All Reports (Admin Only)
const getAllReports = async (req, res) => {
  try {
    const reports = await WasteReport.find().populate("user", "name email");
    res.json(reports);
    console.log(reports);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Approve Report
const approveReport = async (req, res) => {
  const { points } = req.body;

  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (report.status === "approved") {
      return res.status(400).json({ error: "Report already approved" });
    }

    report.status = "approved";
    report.pointsAwarded = points || 0;
    await report.save();

    const user = await User.findById(report.user);
    if (user) {
      user.points += report.pointsAwarded;
      await user.save();
    }

    res.json({ message: `Report approved with ${report.pointsAwarded} points!`, report });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Reject Report
const rejectReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "rejected";
    report.pointsAwarded = 0;
    await report.save();

    res.json({ message: "Report rejected!", report });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get User Reports
const getUserReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({ user: req.user.id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
};

module.exports = { submitReport, getAllReports, approveReport, rejectReport, getUserReports };
