const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();

app.use(bodyParser.json());

dotenv.config();
const port = 3000;

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

// Example usage
app.get('/', async (req, res) => {
	const movies = await getEnglishMoviesWithGenres();
	res.json(movies);
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// FUNCTIONS - MOVE LATER

// Fetch Genres & Movies
async function fetchGenres() {
	const response = await fetch(genresUrl, options);
	const data = await response.json();
	return data.genres.reduce((acc, genre) => {
		acc[genre.id] = genre.name;
		return acc;
	}, {});
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

		const englishMoviesWithGenres = movies.map((movie) => {
			return {
				title: movie.title,
				genres: movie.genre_ids.map((id) => genres[id]),
				image: movie.poster_path
					? `https://image.tmdb.org/t/p/original${movie.poster_path}`
					: null,
			};
		});

		return englishMoviesWithGenres;
	} catch (error) {
		console.error('Error fetching data:', error);
		return [];
	}
}

// Ranking system for genres

// Initialize a genre score table
let genreScores = {};

function initializeGenreScores(genres) {
	genres.forEach((genre) => {
		genreScores[genre.name] = 0;
	});
}

// Function to update genre scores based on the user's movie choice
function updateGenreScores(selectedMovieGenres) {
	selectedMovieGenres.forEach((genre) => {
		if (genreScores.hasOwnProperty(genre)) {
			genreScores[genre]++;
		} else {
			genreScores[genre] = 1;
		}
	});
}

// Function to get the user's preferred genres based on scores
function getUserPreferredGenres() {
	// Sort the genres by score in descending order
	return Object.keys(genreScores).sort(
		(a, b) => genreScores[b] - genreScores[a]
	);
}

// Example usage
initializeGenreScores([
	{ name: 'Action' },
	{ name: 'Comedy' },
	{ name: 'Drama' },
]); // Initialize with all genres you have

// Simulate user picking movies
updateGenreScores(['Action', 'Comedy']); // User picks a movie with Action and Comedy
updateGenreScores(['Action']); // User picks another movie with Action

// Get user preferred genres
console.log("User's preferred genres:", getUserPreferredGenres());



