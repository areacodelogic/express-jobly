const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const jsonschema = require("jsonschema");
const usersSchema = require("../schemas/userSchema.json");
const ExpressError = require("../expressError");

router.post("/", async function(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, usersSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const user = await User.create(req.body);
    return res.json({ user }, 201);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async function(req, res, next) {
  try {
    const users = await User.getUsers();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

router.get("/:username", async function(req, res, next) {
  try {
    const { username } = req.params;
    const user = await User.findUser(username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:username", async function(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, usersSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const username = req.params.username;
    user = await User.update(username, req.body);

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:username", async function(req, res, next) {
  try {
    const { username } = req.params;
    user = await User.delete(username);
    return res.json({ message: "User deleted." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;