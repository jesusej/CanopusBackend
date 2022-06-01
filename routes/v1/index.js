const express = require("express");

let router = express.Router();
let balance = require("./balance")

let xlsxRoute = require("./uploadXlsx");
let reportsRoutes = require("./reports");

router.use('/balance', balance);
router.use('/xlsx', xlsxRoute);
router.use('/reports', reportsRoutes);

module.exports = router;