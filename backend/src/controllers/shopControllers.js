const Shop = require("../models/Shop");
const ErrorHandler = require("../middleware/errorHandler");

class ShopController {
  static async getAllShops(req, res) {
    try {
      const { lat, lng, radius = 50 } = req.query;

      let query = { status: "active" };

      if (lat && lng) {
        query["location.coordinates"] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: parseFloat(radius) * 1609.34, // Convert miles to meters
          },
        };
      }

      const shops = await Shop.find(query);

      res.json({
        success: true,
        count: shops.length,
        data: shops,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getShopById(req, res) {
    try {
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        throw new ErrorHandler("Shop not found", 404);
      }

      res.json({
        success: true,
        data: shop,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getShopInventory(req, res) {
    try {
      const shop = await Shop.findById(req.params.id).select("inventory");

      if (!shop) {
        throw new ErrorHandler("Shop not found", 404);
      }

      // Filter only in-stock items if requested
      const { inStockOnly } = req.query;
      let inventory = shop.inventory;

      if (inStockOnly === "true") {
        inventory = inventory.map((category) => ({
          ...category,
          items: category.items.filter((item) => item.inStock),
        }));
      }

      res.json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateInventory(req, res) {
    try {
      const { items } = req.body;
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        throw new ErrorHandler("Shop not found", 404);
      }

      // Update multiple items
      items.forEach((item) => {
        const categoryIndex = shop.inventory.findIndex(
          (cat) => cat.category === item.category,
        );

        if (categoryIndex > -1) {
          const itemIndex = shop.inventory[categoryIndex].items.findIndex(
            (i) => i._id.toString() === item.itemId,
          );

          if (itemIndex > -1) {
            shop.inventory[categoryIndex].items[itemIndex] = {
              ...shop.inventory[categoryIndex].items[itemIndex],
              ...item.updates,
            };
          }
        }
      });

      await shop.save();

      res.json({
        success: true,
        data: shop.inventory,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getShopHours(req, res) {
    try {
      const shop = await Shop.findById(req.params.id).select("hours");

      if (!shop) {
        throw new ErrorHandler("Shop not found", 404);
      }

      res.json({
        success: true,
        data: shop.hours,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateShopHours(req, res) {
    try {
      const shop = await Shop.findByIdAndUpdate(
        req.params.id,
        { $set: { hours: req.body } },
        { new: true },
      );

      if (!shop) {
        throw new ErrorHandler("Shop not found", 404);
      }

      res.json({
        success: true,
        data: shop.hours,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async searchInventory(req, res) {
    try {
      const { query, category } = req.query;

      let searchQuery = {
        status: "active",
      };

      if (category) {
        searchQuery["inventory.category"] = category;
      }

      if (query) {
        searchQuery["inventory.items.name"] = {
          $regex: query,
          $options: "i",
        };
      }

      const shops = await Shop.find(searchQuery);

      // Filter and format results
      const results = shops.map((shop) => ({
        shopId: shop._id,
        shopName: shop.name,
        location: shop.location,
        items: shop.inventory
          .flatMap((cat) => cat.items)
          .filter(
            (item) =>
              !query || item.name.toLowerCase().includes(query.toLowerCase()),
          ),
      }));

      res.json({
        success: true,
        count: results.length,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ShopController;
