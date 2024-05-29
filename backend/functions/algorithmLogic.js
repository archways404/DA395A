const axios = require('axios');

const apiKey =
	process.env.NODE_ENV === 'test' ? 'test-api-key' : process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

/**
 * Parses genre data to calculate the percentage of each genre.
 * @param {Array} genreData - Array of genre objects with counts.
 * @returns {Array} - Array of genre objects with percentage counts.
 */
const parseGenreData = (genreData) => {
	const total = genreData.reduce((sum, genre) => sum + genre.count, 0);
	return genreData.map((genre) => ({
		...genre,
		count: total === 0 ? 0 : ((genre.count / total) * 100).toFixed(2),
	}));
};

/**
 * Fetches movies by genre from The Movie Database API.
 * @param {number} genreId - The genre ID to fetch movies for.
 * @param {number} count - The number of movies to fetch.
 * @returns {Promise<Array>} - Promise resolving to an array of movies.
 */
const fetchMoviesByGenre = async (genreId, count) => {
	const randomPage = getRandomNumber();
	const url = `${baseURL}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${randomPage}&sort_by=popularity.desc&with_genres=${genreId}`;
	try {
		const response = await axios.get(url, options);
		return response.data.results.slice(0, count);
	} catch (error) {
		console.error('Error fetching movies:', error);
		return [];
	}
};

/**
 * Allocates movie slots based on genre percentages and total slots.
 * @param {Array} genrePercentages - Array of genre objects with percentage counts.
 * @param {number} totalSlots - The total number of slots to allocate.
 * @returns {Promise<Array>} - Promise resolving to an array of movies.
 */
const allocateMovieSlots = async (genrePercentages, totalSlots) => {
	const movieSlots = [];
	const slotAllocations = genrePercentages.map((genre) => ({
		genreId: genre.id,
		slots: Math.floor((genre.count / 100) * totalSlots),
	}));

	let allocatedSlots = slotAllocations.reduce(
		(acc, alloc) => acc + alloc.slots,
		0
	);
	let remainingSlots = totalSlots - allocatedSlots;

	while (remainingSlots > 0) {
		for (let i = 0; i < slotAllocations.length && remainingSlots > 0; i++) {
			slotAllocations[i].slots++;
			remainingSlots--;
		}
	}

	for (const alloc of slotAllocations) {
		const { genreId, slots } = alloc;
		const movies = await fetchMoviesByGenre(genreId, slots);
		movieSlots.push(...movies);
	}

	const shuffledMovieSlots = shuffleArray(movieSlots);
	return shuffledMovieSlots.slice(0, totalSlots);
};

/**
 * Shuffles an array in place.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

/**
 * Generates a random number between 1 and 100.
 * @returns {number} - The random number.
 */
function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

module.exports = {
	parseGenreData,
	fetchMoviesByGenre,
	allocateMovieSlots,
};
