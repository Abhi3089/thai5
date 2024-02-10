require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authController = require("./controllers/authController");
const uploadController = require("./controllers/uploadController");
const tourController = require("./controllers/tourController");
const categoryController = require("./controllers/categoryController");
const wishController = require("./controllers/wishController");
// const mailController = require("./controllers/mailController");
const app = express();

// db connecting
mongoose.connect(process.env.MONGO_URL, {

})
  .then(() => console.log("Db is connected"))
  .catch((error) => console.log("Error connecting to Db:", error));

// middlewares
app.use(cors());
const path=require("path");
app.use(express.json());


app.use(express.urlencoded({ extended: true }));



// to serve images inside public folder
app.use('/images', express.static('public/images'));

app.use("/auth", authController);
app.use("/tour", tourController);
app.use("/category", categoryController);
app.use('/upload', uploadController);
app.use('/wishList', wishController);
// app.use('/mail', mailController);
// Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("build"));

  // index.html for all page routes  html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"build", "index.html"));
  });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));