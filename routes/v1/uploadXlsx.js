const multer = require("multer");
const express = require("express");

const manageFiles = require("../../controller/fileManager");

let router = express.Router();

var storage = multer.memoryStorage();

var upload = multer({
    storage: storage
});

router.post("/upload-xlsx", upload.fields([{name: 'file'}, {name: 'file2'}]), async (req, res) => {
    try {
        let data = [
            req.files.file[0], 
            req.files.file2[0]
          ]
        let nameEnterprise = req.body.nameEnterprise;
        let username = req.body.username;

        let enterprise = await manageFiles(data, nameEnterprise, username);

        console.log("Success!!");
        return res.status(201).send(enterprise);
    } catch(e) {
        console.log(e);
        return res.status(406).send("Failure");
    }
});

module.exports = router;