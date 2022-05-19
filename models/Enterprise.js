const mongoose = require("mongoose");
const account = require("./Accounts")

const enterpriseSchema = new mongoose.Schema({
  nameEnterprise: {
    type: String,
    required: true,
  },
  accounts: [account.accountSchema]
})

const enterprise = mongoose.model("enterprises", enterpriseSchema)
module.exports =  enterprise;