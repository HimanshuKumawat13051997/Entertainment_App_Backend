const database = require("../db/index");
const ObjectId = require("mongoose").Types.ObjectId;

// Fetching TV show collection from the database
const Shows = database.collection("Shows");

// controller to retrieve all TV shows based on page number
const fetchTVShows = async (req, res) => {
  try {
    // Extracting the page number from query parameters
    const page = req.query.page || 1;
    const limit = 20;
    const offset = parseInt(page - 1) * limit;

    // Getting TV shows based on the page number
    const tvShows = await Shows.find(
      {},
      {
        projection: {
          title: 1,
          bannerUrl: 1,
          posterUrl: 1,
          firstAirDate: 1,
          lastAirDate: 1,
          type: 1,
        },
      }
    )
      .skip(offset)
      .limit(limit)
      .toArray();

    const totalTVShows = await Shows.countDocuments();
    // To indicate the total number of pages
    const totalPages = Math.ceil(totalTVShows / limit);

    // If no TV show is found for the given page, send 404 error
    if (tvShows.length === 0 || page > totalPages) {
      res.status(404).send("Page Not Found");
    } else {
      // Sending TV shows, total TV shows, and total page count as a result to the client
      res.status(200).json({ totalTVShows, totalPages, tvShows });
    }
  } catch (err) {
    // Logging the error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// controller to get details about a single TV show using _id
const fetchTVShow = async (req, res) => {
  try {
    // Extracting the id from URL parameters and creating a MongoDB ObjectId for the same

    const idToFetch = new ObjectId(req.params.id);

    // Finding the TV show details using the newly created ObjectId
    const tvShow = await Shows.findOne(
      { _id: idToFetch },
      {
        projection: {
          title: 1,
          firstAirDate: 1,
          lastAirDate: 1,
          rating: 1,
          summary: 1,
          cast: 1,
          genres: 1,
          runtime: 1,
          language: 1,
          posterUrl: 1,
          status: 1,
          type: 1,
        },
      }
    );

    // Sending the result back to the client
    res.status(200).json(tvShow);
  } catch (err) {
    // Logging the error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

// controller to get TV shows based on search titles
const searchShows = async (req, res) => {
  try {
    // To extract the title from query params to search for
    const titleToGet = req.query.title;
    const titleRegex = new RegExp(titleToGet, "i");
    // To query the results using the newly created regex
    const tvSh = await Shows.find(
      { title: { $regex: titleRegex } },
      {
        projection: {
          title: 1,
          bannerUrl: 1,
          firstAirDate: 1,
          lastAirDate: 1,
          type: 1,
          posterUrl: 1,
        },
      }
    ).toArray();

    // If no TV show is found for the given title, return a 404 error
    if (tvSh.length === 0) {
      res.status(404).json({ error: "No TV Shows Found" });
    } else {
      // Sending the result back to the client
      res.status(200).json(tvSh);
    }
  } catch (err) {
    // Logging the error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

// controller to get URLs of a single TV show using _id
const fetchTVShowUrls = async (req, res) => {
  try {
    // Extracting the id from URL parameters and making a MongoDB ObjectId for the same
    const idToFetch = new ObjectId(req.params.id);

    // Finding the TV show URL details using the newly created ObjectId
    const urls = await Shows.findOne(
      { _id: idToFetch },
      {
        projection: {
          homepage: 1,
          trailerUrl: 1,
          imdbUrl: {
            $cond: {
              if: { $eq: ["$imdbId", ""] }, // Check if imdbId exists and is not empty
              then: 0, // If imdbId is empty, return an empty string for imdbUrl
              else: { $concat: ["https://www.imdb.com/title/", "$imdbId"] }, // If imdbId exists, concatenate the URL with found id
            },
          },
        },
      }
    );

    // Sending the result back to the client
    res.status(200).json(urls);
  } catch (err) {
    // Logging the error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

// controller to get cast of a single TV show using _id
const fetchTVShowCast = async (req, res) => {
  try {
    // Extracting the id from URL parameters and making a MongoDB ObjectId for the same
    const idToFetch = new ObjectId(req.params.id);

    // Finding the TV show cast details using the newly created ObjectId
    const cast = await Shows.findOne(
      { _id: idToFetch },
      { projection: { cast: 1, _id: 0 } }
    );

    // Sending the response back to the client
    res.status(200).json(cast);
  } catch (err) {
    // Logging the error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  fetchTVShows,
  fetchTVShow,
  searchShows,
  fetchTVShowCast,
  fetchTVShowUrls,
};
