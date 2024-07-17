const mongoose = require('mongoose');

const possessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const Possession = mongoose.model('Possession', possessionSchema);

module.exports = Possession;
