const axios = require('axios');
const ValidationService = require('./validationService');

class FishingService {
    static async getFishingLocations(lat, lng, radius = 50) {
        try {
            // Mock fishing locations data
            return {
                locations: [
                    {
                        id: "f1",
                        name: "Crystal Lake",
                        type: "Lake",
                        description: "Popular fishing spot with various species",
                        coordinates: {
                            latitude: lat,
                            longitude: lng
                        },
                        species: [
                            "Bass",
                            "Trout",
                            "Catfish"
                        ],
                        regulations: {
                            licensRequired: true,
                            catchLimit: {
                                bass: 5,
                                trout: 3,
                                catfish: 10
                            },
                            seasonDates: {
                                start: "2025-03-15",
                                end: "2025-11-30"
                            }
                        },
                        amenities: [
                            "Boat Ramp",
                            "Parking",
                            "Restrooms",
                            "Fish Cleaning Station"
                        ],
                        accessibility: {
                            wheelchairAccessible: true,
                            dockAccess: true,
                            parkingDistance: "50 feet"
                        }
                    },
                    {
                        id: "f2",
                        name: "River Bend",
                        type: "River",
                        description: "Scenic river fishing location",
                        coordinates: {
                            latitude: lat + 0.02,
                            longitude: lng - 0.02
                        },
                        species: [
                            "Salmon",
                            "Steelhead",
                            "Trout"
                        ],
                        regulations: {
                            licensRequired: true,
                            catchLimit: {
                                salmon: 2,
                                steelhead: 1,
                                trout: 5
                            },
                            seasonDates: {
                                start: "2025-04-01",
                                end: "2025-10-31"
                            }
                        },
                        amenities: [
                            "Parking",
                            "Trail Access"
                        ],
                        accessibility: {
                            wheelchairAccessible: false,
                            dockAccess: false,
                            parkingDistance: "200 feet"
                        }
                    }
                ],
                metadata: {
                    count: 2,
                    searchRadius: radius,
                    coordinates: {
                        latitude: lat,
                        longitude: lng
                    },
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Error fetching fishing locations:', error);
            throw error;
        }
    }

    static async getFishingLocationDetails(locationId) {
        try {
            // Mock detailed location data
            return {
                id: locationId,
                name: "Crystal Lake",
                type: "Lake",
                description: "Popular fishing spot with various species",
                waterBody: {
                    type: "Freshwater Lake",
                    size: "250 acres",
                    depth: {
                        average: "25 feet",
                        maximum: "60 feet"
                    },
                    waterLevel: "Normal",
                    temperature: "68°F"
                },
                species: [
                    {
                        name: "Bass",
                        types: ["Largemouth", "Smallmouth"],
                        seasonalityRating: 5,
                        bestSeasons: ["Spring", "Summer"]
                    },
                    {
                        name: "Trout",
                        types: ["Rainbow", "Brown"],
                        seasonalityRating: 4,
                        bestSeasons: ["Spring", "Fall"]
                    },
                    {
                        name: "Catfish",
                        types: ["Channel", "Flathead"],
                        seasonalityRating: 3,
                        bestSeasons: ["Summer"]
                    }
                ],
                regulations: {
                    licensRequired: true,
                    permits: ["General Fishing License", "Trout Stamp"],
                    catchLimits: {
                        bass: {
                            daily: 5,
                            possession: 10,
                            minimumSize: "12 inches"
                        },
                        trout: {
                            daily: 3,
                            possession: 6,
                            minimumSize: "8 inches"
                        },
                        catfish: {
                            daily: 10,
                            possession: 20,
                            minimumSize: "None"
                        }
                    },
                    seasonDates: {
                        general: {
                            start: "2025-03-15",
                            end: "2025-11-30"
                        },
                        trout: {
                            start: "2025-04-01",
                            end: "2025-09-30"
                        }
                    },
                    restrictions: [
                        "No night fishing",
                        "Artificial lures only in some areas",
                        "Catch and release only for some species"
                    ]
                },
                amenities: {
                    parking: {
                        available: true,
                        type: "Paved",
                        spaces: 50,
                        fee: "None"
                    },
                    boatRamp: {
                        available: true,
                        type: "Concrete",
                        lanes: 2,
                        condition: "Good"
                    },
                    facilities: [
                        "Restrooms",
                        "Fish Cleaning Station",
                        "Picnic Area",
                        "Drinking Water"
                    ]
                },
                accessibility: {
                    wheelchairAccessible: true,
                    dockAccess: true,
                    parkingDistance: "50 feet",
                    adaptivePlatforms: true,
                    trails: "Paved"
                },
                weather: {
                    current: {
                        temperature: "72°F",
                        conditions: "Partly Cloudy",
                        wind: "5 mph NW",
                        pressure: "30.1 inHg",
                        updated: new Date().toISOString()
                    },
                    forecastUrl: "https://weather.gov/location"
                }
            };
        } catch (error) {
            console.error('Error fetching fishing location details:', error);
            throw error;
        }
    }

    static async getSpeciesReport(locationId, date) {
        try {
            return {
                locationId,
                date,
                speciesActivity: [
                    {
                        species: "Bass",
                        activity: "High",
                        bestTimes: ["Early Morning", "Late Evening"],
                        recommendedBait: ["Plastic Worms", "Crankbait"]
                    },
                    {
                        species: "Trout",
                        activity: "Moderate",
                        bestTimes: ["Mid Morning", "Late Afternoon"],
                        recommendedBait: ["Power Bait", "Worms"]
                    }
                ],
                conditions: {
                    waterTemperature: "68°F",
                    clarity: "Clear",
                    level: "Normal"
                }
            };
        } catch (error) {
            console.error('Error fetching species report:', error);
            throw error;
        }
    }
}

module.exports = FishingService;
