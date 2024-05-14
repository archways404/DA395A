const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const {
	getMovieGenres,
	getMovies,
	parseMovies,
	categorizeByGenres,
} = require('../functions/movieLogic');

describe('Movie Functions', () => {
	let mock;
	let originalConsoleError;

	beforeAll(() => {
		originalConsoleError = console.error;
		console.error = jest.fn();
	});

	afterAll(() => {
		console.error = originalConsoleError;
	});

	beforeEach(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.restore();
	});

	describe('getMovieGenres', () => {
		it('should fetch movie genres successfully', async () => {
			const mockGenres = { genres: [{ id: 1, name: 'Action' }] };
			mock.onGet(new RegExp('/genre/movie/list')).reply(200, mockGenres);

			const genres = await getMovieGenres();
			expect(genres).toEqual(mockGenres.genres);
		});

		it('should handle fetch errors', async () => {
			mock.onGet(new RegExp('/genre/movie/list')).networkError();

			const genres = await getMovieGenres();
			expect(genres).toBeInstanceOf(Error);
		});
	});

	describe('getMovies', () => {
		it('should fetch movies successfully', async () => {
			const mockMovies = { results: [{ id: 1, original_title: 'Movie 1' }] };
			const randomPage = 1;
			mock.onGet(new RegExp('/discover/movie')).reply(200, mockMovies);

			const movies = await getMovies();
			expect(movies).toEqual(mockMovies);
		});

		it('should handle fetch errors', async () => {
			mock.onGet(new RegExp('/discover/movie')).networkError();

			const movies = await getMovies();
			expect(movies).toBeInstanceOf(Error);
		});
	});

	describe('parseMovies', () => {
		it('should parse movies data correctly', async () => {
			const mockData = {
				results: [
					{
						genre_ids: [1, 2],
						original_title: 'Movie 1',
						poster_path: '/path.jpg',
					},
				],
			};
			const expectedOutput = [
				{
					genreIds: [1, 2],
					originalTitle: 'Movie 1',
					posterPath: 'https://image.tmdb.org/t/p/original/path.jpg',
				},
			];

			const movies = await parseMovies(mockData);
			expect(movies).toEqual(expectedOutput);
		});
	});

	describe('categorizeByGenres', () => {
		it('should categorize movies by genres correctly', () => {
			const mockMovies = [
				{
					genreIds: [1, 2],
					originalTitle: 'Movie 1',
					posterPath: 'https://image.tmdb.org/t/p/original/path.jpg',
				},
				{
					genreIds: [2],
					originalTitle: 'Movie 2',
					posterPath: 'https://image.tmdb.org/t/p/original/path2.jpg',
				},
			];
			const expectedOutput = {
				1: [
					{
						genreIds: [1, 2],
						originalTitle: 'Movie 1',
						posterPath: 'https://image.tmdb.org/t/p/original/path.jpg',
					},
				],
				2: [
					{
						genreIds: [1, 2],
						originalTitle: 'Movie 1',
						posterPath: 'https://image.tmdb.org/t/p/original/path.jpg',
					},
					{
						genreIds: [2],
						originalTitle: 'Movie 2',
						posterPath: 'https://image.tmdb.org/t/p/original/path2.jpg',
					},
				],
			};

			const categorizedMovies = categorizeByGenres(mockMovies);
			expect(categorizedMovies).toEqual(expectedOutput);
		});
	});
});
