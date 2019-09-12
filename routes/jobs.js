const express = require("express");
const Job = require("../models/job");
const router = new express.Router();
const jsonschema = require("jsonschema");
const jobsschema = require("../schemas/jobsSchema.json");
const ExpressError = require("../expressError");

router.post("/", async function(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, jobsschema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const job = await Job.create(req.body);
    return res.json({ job }, 201);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async function(req, res, next) {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async function(req, res, next) {
  try {
    const { id } = req.params;
    const job = await Job.findJob(id);
    return res.json({ job });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async function(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, jobsschema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const id = req.params.id;
    job = await Job.update(id, req.body);

    return res.json({ job });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async function(req, res, next) {
  try {
    const { id } = req.params;
    job = await Job.delete(id);
    return res.json({ message: "Job deleted." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
