// backend/src/routes/guides.js
import express from 'express';
import GuideService from '../services/guideService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get available guides
router.get("/", async (req, res) => {
  try {
    const { lat, lng, date, radius } = req.query;
    const guides = await GuideService.getAvailableGuides(
      parseFloat(lat),
      parseFloat(lng),
      date,
      parseFloat(radius),
    );
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get guide details
router.get("/:guideId", async (req, res) => {
  try {
    const details = await GuideService.getGuideDetails(req.params.guideId);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book a guide
router.post("/:guideId/book", authMiddleware, async (req, res) => {
  try {
    const booking = await GuideService.bookGuide(req.params.guideId, req.body);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get guide reviews
router.get("/:guideId/reviews", async (req, res) => {
  try {
    const reviews = await GuideService.getGuideReviews(req.params.guideId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
