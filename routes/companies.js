const express = require("express");
const Company = require("../models/company");
const router = new express.Router()





/* GET all the {companies: [comapnyData,...]}*/
router.get("/", async function(req, res, next){

  try {

    const companies = await Company.findAll(req.query);

    return res.json({companies})
      
  } catch (error) {
      return next(error)
  }

})




module.exports = router;