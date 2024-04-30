const express = require("express");
const MediaExtraction = require("../controllers/media.controller");

const Router_media = express.Router();

Router_media.get("/", MediaExtraction);

module.exports = Router_media;
