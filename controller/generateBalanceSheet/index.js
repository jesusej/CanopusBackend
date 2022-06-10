const generateIncomeStatement = require("../generateIncomeStatement");
const enterpriseModel = require("./../../models/Enterprise");

function reverseArray(arr){
    return arr.reverse();
}

  function sumMovements(movements){
    if(movements.length > 0){
      let sum = 0;
      for(let movement of movements){
        if (movement.charge) sum += movement.charge;
        else if (movement.deposit) sum -= movement.deposit;
      }
      return sum;
    } else return 0;
}

function generateSums(accounts, comparer, type){
    let sons = [];
    let lastFather = [{name: accounts[0].nameAccount, sum: 0}];
    let fathers = [{name: accounts[0].nameAccount, sum: 0, subAccounts: []}];
    let result;
  
    for(let account of accounts){
      const index = account.level - 1; 
      if(account.level > 1){
        if(!account.affectable){
          result = {
            name: account.nameAccount, 
            level: account.level, 
            sum: 0, 
            father: lastFather[index-1].name, 
            subAccounts: []
          }
          lastFather[index] = result
          fathers.push(result)
  
        }
        else if(account.movements.length > 0 || account.initialBalance){
          let sum = sumMovements(account.movements);
          
          if(type === "Activo") sum += account.initialBalance;
          else sum = account.initialBalance - sum;
  
          if(!account.type.includes(comparer)) sum *= -1;
          
          result = {
            name: account.nameAccount,
            father: lastFather[index-1].name,
            sum
          }
          fathers[fathers.length-1].sum += sum;
          fathers[fathers.length-1].subAccounts = [... fathers[fathers.length-1].subAccounts, result]
  
          sons = [... sons, result]
        }
      }
    }
    console.log(fathers)
  
    fathers = reverseArray(fathers);
  
    for(let son of fathers){
      const fatherName = son.father;
      const fatherIndex = fathers.findIndex(father => father.name === fatherName);
  
      console.log(fatherIndex);
      
      if(fatherIndex !== -1){
        fathers[fatherIndex].sum += son.sum;
        fathers[fatherIndex].subAccounts = [... fathers[fatherIndex].subAccounts, son]
      }
    }
  
    fathers[fathers.length-1].subAccounts.reverse()
  
    return fathers[fathers.length - 1];
}

async function generateBalanceSheet(nameEnterprise){
    const enterprise = await enterpriseModel.findOne({nameEnterprise}).exec();
  
    if(enterprise && enterprise.accounts){
      const accounts = enterprise.accounts;
  
      const active = accounts.filter(account => account.type[0] === "A" || account.type[0] === "B")
      const pasive = accounts.filter(account => account.type[0] === "D")
      const capital = accounts.filter(account => account.type[0] === "F")
  
      const activeSums = generateSums(active, "Deudora", "Activo");
      const pasiveSums = generateSums(pasive, "Acreedora", "Pasivo");
      const capitalSums = generateSums(capital, "Acreedora", "Capital");
  
      console.log(activeSums)
      console.log(pasiveSums)
      console.log(capitalSums)
  
      let income = await generateIncomeStatement("", "", nameEnterprise, "")
  
      console.log(income);
  
      return {active: activeSums, pasiveAndCapital: {
        pasive: pasiveSums,
        capital: capitalSums,
        profit: income.profit.accumulated,
        profitAndCapital: capitalSums.sum + income.profit.accumulated,
        sum: capitalSums.sum + income.profit.accumulated + pasiveSums.sum
      }}
    }
}

module.exports = generateBalanceSheet;