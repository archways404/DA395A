const apiKey = process.env.API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

async function getSerieGenres() {
	const genresUrl = `${baseUrl}/genre/tv/list?language=en-US`;
	const response = await fetch(genresUrl, options);
	const data = await response.json();
	console.log(data);
	return data.genres;
}

async function getSeries() {
	const discoverUrl = `${baseUrl}/discover/tv?language=en-US&with_original_language=en`;
	const response = await fetch(discoverUrl, options);
	const data = await response.json();
	console.log(data);
	return data;
}

async function parseSeries(data) {
	// Extracting specific data from each movie in the results array
	const series = data.results.map((serie) => ({
		genreIds: serie.genre_ids,
		originalTitle: serie.original_name,
		posterPath: serie.poster_path
			? `https://image.tmdb.org/t/p/original${serie.poster_path}`
			: null,
	}));

	console.log(series);
	return series;
}

module.exports = {
	getSerieGenres,
	getSeries,
	parseSeries,
};
