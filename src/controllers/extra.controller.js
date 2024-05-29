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

    const movie = await Movies.findOne({ _id: idextract });
    // sending the found result
    res.status(200).json(movie);
  } catch (err) {
    // Error handling
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

const Ex_filter = async (req, res) => {
  // const { genres, rating } = req.body;
  let { genres, rating } = req.body;
  const page = req.query.page;
  const limit = 10;
  const offset = parseInt(page - 1) * limit;

  try {
    let filteredmovies;
    if (genres === !undefined && rating !== undefined) {
      filteredmovies = await Movies.find(
        {
          genres: genres.toLowerCase(),
          rating: { $gte: Number(rating) },
        },
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
      res.status(200).json({ allmovies: filteredmovies });
    }
    // sending the found result
    else if (genres !== undefined || rating === undefined) {
      filteredmovies = await Movies.find(
        {
          genres: genres.toLowerCase(),
        },
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
      res.status(200).json({ allmovies: filteredmovies });
    } else {
      filteredmovies = await Movies.find(
        {
          rating: { $gte: +rating },
        },
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
      res.status(200).json({ allmovies: filteredmovies });
    }
  } catch (err) {
    // Error handling
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

const exsearchFeature = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = 10;
    const offset = parseInt(page - 1) * limit;
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
    )
      .skip(offset)
      .limit(limit)
      .toArray();

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

module.exports = {
  Extra_extraction,
  Ex_filter,
  Ex_extraction,
  exsearchFeature,
};
