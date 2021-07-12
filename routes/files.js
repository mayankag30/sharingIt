const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuid4 } = require("uuid");
const router = express.Router();
const File = require("../models/file");
const sendMail = require("../services/emailService");
const emailTemplate = require("../services/emailTemplate");

// Configuration of multer
// Disk Storage
let storage = multer.diskStorage({
  // Where to store the file
  // cb is callback
  // cb(error = null, destination = "uploads/")
  destination: (req, file, cb) => cb(null, "uploads/"),
  // to generate the unique filename
  // Ex: 3456765-234566754.jpeg
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
      // extname = to get the extension of the file from the filename
    )}${path.extname(file.originalname)}`;
    // cb(error = null, uniqueName = uniqueName)
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  // Set the file limit
  // Number should be calculated in bytes
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");
// myfile:  field of request or the name attribute of the form in frontend

router.post("/", (req, res) => {
  // Store the file in folder: uploads
  upload(req, res, async (err) => {
    // Validate the request
    if (!req.file) {
      return res.json({
        error: "All fields are required",
      });
    }

    if (err) {
      return res.status(500).send({
        error: err.message,
      });
    }

    // incase of no error - Store into Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      // destination = path
      path: req.file.path,
      size: req.file.size,
    });

    // save
    const response = await file.save();
    return res.json({
      // Generating the link for download
      // Ex: https://localhost:3000/files/jnvjdbvueb458klns
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  // Validate the request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({
      error: "All fields are required",
    });
  }

  // Get data from database
  const file = await File.findOne({
    uuid: uuid,
  });

  // check if that file exists with that uuid
  // if (!file) {
  // }

  // send the email only once from a particular sender. Not again
  if (file.sender) {
    return res.status(422).send({
      error: "Email already sent",
    });
  }

  // set the sender and reciever and save the file now
  file.sender = emailFrom;
  file.reciever = emailTo;
  const response = await file.save();

  // Send email
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Download Your FILE",
    text: `${emailFrom} shared a file with you`,
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + " KB",
      expires: "24 hours",
    }),
  });

  return res.send({
    success: true,
  });
});

module.exports = router;
