# Canopus Backend

Backend implementation for Canopus Data Capturer with Express and NodeJS

## Table of Contents
- [Canopus Backend](#canopus-backend)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [First steps](#first-steps)
    - [How to run development mode](#how-to-run-development-mode)
    - [How to install/uninstall dependencies](#how-to-installuninstall-dependencies)
  - [Tests](#tests)
    - [How to add new tests](#how-to-add-new-tests)
  - [Notes to remember](#notes-to-remember)
  - [Useful info/resources](#useful-inforesources)

## Requirements

- Node v16.14.2
- npm v8.3.0

## First steps

### How to run development mode

1. Download the file `.env` (check the Discord) and place it in the base dir `...\CanopusBackend`
2. Open a terminal un workspace or the VSCode integrated terminal
3. If first time, install the server dependencies with `npm i`
4. Run development mode with `npm run dev`

### How to install/uninstall dependencies

1. Go to the base dir: `...\CanopusBackend`
2. Install node packages with npm:
   - For production dependencies: `npm install <package-name>`
   - For development dependencies: `npm install -D <package-name>`
3. Add a commit starting a `:heavy_plus_sign:` emoji
4. If you messed up or if you want to uninstall a dependency, use `npm uninstall <package-name>`

## Tests

To run tests run `npm test` to start the test suite. Remember that all the tests must be accepted and not fail. The test suite is built with JEST and MongoDBMemoryServer library.

### How to add new tests

1. In the `/tests` folder add a new file `<name of function to test>.test.js` (try to name the file with the same name as your function)
2. When you start your test file ALWAYS call the `db.js` file to create a local MongoDB server on your PC
3. Call the functions of the db.js with the `beforeAll`, `afterEach` and `afterAll` to manage correctly your local DB. By the moment your file must look like this:    
   ```javascript
   const db = require("./db.js")
   /* Add here the functions or dependencies you want to test or add*/

   beforeAll(async () => await db.connect());

   afterEach(async () => await db.clearDatabase());

   afterAll(async () => await db.closeDatabase());
   ```
4. Start your test suite with a `describe()` function. Add a string with a phrase that describes your suite of tests like `describe("A test suite that tests numbers")`. Next to the string add a `,` and start a new function
5. Inside the function call the `it()` function and give it a name like the function before and open a new function, here you will define your test. Your `describe` function must look like this:    
   ```javascript
   describe("A test suite that tests numbers", () => {
     it("When you get a number from DB", () => {
       /* Here you will define your test */
     })
   })
   ```
6. As you must know, your local DB is not the same as the one hosted in the cloud, so you must prepare it. Start with adding a Mongoose model, add the data you need first and save it. Remember that you must call your model at the top of the file.    
```javascript
   describe("A test suite that tests numbers", () => {
     it("When you get a number from DB", () => {
       let originalModel = new myModel({/*Here add the data you need*/})
       originalModel.save()
     })
   })
   ```
7. After this call your function and do the tests you need. To qualify your test as a success you need to compare the result with an expected result with like the function `expect().toEqual()`. You can prepare it inside your test or with an outside JSON. At the end your testFile structure must look somewhat like this:
```javascript
   const db = require("./db.js")
   const myFunction = require("./<path to function>/myFunction.js")
   const myModel = require("./<path to model>/myModel.js")
   /* Add here the functions or dependencies you want to test or add*/

   beforeAll(async () => await db.connect());

   afterEach(async () => await db.clearDatabase());

   afterAll(async () => await db.closeDatabase());

   describe("A test suite that tests numbers", () => {
     it("When you get a number from DB", () => {
       // Defining expected result
       let expectedResult = {
         /*Add here your data with the SAME variables names as your result*/
       }

       // Creating model to save in DB
       let originalModel = new myModel({/*Here add the data you need*/})
       originalModel.save()
       /* Add here more data that you need to prepare */

       // Calling function
       let result = myFunction(/* Put here your data that your function needs */)
       
       // Compare results
       expect(result).toEqual(expectedResult)
     })
   })
```    

**WARNING**
- This test is to learn the structure of a test. This test will not run if you copy and paste it.
- If you want to test a mongoose model, be careful. Moongoose objects have a variable called `_id` that is randomly generated so a simple `expect().toEqual()` will probably not work so you need to try another ways or JEST functions to test your function. You have been warned. 


## Notes to remember

- If you want to modify the DB for yourself you need to use a tool to connect to the DB. You can access with the MongoDB or use MongoDB Compass
- Only push/merge to main if you think that your implementation is ready enough. Remember to work with branches meanwhile
- Always try to keep your code and methods clean. Keep the routes functions on the `/routes` folder, controller functions on the `/controller` folder and atomize your functions to be easier to mantain.
  - If you have multiple files for your controller functions, keep it in one folder.
- Always run the `npm test` to check that your function did not harm the other functions built


## Useful info/resources
- [Postman API tester](https://www.postman.com)
- [Mongoose docs](https://mongoosejs.com/docs/api.html#)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass)
- [Express docs](http://expressjs.com/en/4x/api.html)
- [Gitmoji](https://gitmoji.dev)