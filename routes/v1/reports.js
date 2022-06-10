const express = require("express");

const generateIncomeStatement = require("./../../controller/generateIncomeStatement");

const generateTrialBalance  = require("../../controller/genrateTrialBalance");

const generateBalanceSheet = require("../../controller/generateBalanceSheet");

let router = express.Router();

router.get("/generate-income-statement/:initialDate/:endDate/:user/:nameEnterprise/:pdf", async(req, res) => {

  let data = await generateIncomeStatement(req.params.initialDate, req.params.endDate, req.params.nameEnterprise, req.params.pdf);
  
  res.status(200).send(data);
});

router.get("/trial-balance/:nameEneterprise", async(req, res) => {

  let data = await generateTrialBalance(req.params.nameEneterprise);

  res.status(200).send(data);
});

router.get("/balance-sheet/:nameEneterprise", async(req, res) => {
  let data = await generateBalanceSheet(req.params.nameEneterprise);

  res.status(200).send(data);
})

module.exports = router;