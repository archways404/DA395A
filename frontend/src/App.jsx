import { useState, useEffect } from 'react';

function App() {
	const [movies, setMovies] = useState([]);
	const [currentPair, setCurrentPair] = useState([]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		fetch('http://localhost:3000/random-movies')
			.then((response) => response.json())
			.then((data) => {
				setMovies(data);
				setCurrentPair(data.slice(0, 2));
			});
	}, []);

	const handleMovieSelection = (selectedMovie) => {
		// Send the selected movie's genres to /userChoice
		fetch('http://localhost:3000/userChoice', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ genres: selectedMovie.genres }),
		});

		// Load the next pair of movies
		const nextIndex = index + 2;
		setIndex(nextIndex);
		setCurrentPair(movies.slice(nextIndex, nextIndex + 2));
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
							src={movie.image}
							alt={movie.title}
							style={{ width: '150px', height: '225px' }}
						/>
						<h2>{movie.title}</h2>
						<button onClick={() => handleMovieSelection(movie)}>Select</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
