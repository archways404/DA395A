import { useState, useEffect } from 'react';

function App() {
	const [movies, setMovies] = useState([]);
	const [currentPair, setCurrentPair] = useState([]);
	const [index, setIndex] = useState(0);
	const [preferredGenres, setPreferredGenres] = useState([]);

	useEffect(() => {
		fetch('http://localhost:3000/random-movies')
			.then((response) => response.json())
			.then((data) => {
				setMovies(data);
				setCurrentPair(data.slice(0, 2));
			});
	}, []);

	const handleMovieSelection = (selectedMovie) => {
		fetch('http://localhost:3000/userChoice', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ genres: selectedMovie.genres }),
		}).then(() => {
			// Load the next pair of movies
			const nextIndex = index + 2;
			setIndex(nextIndex);
			if (nextIndex < movies.length) {
				setCurrentPair(movies.slice(nextIndex, nextIndex + 2));
			} else {
				// Fetch preferred genres and recommended movies when done
				fetchPreferredGenres();
				fetchRecommendedMovies();
			}
		});
	};

	const fetchPreferredGenres = () => {
		fetch('http://localhost:3000/preferred-genres')
			.then((response) => response.json())
			.then((data) => {
				setPreferredGenres(data);
			});
	};

	const fetchRecommendedMovies = () => {
		fetch('http://localhost:3000/recommend-movies')
			.then((response) => response.json())
			.then((data) => {
				setMovies(data);
				setCurrentPair(data.slice(0, 2));
				setIndex(0);
			});
	};

	return (
		<div>
			<h1>Choose Your Favorite Movie</h1>
			<div style={{ display: 'flex', justifyContent: 'space-around' }}>
				{currentPair.map((movie) => (
					<div
						key={movie.id}
						style={{ textAlign: 'center' }}>
						<img
							src={'https://image.tmdb.org/t/p/w500/' + movie.poster_path}
							alt={movie.title}
							style={{ width: '275px', height: '500px' }}
						/>
						<h2>{movie.title}</h2>
						<button onClick={() => handleMovieSelection(movie)}>Select</button>
					</div>
				))}
			</div>
			<div>
				<h2>Preferred Genres</h2>
				<ul>
					{preferredGenres.map((genre, index) => (
						<li key={index}>{genre}</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
