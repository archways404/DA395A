const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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
	getSerieGenres,
	getSeries,
	parseSeries,
} = require('./functions/serieLogic');

//? ROUTES

// GET MOVIES
app.get('/movies', async (req, res) => {
	const data = await getMovies();
	const movies = await parseMovies(data);
	res.json(movies);
});

// GET MOVIE GENRES
app.get('/movieGenres', async (req, res) => {
	const movieGenres = await getMovieGenres();
	res.json(movieGenres);
});

// GET MOVIES CATEGORIZED BY GENRES
app.get('/m', async (req, res) => {
	const raw_data = await getMovies();
	const parsed_data = await parseMovies(raw_data);
	const categorized_data = await categorizeByGenres(parsed_data);
	res.json(categorized_data);
});

// POST MOVIE ALGORITHM -> //! WORK IN PROGRESS
app.post('/MovieAlgorithm', (req, res) => {
	console.log(req.body);
	if (!req.body || !Array.isArray(req.body)) {
		return res.status(400).json({ error: 'Invalid input' });
	}
	const topGenres = req.body.sort((a, b) => b.count - a.count).slice(0, 3);
	console.log('Top 3 Genres:', topGenres);
	res.json({
		message: 'Data received successfully',
		topGenres,
	});
});


// GET SERIES
app.get('/series', async (req, res) => {
	const data = await getSeries();
	const series = await parseSeries(data);
	res.json(series);
});

// GET SERIE GENRES
app.get('/serieGenres', async (req, res) => {
	const serieGenres = await getSerieGenres();
	res.json(serieGenres);
});

app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
});


module.exports = app;  // Export the app for use in other files such as tests