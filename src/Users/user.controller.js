const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const authorize = require("../helpers/Authorize");
const Role = require("../helpers/Role");
const logger = require("../config/winston");

// routes
router.post("/authenticate", authenticate); // public route
router.get("/", authorize(Role.Admin), getAll); // admin only
router.get("/:id", authorize(), getById); // all authenticated users
router.post("/logout", signout); //tried to add a logout but i'm using tokens for authentication and i can't find a way to invalidate the token except for the expireIn but that takes time
module.exports = router;

// that's the signout function where it calls logout from user.service
function signout(req, res, next) {
  try {
    logger.info("User is logging out");
  } catch (error) {
    logger.error(error);
  }
  return userService.logout();
}
// this function calls for the authentication function from user.service
function authenticate(req, res, next) {
  userService
    .authenticate(req.body)

    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
  try {
    logger.info("User is authenticating");
  } catch (error) {
    logger.error(error);
  }
}

// those functions were only tests but they can be acessed with the right routes and authorization
function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  const currentUser = req.user;
  const id = parseInt(req.params.id);

  // only allow admins to access other user records
  if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}
