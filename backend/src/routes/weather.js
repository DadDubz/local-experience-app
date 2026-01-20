// backend/src/routes/weather.js

import express from 'express';
import WeatherAlertService from '../services/weatherAlertService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current weather alerts
router.get('/alerts', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const alerts = await WeatherAlertService.getAlerts(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
    );
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to weather alerts (requires authentication)
router.post('/alerts/subscribe', authMiddleware, async (req, res) => {
  try {
    const subscription = await WeatherAlertService.subscribeToAlerts(
      req.user.id,
      req.body,
    );
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get marine conditions
router.get('/marine', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const conditions = await WeatherAlertService.getMarineConditions(
      parseFloat(lat),
      parseFloat(lng),
    );
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lng, days } = req.query;
    const forecast = await WeatherAlertService.getForecast(
      parseFloat(lat),
      parseFloat(lng),
      parseInt(days),
    );
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical weather
router.get('/historical', async (req, res) => {
  try {
    const { lat, lng, date } = req.query;
    const historical = await WeatherAlertService.getHistorical(
      parseFloat(lat),
      parseFloat(lng),
      date,
    );
    res.json(historical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
