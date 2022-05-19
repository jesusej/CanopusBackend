const express = require("express");

let router = express.Router();

let xlsxRoute = require("./uploadXlsx");

router.use('/xlsx', xlsxRoute);

module.exports = router;