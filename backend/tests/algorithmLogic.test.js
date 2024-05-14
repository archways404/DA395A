const axios = require('axios');
const {
	parseGenreData,
	allocateMovieSlots,
	fetchMoviesByGenre,
} = require('../functions/algorithmLogic');

jest.mock('axios');

describe('parseGenreData', () => {
	it('should correctly calculate genre percentages', async () => {
		const genreData = [
			{ id: 1, name: 'Action', count: 50 },
			{ id: 2, name: 'Comedy', count: 50 },
		];
		const expected = [
			{ id: 1, name: 'Action', count: '50.00' },
			{ id: 2, name: 'Comedy', count: '50.00' },
		];

		const result = await parseGenreData(genreData);
		expect(result).toEqual(expected);
	});

	it('should handle zero total count', async () => {
		const genreData = [
			{ id: 1, name: 'Action', count: 0 },
			{ id: 2, name: 'Comedy', count: 0 },
		];
		const expected = [
			{ id: 1, name: 'Action', count: 0 },
			{ id: 2, name: 'Comedy', count: 0 },
		];

		const result = await parseGenreData(genreData);
		expect(result).toEqual(expected);
	});
});

describe('allocateMovieSlots', () => {
	beforeEach(() => {
		process.env.NODE_ENV = 'test';
		axios.get.mockReset();
	});

	it('should allocate movie slots correctly', async () => {
		const genrePercentages = [
			{ id: 1, name: 'Action', count: '33.33' },
			{ id: 2, name: 'Comedy', count: '33.33' },
			{ id: 3, name: 'Drama', count: '33.34' },
		];
		const totalSlots = 3;

		axios.get
			.mockResolvedValueOnce({
				data: { results: [{ id: 101, title: 'Action Movie 1' }] },
			})
			.mockResolvedValueOnce({
				data: { results: [{ id: 201, title: 'Comedy Movie 1' }] },
			})
			.mockResolvedValueOnce({
				data: { results: [{ id: 301, title: 'Drama Movie 1' }] },
			});

		const result = await allocateMovieSlots(genrePercentages, totalSlots);

		expect(result.length).toBe(3);
		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 101 }),
				expect.objectContaining({ id: 201 }),
				expect.objectContaining({ id: 301 }),
			])
		);
	});

	it('should handle extra slots distribution', async () => {
		const genrePercentages = [
			{ id: 1, name: 'Action', count: '60.00' },
			{ id: 2, name: 'Comedy', count: '40.00' },
		];
		const totalSlots = 5;

		axios.get
			.mockResolvedValueOnce({
				data: {
					results: [
						{ id: 101, title: 'Action Movie 1' },
						{ id: 102, title: 'Action Movie 2' },
						{ id: 103, title: 'Action Movie 3' },
					],
				},
			})
			.mockResolvedValueOnce({
				data: {
					results: [
						{ id: 201, title: 'Comedy Movie 1' },
						{ id: 202, title: 'Comedy Movie 2' },
					],
				},
			});

		const result = await allocateMovieSlots(genrePercentages, totalSlots);

		expect(result.length).toBe(5);
		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 101 }),
				expect.objectContaining({ id: 102 }),
				expect.objectContaining({ id: 103 }),
				expect.objectContaining({ id: 201 }),
				expect.objectContaining({ id: 202 }),
			])
		);
	});

	it('should handle fetchMoviesByGenre failures', async () => {
		const genrePercentages = [
			{ id: 1, name: 'Action', count: '50.00' },
			{ id: 2, name: 'Comedy', count: '50.00' },
		];
		const totalSlots = 4;

		axios.get
			.mockResolvedValueOnce({
				data: { results: [{ id: 101, title: 'Action Movie 1' }] },
			})
			.mockResolvedValueOnce({ data: { results: [] } });

		const result = await allocateMovieSlots(genrePercentages, totalSlots);

		expect(result.length).toBe(1);
		expect(result).toEqual(
			expect.arrayContaining([expect.objectContaining({ id: 101 })])
		);
	});
});

describe('fetchMoviesByGenre', () => {
	beforeEach(() => {
		process.env.NODE_ENV = 'test';
		process.env.API_KEY = 'test-api-key';
	});

	it('should fetch movies successfully', async () => {
		const genreId = 1;
		const count = 2;
		const mockMovies = [
			{ id: 101, title: 'Action Movie 1' },
			{ id: 102, title: 'Action Movie 2' },
		];

		axios.get.mockResolvedValueOnce({
			data: { results: mockMovies },
		});

		const result = await fetchMoviesByGenre(genreId, count);
		expect(result).toEqual(mockMovies);
	});

	it('should handle errors gracefully', async () => {
		const genreId = 1;
		const count = 2;

		axios.get.mockRejectedValueOnce(new Error('Network Error'));

		const result = await fetchMoviesByGenre(genreId, count);
		expect(result).toEqual([]);
	});
});
