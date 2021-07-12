const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: false,
    },
    reciever: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
