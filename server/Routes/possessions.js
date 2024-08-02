const express = require('express');
const router = express.Router();
const Possession = require('../models/possession');

// Fetch all possessions
router.get('/possessions', async (req, res) => {
  try {
    const possessions = await Possession.find();
    res.status(200).json(possessions);
  } catch (err) {
    console.error('Failed to fetch possessions:', err);
    res.status(500).json({ message: 'Failed to fetch possessions' });
  }
});

// Add a new possession
router.post('/possessions', async (req, res) => {
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ message: 'Item is required' });
  }

  try {
    const newPossession = new Possession({ item });
    await newPossession.save();
    res.status(201).json(newPossession);
  } catch (err) {
    console.error('Failed to add possession:', err);
    res.status(500).json({ message: 'Failed to add possession' });
  }
});

// Delete a possession
router.delete('/possessions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Possession.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Possession not found' });
    }

    res.status(200).json({ message: 'Possession deleted' });
  } catch (err) {
    console.error('Failed to delete possession:', err);
    res.status(500).json({ message: 'Failed to delete possession' });
  }
});

module.exports = router;
