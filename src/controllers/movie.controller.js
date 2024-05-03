const database = require("../db/index");
const ObjectId = require("mongoose").Types.ObjectId;
//  access to movies from the database
const Movies = database.collection("Movies");

// controller to get movies for pagination using query params
const Movies_extraction = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const offset = parseInt(page - 1) * limit;

    // finding movies according to
    const allmovies = await Movies.find(
      {},
      {
        projection: {
          title: 1,
          bannerUrl: 1,
          releaseDate: 1,
          type: 1,
          posterUrl: 1,
        },
      }
    )
      .skip(offset)
      .limit(limit)
      .toArray();

    const totalMovies = await Movies.countDocuments();
    // to indicate the total number of pages
    const totalPages = Math.ceil(totalMovies / limit);

    // if no movie is found for the given send 404 no page found
    if (allmovies.length === 0 || page > totalPages) {
      res.status(404).send("Page not found");
    } else {
      // sending result as per params
      res.status(200).json({ totalMovies, totalPages, allmovies });
    }
  } catch (err) {
    // Error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

// controller
const Movie_extraction = async (req, res) => {
  try {
    const idextract = new ObjectId(req.params.id);

    const movie = await Movies.findOne(
      { _id: idextract },
      {
        projection: {
          title: 1,
          releaseDate: 1,
          cast: 1,
          rating: 1,
          summary: 1,
          genres: 1,
          runtime: 1,
          language: 1,
          posterUrl: 1,
          status: 1,
          type: 1,
        },
      }
    );
    // sending the found result
    res.status(200).json(movie);
  } catch (err) {
    // Error handling
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

// controller to search movies based on provided body req
const searchFeature = async (req, res) => {
  try {
    const titleToGet = req.query.title;
    const titleRegex = new RegExp(titleToGet, "i");

    const movies = await Movies.find(
      { title: { $regex: titleRegex } },
      {
        projection: {
          title: 1,
          bannerUrl: 1,
          releaseDate: 1,
          type: 1,
          posterUrl: 1,
        },
      }
    ).toArray();

    // error if no result found
    if (movies.length === 0) {
      res.status(404).json({ error: "Resources are not Found" });
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    // Error handling
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

// controller for singlee movie using id params
const getMovieUrls = async (req, res) => {
  try {
    const idextract = new ObjectId(req.params.id);

    // Discovering the movie's URL details by utilizing the freshly generated object identifier.
    const urls = await Movies.findOne(
      { _id: idextract },
      {
        projection: {
          homepage: 1,
          trailerUrl: 1,
          imdbUrl: {
            $cond: {
              if: { $eq: ["$imdbId", ""] }, //Verify whether imdbId exists and is not null.
              then: 0, // If imdbId is empty, assign an empty string to imdbUrl.
              else: { $concat: ["https://www.imdb.com/title/", "$imdbId"] }, // If imdbId exists, concatenate the URL with found id
            },
          },
        },
      }
    );

    // results back to the user
    res.status(200).json(urls);
  } catch (err) {
    // error handling
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

// handler function to get Movie Cast of single movie using _id
const getMovieCast = async (req, res) => {
  try {
    // extracting the id from url parameters and making a mongodb objectId for the same
    const idToGet = new ObjectId(req.params.id);

    // finding the movie cast details using the newly created objectId
    const cast = await Movies.findOne(
      { _id: idToGet },
      { projection: { cast: 1, _id: 0 } }
    );

    // sending the response back to the client
    res.status(200).json(cast);
  } catch (err) {
    // logging the error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  Movies_extraction,
  Movie_extraction,
  getMovieUrls,
  getMovieCast,
  searchFeature,
};
