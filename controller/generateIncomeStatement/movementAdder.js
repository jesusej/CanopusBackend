function sumMovements(movements){
  if(movements.length > 0){
    let sum = 0;
    for(let movement of movements){
      if (movement.charge) sum -= movement.charge;
      else if (movement.deposit) sum += movement.deposit;
    }
    return Math.abs(sum);
  } else return 0;
}

function generatePercentages(data, period, accumulated){
  let dataSet = data.dataSet;
  for(let i in dataSet){
    for(let j in dataSet[i].subAccounts){
      let subAccount = dataSet[i].subAccounts[j];

      dataSet[i].subAccounts[j].periodPercentage = subAccount.periodSum/period*100;
      dataSet[i].subAccounts[j].accumulatedPercentage = subAccount.accumulatedSum/accumulated*100;
    }
    dataSet[i].periodPercentage = dataSet[i].periodTotal/period*100;
    dataSet[i].accumulatedPercentage = dataSet[i].accumulatedTotal/accumulated*100;
  }

  data.dataSet = dataSet;
  periodPercentage = data.periodTotal/period*100;
  accumulatedPercentage = data.accumulatedTotal/accumulated*100;

  return {... data, periodPercentage, accumulatedPercentage};
}

function generateSums(initialDate, endDate, accounts){
  let dataSet = [];
  let father = -1;
  let dataSetPeriodTotal = 0;
  let dataSetAccumulatedTotal = 0;

  for(let account of accounts){

    if(account.level > 1){
      if(account.level < 3 && (account.initialBalance || !account.affectable)){
        let periodTotal = 0, accumulatedTotal = 0;
        
        if(account.initialBalance && account.affectable){
          periodTotal = sumMovements(account.movements);
          accumulatedTotal = account.initialBalance + periodTotal;
        }

        let fatherAccount = {name: account.nameAccount, periodTotal, accumulatedTotal: accumulatedTotal || 0, subAccounts: []};
        dataSet = [... dataSet, fatherAccount];

        dataSetAccumulatedTotal += accumulatedTotal || 0;
        dataSetPeriodTotal += periodTotal;

        father++;

      } else if(typeof account.initialBalance !== "undefined" && account.level > 2) {
        let periodSum = sumMovements(account.movements);
        let accumulatedSum = periodSum + account.initialBalance;

        if(accumulatedSum !== 0){
          let stateAccount = {name: account.nameAccount, periodSum, accumulatedSum};

          dataSet[father].subAccounts = [... dataSet[father].subAccounts, stateAccount];
          
          dataSet[father].periodTotal += periodSum;
          dataSet[father].accumulatedTotal += accumulatedSum;

          dataSetAccumulatedTotal += accumulatedSum;
          dataSetPeriodTotal += periodSum;
        }
      }
    }
  }

  return {dataSet, accumulatedTotal:dataSetAccumulatedTotal, periodTotal:dataSetPeriodTotal };
}

module.exports = {generatePercentages, generateSums}