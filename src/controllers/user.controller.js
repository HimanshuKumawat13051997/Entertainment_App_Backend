const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");

require("dotenv/config");

const UserModel = require("../models/Users");

// Controller to create a new user in the database
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //zod validation
    const emailValidation = zod.string().email();

    const passwordValidation = zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,32}$/
      );

    const parsedEmail = emailValidation.safeParse(email);

    // failed validation leads to error
    if (!parsedEmail.success)
      return res
        .status(400)
        .json({ success: false, message: "Not a valid email" });

    const parsedPassword = passwordValidation.safeParse(password);

    const passwordError = `The password should have at least:
      1. An uppercase letter
      2. A lowercase letter
      3. A number and a special character`;

    if (!parsedPassword.success)
      return res
        .status(400)
        .json({ success: false, message: `${passwordError}` });

    // Define a regex for email to perform an exactly matching case-insensitive search

    const emailRegex = new RegExp(`^${email}$`, "i");

    // Checking if user already exists in database
    const userExists = await UserModel.findOne({
      email: { $regex: emailRegex },
    });

    // If user exists fail registration with an error
    if (userExists)
      return res
        .status(409)
        .json({ success: false, message: "Email Already Registered" });

    // Hashing the password with a salt to save in database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Saving the user in database
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      watchList: [],
    });
    await UserModel.create(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      email,
    });
  } catch (error) {
    // Logging the error
    res.status(500).json({
      success: false,
      message: "Can't register user, please try again",
    });
  }
};

// Coontroller to login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // email validation using regex
    const emailRegex = new RegExp(`^${email}$`, "i");

    // Finding if the entered email is correct
    const userExists = await UserModel.findOne({
      email: { $regex: emailRegex },
    });

    //error if user do not exist
    if (!userExists) {
      return res
        .status(401)
        .json({ success: false, message: "Given email id does not exist" });
    }

    // password validation
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );

    //error if failed password validation
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password, please try again",
      });
    }

    // jwt token access generation
    const accessToken = jwt.sign(
      { email: userExists.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // sending accesstoken
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    // Error handling

    res.status(500).json({
      success: false,
      message: "Can't login, please try again",
    });
  }
};

// Contoller to logout the user
const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res
      .status(204)
      .json({ success: false, message: "User not logged in" });
  }

  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

// Controller to get user details using jwt access_token
const getUserDetails = async (req, res) => {
  const user = req.user;

  const emailRegex = new RegExp(`^${user.email}$`, "i");

  const userDetails = await UserModel.findOne(
    { email: { $regex: emailRegex } },
    { _id: 0, email: 1 }
  );

  // error if user finding fails
  if (!userDetails)
    return res
      .status(404)
      .json({ success: false, message: "User not found, please login again" });

  // response to client
  res.status(200).json({ success: true, userDetails });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
};
