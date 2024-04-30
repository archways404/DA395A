/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

function MovieInitializer() {
	const [genres, setGenres] = useState([]);
	const [movies, setMovies] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectionCount, setSelectionCount] = useState(0);

	useEffect(() => {
		const storedGenres = sessionStorage.getItem('movieGenres');
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
					sessionStorage.setItem(
						'movieGenres',
						JSON.stringify(initializedGenres)
					);
					setGenres(initializedGenres);
				});
		}
	}, []);

	useEffect(() => {
		fetch('http://localhost:3000/movies')
			.then((response) => response.json())
			.then(setMovies);
	}, []);

	const handleSelectMovie = (selectedMovie) => {
		selectedMovie.genreIds.forEach((id) => {
			incrementCount(id);
		});
		setSelectionCount((prev) => prev + 1);
		moveToNextPair();
	};

	const moveToNextPair = () => {
		const nextIndex = currentIndex + 2;
		if (nextIndex >= movies.length) {
			fetchMoreMovies(); // Function to fetch new movies
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
			});
	};

	const incrementCount = (id) => {
		setGenres((genres) => {
			const updatedGenres = genres.map((genre) => {
				if (genre.id === id) {
					return { ...genre, count: genre.count + 1 };
				}
				return genre;
			});
			sessionStorage.setItem('movieGenres', JSON.stringify(updatedGenres));
			return updatedGenres;
		});
	};

	const currentPair = movies.slice(currentIndex, currentIndex + 2);

	return (
		<div className="container mx-auto px-4">
			{selectionCount < 5 ? (
				<>
					<h1 className="text-center text-2xl font-bold my-4">
						Select Your Favorite Movie
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
								<p className="text-center text-lg my-2">
									{movie.originalTitle}
								</p>
								<div className="text-center">
									<button
										onClick={() => handleSelectMovie(movie)}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
										Select
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="text-center mb-4">
						<button
							onClick={moveToNextPair}
							className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
							Skip
						</button>
					</div>
				</>
			) : (
				<div>
					<h2 className="text-center text-xl font-bold mb-2">Genre Counters</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{genres.map((genre) => (
							<div
								key={genre.id}
								className="text-center">
								<span className="font-semibold">{genre.name}</span>:{' '}
								{genre.count}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default MovieInitializer;
