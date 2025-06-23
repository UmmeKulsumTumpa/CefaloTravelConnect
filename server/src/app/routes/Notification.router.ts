import express from 'express';
import { NotificationRepository } from '../repositories/Notification.repository.js';
import { NotificationService } from '../services/Notification.service.js';
import { NotificationController } from '../controllers/Notification.controller.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const notificationRepository = new NotificationRepository(db);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.post(
    '/',
    asyncHandler(notificationController.createNotification.bind(notificationController))
);

router.get(
    '/user/:userId',
    authenticationMiddleware,
    asyncHandler(notificationController.getUserNotifications.bind(notificationController))
);

router.patch(
    '/:notificationId/read',
    authenticationMiddleware,
    asyncHandler(notificationController.markAsRead.bind(notificationController))
);

router.delete(
    '/:notificationId',
    authenticationMiddleware,
    asyncHandler(notificationController.deleteNotification.bind(notificationController))
);

export default router;
