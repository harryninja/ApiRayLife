const express = require("express");
const mongoose = require("mongoose");
const authorize = require("../helpers/Authorize");
const Role = require("../helpers/Role");
const deploy = require("lc-interviews");
const logger = require("../config/winston");
const Service = mongoose.model("Service");
const Activity = mongoose.model("Activity");

const router = express.Router();

//
router.post("/services", authorize(Role.Admin), async (req, res) => {
  const { _id, image, type, createdAt, cpu, memory, time } = req.body;

  if (!image || !type) {
    return res.status(422).send({ error: "Something happened" });
  }
  try {
    const service = new Service({
      _id,
      image,
      type,
      createdAt,
      cpu,
      memory,
    });
    service.createdAt = Date.now();
   
    if (service.cpu > 3 || service.cpu < 1) {
      return res.send({ error: "CPU value is wrong" });
    } else {
      await service.save();
      const activity = new Activity({
        time,
        servId: req.body._id,
        type: "SERVICE_CREATED",
      });
      activity.time = Date.now();
      await activity.save();
    }
    res.send(service);
    try {
      logger.info("Service was created");
    } catch (error) {
      logger.error(error);
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

//on this route it gets all the services that were created
router.get("/services", async (req, res) => {
  const services = await Service.find({ _id: req.body._id });

  res.send(services);
  try {
    logger.info("All services are being seen");
  } catch (error) {
    logger.error(error);
  }
});

// on this route i get the service by id and log to the console the service status
router.get("/services/:id", async (req, res) => {
  const { _id, image, type, createdAt, cpu, memory } = req.body;

  if (!image || !type) {
    return res.status(422).send({ error: "No info provided" });
  }

  try {
    const service = await Service.findByIdAndUpdate({
      _id,
      image,
      type,
      createdAt,
      cpu,
      memory,
    });

    const deploystatus = deploy.DeploymentLibrary.getDeploymentStatus(
      req.body._id
    );
    console.log(deploystatus);
    res.send(service);
    try {
      logger.info("Service id is being seen");
    } catch (error) {
      logger.error(error);
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

// on this route i call the route to deploy a service that is created on the database and make a call for the fake status to get both status of the deployment and i make a comparison to continue with the deployment until it gives success
router.post("/servicesdeploy/:id", async (req, res) => {
  const { time } = req.body;
  const service = await Service.findByIdAndUpdate({
    _id: req.body._id,
    image: req.body.image,
  });
  const services = await deploy.DeploymentLibrary.deploy(service);
  res.send(services);
  setTimeout(() => {
    const services = deploy.DeploymentLibrary.getDeploymentStatus(req.body._id);
    if (services === "RUNNING") {
      console.log(services)
      const activity = new Activity({
        time,
        servId: req.body._id,
        type: "DEPLOY_SUCCEEDED",
      });
      activity.time = Date.now();
      activity.save();
      try {
        logger.info("Service was deployed");
      } catch (error) {
        logger.error(error);
      }
    }
  }, 60000);
  const activity = new Activity({
    time,
    servId: req.body._id,
    type: "DEPLOY_STARTED",
  });
  activity.time = Date.now();
  await activity.save();
  try {
    logger.info("Service is being deployed");
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
