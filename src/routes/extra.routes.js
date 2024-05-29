const express = require("express");
const {
  Extra_extraction,
  Ex_filter,
  Ex_extraction,
  exsearchFeature,
} = require("../controllers/extra.controller");

const Router_extra = express.Router();

// Endpoint to retrieve all movies based on page number
Router_extra.get("/", Extra_extraction);

//endpoint to retrieve all movies based on filters
Router_extra.post("/info", Ex_filter);

// Endpoint to search for movies based on titles
Router_extra.get("/search", exsearchFeature);

// Endpoint to fetch details about a single movie based on its ID
Router_extra.get("/:id", Ex_extraction);

// // Endpoint to fetch movie URLs based on their IDs
// Router_extra.get("/urls/:id", getMovieUrls);

// // Endpoint to fetch movie cast based on their IDs
// Router_extra.get("/cast/:id", getMovieCast);

module.exports = Router_extra;
