const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  servId: {
    type: String,
    ref: "Service",
  },
  time: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["SERVICE_CREATED", "DEPLOY_STARTED", "DEPLOY_SUCCEEDED"],
    required: true,
  },
});

//model for activity
mongoose.model("Activity", activitySchema);
