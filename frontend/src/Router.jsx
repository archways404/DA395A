/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import MovieInitializer from './MovieInitializer';
import MovieAlgorithm from './MovieAlgorithm';
import MovieHome from './MovieHome';

function Router() {
	const [display, setDisplay] = useState('');
	const [storedGenres, setStoredGenres] = useState([]);
	const [selectionCount, setSelectionCount] = useState(0);

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

	const updateSelectionCount = (count) => {
		setSelectionCount(count);
	};

	return (
		<div className="app-container">
			{!storedGenres.length ? (
				<>
					<button onClick={() => setDisplay('movies')}>Display Movies</button>
					<button onClick={() => setDisplay('series')}>Display Series</button>
				</>
			) : (
				<>
					<button
						onClick={() => setDisplay('algorithm')}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Movie Algorithm
					</button>

					<button
						onClick={() => setDisplay('home')}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Movie Home
					</button>
				</>
			)}
			{display === 'movies' && (
				<MovieInitializer
					onGenresSubmission={handleGenresSubmission}
					onUpdateSelectionCount={updateSelectionCount}
				/>
			)}
			{display === 'series' && (
				<MovieInitializer
					onGenresSubmission={handleGenresSubmission}
					onUpdateSelectionCount={updateSelectionCount}
				/>
			)}
			{display === 'algorithm' && <MovieAlgorithm genres={storedGenres} />}
			{display === 'home' && <MovieHome genres={storedGenres} />}
		</div>
	);
}

export default Router;
