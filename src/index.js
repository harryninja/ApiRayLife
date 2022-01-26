// all the requires
require('./models/Service');
require('./models/Activities');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const serviceRoutes = require('./routes/serviceRoutes');
const activityRoutes = require('./routes/activitiesRoutes');
const errorHandler = require('./helpers/Error-handler');
const logger = require('./config/winston');
const http = require('http').Server(app);

// all the app use
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serviceRoutes);
app.use(activityRoutes);
app.use(errorHandler);
// this calls for the users route to authenticate
app.use('/users', require('./Users/user.controller'));
// connection to database
const mongoUri =
  'mongodb+srv://harryninja:liferayharry@cluster0.1ucls.mongodb.net/apidata?retryWrites=true&w=majority';
 mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
  
});
mongoose.connection.on('error', err => {
  console.error('Error connecting to mongo', err);
});


// server start up
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
http.listen(port, function() {
  console.log('listening on ' + port);
 
try {
    logger.info('Server and Database is initiated');
}
catch (error) {
    logger.error(error);
}
});

// implementation of io
const io = require("socket.io")(http);

io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});
app.get('/', function(req, res) {
  res.send(console.log('hey', io))
 
});

module.exports = io;