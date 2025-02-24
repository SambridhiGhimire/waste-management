const express = require("express");
const { submitReport, getAllReports, approveReport, rejectReport, getUserReports, getReport, editReport, deleteReport } = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/submit", authMiddleware, upload.single("image"), submitReport);
router.get("/", authMiddleware, adminMiddleware, getAllReports);
router.get("/detail/:id", authMiddleware, getReport);
router.get("/user", authMiddleware, getUserReports);
router.patch("/:id/approve", authMiddleware, adminMiddleware, approveReport);
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectReport);
router.put("/:id/edit", authMiddleware, upload.single("image"), editReport); // ✅ Edit report
router.delete("/:id/delete", authMiddleware, deleteReport); // ✅ Delete report

module.exports = router;
