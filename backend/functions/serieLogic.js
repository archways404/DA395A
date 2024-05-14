const axios = require('axios');

const apiKey = process.env.API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

const options = {
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	},
};

async function getSerieGenres() {
	const genresUrl = `${baseUrl}/genre/tv/list?language=en-US`;
	try {
		const response = await axios.get(genresUrl, options);
		console.log(response.data);
		return response.data.genres;
	} catch (error) {
		console.error(error);
		return error;
	}
}

async function getSeries() {
	const discoverUrl = `${baseUrl}/discover/tv?language=en-US&with_original_language=en`;
	try {
		const response = await axios.get(discoverUrl, options);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error(error);
		return error;
	}
}

async function parseSeries(data) {
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
