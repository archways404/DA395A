const apiKey = process.env.API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

async function getMovieGenres() {
	const genresUrl = `${baseURL}/genre/movie/list?language=en-US`;
	try {
		const response = await fetch(genresUrl, options);
		const data = await response.json();
		return data.genres;
	} catch (error) {
		console.error(error);
		return error;
	}
}

async function getMovies() {
	const randomPage = getRandomNumber();
	const discoverUrl = `${baseURL}/discover/movie?language=en-US&with_original_language=en&page=${randomPage}&sort_by=popularity.desc`;
	try {
		const response = await fetch(discoverUrl, options);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return error;
	}
}

async function parseMovies(data) {
	const movies = data.results.map((movie) => ({
		genreIds: movie.genre_ids,
		originalTitle: movie.original_title,
		posterPath: movie.poster_path
			? `https://image.tmdb.org/t/p/original${movie.poster_path}`
			: null,
	}));
	return movies;
}

function categorizeByGenres(movies) {
	const genreMap = {};

	movies.forEach((movie) => {
		movie.genreIds.forEach((genreId) => {
			if (!genreMap[genreId]) {
				genreMap[genreId] = [];
			}
			genreMap[genreId].push({
				genreIds: movie.genre_ids,
				originalTitle: movie.originalTitle,
				posterPath: movie.posterPath,
			});
		});
	});

	return genreMap;
}

function getRandomNumber() {
	return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

module.exports = {
	getMovieGenres,
	getMovies,
	parseMovies,
	categorizeByGenres,
};
