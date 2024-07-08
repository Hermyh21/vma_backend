const mongoose = require("mongoose");

const PlateCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const PlateCode = mongoose.model("PlateCode", PlateCodeSchema);

module.exports = PlateCode;
