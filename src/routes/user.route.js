const express = require("express");
const Router_User = express.Router();
const jwtauthentication = require("../middlewares/auth.middleware");
const {
  getUserWatchlistController,
  addToWatchlistController,
  removeFromWatchlistController,
} = require("../controllers/watchlist.controller");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
} = require("../controllers/user.controller");

// Endpint to for registration of new user
Router_User.post("/register", registerUser);

// Endpoint to login as an existing user
Router_User.post("/login", loginUser);

//Endpoint to logout a user
Router_User.get("/logout", logoutUser);

//Endpoint to get details of a user using jwt for persistent login
Router_User.get("/details", jwtauthentication, getUserDetails);

// Endpoint to get a users watchlist
Router_User.get("/watchlist", jwtauthentication, getUserWatchlistController);

// Endpoint to add new movies or tvshows to a user's watchlist based on id
Router_User.post("/watchlist/:id", jwtauthentication, addToWatchlistController);

//Endpoint to remove movies or tvshows to a user's watchlist based on id
Router_User.delete(
  "/watchlist/:id",
  jwtauthentication,
  removeFromWatchlistController
);
module.exports = Router_User;
