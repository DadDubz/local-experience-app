const axios = require('axios');

class PublicLandsService {
    static async getAllPublicLands(lat, lng, radius = 50) {
        try {
            const [national, state, local] = await Promise.all([
                this.getNationalLands(lat, lng, radius),
                this.getStateLands(lat, lng, radius),
                this.getLocalLands(lat, lng, radius)
            ]);

            return {
                national,
                state,
                local
            };
        } catch (error) {
            console.error('Error fetching public lands:', error);
            throw error;
        }
    }

    static async getNationalLands(lat, lng, radius) {
        try {
            // Recreation.gov API
            const recResponse = await axios.get(
                'https://ridb.recreation.gov/api/v1/facilities',
                {
                    params: {
                        latitude: lat,
                        longitude: lng,
                        radius,
                        limit: 50,
                        apikey: process.env.RECREATION_GOV_API_KEY
                    }
                }
            );

            // National Park Service API
            const npsResponse = await axios.get(
                'https://developer.nps.gov/api/v1/parks',
                {
                    params: {
                        latitude: lat,
                        longitude: lng,
                        radius,
                        api_key: process.env.NPS_API_KEY
                    }
                }
            );

            return {
                recreationAreas: recResponse.data.RECDATA,
                nationalParks: npsResponse.data.data
            };
        } catch (error) {
            console.error('Error fetching national lands:', error);
            throw error;
        }
    }

    static async getStateLands(lat, lng, radius) {
        try {
            // State parks and recreation areas
            const response = await axios.get(
                `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_State_Parks/FeatureServer/0/query`,
                {
                    params: {
                        geometry: `${lng},${lat}`,
                        geometryType: 'esriGeometryPoint',
                        spatialRel: 'esriSpatialRelIntersects',
                        distance: radius * 1609.34, // Convert miles to meters
                        units: 'esriSRUnit_Meter',
                        outFields: '*',
                        f: 'json'
                    }
                }
            );

            return {
                stateParks: response.data.features
            };
        } catch (error) {
            console.error('Error fetching state lands:', error);
            throw error;
        }
    }

    static async getLocalLands(lat, lng, radius) {
        try {
            // City and county parks
            const response = await axios.get(
                `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Local_Parks/FeatureServer/0/query`,
                {
                    params: {
                        geometry: `${lng},${lat}`,
                        geometryType: 'esriGeometryPoint',
                        spatialRel: 'esriSpatialRelIntersects',
                        distance: radius * 1609.34,
                        units: 'esriSRUnit_Meter',
                        outFields: '*',
                        f: 'json'
                    }
                }
            );

            return {
                localParks: response.data.features
            };
        } catch (error) {
            console.error('Error fetching local lands:', error);
            throw error;
        }
    }

    static async getRecreationAreaDetails(facilityId) {
        try {
            const response = await axios.get(
                `https://ridb.recreation.gov/api/v1/facilities/${facilityId}`,
                {
                    params: {
                        apikey: process.env.RECREATION_GOV_API_KEY,
                        full: true
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching recreation area details:', error);
            throw error;
        }
    }
}

module.exports = PublicLandsService;
