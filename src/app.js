const express = require("express");
const connectionDB = require("./database/auth");

const app = express();
require("dotenv").config();
connectionDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(7777, () => {
      console.log("server successfully started");
    });
  })
  .catch(console.error());
