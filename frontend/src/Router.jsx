/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import MovieInitializer from './MovieInitializer';
import MovieAlgorithm from './MovieAlgorithm';
import MovieHome from './MovieHome';
import UserMovieList from './UserMovieList';

function Router() {
	const [display, setDisplay] = useState('');
	const [storedGenres, setStoredGenres] = useState([]);
	const [selectionCount, setSelectionCount] = useState(0);
	const [myList, setMyList] = useState(() => {
		const savedList = localStorage.getItem('myList');
		return savedList ? JSON.parse(savedList) : [];
	});

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
  
  const cleanStorage = () => {
    localStorage.removeItem('movieGenres');
    localStorage.removeItem('myList');
    localStorage.removeItem('currentPage');
    setStoredGenres([]);
    setMyList([]);
    setDisplay('');
  }

	return (
		<div className="app-container">
			{!storedGenres.length ? (
				<>
					<button
						className=" text-white font-bold py-2 px-4 top button"
						onClick={() => setDisplay('movies')}>
						Display Movies
					</button>
					<button
						onClick={() => setDisplay('')}
						className="text-white font-bold py-2 px-4 top button">
						Welcome
					</button>
				</>
			) : (
				<>
					<button
						onClick={() => setDisplay('algorithm')}
						className=" text-white font-bold py-2 px-4 top button">
						Movie Algorithm
					</button>
					<button
						onClick={() => setDisplay('home')}
						className="text-white font-bold py-2 px-4 top button">
						Movies
					</button>
					<button
						onClick={() => setDisplay('')}
						className="text-white font-bold py-2 px-4 top button">
						Welcome
					</button>
					<button
						onClick={() => cleanStorage()}
						className="text-white font-bold py-2 px-4 top button">
						Clean Storage
					</button>
				</>
			)}

			{display === 'movies' && (
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
