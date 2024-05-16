const request = require('supertest');
const app = require('../script.js');

describe('API Endpoints', () => {
	it('GET /movies should return a list of movies', async () => {
		const res = await request(app).get('/movies');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});

	it('GET /movieGenres should return a list of movie genres', async () => {
		const res = await request(app).get('/movieGenres');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});

	it('GET /m should return categorized movies by genres', async () => {
		const res = await request(app).get('/m');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});

	it('POST /MovieAlgorithm should return allocated movie slots', async () => {
		const res = await request(app)
			.post('/MovieAlgorithm')
			.send([{ id: 1, count: 10 }]);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});

	it('POST /home/movies should return home movies', async () => {
		const res = await request(app)
			.post('/home/movies')
			.send([{ id: 1, count: 10 }]);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});
});
