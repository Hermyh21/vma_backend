const mongoose = require('mongoose');

const possessionSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
});

// Check if the model already exists before defining it
module.exports = mongoose.models.Possession || mongoose.model("Possession", possessionSchema);
// module.exports = Possession;
