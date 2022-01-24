const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  time: {
    type: Date,
    required: true,
  
  },

 
});

mongoose.model('Activity', activitySchema);