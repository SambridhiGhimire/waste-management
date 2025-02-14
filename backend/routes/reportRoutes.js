const express = require("express");
const { submitReport, getAllReports, approveReport, rejectReport } = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/submit", authMiddleware, upload.single("image"), submitReport);
router.get("/", authMiddleware, adminMiddleware, getAllReports);
router.patch("/:id/approve", authMiddleware, adminMiddleware, approveReport);
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectReport);

module.exports = router;
