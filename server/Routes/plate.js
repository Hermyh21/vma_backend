const express = require("express");
const router = express.Router();
const PlateRegion = require("../Models/plateRegion");
const PlateCode = require("../Models/plateCode");

// Add Plate Code
router.post('/api/Plate/PlateCode', async (req, res) => {
  const { code, description } = req.body;
  
  // Debugging statements
  console.log('Received PlateCode:');
  console.log('Code:', code);
  console.log('Description:', description);
  
  try {
    const newPlateCode = new PlateCode({ code, description });
    await newPlateCode.save();
    res.status(201).json(newPlateCode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add plate code', error });
  }
});


// Delete Plate Code
router.delete('/api/Plate/plate-code/:id', async (req, res) => {
  const { id } = req.params;

  // Debugging statements
  console.log('Received PlateCode ID for deletion:', id);

  try {
    const plateCode = await PlateCode.findByIdAndDelete(id);
    if (!plateCode) {
      return res.status(404).json({ message: 'Plate code not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete plate code', error });
  }
});


// Fetch Plate Codes
router.get('/api/Plate/PlateCode', async (req, res) => {
  try {
    const plateCodes = await PlateCode.find();
    
    // Debugging statement
    console.log('Fetched PlateCodes:', plateCodes);

    res.status(200).json(plateCodes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plate codes', error });
  }
});


// Add Plate Region
router.post('/api/Plate/PlateRegion', async (req, res) => {
  const { region } = req.body;
  console.log('Received region:', region); // Debug log
  if (!region) {
    return res.status(400).json({ message: 'Region is required' });
  }
  try {
    const newRegion = new PlateRegion({ name: region });
    await newRegion.save();
    res.status(201).json(newRegion);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add region', error });
  }
});


// Delete Region
router.delete('/api/Plate/plate-regions/:id', async (req, res) => {
  const { id } = req.params;

  // Debugging statement
  console.log('Received Region ID for deletion:', id);

  try {
    const region = await PlateRegion.findByIdAndDelete(id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete region', error });
  }
});
;

// Fetch Regions
router.get('/api/Plate/PlateRegion', async (req, res) => {
  try {
    const regions = await PlateRegion.find();
    
    // Debugging statement
    console.log('Fetched Regions:', regions);

    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch regions', error });
  }
});

module.exports = router;