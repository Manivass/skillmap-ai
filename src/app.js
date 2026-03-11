const express = require("express");
const connectionDB = require("./database/auth");
const userRouter = require("./routes/userRouter");

const app = express();
require("dotenv").config();
app.use("/", express.json());
app.use("/", userRouter);

connectionDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(7777, () => {
      console.log("server successfully started");
    });
  })
  .catch(console.error());
