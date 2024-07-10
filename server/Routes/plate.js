const express = require("express");
const PlateRegion = require("../models/PlateRegion");
const PlateCode = require("../models/plateCode");

const router = express.Router();

// Get all plate regions
router.get("/plate-regions", async (req, res) => {
  try {
    const plateRegions = await PlateRegion.find();
    res.json(plateRegions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plate codes
router.get("/plate-codes", async (req, res) => {
  try {
    const plateCodes = await PlateCode.find();
    res.json(plateCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
