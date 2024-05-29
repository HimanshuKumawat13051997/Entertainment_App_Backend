const database = require("../db/index");
const ObjectId = require("mongoose").Types.ObjectId;
//  access to movies from the database
const Movies = database.collection("Movies");

const Extra_extraction = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = 10;
    const offset = parseInt(page - 1) * limit;

    // finding movies according to
    const allmovies = await Movies.find(
      {},
      {
        projection: {
          title: 1,
          bannerUrl: 1,
          summary: 1,
          releaseDate: 1,
          type: 1,
          posterUrl: 1,
        },
      }
    )
      .skip(offset)
      .limit(limit)
      .toArray();
    // if no movie is found for the given send 404 no page found
    if (allmovies.length === 0) {
      res.status(404).send("Page not found");
    } else {
      res.status(200).json({ allmovies });
    }
  } catch (err) {
    // Error
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

const Ex_extraction = async (req, res) => {
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

const Ex_filter = async (req, res) => {
  try {
    const { genres, rating } = req.body;
    if (genres.length > 0 && rating !== undefined) {
      const filteredmovies = await Movies.findMany({
        genres: genres,
        rating: { $gte: rating },
      });
      res.status(200).json(filteredmovies);
    }
    // sending the found result
    else if (genres.length > 0 || rating === undefined) {
      const filteredmovies = await Movies.findMany({
        genres: genres,
      });
      res.status(200).json(filteredmovies);
    } else {
      const filteredmovies = await Movies.findMany({
        rating: { $gte: rating },
      });
      res.status(200).json(filteredmovies);
    }
  } catch (err) {
    // Error handling
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  Extra_extraction,
  Ex_extraction,
  Ex_filter,
};
