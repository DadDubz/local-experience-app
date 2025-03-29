const Joi = require('joi');
const ErrorHandler = require('./errorHandler');

class ValidationMiddleware {
    static validateLocation(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().required().min(3).max(100),
            type: Joi.string().required().valid('lake', 'river', 'ocean', 'pond', 'stream'),
            coordinates: Joi.object({
                type: Joi.string().default('Point'),
                coordinates: Joi.array().items(Joi.number()).length(2).required()
            }),
            description: Joi.string(),
            features: Joi.array().items(
                Joi.string().valid('boat_launch', 'dock', 'parking', 'restroom', 'camping')
            ),
            species: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    seasonality: Joi.object({
                        start: Joi.date(),
                        end: Joi.date()
                    }),
                    commonality: Joi.string().valid('rare', 'common', 'abundant')
                })
            )
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    }

    static validateBooking(req, res, next) {
        const schema = Joi.object({
            guideId: Joi.string().required(),
            serviceId: Joi.string().required(),
            date: Joi.date().greater('now').required(),
            participants: Joi.object({
                count: Joi.number