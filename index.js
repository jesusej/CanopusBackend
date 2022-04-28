const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const enterpriseModel = require("./models/Enterprise");

let xlsxRoutes = require("./routes/v1/cargaXlsx");

let PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
  cors({
    methods: ["GET", "POST"],
  })
);

app.use('/xlsx', xlsxRoutes);

mongoose.connect(process.env.KEY, {
  useNewUrlParser: true,
});

app.get("/", async (req, res) => {
  enterpriseModel.find({}, (err, docs) => {
    if (err) {
      res.send(err);
      console.log(err);
    }
    res.send(docs);
    console.log(docs);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})