const express = require("express");
const connectionDB = require("./database/auth");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/", cookieParser());
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
