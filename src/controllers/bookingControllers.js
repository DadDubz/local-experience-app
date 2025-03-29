const Booking = require('../models/Booking');
const Guide = require('../models/Guide');
const User = require('../models/User');
const ErrorHandler = require('../middleware/errorHandler');

class BookingController {
    static async createBooking(req, res) {
        try {
            const { guideId, serviceId, date, participants } = req.body;

            // Check guide availability
            const guide = await Guide.findById(guideId);
            if (!guide) {
                throw new ErrorHandler('Guide not found', 404);
            }

            // Check if date is available
            const isDateBooked = await Booking.findOne({
                guide: guideId,
                date,
                status: { $in: ['pending', 'confirmed'] }
            });

            if (isDateBooked) {
                throw new ErrorHandler('This date is already booked', 400);
            }

            // Get service details
            const service = guide.services.id(serviceId);
            if (!service) {
                throw new ErrorHandler('Service not found', 404);
            }

            // Create booking
            const booking = new Booking({
                user: req.user.id,
                guide: guideId,
                service: {
                    name: service.name,
                    duration: service.duration,
                    price: service.price
                },
                date,
                participants,
                payment: {
                    amount: service.price
                }
            });

            await booking.save();

            res.status(201).json({
                success: true,
                data: booking
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateBookingStatus(req, res) {
        try {
            const { status } = req.body;
            const booking = await Booking.findById(req.params.id);

            if (!booking) {
                throw new ErrorHandler('Booking not found', 404);
            }

            // Check if user has permission to update
            if (booking.user.toString() !== req.user.id && 
                !req.user.isGuide) {
                throw new ErrorHandler('Not authorized', 403);
            }

            booking.status = status;
            await booking.save();

            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getUserBookings(req, res) {
        try {
            const bookings = await Booking.find({ user: req.user.id })
                .populate('guide', 'businessInfo.name')
                .sort('-date');

            res.json({
                success: true,
                count: bookings.length,
                data: bookings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getBookingDetails(req, res) {
        try {
            const booking = await Booking.findById(req.params.id)
                .populate('guide', 'businessInfo.name experience')
                .populate('user', 'name email');

            if (!booking) {
                throw new ErrorHandler('Booking not found', 404);
            }

            // Check if user has permission to view
            if (booking.user._id.toString() !== req.user.id && 
                booking.guide.user.toString() !== req.user.id) {
                throw new ErrorHandler('Not authorized', 403);
            }

            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async cancelBooking(req, res) {
        try {
            const booking = await Booking.findById(req.params.id);

            if (!booking) {
                throw new ErrorHandler('Booking not found', 404);
            }

            // Check if user has permission to cancel
            if (booking.user.toString() !== req.user.id) {
                throw new ErrorHandler('Not authorized', 403);
            }

            // Check if booking can be cancelled (e.g., not too close to date)
            const bookingDate = new Date(booking.date);
            const now = new Date();
            const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

            if (hoursDifference < 24) {
                throw new ErrorHandler('Bookings must be cancelled at least 24 hours in advance', 400);
            }

            booking.status = 'cancelled';
            await booking.save();

            res.json({
                success: true,
                message: 'Booking cancelled successfully'
            });
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = BookingController;