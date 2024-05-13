# API Routes Documentation

This document outlines the API endpoints available in the Movie and Series Information Service.

## Movies

### Get Movies
- **Endpoint:** `/movies`
- **Method:** GET
- **Description:** Fetches a list of movies.
- **Response:** JSON array of movie objects.

### Get Movie Genres
- **Endpoint:** `/movieGenres`
- **Method:** GET
- **Description:** Fetches available movie genres.
- **Response:** JSON object listing all movie genres.

### Get Movies Categorized by Genres
- **Endpoint:** `/m`
- **Method:** GET
- **Description:** Fetches movies categorized by genres.
- **Response:** JSON object of movies categorized by genres.

### Movie Algorithm
- **Endpoint:** `/MovieAlgorithm`
- **Method:** POST
- **Description:** Allocates movies into slots based on genre popularity.
- **Request Body:** JSON array of genre data.
- **Response:** JSON array of movies allocated into slots.

## Series

### Get Series
- **Endpoint:** `/series`
- **Method:** GET
- **Description:** Fetches a list of series.
- **Response:** JSON array of series.

### Get Series Genres
- **Endpoint:** `/serieGenres`
- **Method:** GET
- **Description:** Fetches available series genres.
- **Response:** JSON object listing all series genres.

## Home Movies

### Fetch Home Movies
- **Endpoint:** `/home/movies`
- **Method:** POST
- **Description:** Fetches home movies based on top categories.
- **Request Body:** JSON object with the categories and their preferences.
- **Response:** JSON object of home movies.
