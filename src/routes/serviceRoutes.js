const express = require('express');
const mongoose = require('mongoose');


const Service = mongoose.model('Service');

const router = express.Router();


router.get('/services', async (req, res) => {
  const services = await Service.find({ userId: req.user._id });

  res.send(services);
});

router.post('/services', async (req, res) => {
  const { title, description, photoUri } = req.body;

  if (!title || !description || !photoUri) {
    return res
      .status(422)
      .send({ error: 'You must provide a title, a description and a photo' });
  }
  try {
    const service = new Service({
      title,
      description,
      photoUri,
      userId: req.user._id,
    });
    await service.save();
    res.send(service);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
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

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndRemove({ _id: req.params.id });
    res.send(service);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
