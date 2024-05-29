const axios = require('axios');

const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const options = {
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

/**
 * Fetch movie genres from The Movie Database API.
 * @returns {Promise<Array>} The array of movie genres.
 */
async function getMovieGenres() {
	const genresUrl = `${baseURL}/genre/movie/list?language=en-US`;
	try {
		const response = await axios.get(genresUrl, options);
		return response.data.genres;
	} catch (error) {
		console.error(error);
		return error;
	}
}

/**
 * Fetch a page of movies from The Movie Database API.
 * @returns {Promise<Object>} The movie data for a random page.
 */
async function getMovies() {
	const randomPage = getRandomNumber();
	const discoverUrl = `${baseURL}/discover/movie?language=en-US&with_original_language=en&page=${randomPage}&sort_by=popularity.desc`;
	try {
		const response = await axios.get(discoverUrl, options);
		return response.data;
	} catch (error) {
		console.error(error);
		return error;
	}
}

/**
 * Parse movie data to extract relevant information.
 * @param {Object} data - The raw movie data from the API.
 * @returns {Promise<Array>} The array of parsed movie objects.
 */
async function parseMovies(data) {
	const movies = data.results.map((movie) => ({
		genreIds: movie.genre_ids,
		originalTitle: movie.original_title,
		posterPath: movie.poster_path
			? `https://image.tmdb.org/t/p/original${movie.poster_path}`
			: 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg',
	}));
	return movies;
}

/**
 * Categorize movies by their genres.
 * @param {Array} movies - The array of movie objects.
 * @returns {Object} The categorized movie objects by genre.
 */
function categorizeByGenres(movies) {
	const genreMap = {};

	movies.forEach((movie) => {
		movie.genreIds.forEach((genreId) => {
			if (!genreMap[genreId]) {
				genreMap[genreId] = [];
			}
			genreMap[genreId].push({
				genreIds: movie.genreIds,
				originalTitle: movie.originalTitle,
				posterPath: movie.posterPath,
			});
		});
	});

	return genreMap;
}

/**
 * Generate a random number between 1 and 100.
 * @returns {number} The generated random number.
 */
function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

module.exports = {
	getMovieGenres,
	getMovies,
	parseMovies,
	categorizeByGenres,
};
