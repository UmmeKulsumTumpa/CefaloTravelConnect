import { body, param } from 'express-validator';

export const validateGeolocation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
  body('address')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Address must be a string up to 255 characters'),
];

export const validateGeolocationUpdate = [
  param('id').isUUID().withMessage('Invalid geolocation ID'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
  body('address')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Address must be a string up to 255 characters'),
];
