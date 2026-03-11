const mongoose = require("mongoose");
require("dotenv").config();
async function connectionDB() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
}

module.exports = connectionDB;
