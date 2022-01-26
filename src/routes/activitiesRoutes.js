const express = require("express");
const mongoose = require("mongoose");
const logger = require("../config/winston");

const Activity = mongoose.model("Activity");

const router = express.Router();

// here is the route to get all activities from the database

router.get("/activities", async (req, res) => {
  const activities = await Activity.find({ servId: req.body._id });
  res.send(activities);
  try {
    logger.info("All activities are being seen");
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
