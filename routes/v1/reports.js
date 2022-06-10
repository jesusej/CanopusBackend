const express = require("express");

const generateIncomeStatement = require("./../../controller/generateIncomeStatement");

let router = express.Router();

router.get("/generate-income-statement/:initialDate/:endDate/:user/:nameEnterprise/:pdf", async(req, res) => {

  let data = await generateIncomeStatement(req.params.initialDate, req.params.endDate, req.params.nameEnterprise, req.params.pdf);
  
  res.status(200).send(data);
});

module.exports = router;