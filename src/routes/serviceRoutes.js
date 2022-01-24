const express = require('express');
const mongoose = require('mongoose');
const authorize = require('../helpers/Authorize')
const Role = require('../helpers/Role');


const Service = mongoose.model('Service');

const router = express.Router();

router.post('/services', authorize(Role.Admin), async (req, res) => {
  const { image, type, createdAt, cpu, memory } = req.body;

  if (!image || !type || !createdAt) {
    return res
      .status(422)
      .send({ error: 'You must provide a title, a description and a photo' });
  }
  try {
    const service = new Service({
      image,
      type,
      createdAt,
      cpu,
      memory,
    });
    await service.save();
    const io = req.app.locals.io
    io.emit('creating', { my: service })
 
    res.send(service);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.get('/services', async (req, res) => {
  const services = await Service.find({ type: req.body.type });

  res.send(services);
});

router.get('/services/:id', async (req, res) => {
  const { title, description, photoUri } = req.body;

  if (!title || !description || !photoUri) {
    return res
      .status(422)
      .send({ error: 'You must provide a title, a description and a photo' });
  }

  try {
    const service = await Service.findByIdAndUpdate(
      { _id: req.params.id },
      { title, description, photoUri, userId: req.user._id }
    );
    res.send(service);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});


module.exports = router;
