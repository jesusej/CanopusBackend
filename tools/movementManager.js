
const { movementModel } = require("../models/Movements");

function createMovements(data, accounts) {
  
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
                  let newMovement = movementModel({
                    date: line["CONTPAQ i"],
                    type: line["__EMPTY"],
                    concept: line["Lecar Consultoria en TI, S.C."],
                    charge: line["__EMPTY_3"],
                    deposit: line["__EMPTY_4"],
                  })
                  
                  accounts[index].movements = [... accounts[index].movements, newMovement]
              }
          }
      }
    }
    return accounts;
}

module.exports = { createMovements }