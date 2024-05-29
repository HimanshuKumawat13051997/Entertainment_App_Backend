const express = require("express");
const {
  Extra_extraction,
  Ex_filter,
} = require("../controllers/extra.controller");

const Router_extra = express.Router();

// Endpoint to retrieve all movies based on page number
Router_extra.get("/", Extra_extraction);

Router_extra.get("/info", Ex_filter);
// // Endpoint to search for movies based on titles
// Router_extra.get("/search", searchFeature);

// // Endpoint to fetch details about a single movie based on its ID
// Router_extra.get("/:id", Movie_extraction);

// // Endpoint to fetch movie URLs based on their IDs
// Router_extra.get("/urls/:id", getMovieUrls);

// // Endpoint to fetch movie cast based on their IDs
// Router_extra.get("/cast/:id", getMovieCast);

module.exports = Router_extra;
