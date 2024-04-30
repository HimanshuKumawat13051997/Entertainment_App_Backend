const express = require("express");
const { fetchTrending } = require("../controllers/trending.controller");

const Routes_trend = express.Router();

// to get all trending movies and tv Shows
Routes_trend.get("/", fetchTrending);

// Export the trending routes
module.exports = Routes_trend;
