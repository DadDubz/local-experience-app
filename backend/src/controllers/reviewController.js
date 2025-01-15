const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ErrorHandler = require('../middleware/errorHandler');

class ReviewController {
    static async createReview(req, res) {
        try {
            const { type, targetId, rating, title, content, bookingId } = req.body;

            // Verify booking if provided
            if (bookingId) {
                const booking = await Booking.findById(bookingId);
                if (!booking || booking.user.toString() !== req.user.id) {
                    throw new ErrorHandler('Invalid booking', 400);
                }
            }

            // Check for existing review
            const existingReview = await Review.findOne({
                user: req.user.id,
                targetId,
                type
            });

            if (existingReview) {
                throw new ErrorHandler('You have already reviewed this ' + type, 400);
            }

            // Create review
            const review = new Review({
                user: req.user.id,
                type,
                targetId,
                booking: bookingId,
                rating,
                title,
                content,
                experience: {
                    date: new Date(),
                    serviceType: req.body.serviceType
                }
            });

            await review.save();

            res.status(201).json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getReviews(req, res) {
        try {
            const { type, targetId, sort = 'recent' } = req.query;
            
            let sortQuery = {};
            switch (sort) {
                case 'recent':
                    sortQuery = { createdAt: -1 };
                    break;
                case 'rating':
                    sortQuery = { rating: -1 };
                    break;
                case 'helpful':
                    sortQuery = { 'helpful.count': -1 };
                    break;
            }

            const reviews = await Review.find({ type, targetId, status: 'approved' })
                .sort(sortQuery)
                .populate('user', 'name')
                .populate('booking', 'date');

            res.json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateReview(req, res) {
        try {
            const review = await Review.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!review) {
                throw new ErrorHandler('Review not found or unauthorized', 404);
            }

            res.json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteReview(req, res) {
        try {
            const review = await Review.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });

            if (!review) {
                throw new ErrorHandler('Review not found or unauthorized', 404);
            }

            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async markHelpful(req, res) {
        try {
            const review = await Review.findById(req.params.id);

            if (!review) {
                throw new ErrorHandler('Review not found', 404);
            }

            // Check if user already marked as helpful
            const hasMarked = review.helpful.users.includes(req.user.id);
            
            if (hasMarked) {
                // Remove helpful mark
                review.helpful.count--;
                review.helpful.users.pull(req.user.id);
            } else {
                // Add helpful mark
                review.helpful.count++;
                review.helpful.users.push(req.user.id);
            }

            await review.save();

            res.json({
                success: true,
                data: {
                    helpfulCount: review.helpful.count,
                    hasMarked: !hasMarked
                }
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async reportReview(req, res) {
        try {
            const { reason } = req.body;
            const review = await Review.findById(req.params.id);

            if (!review) {
                throw new ErrorHandler('Review not found', 404);
            }

            review.reported.count++;
            review.reported.reasons.push(reason);

            // Automatically hide review if reported multiple times
            if (review.reported.count >= 5) {
                review.status = 'rejected';
            }

            await review.save();

            res.json({
                success: true,
                message: 'Review reported successfully'
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ReviewController;