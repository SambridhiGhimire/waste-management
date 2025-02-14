const WasteReport = require("../models/WasteReport");

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
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Approve Waste Report (Admin Only)
const approveReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "approved";
    await report.save();

    res.json({ message: "Report approved!", report });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Reject Waste Report (Admin Only)
const rejectReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "rejected";
    await report.save();

    res.json({ message: "Report rejected!", report });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { submitReport, getAllReports, approveReport, rejectReport };
