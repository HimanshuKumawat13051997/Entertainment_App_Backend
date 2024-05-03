const database = require("../db/index");

const Movies = database.collection("Movies");
const TvShows = database.collection("Shows");

// controller to get movies based on the title using query params
const MediaExtraction = async (req, res) => {
  const { title } = req.query;

  const mediaRegex = new RegExp(title, "i"); //performs case sensitive operations

  const Result_Movies = await Movies.find(
    { title: { $regex: mediaRegex } },
    {
      projection: {
        title: 1,
        bannerUrl: 1,
        posterUrl: 1,
        releaseDate: 1,
        type: 1,
      },
    }
  ).toArray();
  const Result_Shows = await TvShows.find(
    { title: { $regex: mediaRegex } },
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

  // Error code if movies not found
  if (Result_Movies.length === 0 && Result_Shows.length === 0)
    return res.status(404).json({ error: "No such movie or tv shows exist" });

  //sending the result
  res.status(200).json([...Result_Movies, ...Result_Shows]);
};

module.exports = MediaExtraction;
