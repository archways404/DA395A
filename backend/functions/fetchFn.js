// Define necessary URLs and options based on environment variables or constants
const apiKey = process.env.API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const genresUrl = `${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`;
const discoverUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&with_original_language=en`;

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

let genreScores = {};

async function fetchGenres() {
	const response = await fetch(genresUrl, options);
	const data = await response.json();
	return data.genres;
}

async function initializeGenreScores() {
	const genres = await fetchGenres();
	genres.forEach((genre) => {
		genreScores[genre.name] = 0;
	});
}

async function fetchEnglishMovies() {
	const response = await fetch(discoverUrl, options);
	const data = await response.json();
	return data.results;
}

async function getEnglishMoviesWithGenres() {
	try {
		const genres = await fetchGenres();
		const movies = await fetchEnglishMovies();

		const genreMap = genres.reduce((acc, genre) => {
			acc[genre.id] = genre.name;
			return acc;
		}, {});

		return movies.map((movie) => ({
			id: movie.id,
			title: movie.title,
			genres: movie.genre_ids.map((id) => genreMap[id]),
			image: movie.poster_path
				? `https://image.tmdb.org/t/p/original${movie.poster_path}`
				: null,
		}));
	} catch (error) {
		console.error('Error fetching data:', error);
		return [];
	}
}

function updateGenreScores(selectedMovieGenres) {
	selectedMovieGenres.forEach((genre) => {
		if (genreScores.hasOwnProperty(genre)) {
			genreScores[genre]++;
			console.log(genreScores);
		} else {
			genreScores[genre] = 1;
			console.log(genreScores);
		}
	});
}

function getUserPreferredGenres() {
	return Object.keys(genreScores).sort(
		(a, b) => genreScores[b] - genreScores[a]
	);
}

async function fetchRandomMovies(count = 10) {
	const movies = [];
	while (movies.length < count) {
		const page = Math.floor(Math.random() * 100) + 1;
		const url = `${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}`;
		const response = await fetch(url, options);
		const data = await response.json();
		const randomIndex = Math.floor(Math.random() * data.results.length);
		movies.push(data.results[randomIndex]);
	}
	return movies;
}

async function recommendMoviesBasedOnGenres(preferredGenres, count = 2) {
	const recommendedMovies = [];
	for (let genre of preferredGenres) {
		if (recommendedMovies.length >= count) break;

		const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genre.id}&language=en-US`;
		const response = await fetch(url, options);
		const data = await response.json();

		if (data.results.length > 0) {
			const randomIndex = Math.floor(Math.random() * data.results.length);
			recommendedMovies.push(data.results[randomIndex]);
		}
	}
	return recommendedMovies.slice(0, count);
}

// Export the functions to be used in other files
module.exports = {
	fetchGenres,
	initializeGenreScores,
	fetchEnglishMovies,
	getEnglishMoviesWithGenres,
	updateGenreScores,
	getUserPreferredGenres,
	fetchRandomMovies,
	recommendMoviesBasedOnGenres,
};
