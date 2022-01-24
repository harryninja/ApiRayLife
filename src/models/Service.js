const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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
