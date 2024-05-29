/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import Initializer from './components/Initializer.jsx';
import Algorithm from './components/Algorithm.jsx';
import Home from './components/Home.jsx';
import WelcomePage from './components/WelcomePage.jsx';

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
		} else {
			setDisplay('welcome');
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
		localStorage.removeItem('selectionCounter');
		setStoredGenres([]);
		setMyList([]);
		setDisplay('welcome');
	};

	return (
		<div className="app-container">
			{!storedGenres.length ? (
				<>
					<button
						onClick={() => cleanStorage()}
						className="text-white font-bold py-2 px-4 top button">
						Clean Storage
					</button>
				</>
			) : (
				<>
					<button
						onClick={() => setDisplay('algorithm')}
						className="text-white font-bold py-2 px-4 top button">
						Movie Algorithm
					</button>
					<button
						onClick={() => setDisplay('home')}
						className="text-white font-bold py-2 px-4 top button">
						Movies
					</button>
					<button
						onClick={() => setDisplay('welcome')}
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
				<Initializer
					onGenresSubmission={handleGenresSubmission}
					onUpdateSelectionCount={updateSelectionCount}
				/>
			)}
			{display === 'algorithm' && <Algorithm genres={storedGenres} />}
			{display === 'home' && <Home genres={storedGenres} />}
			{display === 'welcome' && <WelcomePage setDisplay={setDisplay} />}
		</div>
	);
}

export default Router;