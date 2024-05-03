const jwt = require("jsonwebtoken");

require("dotenv/config");

const jwtauthentication = async (req, res, next) => {
  // jwt token getting
  const headerinauth = req.headers.authorization;
  if (!headerinauth) {
    return res.sendStatus(401);
  }
  const maintoken = headerinauth.split(" ")[1];

  //   accesstoken verification
  jwt.verify(maintoken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Login Failed Please Try Again!" });
    }
    // verfication success
    req.user = user;
    next();
  });
};

module.exports = jwtauthentication;
