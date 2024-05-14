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

const parseGenreData = (genreData) => {
	const total = genreData.reduce((sum, genre) => sum + genre.count, 0);
	return genreData.map((genre) => ({
		...genre,
		count: total === 0 ? 0 : ((genre.count / total) * 100).toFixed(2),
	}));
};

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

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

module.exports = {
	parseGenreData,
	fetchMoviesByGenre,
	allocateMovieSlots,
};
