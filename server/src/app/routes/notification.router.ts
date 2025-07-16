import express from 'express';
import { NotificationRepository } from '../repositories/index.js';
import { NotificationService } from '../services/index.js';
import { NotificationController } from '../controllers/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';

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
