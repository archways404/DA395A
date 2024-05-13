# Functions Documentation

This document provides detailed descriptions of the functions implemented in the Movie and Series Information Service.

## `movieLogic.js`

### `getMovieGenres()`
- **Description:** Fetches the list of movie genres from TMDB.
- **Returns:** Array of genres.

### `getMovies()`
- **Description:** Fetches a random page of movies sorted by popularity.
- **Returns:** JSON object containing a list of movies.

### `parseMovies(data)`
- **Description:** Parses the raw movie data to extract essential fields.
- **Parameters:**
  - `data`: Raw movie data from TMDB.
- **Returns:** Array of parsed movie objects.

### `categorizeByGenres(movies)`
- **Description:** Categorizes movies by their genres.
- **Parameters:**
  - `movies`: Array of movies with genre IDs.
- **Returns:** Object mapping genres to arrays of movies.

## `serieLogic.js`

### `getSerieGenres()`
- **Description:** Fetches the list of series genres from TMDB.
- **Returns:** Array of genres.

### `getSeries()`
- **Description:** Fetches a random page of series sorted by original language and popularity.
- **Returns:** JSON object containing a list of series.

### `parseSeries(data)`
- **Description:** Parses the raw series data to extract essential fields.
- **Parameters:**
  - `data`: Raw series data from TMDB.
- **Returns:** Array of parsed series objects.

## `algorithmLogic.js`

### `parseGenreData(genreData)`
- **Description:** Calculates the percentage of each genre based on count.
- **Parameters:**
  - `genreData`: Array of genres with their count.
- **Returns:** Array of genres with percentage calculations.

### `allocateMovieSlots(genrePercentages, totalSlots)`
- **Description:** Allocates a specific number of movie slots based on genre popularity.
- **Parameters:**
  - `genrePercentages`: Array of genres with their calculated percentages.
  - `totalSlots`: Total slots available for movies.
- **Returns:** Array of movies selected based on the allocated slots.

## `movieHomeLogic.js`

### `getTopCategories(data, numCategories)`
- **Description:** Selects the top categories based on count.
- **Parameters:**
  - `data`: Array of category data.
  - `numCategories`: Number of top categories to select.
- **Returns:** Array of top categories.
