const enterpriseModel = require("../models/Enterprise");

const { xlsxToData } = require("./../tools/xlsxConverter");
const { createAccounts } = require("../tools/accountManager");
const { createMovements } = require("../tools/movementManager");

async function manageFiles(files, nameEnterprise, username) {
  let data = [xlsxToData(files[0]), xlsxToData(files[1])];
  let enterprise = await enterpriseModel.findOne({nameEnterprise}).exec();
    
  enterprise = await createEnterpriseAccounts(data, enterprise);
  await enterprise.save();

  return enterprise;
}

async function createEnterpriseAccounts(data, enterprise) {
  let accounts = await createAccounts(data[0]);
  accounts = await createMovements(data[1], accounts);
  enterprise.accounts = accounts;

  return enterprise;
}

module.exports = manageFiles;