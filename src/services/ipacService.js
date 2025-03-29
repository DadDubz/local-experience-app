// src/services/ipacService.js
const axios = require('axios');

class IPACService {
    static BASE_URL = 'https://ipac.ecosphere.fws.gov/location/api';

    static async getSpeciesData(lat, lng, radius = 10) {
        try {
            const coordinates = this.createCircleCoordinates(lat, lng, radius);
            
            const response = await axios.post(`${this.BASE_URL}/resources`, {
                'location.footprint': {
                    type: 'Polygon',
                    coordinates: [coordinates]
                },
                includeOtherFwsResources: true,
                includeCrithabGeometry: true
            });

            return this.formatResponse(response.data);
        } catch (error) {
            console.error('IPAC API Error:', error);
            throw error;
        }
    }

    static async getSpeciesDetails(speciesId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/species/${speciesId}`);
            return response.data;
        } catch (error) {
            console.error('IPAC Species Details Error:', error);
            throw error;
        }
    }

    static createCircleCoordinates(centerLat, centerLng, radiusKm, points = 32) {
        const coordinates = [];
        const km = radiusKm * 0.01;

        for (let i = 0; i < points; i++) {
            const angle = (i * 2 * Math.PI) / points;
            const lat = centerLat + (km * Math.sin(angle));
            const lng = centerLng + (km * Math.cos(angle));
            coordinates.push([lng, lat]);
        }
        coordinates.push(coordinates[0]);
        return coordinates;
    }

    static formatResponse(data) {
        return {
            species: data.resources?.populationsBySid || {},
            wetlands: data.resources?.wetlands?.items || [],
            refuges: data.resources?.refuges?.items || [],
            criticalHabitats: data.resources?.crithabs || []
        };
    }
}

module.exports = IPACService;