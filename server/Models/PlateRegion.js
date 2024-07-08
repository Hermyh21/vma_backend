const mongoose = require("mongoose");

const PlateRegionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PlateRegion = mongoose.model("PlateRegion", PlateRegionSchema);

module.exports = PlateRegion;
