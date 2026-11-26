const express = require("express");
const router = express.Router();
const {
  getAllGuides,
  getGuideById,
  searchGuides,
  getHelplines,
  createEmergencyAlert
} = require("../controllers/guidesController");

router.get("/guides", getAllGuides);
router.get("/guides/:id", getGuideById);
router.post("/search", searchGuides);
router.get("/helplines", getHelplines);
router.post("/emergency-alert", createEmergencyAlert);

module.exports = router;
