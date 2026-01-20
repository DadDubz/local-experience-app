// backend/src/routes/reports.js

import express from 'express';
import CatchReportService from '../services/catchReportService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Submit a catch report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const report = await CatchReportService.submitReport({
      userId: req.user.id,
      ...req.body,
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's reports
router.get('/my-reports', authMiddleware, async (req, res) => {
  try {
    const reports = await CatchReportService.getUserReports(req.user.id);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reports for a location
router.get('/location/:locationId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reports = await CatchReportService.getLocationReports(
      req.params.locationId,
      startDate,
      endDate,
    );
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get location stats
router.get('/stats/:locationId', async (req, res) => {
  try {
    const stats = await CatchReportService.getLocationStats(
      req.params.locationId,
    );
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload report photos
router.post('/:reportId/photos', authMiddleware, async (req, res) => {
  try {
    const photos = await CatchReportService.uploadPhotos(
      req.params.reportId,
      req.files,
    );
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
