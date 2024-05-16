const axios = require('axios');

// API Key based on environment
const apiKey =
	process.env.NODE_ENV === 'test' ? 'test-api-key' : process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const options = {
	headers: {
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

/**
 * Get the top categories based on count.
 * @param {Array} data - The array of categories with counts.
 * @param {number} numCategories - The number of top categories to return.
 * @returns {Array} The sorted array of top categories.
 */
function getTopCategories(data, numCategories) {
	const sorted = data.sort((a, b) => b.count - a.count);
	return sorted.slice(0, numCategories);
}

/**
 * Fetch movies by genre from The Movie Database API.
 * @param {number} genreId - The genre ID to fetch movies for.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<Array>} The array of movies.
 */
async function fetchMoviesByGenre(genreId, page) {
	const movieURL = `${baseURL}/discover/movie?language=en-US&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
	try {
		const response = await axios.get(movieURL, options);
		return response.data.results;
	} catch (error) {
		console.error(
			'Error fetching movies by genre:',
			error.response ? error.response.data : error.message
		);
		return [];
	}
}

/**
 * Get movies for the home page categorized by top categories.
 * @param {Array} topCategories - The array of top categories.
 * @returns {Promise<Object>} The object containing movies categorized by top categories.
 */
async function getHomeMovies(topCategories) {
	const allMovies = {};
	for (const category of topCategories) {
		const randomPage = getRandomNumber();
		const movies = await fetchMoviesByGenre(category.id, randomPage);
		allMovies[category.name] = movies.map((movie) => ({
			originalTitle: movie.title,
			posterPath: movie.poster_path
				? `https://image.tmdb.org/t/p/original${movie.poster_path}`
				: null,
			overview: movie.overview,
			releaseDate: movie.release_date,
			genre_ids: movie.genre_ids,
		}));
	}
	return allMovies;
}

/**
 * Generate a random number between 1 and 100.
 * @returns {number} The generated random number.
 */
function getRandomNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

module.exports = {
	getTopCategories,
	getHomeMovies,
};
