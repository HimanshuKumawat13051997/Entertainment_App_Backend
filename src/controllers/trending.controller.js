const database = require("../db");
const axios = require("axios");
// Loading environment variables from dotenv configuration
require("dotenv/config");

// Checks if the Trending collection requires an update1
const requiresUpdate = async () => {
  const trendingCol = database.collection("Trending");
  const latestEntry = await trendingCol.findOne({}, { sort: { _id: -1 } });

  if (!latestEntry) return true; // Collection is empty, update needed

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return latestEntry.createdAt < oneWeekAgo; // Checks if latest entry is older than a week
};

// Fetches IMDb IDs from TMDB and updates the Trending collection with details from Movies and Shows collections
const updateTrendingData = async () => {
  const trendingUrl = "https://api.themoviedb.org/3/trending/all/week";
  const apiKey = process.env.TMDB_API_KEY;
  const trendingResponse = await axios.get(`${trendingUrl}?api_key=${apiKey}`);

  const trendingData = await trendingResponse.data;
  const trendingItems = await trendingData.results;

  const detailsPromises = trendingItems.map(async (item) => {
    const mediaType = item.media_type;
    console.log(mediaType);
    const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${item.id}/external_ids?api_key=${apiKey}`;

    const detailsResponse = await axios.get(detailsUrl);
    const detailsData = await detailsResponse.data;
    const imdbId = await detailsData.imdb_id;

    const collectionName = mediaType === "movie" ? "Movies" : "Shows";
    const collect = database.collection(collectionName);
    const mediaDetails = await collect.findOne({ imdbId });
    return mediaDetails ? { ...mediaDetails, createdAt: new Date() } : null;
  });

  const fullDetails = (await Promise.all(detailsPromises)).filter(
    (details) => details !== null
  );

  const trendingCol = database.collection("Trending");
  await trendingCol.deleteMany({});
  await trendingCol.insertMany(fullDetails);
};

// Retrieves trending movies and TV shows from the Trending collection
const fetchTrending = async (req, res) => {
  try {
    if (await requiresUpdate()) {
      await updateTrendingData();
    }

    const trendingCol = database.collection("Trending");
    const trendingItems = await trendingCol
      .find(
        {},
        {
          projection: {
            title: 1,
            bannerUrl: 1,
            releaseDate: 1,
            firstAirDate: 1,
            lastAirDate: 1,
            rated: 1,
            type: 1,
          },
        }
      )
      .toArray();

    res.status(200).json({ trendingItems });
  } catch (error) {
    console.error("Error in fetchTrending:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchTrending };
