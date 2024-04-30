const express = require("express");
const {
  Movies_extraction,
  Movie_extraction,
  getMovieUrls,
  getMovieCast,
  searchFeature,
} = require("../controllers/movie.controller");

const Router_movies = express.Router();

// Endpoint to retrieve all movies based on page number
Router_movies.get("/", Movies_extraction);

// Endpoint to search for movies based on titles
Router_movies.get("/search", searchFeature);

// Endpoint to fetch details about a single movie based on its ID
Router_movies.get("/:id", Movie_extraction);

// Endpoint to fetch movie URLs based on their IDs
Router_movies.get("/urls/:id", getMovieUrls);

// Endpoint to fetch movie cast based on their IDs
Router_movies.get("/cast/:id", getMovieCast);

module.exports = Router_movies;
