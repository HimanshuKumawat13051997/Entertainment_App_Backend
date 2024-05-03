const mongoose = require("mongoose");

// Schema for TVShows to store in mongoDB
const tvShowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imdbid: {
    type: String,
  },
  rating: {
    type: Number,
  },
  rated: {
    type: String,
  },
  language: {
    type: String,
    required: true,
  },
  firstAirDate: {
    type: Date,
    required: true,
  },
  lastAirDate: {
    type: Date,
  },
  status: {
    type: String,
  },
  genres: {
    type: [String],
  },
  summary: {
    type: String,
    required: true,
  },
  cast: {
    type: [String],
  },
  homepage: {
    type: String,
  },
  bannerUrl: {
    type: String,
  },
  posterUrl: {
    type: String,
  },
});

// below exports the model for adding it in controllers for populating tvshows
const Shows = mongoose.model("Shows", tvShowSchema);

module.exports = Shows;
