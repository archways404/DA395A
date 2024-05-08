import { useEffect, useState } from 'react';

function MovieHome({ genres }) {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState('Loading.');
	const [error, setError] = useState('');

	useEffect(() => {
		fetchMovies(genres);
		console.log('once');
	}, []);

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
				setMovies(data);
			})
			.catch((error) => {
				console.error('Error:', error);
				setError('An error occurred, please try again later.');
			})
			.finally(() => {
				setLoading(false);
			});
	};

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
						<h1 className="text-center text-2xl font-bold my-4">Home</h1>
						<div className="flex justify-between items-start mb-4">
							{movies.map((movie, index) => (
								<div
									key={movie.id}
									className="w-1/2 px-2">
									<img
										src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
										alt={movie.title}
										className="w-1/2 h-auto mx-auto"
									/>
									<p className="text-center text-lg my-2">{movie.title}</p>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</>
	);
}

export default MovieHome;
