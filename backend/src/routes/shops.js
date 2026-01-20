// backend/src/routes/shops.js

import express from 'express';
import BaitShopService from '../services/baitShopService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get nearby shops
router.get('/', async (req, res) => {
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
router.get('/:shopId', async (req, res) => {
  try {
    const details = await BaitShopService.getShopDetails(req.params.shopId);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop inventory
router.get('/:shopId/inventory', async (req, res) => {
  try {
    const inventory = await BaitShopService.getInventory(req.params.shopId);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reserve items (requires authentication)
router.post('/:shopId/reserve', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const reservation = await BaitShopService.reserveItems?.(
      req.params.shopId,
      items,
    );
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop hours
router.get('/:shopId/hours', async (req, res) => {
  try {
    const hours = await BaitShopService.getShopHours?.(req.params.shopId);
    res.json(hours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop reviews
router.get('/:shopId/reviews', async (req, res) => {
  try {
    const reviews = await BaitShopService.getShopReviews?.(req.params.shopId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
