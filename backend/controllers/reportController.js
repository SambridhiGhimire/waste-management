const WasteReport = require("../models/WasteReport");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
// Submit Waste Report
const submitReport = async (req, res) => {
  const { location, description, wasteType } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  if (!wasteType) {
    return res.status(400).json({ error: "Waste type is required" });
  }

  try {
    const newReport = new WasteReport({
      user: req.user.id,
      location: JSON.parse(location),
      description,
      wasteType, // Store waste type
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

// Admin Approve Report
const approveReport = async (req, res) => {
  const { points } = req.body;

  try {
    const report = await WasteReport.findById(req.params.id).populate("user");
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (report.status !== "pending") {
      return res.status(400).json({ error: "Report is already processed" });
    }

    report.status = "approved";
    report.pointsAwarded = points || 0;
    report.approvedBy = req.user.id;
    await report.save();

    if (report.user) {
      report.user.points += report.pointsAwarded;
      await report.user.save();
    }

    res.json({
      message: `Report approved with ${report.pointsAwarded} points!`,
      report,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Reject Report
const rejectReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (report.status !== "pending") {
      return res.status(400).json({ error: "Report is already processed" });
    }

    report.status = "rejected";
    report.pointsAwarded = 0;
    report.approvedBy = req.user.id;
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

const getReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id).populate("user", "name email").populate("approvedBy", "name email");

    if (!report) return res.status(404).json({ error: "Report not found" });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Edit Waste Report
const editReport = async (req, res) => {
  try {
    const { description, wasteType, location } = req.body;
    const report = await WasteReport.findById(req.params.id);

    if (!report) return res.status(404).json({ error: "Report not found" });
    if (report.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized to edit this report" });

    // Update fields
    if (description) report.description = description;
    if (wasteType) report.wasteType = wasteType;
    if (location) report.location = JSON.parse(location);

    // If new image uploaded, delete old image
    if (req.file) {
      if (report.imagePath) {
        const oldImagePath = path.join(__dirname, "..", report.imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete old image from server
        }
      }
      report.imagePath = req.file.path;
    }

    await report.save();
    res.json({ message: "Report updated successfully", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating report" });
  }
};

// Delete Waste Report
const deleteReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);

    if (!report) return res.status(404).json({ error: "Report not found" });
    if (report.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized to delete this report" });

    // Delete report image from server
    if (report.imagePath) {
      const imagePath = path.join(__dirname, "..", report.imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting report" });
  }
};

module.exports = { submitReport, getAllReports, approveReport, rejectReport, getUserReports, getReport, editReport, deleteReport };
