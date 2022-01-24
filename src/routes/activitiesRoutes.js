const express = require('express');
const mongoose = require('mongoose');


const Activity = mongoose.model('Activity');

const router = express.Router();


router.get('/activities', async (req, res) => {
  const activities = await Activity.find({ userId: req.body._id });

  res.send(activities);
});

router.post('/activities', async (req, res) => {
  const { time } = req.body;

  if (!time) {
    return res
      .status(422)
      .send({ error: 'Time has an error' });
  }
  try {
    const activity = new Activity({
      time,
      userId: req.body._id,
    });
    await activity.save();
    res.send(activity);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
