const express = require("express");
const {
  fetchTVShows,
  fetchTVShow,
  searchShows,
  fetchTVShowCast,
  fetchTVShowUrls,
} = require("../controllers/shows.Controller");
const Router_shows = express.Router();

// Endpoints to retrieve all TV shows based on page number
Router_shows.get("/", fetchTVShows);

// Endpoints to retrieve TV shows based on search titles
Router_shows.get("/search", searchShows);

// Endpoints to retrieve details about a single TV show based on the given ID
Router_shows.get("/:id", fetchTVShow);

// Endpoints to retrieve movie URLs based on the given ID
Router_shows.get("/urls/:id", fetchTVShowCast);

// Endpoints to retrieve TV show cast based on the given ID
Router_shows.get("/cast/:id", fetchTVShowUrls);
module.exports = Router_shows;
