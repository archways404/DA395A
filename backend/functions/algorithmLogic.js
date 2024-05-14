const axios = require('axios');

const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

async function parseGenreData(genreData) {
	const totalCount = genreData.reduce((acc, genre) => acc + genre.count, 0);
	const genrePercentages = genreData.map((genre) => ({
		...genre,
		count: totalCount > 0 ? ((genre.count / totalCount) * 100).toFixed(2) : 0,
	}));

	return genrePercentages;
}

async function allocateMovieSlots(genrePercentages, totalSlots) {
	const movieSlots = [];
	console.log(
		'Starting allocateMovieSlots with:',
		genrePercentages,
		totalSlots
	);

	for (const genre of genrePercentages) {
		const slots = Math.round((genre.count / 100) * totalSlots);
		console.log(`Fetching movies for genre ${genre.id} with ${slots} slots`);
		const movies = await fetchMoviesByGenre(genre.id, slots);
		console.log(`Fetched movies for genre ${genre.id}:`, movies);
		movieSlots.push(...movies);
	}

	if (movieSlots.length > totalSlots) {
		return movieSlots.slice(0, totalSlots);
	}
	return movieSlots;
}

async function fetchMoviesByGenre(genreId, count) {
	const apiKey = process.env.API_KEY;
	if (!apiKey) {
		console.error('API key is not defined');
		return [];
	}
	const randomNumber = getRandomNumber();
	const movieURL = `${baseURL}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${randomNumber}&sort_by=popularity.desc&with_genres=${genreId}`;
	console.log(`Fetching movies from URL: ${movieURL}`);
	try {
		const response = await axios.get(movieURL, {
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		});
		const data = response.data;
		const scrambledData = await shuffleArray(data.results.slice(0, count));
		console.log('post-scramble', scrambledData);
		return scrambledData;
	} catch (error) {
		console.error('Error fetching movies:', error);
		return [];
	}
}

function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

module.exports = {
	parseGenreData,
	allocateMovieSlots,
};

/*
const axios = require('axios');
const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

async function parseGenreData(genreData) {
	const totalCount = genreData.reduce((acc, genre) => acc + genre.count, 0);
	const genrePercentages = genreData.map((genre) => ({
		...genre,
		count: totalCount > 0 ? ((genre.count / totalCount) * 100).toFixed(2) : 0,
	}));

	return genrePercentages;
}

async function allocateMovieSlots(genrePercentages, totalSlots) {
	const movieSlots = [];

	for (const genre of genrePercentages) {
		const slots = Math.round((genre.count / 100) * totalSlots);
		const movies = await fetchMoviesByGenre(genre.id, slots);
		movieSlots.push(...movies);
	}
	if (movieSlots.length > totalSlots) {
		return movieSlots.slice(0, totalSlots);
	}
	return movieSlots;
}

async function fetchMoviesByGenre(genreId, count) {
	const apiKey = process.env.API_KEY;
	if (!apiKey) {
		console.error('API key is not defined');
		return [];
	}
	const randomNumber = getRandomNumber();
	const movieURL = `${baseURL}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${randomNumber}&sort_by=popularity.desc&with_genres=${genreId}`;
	try {
		const response = await axios.get(movieURL, {
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		});
		const data = response.data;
		const scrambledData = await shuffleArray(data.results.slice(0, count));
		return scrambledData;
	} catch (error) {
		console.error('Error fetching movies:', error);
		return [];
	}
}

function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

module.exports = {
	parseGenreData,
	allocateMovieSlots,
};

*/
