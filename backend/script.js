const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173',
	})
);

// DEFINITION OF EXTERNAL FUNCTIONS
const {
	getMovieGenres,
	getMovies,
	parseMovies,
	categorizeByGenres,
} = require('./functions/movieLogic');

const {
	parseGenreData,
	allocateMovieSlots,
} = require('./functions/algorithmLogic');

const {
	getTopCategories,
	getHomeMovies,
} = require('./functions/movieHomeLogic');

/**
 * GET /movies
 * Fetches and returns a list of movies.
 * @name GET/movies
 * @function
 * @memberof module:express.Router
 * @inner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get('/movies', async (req, res) => {
	const data = await getMovies();
	const movies = await parseMovies(data);
	res.json(movies);
});

/**
 * GET /movieGenres
 * Fetches and returns a list of movie genres.
 * @name GET/movieGenres
 * @function
 * @memberof module:express.Router
 * @inner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get('/movieGenres', async (req, res) => {
	const movieGenres = await getMovieGenres();
	res.json(movieGenres);
});

/**
 * GET /m
 * Fetches, parses, and categorizes movies by genres.
 * @name GET/m
 * @function
 * @memberof module:express.Router
 * @inner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get('/m', async (req, res) => {
	const raw_data = await getMovies();
	const parsed_data = await parseMovies(raw_data);
	const categorized_data = await categorizeByGenres(parsed_data);
	res.json(categorized_data);
});

/**
 * POST /MovieAlgorithm
 * Processes movie data using a specified algorithm and returns the results.
 * @name POST/MovieAlgorithm
 * @function
 * @memberof module:express.Router
 * @inner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.post('/MovieAlgorithm', async (req, res) => {
	if (!req.body || !Array.isArray(req.body)) {
		return res.status(400).json({ error: 'Invalid input' });
	}
	const preParsedData = await parseGenreData(req.body);
	const parsedData = await allocateMovieSlots(preParsedData, 25);
	res.json(parsedData);
});

/**
 * POST /home/movies
 * Fetches and returns a list of top categories and their associated movies for the home page.
 * @name POST/home/movies
 * @function
 * @memberof module:express.Router
 * @inner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.post('/home/movies', async (req, res) => {
	const requestBody = req.body;
	const topCategories = await getTopCategories(requestBody, 5);
	const parsedMovies = await getHomeMovies(topCategories);
	res.json(parsedMovies);
});

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, async () => {
		console.log(`Server listening on port ${PORT}`);
	});
}

module.exports = app;
