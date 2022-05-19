const enterpriseModel = require("./../../models/Enterprise");

function sumMovements(movements){
  let sum = 0;
  for(let movement of movements){
    if (movement.charge) sum -= movement.charge;
    else if (movement.deposit) sum += movement.deposit;
  }
  return sum;
}

function generateDataSet(initialDate, endDate, accounts){
  let dataSet = [];
  let father = -1;
  for(let account of accounts){
    console.log(account);

    if(account.level !== 1){
      if(account.affectable && account.movements.length > 0){
        let periodSum = sumMovements(account.movements);

        let stateAccount = {name: account.nameAccount, periodSum, accumulatedSum: periodSum + account.initialBalance}

        if(account.level === 3){
          console.log(dataSet);
          dataSet[father].subAccounts = [... dataSet[father].subAccounts, stateAccount] ;

          dataSet[father].periodTotal += periodSum;
          dataSet[father].accumulatedTotal += periodSum;
        } else {
          dataSet = [... dataSet, stateAccount];
          father++;
        }

      } else if(!account.affectable) { 
        let fatherAccount = {name: account.nameAccount, periodTotal: 0, accumulatedTotal: account.initialBalance || 0, subAccounts: []}
        dataSet = [... dataSet, fatherAccount];

        father++;
      }
    }
  }

  console.log(dataSet[0]);

  return dataSet;
}

async function generateIncomeStatement(initialDate, endDate, nameEnterprise, pdf){
  const enterprise = await enterpriseModel.findOne({nameEnterprise}).exec();

  if(enterprise && enterprise.accounts){
    const accounts = enterprise.accounts;
    
    const income = accounts.filter(account => account.type[0] === "H");
    const outcome = accounts.filter(account => account.type[0] === "G");

    //let incomeSums = generateDataSet(initialDate, endDate, income);
    let outcomeSums = generateDataSet(initialDate, endDate, outcome);

    //console.log(incomeSums);
    console.log(outcomeSums);

    return {outcomeSums};
  } else {
    console.log("Not found");
    return null;
  }
}

module.exports = generateIncomeStatement;