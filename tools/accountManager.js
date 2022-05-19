const { accountModel } = require("../models/Accounts");

async function createAccounts(data) {
  let accounts = []
  
  for(let line of data){
    if(typeof line["CONTPAQ i"] === "number"){
      let newAccount = new accountModel({
        level: line["CONTPAQ i"],
        nameAccount: line["__EMPTY_1"],
        type: line["__EMPTY_2"],
        code: line["__EMPTY"],
        affectable: line["__EMPTY_3"] == "Afectable",
      });

      accounts = [... accounts, newAccount];
    }
  }
  
  return accounts;
}

module.exports =  {createAccounts}