const multer = require("multer");
const xlsx = require("xlsx");
const express = require("express");
const mongoose = require("mongoose");

const enterpriseModel = require("../../models/Enterprise");

let router = express.Router();

var storage = multer.memoryStorage();

var upload = multer({
    storage: storage
});

router.post("/uploadXlsx", upload.fields([{name: 'file'}, {name: 'file2'}]), manageFiles);

async function manageFiles(req, res) {

  let files = [req.files.file[0], req.files.file2[0]]
  let accounts;

  try {
    accounts = await uploadAccounts(files[0]);
    accounts = await uploadMovements(files[1], accounts);

    const enterprise = new enterpriseModel({nameEnterprise: "FlexBPO", accounts:accounts});

    await enterprise.save();

    console.log(enterprise);

    return res.status(201).send(enterprise);
  } catch(e) {
    console.log(e);

    return res.status(406).send("Failure");
  }
}

async function uploadAccounts(file) {
  let workbook = xlsx.read(file.buffer);
  let sheet_name_list = workbook.SheetNames;
  let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  let accounts = []
  
  for(let line of data){
    let account = {
      level : null,
      code : "",
      nameAccount : "",
      type : "",
      initialBalance: 0,
      affectable : false,
      movements: []
    }

    if(typeof line["CONTPAQ i"] === "number"){
      account.level = line["CONTPAQ i"];
      account.code = line["__EMPTY"];
      account.nameAccount = line["__EMPTY_1"];
      account.type = line["__EMPTY_2"];
      account.affectable = line["__EMPTY_3"] == "Afectable";

      accounts = [... accounts, account];
    }
  }
  
  return accounts;
}

function uploadMovements(file, accounts) {
  let workbook = xlsx.read(file.buffer);
  let sheet_name_list = workbook.SheetNames;
  let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  let index = 0;
  for (let line of data) {
    let account = "";

      if (Object.keys(line).length >= 4 && line["CONTPAQ i"] !== undefined && line["__EMPTY"] !== "") {
          if (String(line["CONTPAQ i"]).match(/\d{3}-\d{3}/)) {
              account = line["CONTPAQ i"];
              initialBalance = line["Hoja:      1"];
              
              index = accounts.findIndex(a => a.code === account)
              
              accounts[index].initialBalance = initialBalance;
          } else {
              if (Object.keys(line).length >= 6 && line["CONTPAQ i"] !== "Fecha") {
                  let movement = {
                    date: "",
                    type: "",
                    concept: "",
                    charge: null,
                    deposit: null
                  }

                  movement.date = line["CONTPAQ i"];
                  movement.type = line["__EMPTY"];
                  movement.concept = line["Lecar Consultoria en TI, S.C."];
                  movement.charge = line["__EMPTY_3"];
                  movement.deposit = line["Hoja:      1"];
                  
                  accounts[index].movements = [... accounts[index].movements, movement]
              }
          }
      }
    }
    return accounts;
}

module.exports = router;