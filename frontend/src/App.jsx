import { useState, useEffect } from 'react';

function GenreCounter() {
	const [genres, setGenres] = useState([]);

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

	return (
		<div>
			<h1>Genre Counters</h1>
			{genres.map((genre) => (
				<div key={genre.id}>
					<button onClick={() => incrementCount(genre.id)}>
						{genre.name} ({genre.count})
					</button>
				</div>
			))}
		</div>
	);
}

export default GenreCounter;
