/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import UserMovieList from './UserMovieList.jsx';
import Loading from './Loading.jsx';

function Home({ genres }) {
	const [genreMovies, setGenreMovies] = useState({});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [expandedGenre, setExpandedGenre] = useState(null);
	const [myList, setMyList] = useState(() => {
		const savedList = localStorage.getItem('myList');
		return savedList ? JSON.parse(savedList) : [];
	});
	const [movieGenres, setMovieGenres] = useState(() => {
		const savedGenres = localStorage.getItem('movieGenres');
		return savedGenres ? JSON.parse(savedGenres) : genres;
	});

	useEffect(() => {
		fetchMovies(genres);
		console.log('once');
	}, [genres]);

	useEffect(() => {
		localStorage.setItem('myList', JSON.stringify(myList));
	}, [myList]);

	useEffect(() => {
		localStorage.setItem('movieGenres', JSON.stringify(movieGenres));
	}, [movieGenres]);

	const fetchMovies = (genres) => {
		setLoading(true);
		fetch('http://localhost:3000/home/movies', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(genres),
		})
			.then((response) => {
				if (!response.ok) throw new Error('Network response was not ok');
				return response.json();
			})
			.then((data) => {
				setGenreMovies(data);
			})
			.catch((error) => {
				console.error('Error:', error);
				setError('An error occurred, please try again later.');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const toggleGenre = (genre) => {
		if (expandedGenre === genre) {
			setExpandedGenre(null);
		} else {
			setExpandedGenre(genre);
		}
	};

	const updateGenreCounts = (movie, increment) => {
		setMovieGenres((prevGenres) => {
			return prevGenres.map((genre) => {
				if (movie.genre_ids.includes(genre.id)) {
					return { ...genre, count: genre.count + (increment ? 1 : -1) };
				}
				return genre;
			});
		});
	};

	const addToMyList = (movie) => {
		setMyList((prevList) => [...prevList, movie]);
		updateGenreCounts(movie, true);
		setGenreMovies((prevGenreMovies) => {
			const updatedGenreMovies = { ...prevGenreMovies };
			movie.genre_ids.forEach((genreId) => {
				const genre = Object.keys(updatedGenreMovies).find(
					(key) => parseInt(key) === genreId
				);
				if (genre) {
					updatedGenreMovies[genre] = updatedGenreMovies[genre].filter(
						(item) => item.originalTitle !== movie.originalTitle
					);
				}
			});
			return updatedGenreMovies;
		});
	};

	const removeFromMyList = (movie) => {
		setMyList((prevList) =>
			prevList.filter((item) => item.originalTitle !== movie.originalTitle)
		);
		updateGenreCounts(movie, false);
		setGenreMovies((prevGenreMovies) => {
			const updatedGenreMovies = { ...prevGenreMovies };
			movie.genre_ids.forEach((genreId) => {
				const genre = Object.keys(updatedGenreMovies).find(
					(key) => parseInt(key) === genreId
				);
				if (genre) {
					updatedGenreMovies[genre] = [movie, ...updatedGenreMovies[genre]];
				}
			});
			return updatedGenreMovies;
		});
	};

	const isInMyList = (movie) => {
		return myList.some((item) => item.originalTitle === movie.originalTitle);
	};

	return (
		<div className="container mx-auto px-4">
			{loading ? (
				<div className="container text-white mx-auto px-4 flex justify-center items-center min-h-screen">
					<Loading
						type="spinningBubbles"
						color="red"
						className="mx-auto"
					/>
				</div>
			) : (
				<>
					<h1 className="text-2xl titlecard font-bold my-4 text-black text-center">
						Movie Categories
					</h1>
					<UserMovieList
						myList={myList}
						setMyList={setMyList}
						updateGenreCounts={updateGenreCounts}
					/>

					{Object.keys(genreMovies).map((genre) => (
						<div
							key={genre}
							className="mb-8 categorybox overflow-hidden">
							<h2 className="text-xl font-semibold mb-4">{genre}:</h2>
							<div className="grid grid-flow-col auto-cols-64 gap-4 overflow-x-scroll 2xl:grid-cols-5 2xl:grid-rows-auto 2xl:overflow-x-hidden 2xl:grid-flow-row">
								{(expandedGenre === genre
									? genreMovies[genre]
									: genreMovies[genre]
											.filter((movie) => !isInMyList(movie))
											.slice(0, 5)
								).map((movie) => (
									<div
										key={movie.originalTitle}
										className="relative overflow-hidden w-64">
										<img
											src={movie.posterPath}
											alt={movie.originalTitle}
											className="w-full imgborder h-auto rounded-lg shadow-lg"
										/>
										<div className="absolute inset-0 infocard bg-black bg-opacity-75 opacity-0 hover:opacity-100 flex flex-col justify-center items-center text-white p-4 transition-opacity duration-300">
											<h3 className="text-center pb-10 font-bold title">
												{movie.originalTitle}
											</h3>
											<p className="text-xs block whitespace-normal">
												{movie.overview}
											</p>
											<p className="text-m pt-2 italic year">
												{movie.releaseDate.slice(0, 4)}
											</p>
											{isInMyList(movie) ? (
												<button
													onClick={() => removeFromMyList(movie)}
													className="mt-2 py-1 px-2 bg-red-500 rounded text-white">
													Remove from My List
												</button>
											) : (
												<button
													onClick={() => addToMyList(movie)}
													className="mt-2 py-1 px-2 bg-green-500 rounded text-white z-10">
													Add to My List
												</button>
											)}
										</div>
									</div>
								))}
							</div>
							<button
								onClick={() => toggleGenre(genre)}
								className="button text-white py-2 px-4 rounded">
								{expandedGenre === genre ? 'View Less' : 'View More'}
							</button>
						</div>
					))}
				</>
			)}
		</div>
	);
}

export default Home;
