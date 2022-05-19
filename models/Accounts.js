const mongoose = require("mongoose");
const movements = require("./Movements")

const accountSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: false,
  },
  nameAccount: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  initialBalance: {
    type: Number,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
  affectable: {
    type: Boolean,
    required: false,
  },
  movements: [movements.movementsSchema]
})

const accountModel = mongoose.model("accounts", accountSchema);

module.exports = {accountSchema, accountModel};