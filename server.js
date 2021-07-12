const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
// Setting up config.env file for all the environment variables
dotenv.config({ path: "./config/config.env" });

// Connect the Database
connectDB();

// Declaring the app
const app = express();

// Initializing the PORT
const PORT = process.env.PORT || 3000;

// View(Template) Engine to be configured
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// TO allow express take json data
app.use(express.json());

// Initialize Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

// App Listening
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
