// __tests__/integration/ipac.test.js
const request = require('supertest');
const app = require('../../src/server');

describe('IPAC Integration', () => {
    test('GET /api/lands/species returns species data', async () => {
        const response = await request(app)
            .get('/api/lands/species')
            .query({
                lat: 47.6062,
                lng: -122.3321,
                radius: 10
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('species');
        expect(response.body).toHaveProperty('wetlands');
    });
});