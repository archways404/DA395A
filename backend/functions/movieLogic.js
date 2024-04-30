const apiKey = process.env.API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

async function getMovieGenres() {
	const genresUrl = `${baseUrl}/genre/movie/list?language=en-US`;
	const response = await fetch(genresUrl, options);
	const data = await response.json();
	console.log(data);
	return data.genres;
}

async function getMovies() {
	const discoverUrl = `${baseUrl}/discover/movie?language=en-US&with_original_language=en`;
	const response = await fetch(discoverUrl, options);
	const data = await response.json();
	console.log(data);
	return data;
}

async function parseMovies(data) {
	// Extracting specific data from each movie in the results array
	const movies = data.results.map((movie) => ({
		genreIds: movie.genre_ids,
		originalTitle: movie.original_title,
		posterPath: movie.poster_path
			? `https://image.tmdb.org/t/p/original${movie.poster_path}`
			: null,
	}));
	console.log(movies);
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

// Export the functions to be used in other files
module.exports = {
	getMovieGenres,
	getMovies,
	parseMovies,
	categorizeByGenres,
};
