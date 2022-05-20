const enterpriseModel = require("../../models/Enterprise");
const express = require("express");

let router = express.Router();

router.get("/getEnterpriseName/:initialDate/:endDate/:user/:enterpriseName/:pdf", async(req, res) => {
  const params = req.params;

  const initialDate = params.initialDate;
  const endDate = params.endDate;
  const user = params.user;
  const enterpriseName = params.enterpriseName;
  const pdf = params.pdf;


  let enterprise = await enterpriseModel.findOne({nameEnterprise:enterpriseName}).exec();

//this one to send to front end
  res.status(201).send(enterprise);

});

module.exports = router;