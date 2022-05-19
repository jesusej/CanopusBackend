const xlsx = require("xlsx");

const db = require("./db");
const enterpriseModel = require("./../models/Enterprise");
const { generateXlsx } = require("./../tools/xlsxConverter");
const manageFiles = require("./../controller/fileManager");

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe("File manager for xlsx tests", () => {

  it("When no accounts", async () => {
    const nameEnterprise = "test";
    const username = "user";

    let originalEnterprise = new enterpriseModel({ nameEnterprise, accounts: [] });
    await originalEnterprise.save();

    /*enterpriseModel.findOne.exec = jest.fn().mockReturnValueOnce({
      name: nameEnterprise,
      accounts: [],
    })*/

    console.log("Test prepared");

    // Generate xlsx
    const testJson = require("./sheets.json");
    let files = [
      generateXlsx(testJson[0]),
      generateXlsx(testJson[1])
    ]

    // Call driver function
    let enterprise = await manageFiles(files, nameEnterprise, username);

    console.log(enterprise);

    // Compare
    expect(enterprise.nameEnterprise).toEqual(nameEnterprise);
  })
})