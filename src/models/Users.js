const mongoose = require("mongoose");

// userschema for adding details of users for login and logout
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    watchlist: [
      { type: mongoose.SchemaTypes.ObjectId, ref: ["Movie", "TvShow"] },
    ],
  },
  { timestamps: true }
);

// exporting model for populating database with user information
const User = mongoose.model("User", userSchema);

module.exports = User;
