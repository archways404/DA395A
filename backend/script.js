const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key';

app.use(bodyParser.json());
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173',
	})
);

//? API Key and URLs
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

//? IMPORT OF FUNCTIONS
const {
	fetchGenres,
	initializeGenreScores,
	fetchEnglishMovies,
	getEnglishMoviesWithGenres,
	updateGenreScores,
	getUserPreferredGenres,
	fetchRandomMovies,
	recommendMoviesBasedOnGenres,
} = require('./functions/fetchFn');

// ROUTES
app.get('/', async (req, res) => {
	const movies = await getEnglishMoviesWithGenres();
	res.json(movies);
});

app.post('/userChoice', (req, res) => {
	// Directly access genres from req.body
	const selectedMovieGenres = req.body.genres;

	if (selectedMovieGenres && selectedMovieGenres.length > 0) {
		updateGenreScores(selectedMovieGenres);
		res.json({ success: true, preferredGenres: getUserPreferredGenres() });
	} else {
		res.status(400).json({ success: false, message: 'No genres provided' });
	}
});

app.get('/random-movies', async (req, res) => {
	try {
		const randomMovies = await fetchRandomMovies(10);
		res.json(randomMovies);
	} catch (error) {
		console.error('Error fetching random movies:', error);
		res.status(500).send('Error fetching random movies');
	}
});

app.get('/recommend-movies', async (req, res) => {
	try {
		const userPreferences = getUserPreferredGenres(); // Assume this function gives the top genres
		const recommendedMovies = await recommendMoviesBasedOnGenres(
			userPreferences,
			2
		);
		res.json(recommendedMovies);
	} catch (error) {
		console.error('Error recommending movies:', error);
		res.status(500).send('Error recommending movies');
	}
});

app.get('/preferred-genres', (req, res) => {
	res.json(getUserPreferredGenres());
});

app.listen(PORT, async () => {
	await initializeGenreScores();
	console.log(`Server listening on port ${PORT}`);
});
