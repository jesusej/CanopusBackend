const db = require("./db");
const enterpriseModel = require("./../models/Enterprise");

const generateIncomeStatement = require("../controller/generateIncomeStatement");
const dummy = require("./dummyDB.json");

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe("File manager for xlsx tests", () => {
  it("Generating incomeStatement", async() => {
    const initialDate = "01-Jun-2016";
    const endDate = "30-Jun-2016";
    const nameEnterprise = "test";

    const enterprise = new enterpriseModel(dummy);
    await enterprise.save();

    console.log("Test prepared");

    let incomeStatement = await generateIncomeStatement(initialDate, endDate, nameEnterprise, false);

    console.log(incomeStatement)

    expect(false).toBeFalsy();
  });
});