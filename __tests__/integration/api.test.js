```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/server');
const User = require('../../src/models/User');

describe('API Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('Auth Endpoints', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
        });

        it('should login user', async () => {
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with wrong password', async () => {
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('Protected Endpoints', () => {
        let token;
        let userId;

        beforeEach(async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            userId = user._id;

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            token = res.body.token;
            expect(token).toBeDefined(); // Ensure token is defined
        });

        it('should access protected route with token', async () => {
            const res = await request(app)
                .get('/api/user/profile')
                .set('Authorization', 'Bearer ' + token);

            expect(res.statusCode).toBe(200);
            expect(res.body.user._id).toBe(userId.toString());
        });

        it('should not access protected route without token', async () => {
            const res = await request(app)
                .get('/api/user/profile');

            expect(res.statusCode).toBe(401);
        });
    });

    describe('Public Lands Endpoints', () => {
        let token;

        beforeEach(async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            token = res.body.token;
        });

        it('should get public lands data', async () => {
            const res = await request(app)
                .get('/api/lands')
                .query({
                    lat: 40.7128,
                    lng: -74.0060,
                    radius: 50
                })
                .set('Authorization', 'Bearer ' + token);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('national');
            expect(res.body).toHaveProperty('state');
            expect(res.body).toHaveProperty('local');
        });

        it('should get DNR fishing locations', async () => {
            const res = await request(app)
                .get('/api/dnr/fishing')
                .query({
                    state: 'WA',
                    lat: 47.6062,
                    lng: -122.3321
                })
                .set('Authorization', 'Bearer ' + token);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.locations)).toBeTruthy();
            expect(res.body).toHaveProperty('regulations');
        });

        it('should get DNR hunting areas', async () => {
            const res = await request(app)
                .get('/api/dnr/hunting')
                .query({
                    state: 'WA',
                    lat: 47.6062,
                    lng: -122.3321
                })
                .set('Authorization', 'Bearer ' + token);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.areas)).toBeTruthy();
            expect(res.body).toHaveProperty('seasons');
        });
    });

    describe('Weather Endpoints', () => {
        let token;

        beforeEach(async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            token = res.body.token;
        });

        it('should get weather forecast', async () => {
            const res = await request(app)
                .get('/api/weather')
                .query({
                    lat: 47.6062,
                    lng: -122.3321
                })
                .set('Authorization', 'Bearer ' + token);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('forecast');
            expect(res.body).toHaveProperty('alerts');
        });
    });
});
```