/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';

function MovieAlgorithm({ genres }) {
	const [movies, setMovies] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState('Loading.');
	const [error, setError] = useState('');
	const [updatedGenres, setUpdatedGenres] = useState(genres);

	useEffect(() => {
		fetchMovies(updatedGenres);
	}, [updatedGenres]);

	useEffect(() => {
		let dots = 1;
		const interval = setInterval(() => {
			if (loading) {
				dots = (dots % 3) + 1;
				setLoadingMessage(`Loading${'.'.repeat(dots)}`);
			}
		}, 300);

		return () => clearInterval(interval);
	}, [loading]);

	const fetchMovies = (genres) => {
		setLoading(true);
		fetch('http://localhost:3000/MovieAlgorithm', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(genres),
		})
			.then((response) => {
				if (!response.ok) throw new Error('Network response was not ok');
				return response.json();
			})
			.then((data) => {
				setMovies((prev) => [...prev, ...data]);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error:', error);
				setError('An error occurred, please try again later.');
				setLoading(false);
			});
	};

	const handleSelectMovie = (selectedMovie) => {
		console.log('Selected Movie:', selectedMovie);
		if (selectedMovie.genre_ids && Array.isArray(selectedMovie.genre_ids)) {
			const newGenres = updatedGenres.map((genre) => ({
				...genre,
				count: selectedMovie.genre_ids.includes(genre.id)
					? genre.count + 1
					: genre.count,
			}));
			setUpdatedGenres(newGenres);
			console.log('Updated Genres:', newGenres);
		} else {
			console.error(
				"Selected movie does not have a genre_ids property or it's not an array:",
				selectedMovie
			);
		}
		moveToNextPair();
	};

	const moveToNextPair = () => {
		const nextIndex = currentIndex + 2;
		if (nextIndex >= movies.length - 2) {
			fetchMovies(updatedGenres);
		}
		setCurrentIndex(nextIndex);
	};

	const currentPair = movies.slice(currentIndex, currentIndex + 2);

	if (loading) {
		return (
			<div className="container mx-auto px-4 text-center">
				<h2>{loadingMessage}</h2>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto px-4">
				{error ? (
					<p>{error}</p>
				) : (
					<>
						<h1 className="text-center text-2xl font-bold my-4">
							Select your favorite movie
						</h1>
						<h2 className="text-center text-1xl font-bold my-4">
							The more movies you give our Algorithm, the better the
							recommendations will be!
						</h2>
						<div className="flex justify-between items-start mb-4">
							{currentPair.map((movie, index) => (
								<div
									key={movie.id}
									className="w-1/2 px-2">
									<img
										src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
										alt={movie.title}
										className="w-1/2 h-auto mx-auto"
									/>
									<p className="text-center text-lg my-2">{movie.title}</p>
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
				)}
			</div>
		</>
	);
}

export default MovieAlgorithm;
