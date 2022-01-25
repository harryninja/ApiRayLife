const express = require('express');
const mongoose = require('mongoose');
const authorize = require('../helpers/Authorize')
const Role = require('../helpers/Role');
const deploy = require('lc-interviews')

const Service = mongoose.model('Service');

const router = express.Router();

router.post('/services', authorize(Role.Admin), async (req, res) => {
  const { image, type, createdAt, cpu, memory } = req.body;

  if (!image || !type ) {
    return res
      .status(422)
      .send({ error: 'Something happened' });
  }
  try {
 
    const service = new Service({
      image,
      type,
      createdAt,
      cpu,
      memory,
    });
    service.createdAt = Date.now();
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
router.get('/servicesdeploy', async (req, res) => {
  const services = await deploy.DeploymentLibrary.deploy(service);

  res.send(services);
});

router.get('/services/:id', async (req, res) => {
  const { image, type, createdAt, cpu, memory } = req.body;

  if (!image || !type || !createdAt) {
    return res
      .status(422)
      .send({ error: 'No info provided' });
  }

  try {
    const service = await Service.findByIdAndUpdate(
      { _id: req.params.id },
      {     image,
        type,
        createdAt,
        cpu,
        memory,}
    );
    deploy.DeploymentLibrary.getDeploymentStatus(req.params.id)
    res.send(service);
  
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});


module.exports = router;
