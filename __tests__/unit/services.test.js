const WeatherService = require('../../src/services/weatherService');
const LocationService = require('../../src/services/locationService');
const PublicLandsService = require('../../src/services/publicLands');
const DNRService = require('../../src/services/dnrServices');
const BaitShopService = require('../../src/services/baitShopService');
const GuideService = require('../../src/services/guideService');

describe('Service Tests', () => {
    describe('WeatherService', () => {
        it('should get weather data', async () => {
            const weatherData = await WeatherService.getWeather(37.7749, -122.4194);
            expect(weatherData).toHaveProperty('current');
            expect(weatherData).toHaveProperty('forecast');
        });

        it('should get weather alerts', async () => {
            const alerts = await WeatherService.getAlerts(37.7749, -122.4194);
            expect(Array.isArray(alerts)).toBe(true);
        });
    });

    describe('LocationService', () => {
        it('should find nearby locations', async () => {
            const locations = await LocationService.findNearby(37.7749, -122.4194, 10);
            expect(Array.isArray(locations)).toBe(true);
        });

        it('should get location details', async () => {
            const locationId = 'test-location-id';
            const location = await LocationService.getDetails(locationId);
            expect(location).toHaveProperty('name');
            expect(location).toHaveProperty('coordinates');
        });
    });

    describe('PublicLandsService', () => {
        it('should get all public lands', async () => {
            const lands = await PublicLandsService.getAllPublicLands(37.7749, -122.4194, 50);
            expect(lands).toHaveProperty('national');
            expect(lands).toHaveProperty('state');
            expect(lands).toHaveProperty('local');
        });

        it('should get national parks', async () => {
            const parks = await PublicLandsService.getNationalParks(37.7749, -122.4194);
            expect(Array.isArray(parks)).toBe(true);
        });
    });

    describe('DNRService', () => {
        it('should get fishing locations', async () => {
            const locations = await DNRService.getFishingLocations('WA', 47.6062, -122.3321);
            expect(Array.isArray(locations)).toBe(true);
        });

        it('should get hunting areas', async () => {
            const areas = await DNRService.getHuntingAreas('WA', 47.6062, -122.3321);
            expect(Array.isArray(areas)).toBe(true);
            expect(areas[0]).toHaveProperty('regulations');
        });
    });

    describe('BaitShopService', () => {
        it('should find nearby bait shops', async () => {
            const shops = await BaitShopService.findNearby(47.6062, -122.3321, 10);
            expect(Array.isArray(shops)).toBe(true);
            expect(shops[0]).toHaveProperty('name');
            expect(shops[0]).toHaveProperty('address');
        });
    });

    describe('GuideService', () => {
        it('should find available guides', async () => {
            const guides = await GuideService.findAvailable(47.6062, -122.3321, '2024-02-01');
            expect(Array.isArray(guides)).toBe(true);
            expect(guides[0]).toHaveProperty('name');
            expect(guides[0]).toHaveProperty('availability');
        });

        it('should get guide details', async () => {
            const guideId = 'test-guide-id';
            const guide = await GuideService.getDetails(guideId);
            expect(guide).toHaveProperty('name');
            expect(guide).toHaveProperty('expertise');
            expect(guide).toHaveProperty('ratings');
        });
    });
});