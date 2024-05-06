const apiKey = process.env.API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

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
	const movieURL = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${randomNumber}&sort_by=popularity.desc&with_genres=${genreId}`;
	try {
		const response = await fetch(movieURL, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		});
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}
		const data = await response.json();
		return data.results.slice(0, count);
	} catch (error) {
		console.error('Error fetching movies:', error);
		return [];
	}
}

function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

module.exports = {
	parseGenreData,
	allocateMovieSlots,
};
