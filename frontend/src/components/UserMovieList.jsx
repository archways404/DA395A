/* eslint-disable react/prop-types */

function UserMovieList({ myList, setMyList, updateGenreCounts }) {
	const removeFromMyList = (movie) => {
		setMyList((prevList) =>
			prevList.filter((item) => item.originalTitle !== movie.originalTitle)
		);
		updateGenreCounts(movie, false);
	};

	return (
		<div className="mb-8 categorybox overflow-hidden">
			<h2 className="text-xl font-semibold mb-4">My List:</h2>
			{myList.length > 0 ? (
				<div className="grid grid-flow-col auto-cols-64 overflow-x-scroll gap-4 mylistcard xl:grid-cols-5 xl:grid-rows-auto xl:overflow-x-hidden xl:grid-flow-row">
					{myList.map((movie) => (
						<div
							key={movie.originalTitle}
							className="relative w-64 overflow-hidden">
							<img
								src={movie.posterPath}
								alt={movie.originalTitle}
								className="w-full imgborder h-auto rounded-lg shadow-lg"
							/>
							<div className="absolute inset-0 infocard bg-black bg-opacity-75 opacity-0 hover:opacity-100 flex flex-col justify-center items-center text-white p-4 transition-opacity duration-300">
								<h3 className="text-center pb-10 font-bold title">
									{movie.originalTitle}
								</h3>
								<p className="text-xs">{movie.overview}</p>
								<p className="text-m pt-2 italic year">
									{movie.releaseDate.slice(0, 4)}
								</p>
								<button
									onClick={() => removeFromMyList(movie)}
									className="mt-2 py-1 px-2 bg-red-500 rounded text-white z-10">
									Remove from My List
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-500">
					Your favorite movies will appear here. Add movies to your list to see
					them displayed!
				</p>
			)}
		</div>
	);
}

export default UserMovieList;
