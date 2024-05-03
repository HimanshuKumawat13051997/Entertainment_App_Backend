const express = require("express");
const Router_movies = require("./routes/movie.route");
const Router_shows = require("./routes/shows.route");
const Router_User = require("./routes/user.route");
const cron = require("node-cron");
const Routes_trend = require("./routes/trending.routes");
const CredentialsAllowed = require("./middlewares/cred.middleware");
const cors = require("cors");
const Router_media = require("./routes/media.route.");
const axios = require("axios");
const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CredentialsAllowed);

// all routes
app.use("/movies", Router_movies);

app.use("/tvshows", Router_shows);

app.use("/trending", Routes_trend);

app.use("/media", Router_media);

app.use("/user", Router_User);

// handling any other request
app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(process.env.PORT || PORT, () => {
  console.log("App is running on " + PORT);
});

const awake = () => {
  const backendreq = async () => {
    try {
      const response = await axios.post(
        "https://entertainment-app-backend-3huo.onrender.com//user/login",
        JSON.stringify({ email: "falseemail", pasword: "falsepassword" }),
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  // crons use to make server run and remain awake as the below function runs again and again after 14 minutes
  cron.schedule("*/14 * * * *", () => {
    backendreq();
  });
};

awake();
