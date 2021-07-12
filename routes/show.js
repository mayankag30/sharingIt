const express = require("express");

const File = require("../models/file");
const router = express.Router();

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });

    if (!file) {
      return res.render("download", {
        error: "Link. has been expired",
      });
    }

    return res.render("download", {
      // Sending the data to the front-end: view-engine
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      // Ex: http://localhost:3000/files/download/14r22edsdcnejv
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (err) {
    // console.error(err);
    return res.render("download", {
      error: "Something went Wrong",
    });
  }
});

module.exports = router;
