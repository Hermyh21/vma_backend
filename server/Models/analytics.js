const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  visitorCount: {
    type: Number,
    required: true,
    default: 0,
  },
  userCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;
