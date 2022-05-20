const enterpriseModel = require("./../../models/Enterprise");
const { generatePercentages, generateSums } = require("./movementAdder");

async function generateIncomeStatement(initialDate, endDate, nameEnterprise, pdf){
  console.log(nameEnterprise);
  const enterprise = await enterpriseModel.findOne({nameEnterprise}).exec();
  console.log(enterprise);

  if(enterprise && enterprise.accounts){
    const accounts = enterprise.accounts;
    
    const income = accounts.filter(account => account.type[0] === "H");
    const outcome = accounts.filter(account => account.type[0] === "G");

    let incomeSums = generateSums(initialDate, endDate, income);
    let outcomeSums = generateSums(initialDate, endDate, outcome);

    const incomeTotalPeriod = incomeSums.periodTotal;
    const incommeTotalAccumulated = incomeSums.accumulatedTotal;;

    incomeSums = generatePercentages(incomeSums, incomeTotalPeriod, incommeTotalAccumulated);
    outcomeSums = generatePercentages(outcomeSums, incomeTotalPeriod, incommeTotalAccumulated);

    profit = {
      period: incomeTotalPeriod - outcomeSums.periodTotal,
      periodPercentage: incomeSums.periodPercentage - outcomeSums.periodPercentage,
      accumulated: incommeTotalAccumulated - outcomeSums.accumulatedTotal,
      accumulatedPercentage: incomeSums.accumulatedPercentage - outcomeSums.accumulatedPercentage
    }

    return {income: incomeSums, outcome: outcomeSums, profit};
  } else {
    console.log("Not found");
    return null;
  }
}

module.exports = generateIncomeStatement;