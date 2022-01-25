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
  type: {
    type: String,
    enum : [SERVICE_CREATED | DEPLOY_STARTED | DEPLOY_SUCCEEDED],
    required: true,
  },

 
});

mongoose.model('Activity', activitySchema);