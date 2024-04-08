const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { expressjwt: expressJwt } = require('express-jwt');
const { checkJwt, checkScopes } = require('express-jwt-authz');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key';

app.use(bodyParser.json());
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173', // Adjust this to match the URL of your frontend application
		credentials: true, // If your frontend needs to send cookies with the request
	})
);

//? Dummy user data
const users = [
	{
		id: 1,
		username: 'admin',
		password: '$2a$10$G/gBH/gljtYaS/HF0r4j2OSbuoS6z51iVlYzqyhdCLsvqC0hbtBhq',
	}, // hashed password: 'password'
];

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

//! TEMPORARY: Store genre scores in memory
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
		} else {
			genreScores[genre] = 1;
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
		const page = Math.floor(Math.random() * 100) + 1; // Example random page
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

		// Randomly pick a movie from the genre
		if (data.results.length > 0) {
			const randomIndex = Math.floor(Math.random() * data.results.length);
			recommendedMovies.push(data.results[randomIndex]);
		}
	}
	return recommendedMovies.slice(0, count);
}

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

// User registration
app.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body;
		console.log(username, password);
		console.log(req.body);
		const hashedPassword = await bcrypt.hash(password, 10);
		users.push({ id: users.length + 1, username, password: hashedPassword });
		console.log(users);
		res.status(201).send('User registered successfully.');
	} catch (error) {
		res.status(500).send('Error registering user.');
	}
});

// User login
app.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		console.log(username, password);
		console.log(req.body);
		const user = users.find((u) => u.username === username);
		if (!user) {
			return res.status(404).send('User not found.');
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		console.log(password, user.password, isPasswordValid);
		console.log(await bcrypt.hash(password, 10));
		console.log(await bcrypt.hash('password', 10));
		if (!isPasswordValid) {
			return res.status(401).send('Invalid username or password.');
		}
		const token = jwt.sign(
			{ userId: user.id, username: user.username },
			SECRET_KEY
		);
		res.send({ token });
	} catch (error) {
		res.status(500).send('Error logging in.');
	}
});

app.get(
	'/protected',
	expressJwt({ secret: SECRET_KEY, algorithms: ['HS256'] }),
	function (req, res) {
		// Check if the user is authorized (e.g., has the required permissions)
		if (!req.auth.admin) {
			return res.sendStatus(401); // Unauthorized
		}
		res.sendStatus(200); // Authorized
	}
);

app.listen(PORT, async () => {
	await initializeGenreScores();
	console.log(`Server listening on port ${PORT}`);
});
