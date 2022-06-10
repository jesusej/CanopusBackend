const enterpriseModel = require("./../../models/Enterprise");

function sumChargesAndDeposits(movements){
  let result = {
    charge: 0,
    deposit: 0
  }

  if(movements.length > 0){
    for(let movement of movements){
      if (movement.charge) result.charge += movement.charge;
      if (movement.deposit) result.deposit += movement.deposit;
    }
  }

  return result;
}

function generateSums(accounts){
  let sons = [];
  let nearestFather = [];
  let fathers = [];

  for(let pos = 0; pos < accounts.length; pos++){
    const account = accounts[pos];
    const index = account.level - 1;
    let result;

    //console.log(account)

    result = {
      code: account.code,
      name: account.nameAccount,
      initialBalance: 0,
      actualBalance: 0,
      father: (nearestFather[index-1]) ? nearestFather[index-1].code : null,
      charge: 0,
      deposit: 0,
    }

    if(!account.affectable){
      console.log("New father at " +  pos);

      nearestFather[index] = result;
      fathers.push({... result, subAccounts: []})
      
    }
    else {
      const sums = sumChargesAndDeposits(account.movements);
      const actualBalance = account.initialBalance + sums.charge - sums.deposit;

      // Defining result
      result.initialBalance = account.initialBalance;
      result.deposit = sums.deposit;
      result.charge = sums.charge;
      result.actualBalance = actualBalance;

      // Updating father account

      const fatherIndex = fathers.findIndex(father => father.code === result.father);
      
      fathers[fatherIndex].initialBalance += result.initialBalance;
      fathers[fatherIndex].actualBalance += result.actualBalance;
      fathers[fatherIndex].charge += result.charge;
      fathers[fatherIndex].deposit += result.deposit;
      
      fathers[fatherIndex].subAccounts = [... fathers[fatherIndex].subAccounts, result]
    }
  }
  console.log(sons);
  //console.log(fathers);

  fathers.reverse();

  //for(let son of )

  for(let son of fathers){
    const fatherName = son.father;
    if(fatherName !== null){
      const fatherIndex = fathers.findIndex(father => father.code === fatherName);

      console.log(fatherIndex);
      
      if(fatherIndex !== -1){
        console.log(son.name + " es hijo de " + fathers[fatherIndex].name + " " + fathers[fatherIndex].code)
        fathers[fatherIndex].initialBalance += son.initialBalance;
        fathers[fatherIndex].actualBalance += son.actualBalance;
        fathers[fatherIndex].charge += son.charge;
        fathers[fatherIndex].deposit += son.deposit;
        fathers[fatherIndex].subAccounts = [... fathers[fatherIndex].subAccounts, son]
      }
  }
  }
  console.log(fathers);

  fathers.reverse();

  return fathers;
}

async function generateTrialBalance(nameEnterprise){
  const enterprise = await enterpriseModel.findOne({nameEnterprise}).exec();

  if(enterprise && enterprise.accounts){
    const accounts = enterprise.accounts;

    const dataSet = generateSums(accounts);

    /*const debtor = accounts.filter(account => (account.type[0] === "A") || (account.type[0] === "G"))
    const creditor = accounts.filter(account => (account.type[0] === "D") || (account.type[0] === "F") || (account.type[0] === "H"))*/

    
    return dataSet
  }
}

module.exports = generateTrialBalance;