const axios = require("axios");

class BaitShopService {
  static async getNearbyShops(lat, lng, radius = 50) {
    try {
      // Mock data for bait shops
      return {
        shops: [
          {
            id: "bs1",
            name: "Bob's Bait & Tackle",
            description: "Full service bait and tackle shop",
            coordinates: {
              latitude: lat + 0.01,
              longitude: lng + 0.01,
            },
            address: {
              street: "123 Fishing Lane",
              city: "Fishtown",
              state: "ST",
              zip: "12345",
            },
            contact: {
              phone: "555-0123",
              email: "bobs@baittackle.com",
              website: "www.bobsbait.com",
            },
            hours: {
              monday: "6:00 AM - 7:00 PM",
              tuesday: "6:00 AM - 7:00 PM",
              wednesday: "6:00 AM - 7:00 PM",
              thursday: "6:00 AM - 7:00 PM",
              friday: "5:00 AM - 8:00 PM",
              saturday: "5:00 AM - 8:00 PM",
              sunday: "5:00 AM - 6:00 PM",
            },
            inventory: {
              liveBait: [
                {
                  type: "Minnows",
                  price: "3.99/dozen",
                  inStock: true,
                },
                {
                  type: "Worms",
                  price: "4.99/dozen",
                  inStock: true,
                },
                {
                  type: "Crickets",
                  price: "2.99/dozen",
                  inStock: true,
                },
              ],
              artificialBait: [
                {
                  type: "Lures",
                  varieties: ["Spinning", "Plastic", "Flies"],
                  priceRange: "$2.99 - $15.99",
                },
              ],
              equipment: ["Rods", "Reels", "Tackle Boxes", "Nets"],
            },
            services: [
              "License Sales",
              "Rod Repair",
              "Line Spooling",
              "Custom Tackle",
            ],
            ratings: {
              average: 4.5,
              total: 128,
              recent: [
                {
                  rating: 5,
                  comment: "Great selection of live bait",
                  date: "2025-01-10",
                },
              ],
            },
          },
          {
            id: "bs2",
            name: "Fishing Supply Co.",
            description: "Premium fishing supplies and expert advice",
            coordinates: {
              latitude: lat - 0.01,
              longitude: lng - 0.01,
            },
            address: {
              street: "456 Angler Ave",
              city: "Fishtown",
              state: "ST",
              zip: "12345",
            },
            contact: {
              phone: "555-0456",
              email: "info@fishingsupply.com",
              website: "www.fishingsupply.com",
            },
            hours: {
              monday: "7:00 AM - 6:00 PM",
              tuesday: "7:00 AM - 6:00 PM",
              wednesday: "7:00 AM - 6:00 PM",
              thursday: "7:00 AM - 6:00 PM",
              friday: "6:00 AM - 7:00 PM",
              saturday: "6:00 AM - 7:00 PM",
              sunday: "6:00 AM - 5:00 PM",
            },
            inventory: {
              liveBait: [
                {
                  type: "Minnows",
                  price: "4.99/dozen",
                  inStock: true,
                },
                {
                  type: "Worms",
                  price: "5.99/dozen",
                  inStock: true,
                },
              ],
              artificialBait: [
                {
                  type: "Premium Lures",
                  varieties: ["Bass", "Trout", "Salmon"],
                  priceRange: "$5.99 - $25.99",
                },
              ],
              equipment: ["Premium Rods", "Quality Reels", "Professional Gear"],
            },
            services: [
              "License Sales",
              "Rod Repair",
              "Custom Lures",
              "Fishing Classes",
            ],
            ratings: {
              average: 4.8,
              total: 85,
              recent: [
                {
                  rating: 5,
                  comment: "Excellent service and knowledge",
                  date: "2025-01-12",
                },
              ],
            },
          },
        ],
        metadata: {
          count: 2,
          searchRadius: radius,
          coordinates: {
            latitude: lat,
            longitude: lng,
          },
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error fetching nearby bait shops:", error);
      throw error;
    }
  }

  static async getShopDetails(shopId) {
    try {
      // Mock detailed shop data
      return {
        id: shopId,
        name: "Bob's Bait & Tackle",
        // ... (same as above, but with additional details)
        specialties: [
          {
            type: "Bass Fishing",
            expertise: "Expert",
            featuredProducts: ["Custom Bass Lures", "Premium Bass Rods"],
          },
        ],
        events: [
          {
            name: "Fishing Clinic",
            date: "2025-02-15",
            description: "Learn bass fishing techniques",
            price: "Free",
            registration: "Required",
          },
        ],
        loyaltyProgram: {
          available: true,
          benefits: [
            "10% off live bait",
            "Free line spooling",
            "Member events",
          ],
        },
      };
    } catch (error) {
      console.error("Error fetching shop details:", error);
      throw error;
    }
  }

  static async getInventory(shopId) {
    try {
      // Mock inventory data
      return {
        shopId,
        lastUpdated: new Date().toISOString(),
        categories: {
          liveBait: [
            {
              type: "Minnows",
              variants: [
                {
                  size: "Small",
                  price: 3.99,
                  unit: "dozen",
                  inStock: true,
                },
                {
                  size: "Large",
                  price: 5.99,
                  unit: "dozen",
                  inStock: true,
                },
              ],
            },
          ],
          tackle: [
            {
              type: "Hooks",
              brands: ["Brand A", "Brand B"],
              sizes: ["2/0", "3/0", "4/0"],
              priceRange: {
                min: 2.99,
                max: 8.99,
              },
            },
          ],
        },
      };
    } catch (error) {
      console.error("Error fetching shop inventory:", error);
      throw error;
    }
  }
}

module.exports = BaitShopService;