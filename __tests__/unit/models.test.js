const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Location = require('../../src/models/Location');
const Guide = require('../../src/models/Guide');
const Booking = require('../../src/models/Booking');
const Review = require('../../src/models/Review');
const Report = require('../../src/models/Report');
const Shop = require('../../src/models/Shop');

describe('Model Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('User Model', () => {
        it('should create user successfully', async () => {
            const validUser = new User({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            });
            const savedUser = await validUser.save();
            expect(savedUser._id).toBeDefined();
            expect(savedUser.email).toBe(validUser.email);
        });

        it('should fail without required fields', async () => {
            const userWithoutRequired = new User({
                name: 'John Doe'
            });
            let err;
            try {
                await userWithoutRequired.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        });
    });

    describe('Location Model', () => {
        it('should create location with coordinates', async () => {
            const location = new Location({
                name: 'Test Location',
                type: 'FISHING',
                coordinates: {
                    type: 'Point',
                    coordinates: [-122.3321, 47.6062]
                },
                description: 'Test description'
            });
            const savedLocation = await location.save();
            expect(savedLocation.coordinates).toBeDefined();
        });
    });

    describe('Guide Model', () => {
        it('should create guide profile', async () => {
            const user = await User.create({
                name: 'Guide User',
                email: 'guide@example.com',
                password: 'password123'
            });

            const guide = new Guide({
                user: user._id,
                expertise: ['fishing', 'hiking'],
                certifications: ['First Aid'],
                rate: 100
            });
            const savedGuide = await guide.save();
            expect(savedGuide.expertise).toHaveLength(2);
        });
    });

    describe('Booking Model', () => {
        it('should create booking', async () => {
            const user = await User.create({
                name: 'Booking User',
                email: 'booking@example.com',
                password: 'password123'
            });

            const guide = await Guide.create({
                user: user._id,
                expertise: ['fishing'],
                rate: 100
            });

            const booking = new Booking({
                user: user._id,
                guide: guide._id,
                date: new Date(),
                status: 'PENDING'
            });
            const savedBooking = await booking.save();
            expect(savedBooking.status).toBe('PENDING');
        });
    });

    describe('Review Model', () => {
        it('should create review with rating', async () => {
            const user = await User.create({
                name: 'Review User',
                email: 'review@example.com',
                password: 'password123'
            });

            const location = await Location.create({
                name: 'Review Location',
                type: 'FISHING',
                coordinates: {
                    type: 'Point',
                    coordinates: [-122.3321, 47.6062]
                }
            });

            const review = new Review({
                user: user._id,
                location: location._id,
                rating: 5,
                comment: 'Great location!'
            });
            const savedReview = await review.save();
            expect(savedReview.rating).toBe(5);
        });
    });

    describe('Report Model', () => {
        it('should create catch report', async () => {
            const user = await User.create({
                name: 'Report User',
                email: 'report@example.com',
                password: 'password123'
            });

            const location = await Location.create({
                name: 'Report Location',
                type: 'FISHING',
                coordinates: {
                    type: 'Point',
                    coordinates: [-122.3321, 47.6062]
                }
            });

            const report = new Report({
                user: user._id,
                location: location._id,
                type: 'CATCH',
                details: {
                    species: 'Bass',
                    size: '14 inches'
                }
            });
            const savedReport = await report.save();
            expect(savedReport.type).toBe('CATCH');
        });
    });

    describe('Shop Model', () => {
        it('should create bait shop', async () => {
            const shop = new Shop({
                name: 'Test Bait Shop',
                location: {
                    type: 'Point',
                    coordinates: [-122.3321, 47.6062]
                },
                hours: {
                    monday: '9AM-5PM',
                    tuesday: '9AM-5PM'
                },
                inventory: ['bait', 'tackle']
            });
            const savedShop = await shop.save();
            expect(savedShop.inventory).toContain('bait');
        });
    });
});