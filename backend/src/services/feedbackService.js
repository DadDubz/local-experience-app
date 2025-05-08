const Feedback = require("../models/Feedback");

class FeedbackService {
  static async submitFeedback(userId, data) {
    const feedback = new Feedback({
      user: userId,
      type: data.type,
      description: data.description,
      screenshot: data.screenshot,
      deviceInfo: data.deviceInfo,
      priority: data.priority,
    });

    await feedback.save();
    return feedback;
  }

  static async getBetaMetrics() {
    const metrics = await Feedback.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgPriority: { $avg: "$priority" },
        },
      },
    ]);

    return metrics;
  }
}

module.exports = FeedbackService;