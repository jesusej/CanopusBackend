const db = require("./db");
const enterpriseModel = require("./../models/Enterprise");
const { accountModel } = require("./../models/Accounts");

const { generateXlsx } = require("./../tools/xlsxConverter");
const manageFiles = require("../controller/fileManager");
const test = require("./test.json");

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe("File manager for xlsx tests", () => {

  it("When the enterprise doesn't have any accounts", async () => {
    const expectedResult = test.expectedResult;

    const nameEnterprise = expectedResult.nameEnterprise;
    const username = expectedResult.username;

    let originalEnterprise = new enterpriseModel({ nameEnterprise, accounts: [] });
    await originalEnterprise.save();

    console.log("Test prepared");

    // Generate xlsx
    const sheetsJson = test.sheets;
    let files = [
      generateXlsx(sheetsJson[0]),
      generateXlsx(sheetsJson[1])
    ]

    // Call driver function
    let enterprise = await manageFiles(files, nameEnterprise, username);

    // Compare
    expect(enterprise.nameEnterprise).toEqual(nameEnterprise);

    const expectedAccounts = expectedResult.accounts;
    const enterpriseAccounts = enterprise.accounts;
    
    let flag = false;
    if(expectedAccounts.length === enterpriseAccounts.length){
      for(let index; index < expectedAccounts.length; index++){
        const expectedAccount = expectedAccounts[index];
        const enterpriseAccount = enterpriseAccounts[index];
        
        expect(expectedAccount.level).toEqual(enterpriseAccount.level);
        expect(expectedAccount.nameAccount).toEqual(enterpriseAccount.nameAccount);
        expect(expectedAccount.type).toEqual(enterpriseAccount.type);
        expect(expectedAccount.code).toEqual(enterpriseAccount.code);
        expect(expectedAccount.affectable).toEqual(enterpriseAccount.affectable);
        
        if(expectedAccount.movements.length !== enterpriseAccount.movements.length){
          flag = true;
        } else {
          const expectedMovements = expectedAccount.movements;
          const enterpriseMovements = enterpriseAccount.movements;
          for(let j; j < expectedMovements.length; j++){
            const expectedMovement = expectedMovements[j];
            const enterpriseMovement = enterpriseMovements[j];

            expect(expectedMovement.date).toEqual(enterpriseMovement.date.getISOString().substring(0,4));
            expect(expectedMovement.type).toEqual(enterpriseMovement.type);
            expect(expectedMovement.concept).toEqual(enterpriseMovement.concept);
            expect(expectedMovement.date).toEqual(enterpriseMovement.date);
            expect(expectedMovement.date).toEqual(enterpriseMovement.date);
          }
        }
      }
    } else {
      flag = true;
    }

    expect(flag).toBeFalsy();
  });

  /*it("When the enterprise already has some accounts", async () => {
    let extraAccount = new accountModel({
      level: 1,
      nameAccount: "Cuenta extra",
      type: "tipo",
      code: "000-0200",
      affectable: false,
    })
    let expectedResult = test.expectedResult;
    expectedResult.accounts += extraAccount;

    const nameEnterprise = expectedResult.nameEnterprise;
    const username = expectedResult.username;

    let originalEnterprise = new enterpriseModel({ nameEnterprise, accounts: [] });
    await originalEnterprise.save();

    console.log("Test prepared");

    // Generate xlsx
    const sheetsJson = test.sheets;
    let files = [
      generateXlsx(sheetsJson[0]),
      generateXlsx(sheetsJson[1])
    ]

    // Call driver function
    let enterprise = await manageFiles(files, nameEnterprise, username);

    // Compare
    expect(enterprise.nameEnterprise).toEqual(nameEnterprise);

    const expectedAccounts = expectedResult.accounts;
    const enterpriseAccounts = enterprise.accounts;
    
    let flag = false;
    if(expectedAccounts.length === enterpriseAccounts.length){
      for(let index; index < expectedAccounts.length; index++){
        const expectedAccount = expectedAccounts[index];
        const enterpriseAccount = enterpriseAccounts[index];
        
        expect(expectedAccount.level).toEqual(enterpriseAccount.level);
        expect(expectedAccount.nameAccount).toEqual(enterpriseAccount.nameAccount);
        expect(expectedAccount.type).toEqual(enterpriseAccount.type);
        expect(expectedAccount.code).toEqual(enterpriseAccount.code);
        expect(expectedAccount.affectable).toEqual(enterpriseAccount.affectable);
        
        if(expectedAccount.movements.length !== enterpriseAccount.movements.length){
          flag = true;
          console.log("One of the movements array is larger than the other");
        } else {
          const expectedMovements = expectedAccount.movements;
          const enterpriseMovements = enterpriseAccount.movements;
          for(let j; j < expectedMovements.length; j++){
            const expectedMovement = expectedMovements[j];
            const enterpriseMovement = enterpriseMovements[j];

            expect(expectedMovement.date).toEqual(enterpriseMovement.date.getISOString().substring(0,4));
            expect(expectedMovement.type).toEqual(enterpriseMovement.type);
            expect(expectedMovement.concept).toEqual(enterpriseMovement.concept);
            expect(expectedMovement.date).toEqual(enterpriseMovement.date);
            expect(expectedMovement.date).toEqual(enterpriseMovement.date);
          }
        }
      }
    } else {
      flag = true;
      console.log("One of the accounts array is larger than the other");
    }

    expect(flag).toBeFalsy();
  });*/
});