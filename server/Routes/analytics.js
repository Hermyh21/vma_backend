const express = require("express");
const router = express.Router();
const Analytics = require("../Models/analytics");

// Get analytics data
router.get("/analytics", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update analytics data
router.patch("/analytics", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["visitorCount", "userCount"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    const analytics = await Analytics.findOne();

    if (!analytics) {
      return res.status(404).json({ error: "Analytics data not found!" });
    }

    updates.forEach((update) => {
      analytics[update] = req.body[update];
    });

    await analytics.save();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
