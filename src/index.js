require('./models/Service');
require('./models/Activities');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const serviceRoutes = require('./routes/serviceRoutes');
const activityRoutes = require('./routes/activitiesRoutes');
const errorHandler = require('./helpers/Error-handler');


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serviceRoutes);
app.use(activityRoutes);
app.use(errorHandler);
app.use('/users', require('./Users/user.controller'));

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

const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

const socket = require("socket.io")(server);
socket.on("creating" , ()=>{
  console.log("hey");
});

app.locals.io = socket