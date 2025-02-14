const express = require("express");
const { submitReport, getAllReports, approveReport, rejectReport } = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/submit", authMiddleware, submitReport); // Protected
router.get("/", authMiddleware, adminMiddleware, getAllReports); // Protected + Admin
router.patch("/:id/approve", authMiddleware, adminMiddleware, approveReport); // Protected + Admin
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectReport); // Protected + Admin

module.exports = router;
