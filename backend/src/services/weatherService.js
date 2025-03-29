const axios = require('axios');

class WeatherService {
    static async getWeather(lat, lng) {
        try {
            // Mock weather data for testing
            return {
                current: {
                    temperature: 72,
                    conditions: "Partly Cloudy",
                    windSpeed: 5,
                    windDirection: "NW",
                    humidity: 45,
                    precipitation: 0,
                    updated: new Date().toISOString()
                },
                forecast: [
                    {
                        date: new Date(Date.now() + 86400000).toISOString(),
                        high: 75,
                        low: 55,
                        conditions: "Sunny",
                        precipitation: 0
                    },
                    {
                        date: new Date(Date.now() + 172800000).toISOString(),
                        high: 73,
                        low: 54,
                        conditions: "Partly Cloudy",
                        precipitation: 20
                    },
                    {
                        date: new Date(Date.now() + 259200000).toISOString(),
                        high: 68,
                        low: 52,
                        conditions: "Rain",
                        precipitation: 80
                    }
                ],
                alerts: [],
                location: {
                    latitude: lat,
                    longitude: lng,
                    elevation: "1200 ft",
                    name: "Test Location"
                }
            };
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    }

    static async getAlerts(lat, lng, radius = 50) {
        try {
            return {
                alerts: [
                    {
                        type: "ADVISORY",
                        title: "Fire Weather Watch",
                        description: "Mock fire weather watch for testing",
                        severity: "moderate",
                        timeIssued: new Date().toISOString(),
                        expires: new Date(Date.now() + 86400000).toISOString()
                    }
                ],
                metadata: {
                    location: {
                        latitude: lat,
                        longitude: lng,
                        radius: radius
                    },
                    updated: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Error fetching weather alerts:', error);
            throw error;
        }
    }

    static async getForecast(lat, lng, days = 7) {
        try {
            const forecast = [];
            for (let i = 0; i < days; i++) {
                forecast.push({
                    date: new Date(Date.now() + i * 86400000).toISOString(),
                    high: Math.floor(Math.random() * 20 + 65), // Random temp between 65-85
                    low: Math.floor(Math.random() * 15 + 45), // Random temp between 45-60
                    conditions: ["Sunny", "Partly Cloudy", "Cloudy", "Rain"][Math.floor(Math.random() * 4)],
                    precipitation: Math.floor(Math.random() * 100),
                    windSpeed: Math.floor(Math.random() * 20),
                    humidity: Math.floor(Math.random() * 50 + 30)
                });
            }

            return {
                forecast,
                metadata: {
                    location: {
                        latitude: lat,
                        longitude: lng
                    },
                    duration: days,
                    units: {
                        temperature: "F",
                        windSpeed: "mph",
                        precipitation: "%"
                    }
                }
            };
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    }

    static async getHistorical(lat, lng, date) {
        try {
            return {
                date: date,
                temperature: {
                    high: 75,
                    low: 55,
                    average: 65
                },
                conditions: "Sunny",
                precipitation: 0,
                location: {
                    latitude: lat,
                    longitude: lng
                }
            };
        } catch (error) {
            console.error('Error fetching historical weather:', error);
            throw error;
        }
    }
}

module.exports = WeatherService;
