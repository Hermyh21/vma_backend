const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const PlateRegion = mongoose.model('PlateRegion', regionSchema);

module.exports = PlateRegion;
