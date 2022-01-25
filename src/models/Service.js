const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum : ['Deployment','StatefulSet'],
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

mongoose.model('Service', serviceSchema);
