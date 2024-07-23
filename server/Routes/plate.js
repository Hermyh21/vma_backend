const express = require("express");
const router = express.Router();
const PlateRegion = require("../Models/PlateRegion");
const PlateCode = require("../Models/plateCode");

// Get all plate regions
router.get("/plate-regions", async (req, res) => {
  try {
    const plateRegions = await PlateRegion.find();
    res.status(200).json(plateRegions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new plate region
router.post("/plate-regions", async (req, res) => {
  try {
    const { region } = req.body;
    const newRegion = new PlateRegion({ region });
    await newRegion.save();
    res.status(201).json(newRegion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a plate region
router.delete("/plate-regions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PlateRegion.findByIdAndDelete(id);
    res.status(200).json({ message: "Plate region deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plate codes
router.get("/plate-codes", async (req, res) => {
  try {
    const plateCodes = await PlateCode.find();
    res.status(200).json(plateCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new plate code
router.post("/plate-codes", async (req, res) => {
  try {
    const { code, description } = req.body;
    const newCode = new PlateCode({ code, description });
    await newCode.save();
    res.status(201).json(newCode);
    console.log("Plate code added");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("failed to add code")
  }
});

// Delete a plate code
router.delete("/plate-codes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PlateCode.findByIdAndDelete(id);
    res.status(200).json({ message: "Plate code deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
