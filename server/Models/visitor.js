const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const possesionSchema = new Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const visitorSchema = new mongoose.Schema(
  {
    name: [
      {
        type: String,
        required: true,
      },
    ],
    purpose: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numberOfVisitors: {
      type: Number,
      required: true,
    },
    bringCar: {
      type: Boolean,
      required: true,
    },
    selectedPlateNumbers: {
      type: [String],
      required: false,
    },
    
    possessions: [possesionSchema],
    approved: {
      type: Boolean,
      default: false,
    },
    declined: {
      type: Boolean,
      default: false,
    },
    declineReason: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
