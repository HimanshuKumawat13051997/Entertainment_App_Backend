const database = require("../db");

// Importing the User model from models
const User = require("../models/Users");
const ObjectId = require("mongoose").Types.ObjectId;

// Accessing the Movies and TvShows collection from the database
const MoviesCollection = database.collection("Movies");
const TvShowsCollection = database.collection("Shows");

// Controller  to get the user's watchlist
const getUserWatchlistController = async (req, res) => {
  try {
    // Extracting the user object from middleware
    const currentUser = req.user;

    // regex for case insensitivity
    const emailRegex = new RegExp(`^${currentUser.email}$`, "i");

    // Retrieving the user's watchlist from the database
    const userWatchlist = await User.findOne(
      { email: { $regex: emailRegex } },
      { watchlist: 1, _id: 0 }
    );
    const watchlistItems = userWatchlist?.watchlist;

    // If no watchlist found, return a 404 error
    if (!watchlistItems)
      return res
        .status(404)
        .json({ success: false, message: "Watchlist Not Found" });

    // Populating the user's watchlist using IDs stored
    const userWatchlistWithDetails = await Promise.all(
      watchlistItems.map(async (item) => {
        // Checking if the item is a movie or a TV show
        const movieDetails = await MoviesCollection.findOne(
          { _id: item },
          { projection: { title: 1, bannerUrl: 1, releaseDate: 1, type: 1 } }
        );
        const tvShowDetails = await TvShowsCollection.findOne(
          { _id: item },
          {
            projection: {
              title: 1,
              bannerUrl: 1,
              firstAirDate: 1,
              lastAirDate: 1,
              type: 1,
            },
          }
        );

        // Returning either movie or TV show details
        return movieDetails ?? tvShowDetails;
      })
    );

    // Returning the user's watchlist
    res
      .status(200)
      .json({ success: true, watchlist: userWatchlistWithDetails });
  } catch (err) {
    // Logging the error
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve the watchlist, please try again",
    });
  }
};

// Controller to add movie IDs to the user's watchlist using id params
const addToWatchlistController = async (req, res) => {
  try {
    const { id } = req.params;
    const objectIdToAdd = new ObjectId(id);

    // validating if id exist or not
    const doesMovieExist = await MoviesCollection.findOne(
      { _id: objectIdToAdd },
      { projection: { _id: 1 } }
    );
    const doesTvShowExist = await TvShowsCollection.findOne(
      { _id: objectIdToAdd },
      { projection: { _id: 1 } }
    );

    const typeToAdd =
      id === String(doesMovieExist?._id)
        ? "Movie"
        : id === String(doesTvShowExist?._id)
        ? "TV Show"
        : null;

    // If no movie or TV show with the given ID is found, return a 404 error
    if (!typeToAdd)
      return res
        .status(404)
        .send("No movie or TV show found with the given ID");

    // Extracting the user object from middleware
    const currentUser = req.user;

    // Defining a regex for email to perform an exact matching case-insensitive search
    const emailRegex = new RegExp(`^${currentUser.email}$`, "i");

    // Fetching the user from the database
    const watchlistData = await User.findOne(
      { email: { $regex: emailRegex } },
      { watchlist: 1, _id: 0 }
    );

    let userWatchlist = watchlistData.watchlist;

    // If the ID already exists in the watchlist, return a 400 error
    if (userWatchlist.some((watchlistId) => String(watchlistId) === id)) {
      return res.status(400).json({
        success: false,
        message: `${typeToAdd} already exists in the watchlist`,
      });
    }

    // Add the ID to the watchlist and update the database
    userWatchlist.push(id);
    await User.updateOne(
      { email: { $regex: emailRegex } },
      { watchlist: userWatchlist }
    );

    // Sending the response back to the client
    res.status(201).json({
      success: true,
      message: `${typeToAdd} added to the watchlist successfully`,
    });
  } catch (err) {
    // Logging the error
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Unable to update the watchlist, please try again",
    });
  }
};

// Controller  to remove movie or TV show IDs from the user's watchlist using id params
const removeFromWatchlistController = async (req, res) => {
  try {
    const { id } = req.params;
    const objectIdToRemove = new ObjectId(id);

    // Extracting the user object from middleware
    const currentUser = req.user;

    // Defining a regex for email to perform an exact matching case-insensitive search
    const emailRegex = new RegExp(`^${currentUser.email}$`, "i");

    // Fetching the user's watchlist from the database
    const watchlistData = await User.findOne(
      { email: currentUser.email },
      { watchlist: 1, _id: 0 }
    );

    let userWatchlist = watchlistData.watchlist;

    // Remove the ID from the watchlist array
    userWatchlist = userWatchlist.filter(
      (watchlistId) => String(watchlistId) !== id
    );

    // Update the user's watchlist in the database
    await User.updateOne(
      { email: { $regex: emailRegex } },
      { watchlist: userWatchlist }
    );

    // Sending the response back to the client
    res.status(200).json({
      success: true,
      message: `${id} removed from the watchlist successfully`,
    });
  } catch (err) {
    // Logging the error
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Unable to update the watchlist, please try again",
    });
  }
};

module.exports = {
  getUserWatchlistController,
  addToWatchlistController,
  removeFromWatchlistController,
};
