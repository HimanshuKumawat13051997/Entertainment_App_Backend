const CredentialsAllowed = (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
};

module.exports = CredentialsAllowed;
