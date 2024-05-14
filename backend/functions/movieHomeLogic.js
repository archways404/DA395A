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

function getTopCategories(data, numCategories) {
	const sorted = data.sort((a, b) => b.count - a.count);
	return sorted.slice(0, numCategories);
}

async function fetchMoviesByGenre(genreId, page) {
	const movieURL = `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
	try {
		const response = await axios.get(movieURL, options);
		return response.data.results;
	} catch (error) {
		console.error('Error fetching movies by genre:', error);
		return [];
	}
}

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

function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

module.exports = {
	getTopCategories,
	getHomeMovies,
};
