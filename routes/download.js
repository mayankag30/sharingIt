const express = require("express");
const router = express.Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });

    if (!file) {
      return res.render("download", {
        error: "Link has been expired",
      });
    }

    // get the filePath
    const filePath = `${__dirname}/../${file.path}`;
    // to Download the file
    res.download(filePath);
  } catch (err) {
    return res.render("download", {
      error: "Something Went Wrong",
    });
  }
});

module.exports = router;
