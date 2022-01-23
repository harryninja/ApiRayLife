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
    type: String,
    required: true,
  },
  cpu: {
    type: Number,
    default: '',
  },
  memory: {
    type: Number,
    default: '',
  },
});

mongoose.model('Service', serviceSchema);
