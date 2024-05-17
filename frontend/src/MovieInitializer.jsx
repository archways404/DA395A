/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

function MovieInitializer({ onGenresSubmission, onUpdateSelectionCount }) {
	const [genres, setGenres] = useState([]);
	const [movies, setMovies] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectionCount, setSelectionCount] = useState(0);

	useEffect(() => {
		const storedGenres = localStorage.getItem('movieGenres');
		if (storedGenres) {
			setGenres(JSON.parse(storedGenres));
		} else {
			fetch('http://localhost:3000/movieGenres')
				.then((response) => response.json())
				.then((data) => {
					const initializedGenres = data.map((genre) => ({
						...genre,
						count: 0,
					}));
					localStorage.setItem(
						'movieGenres',
						JSON.stringify(initializedGenres)
					);
					setGenres(initializedGenres);
				})
				.catch((error) => console.error('Failed to fetch genres:', error));
		}
	}, []);

	useEffect(() => {
		fetch('http://localhost:3000/movies')
			.then((response) => response.json())
			.then(setMovies)
			.catch((error) => console.error('Failed to fetch movies:', error));
	}, []);

	const handleSelectMovie = (selectedMovie) => {
		selectedMovie.genreIds.forEach((id) => incrementCount(id));
		const newSelectionCount = selectionCount + 1;
		setSelectionCount(newSelectionCount);
		onUpdateSelectionCount(newSelectionCount);

		if (newSelectionCount >= 5) {
			submitGenreCounts();
		}

		moveToNextPair();
	};

	const moveToNextPair = () => {
		const nextIndex = currentIndex + 2;
		if (nextIndex >= movies.length) {
			fetchMoreMovies();
		} else {
			setCurrentIndex(nextIndex);
		}
	};

	const fetchMoreMovies = () => {
		fetch('http://localhost:3000/movies')
			.then((response) => response.json())
			.then((newMovies) => {
				setMovies((currentMovies) => [...currentMovies, ...newMovies]);
				setCurrentIndex(movies.length);
			})
			.catch((error) => console.error('Failed to fetch more movies:', error));
	};

	const incrementCount = (id) => {
		setGenres((genres) => {
			const updatedGenres = genres.map((genre) => {
				if (genre.id === id) {
					return { ...genre, count: genre.count + 1 };
				}
				return genre;
			});
			localStorage.setItem('movieGenres', JSON.stringify(updatedGenres));
			return updatedGenres;
		});
	};

	const submitGenreCounts = () => {
		localStorage.setItem('movieGenres', JSON.stringify(genres));
		onGenresSubmission(genres);
	};

	const currentPair = movies.slice(currentIndex, currentIndex + 2);

	return (
		<>
			<div className="container mx-auto px-4">
				<div
					className="selection-counter"
					style={{
						position: 'fixed',
						top: '10px',
						right: '10px',
						fontSize: '16px',
						backgroundColor: 'lightgray',
						padding: '5px 10px',
						borderRadius: '10px',
					}}>
					Selected: {selectionCount} / 5
				</div>
				<h1 className="text-center text-2xl font-bold my-4">
					Select movies that you like or think you would enjoy
				</h1>
				<div className="flex justify-between items-start mb-4">
					{currentPair.map((movie, index) => (
						<div
							key={movie.originalTitle}
							className="w-1/2 px-2">
							<img
								src={movie.posterPath}
								alt={movie.originalTitle}
								className="w-1/2 h-auto mx-auto"
							/>
							<p className="text-center text-white text-lg my-2">{movie.originalTitle}</p>
							<div className="text-center">
								<button
									onClick={() => handleSelectMovie(movie)}
									className="button neon-text text-white font-bold py-2 px-4 rounded">
									Select
								</button>
							</div>
						</div>
					))}
				</div>
				<div className="text-center mb-4">
					<button
						onClick={moveToNextPair}
						className="button text-white font-bold py-2 px-4 rounded">
						Skip
					</button>
				</div>
			</div>
		</>
	);
}

export default MovieInitializer;
