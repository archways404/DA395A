import { useState, useEffect } from 'react';
import MovieInitializer from './App';
import MovieAlgorithm from './MovieAlgorithm';

function Router() {
	const [display, setDisplay] = useState('');
	const [storedGenres, setStoredGenres] = useState([]);

	useEffect(() => {
		const savedDisplay = localStorage.getItem('currentPage');
		if (savedDisplay) {
			setDisplay(savedDisplay);
		}
		const genres = localStorage.getItem('movieGenres');
		if (genres) {
			setStoredGenres(JSON.parse(genres));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('currentPage', display);
	}, [display]);

	const handleGenresSubmission = (genres) => {
		setStoredGenres(genres);
		localStorage.setItem('movieGenres', JSON.stringify(genres));
		setDisplay('algorithm');
	};

	return (
		<div className="app-container">
			{!storedGenres.length ? (
				<>
					<button onClick={() => setDisplay('movies')}>Display Movies</button>
					<button onClick={() => setDisplay('series')}>Display Series</button>
				</>
			) : (
				<button onClick={() => setDisplay('algorithm')}>Movie Algorithm</button>
			)}
			{display === 'movies' && (
				<MovieInitializer onGenresSubmission={handleGenresSubmission} />
			)}
			{display === 'series' && (
				<MovieInitializer onGenresSubmission={handleGenresSubmission} />
			)}
			{display === 'algorithm' && <MovieAlgorithm genres={storedGenres} />}
		</div>
	);
}

export default Router;
