// to add environmental variables defined in folder
require("dotenv/config");
const mongoose = require("mongoose");

// gives URL for the database using env file to prevent exposing of the private urls
const URL_DB = process.env.MONGO_CONNECTION_STRING;

// code for connection of mongodb database with given URL
mongoose
  .connect(URL_DB)
  .then(() => {
    console.log("DB Connection establisheed");
  })
  .catch((err) => {
    console.log("Error in connection: ", err.message);
  });

const database = mongoose.connection;
module.exports = database;
