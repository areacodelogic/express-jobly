const express = require("express");
const Company = require("../models/company");
const router = new express.Router();
const jsonschema = require("jsonschema");
const companyschema = require("../schemas/companiesSchema.json");
const ExpressError = require("../expressError")




/* GET all the {companies: [comapnyData,...]}*/
router.get("/", async function(req, res, next){

  try {

    const companies = await Company.findAll(req.query);

    return res.json({companies})
      
  } catch (error) {
      return next(error)
  }

})

router.post("/", async function(req, res, next) {
  try {

    const result = jsonschema.validate(req.body, companyschema);
    if (!result.valid) {
      let listOfErrors = result.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const company = await Company.create(req.body);
    return res.json({ company });

  } catch (error) {
    return next(error);
  }
});

router.get("/:handle", async function(req, res, next) {
  try {
    
    const handle = req.params.handle;

    const company = await Company.findCompany(handle);
    return res.json({ company });

  } catch (error) {
    return next(error);
  }
});

router.patch("/:handle", async function(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, companyschema)
    if(!result.valid){
      let listOfErrors = result.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const handle = req.params.handle;
    company = await Company.update(handle, req.body.company);
    return res.json({ company });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:handle", async function(req, res, next){
  try {
    const handle = req.params.handle;

    company = await Company.delete(handle);
    return res.json({message: "company deleted"});
  } catch (error) {
    return next(error)
  }
})




module.exports = router;