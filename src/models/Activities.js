const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  time: {
    type: Date,
    required: true,
  
  },

 
});

mongoose.model('Activity', activitySchema);