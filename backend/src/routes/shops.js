const express = require("express");
const router = express.Router();
const BaitShopService = require("../services/baitShopService");
const authMiddleware = require("../middleware/authMiddleware");

// Get nearby shops
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const shops = await BaitShopService.getNearbyShops(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
    );
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop details
router.get("/:shopId", async (req, res) => {
  try {
    const details = await BaitShopService.getShopDetails(req.params.shopId);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop inventory
router.get("/:shopId/inventory", async (req, res) => {
  try {
    const inventory = await BaitShopService.getInventory(req.params.shopId);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reserve items
router.post("/:shopId/reserve", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const reservation = await BaitShopService.reserveItems(
      req.params.shopId,
      items,
    );
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop hours
router.get("/:shopId/hours", async (req, res) => {
  try {
    const hours = await BaitShopService.getShopHours(req.params.shopId);
    res.json(hours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop reviews
router.get("/:shopId/reviews", async (req, res) => {
  try {
    const reviews = await BaitShopService.getShopReviews(req.params.shopId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
