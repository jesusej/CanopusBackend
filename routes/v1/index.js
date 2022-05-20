const express = require("express");

let router = express.Router();

let xlsxRoute = require("./uploadXlsx");
let reportsRoutes = require("./reports");

router.use('/xlsx', xlsxRoute);
router.use('/reports', reportsRoutes);

module.exports = router;