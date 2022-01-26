const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Deployment", "StatefulSet"],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  cpu: {
    type: Number,
  },
  memory: {
    type: Number,
  },
});

//model for service
mongoose.model("Service", serviceSchema);
