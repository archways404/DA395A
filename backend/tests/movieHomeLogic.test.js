const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const {
	getTopCategories,
	getHomeMovies,
} = require('../functions/movieHomeLogic');

const baseURL = 'https://api.themoviedb.org/3';

describe('getTopCategories', () => {
	it('should return the top categories sorted by count in descending order', () => {
		const data = [
			{ id: 1, name: 'Action', count: 100 },
			{ id: 2, name: 'Comedy', count: 80 },
			{ id: 3, name: 'Drama', count: 120 },
		];
		const numCategories = 2;
		const expected = [
			{ id: 3, name: 'Drama', count: 120 },
			{ id: 1, name: 'Action', count: 100 },
		];
		const result = getTopCategories(data, numCategories);
		expect(result).toEqual(expected);
	});

	it('should handle an empty data array', () => {
		const data = [];
		const numCategories = 2;
		const expected = [];
		const result = getTopCategories(data, numCategories);
		expect(result).toEqual(expected);
	});
});

describe('getHomeMovies', () => {
	let mock;

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	afterAll(() => {
		mock.restore();
	});

	it('should fetch movies for the top categories', async () => {
		const topCategories = [
			{ id: 1, name: 'Action', count: 100 },
			{ id: 2, name: 'Comedy', count: 80 },
		];

		const mockMovies = [
			{
				title: 'Movie 1',
				poster_path: '/path1.jpg',
				overview: 'Overview 1',
				release_date: '2024-01-01',
				genre_ids: [1],
			},
			{
				title: 'Movie 2',
				poster_path: '/path2.jpg',
				overview: 'Overview 2',
				release_date: '2024-01-02',
				genre_ids: [2],
			},
		];

		mock
			.onGet(new RegExp(`${baseURL}/discover/movie`))
			.reply(200, { results: mockMovies });

		const result = await getHomeMovies(topCategories);

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					originalTitle: 'Movie 1',
					posterPath: 'https://image.tmdb.org/t/p/original/path1.jpg',
					overview: 'Overview 1',
					releaseDate: '2024-01-01',
					genre_ids: [1],
				}),
				expect.objectContaining({
					originalTitle: 'Movie 2',
					posterPath: 'https://image.tmdb.org/t/p/original/path2.jpg',
					overview: 'Overview 2',
					releaseDate: '2024-01-02',
					genre_ids: [2],
				}),
			])
		);
	});

	it('should handle fetch errors gracefully', async () => {
		const topCategories = [{ id: 1, name: 'Action', count: 100 }];

		mock.onGet(new RegExp(`${baseURL}/discover/movie`)).networkError();

		const result = await getHomeMovies(topCategories);

		expect(result).toEqual([]);
	});
});
