const express = require("express");

let router = express.Router();

router.get("/generate-income-statement", async(req, res) => {
  const params = req.params;

  const initialDate = params.initialDate;
  const endDate = params.endDate;
  const user = params.user;
  const enterpriseName = params.enterpriseName;
  const pdf = params.pdf;

  generateIncomeStatement(initialDate, endDate, enterpriseName, pdf);

  

  res.status(201).send();
});