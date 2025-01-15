const axios = require('axios');

class GuideService {
    static async getAvailableGuides(lat, lng, date, radius = 50) {
        try {
            // Mock guide data
            return {
                guides: [
                    {
                        id: "g1",
                        name: "John Smith",
                        title: "Master Fishing Guide",
                        experience: "15 years",
                        rating: 4.8,
                        specialties: ["Bass", "Trout", "Walleye"],
                        credentials: {
                            licensed: true,
                            certifications: [
                                "Professional Angler Association",
                                "First Aid Certified",
                                "Coast Guard Licensed"
                            ],
                            insuranceVerified: true
                        },
                        services: [
                            {
                                type: "Half Day Trip",
                                duration: "4 hours",
                                price: 250,
                                maxParticipants: 3,
                                includes: [
                                    "All Equipment",
                                    "Bait",
                                    "Safety Gear",
                                    "Fish Cleaning"
                                ]
                            },
                            {
                                type: "Full Day Trip",
                                duration: "8 hours",
                                price: 450,
                                maxParticipants: 3,
                                includes: [
                                    "All Equipment",
                                    "Bait",
                                    "Lunch",
                                    "Safety Gear",
                                    "Fish Cleaning"
                                ]
                            }
                        ],
                        availability: {
                            nextAvailable: "2025-01-20",
                            regularHours: {
                                start: "05:00",
                                end: "19:00"
                            },
                            bookedDates: [
                                "2025-01-15",
                                "2025-01-16"
                            ]
                        },
                        location: {
                            latitude: lat + 0.01,
                            longitude: lng + 0.01,
                            serviceArea: `${radius} mile radius`
                        },
                        equipment: {
                            boat: {
                                type: "Bass Boat",
                                make: "Ranger",
                                model: "Z521L",
                                year: "2024"
                            },
                            provided: [
                                "Rods & Reels",
                                "Tackle",
                                "Life Jackets",
                                "Fish Finder"
                            ]
                        },
                        reviews: [
                            {
                                rating: 5,
                                comment: "Excellent guide, very knowledgeable",
                                date: "2025-01-10",
                                tripType: "Full Day"
                            }
                        ]
                    }
                ],
                metadata: {
                    searchDate: date,
                    location: {
                        latitude: lat,
                        longitude: lng,
                        radius
                    },
                    totalFound: 1
                }
            };
        } catch (error) {
            console.error('Error fetching guides:', error);
            throw error;
        }
    }

    static async getGuideDetails(guideId) {
        try {
            return {
                id: guideId,
                name: "John Smith",
                biography: "Professional guide with 15 years of experience...",
                expertise: [
                    {
                        species: "Bass",
                        level: "Expert",
                        techniques: ["Drop Shot", "Carolina Rig", "Topwater"],
                        bestLocations: ["Lake A", "Lake B"]
                    }
                ],
                packages: [
                    {
                        id: "p1",
                        name: "Premium Bass Experience",
                        description: "Full day dedicated to trophy bass",
                        duration: "8 hours",
                        price: 500,
                        includes: [
                            "Premium Equipment",
                            "Gourmet Lunch",
                            "Photo Package"
                        ],
                        requirements: [
                            "Valid Fishing License",
                            "Weather Appropriate Clothing"
                        ]
                    }
                ],
                calendar: {
                    availableDates: [
                        "2025-01-20",
                        "2025-01-21",
                        "2025-01-22"
                    ],
                    popularDates: [
                        "2025-02-15",
                        "2025-02-16"
                    ]
                }
            };
        } catch (error) {
            console.error('Error fetching guide details:', error);
            throw error;
        }
    }

    static async bookGuide(guideId, bookingDetails) {
        try {
            // Mock booking confirmation
            return {
                bookingId: `booking_${Date.now()}`,
                guide: {
                    id: guideId,
                    name: "John Smith"
                },
                details: {
                    date: bookingDetails.date,
                    package: bookingDetails.packageId,
                    participants: bookingDetails.participants,
                    totalPrice: 450,
                    status: "confirmed"
                },
                paymentStatus: "pending",
                instructions: {
                    meetingPoint: "Marina Dock A",
                    time: "05:30 AM",
                    whatToBring: [
                        "Fishing License",
                        "Weather Appropriate Clothing",
                        "Sunscreen",
                        "Camera"
                    ]
                },
                cancellationPolicy: {
                    deadline: "48 hours before trip",
                    refundPolicy: "Full refund if cancelled before deadline"
                }
            };
        } catch (error) {
            console.error('Error booking guide:', error);
            throw error;
        }
    }

    static async getGuideReviews(guideId) {
        try {
            return {
                guideId,
                averageRating: 4.8,
                totalReviews: 156,
                reviews: [
                    {
                        id: "r1",
                        rating: 5,
                        title: "Amazing Experience",
                        comment: "Best fishing trip ever! Caught multiple trophy bass.",
                        date: "2025-01-10",
                        user: "John D.",
                        tripType: "Full Day",
                        verified: true,
                        photos: ["photo1.jpg", "photo2.jpg"]
                    }
                ],
                ratingBreakdown: {
                    5: 120,
                    4: 30,
                    3: 5,
                    2: 1,
                    1: 0
                }
            };
        } catch (error) {
            console.error('Error fetching guide reviews:', error);
            throw error;
        }
    }
}

module.exports = GuideService;