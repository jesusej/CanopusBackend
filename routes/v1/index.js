const express = require("express");

let router = express.Router();
let balance = require("./balance")

let xlsxRoute = require("./uploadXlsx");

router.use('/balance', balance);
router.use('/xlsx', xlsxRoute);

module.exports = router;