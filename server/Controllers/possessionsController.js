const Possession = require('../models/possession');

// Get all possessions
exports.getAllPossessions = async (req, res) => {
  try {
    const possessions = await Possession.find();
    res.json(possessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new possession
exports.createPossession = async (req, res) => {
  const possession = new Possession({
    name: req.body.name,
    checked: req.body.checked,
  });

  try {
    const newPossession = await possession.save();
    res.status(201).json(newPossession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a possession
exports.updatePossession = async (req, res) => {
  try {
    const possession = await Possession.findById(req.params.id);
    if (!possession) return res.status(404).json({ message: 'Possession not found' });

    possession.name = req.body.name ?? possession.name;
    possession.checked = req.body.checked ?? possession.checked;

    const updatedPossession = await possession.save();
    res.json(updatedPossession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a possession
exports.deletePossession = async (req, res) => {
  try {
    const possession = await Possession.findById(req.params.id);
    if (!possession) return res.status(404).json({ message: 'Possession not found' });

    await possession.remove();
    res.json({ message: 'Possession deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
