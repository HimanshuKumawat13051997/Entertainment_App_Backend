# Entertainment App API Documentation

Welcome to the Entertainment App API documentation. This API provides endpoints to access a wide range of movies, TV shows, trending content, user authentication, and user watchlists.

## Base URL

The base URL for all endpoints is: https://entertainment-app-backend-3huo.onrender.com


## Authentication

Authentication is required for certain endpoints to access user-specific features such as watchlists. The authentication process involves registering a new user, logging in, and obtaining a JSON Web Token (JWT) for subsequent requests.

## Endpoints

### Movies

Endpoints related to movies allow users to retrieve information about movies, search for movies, fetch details of a specific movie, obtain URLs and cast information, and more.

- `/movies`: Retrieve all movies based on page number.
- `/movies/search`: Search for movies based on titles.
- `/movies/:id`: Retrieve details about a single movie based on its ID.
- `/movies/urls/:id`: Retrieve movie URLs based on their IDs.
- `/movies/cast/:id`: Retrieve movie cast based on their IDs.

### TV Shows

Endpoints related to TV shows provide functionality to fetch TV shows, search for shows, get details of a specific show, obtain cast information, and more.

- `/tvshows`: Retrieve all TV shows based on page number.
- `/tvshows/search`: Search for TV shows based on titles.
- `/tvshows/:id`: Retrieve details about a single TV show based on its ID.
- `/tvshows/urls/:id`: Retrieve TV show URLs based on their IDs.
- `/tvshows/cast/:id`: Retrieve TV show cast based on their IDs.

### Trending

The trending endpoints allow users to fetch trending movies and TV shows.

- `/trending`: Retrieve all trending movies and TV shows.

### User

Endpoints related to user management enable users to register, login, logout, and manage their watchlists.

- `/user/register`: Register a new user.
- `/user/login`: Login as an existing user.
- `/user/logout`: Logout a user.
- `/user/details`: Get details of a user using JWT for persistent login.
- `/user/watchlist`: Get a user's watchlist.
- `/user/watchlist/:id`: Add new movies or TV shows to a user's watchlist based on ID.
- `/user/watchlist/:id`: Remove movies or TV shows from a user's watchlist based on ID.

## Error Handling

The API returns appropriate HTTP status codes along with error messages in case of errors. Make sure to handle these errors in your application.

# Entertainment App Database Schema Documentation

## Overview

This document outlines the database schemas used in the Entertainment App for managing movies, TV shows, and user data.

## Schemas

### Movie Schema

- **Purpose**: Defines the structure for storing movie data.
- **Collection**: Movies
- **Required Fields**:
    - `title`: String
    - `language`: String
    - `releaseDate`: Date
    - `summary`: String
    - `cast`: Array of Strings
- **Optional Fields**:
    - `imdbId`: String
    - `rating`: Number
    - `runtime`: Number
    - `status`: String
    - `genres`: Array of Strings
    - `homepage`: String
    - `bannerUrl`: String
    - `posterUrl`: String
    - `trailerUrl`: String

### TV Show Schema

- **Purpose**: Defines the structure for storing TV show data.
- **Collection**: TV Shows
- **Required Fields**:
    - `title`: String
    - `language`: String
    - `firstAirDate`: Date
    - `summary`: String
- **Optional Fields**:
    - `imdbId`: String
    - `rating`: Number
    - `rated`: String
    - `lastAirDate`: Date
    - `status`: String
    - `genres`: Array of Strings
    - `cast`: Array of Strings
    - `homepage`: String
    - `bannerUrl`: String
    - `posterUrl`: String

### User Schema

- **Purpose**: Manages user authentication and stores user-specific data.
- **Collection**: Users
- **Fields**:
    - `email`: String (required)
    - `password`: String (required)
    - `watchlist`: Array of ObjectIds (references Movies and TV Shows)
- **Features**:
    - `timestamps`: Automatically manages creation and update timestamps.

## Relationships

- **User to Movies/TV Shows**: A user can have multiple movies and TV shows in their watchlist, representing a one-to-many relationship.

## Model Creation

- **Function**: `mongoose.model()` is used to create models based on the defined schemas, which interact with the database.



