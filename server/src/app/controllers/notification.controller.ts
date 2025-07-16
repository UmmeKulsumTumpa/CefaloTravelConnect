import { Request, Response } from 'express';
import { NotificationService, MarkAsReadResult } from '../services/index.js';
import {sendResponse} from '../utils/index.js';

export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    async createNotification(req: Request, res: Response) {
        const notification = await this.notificationService.createNotification(req.body);

        if (!notification) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: 'Failed to create notification',
                data: null,
            });
        }

        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Notification created successfully',
            data: notification,
        });
    }

    async getUserNotifications(req: Request, res: Response) {
        const userId = Number(req.params.userId);
        const authUser = (req as any).user;
        const notifications = await this.notificationService.getUserNotifications(userId, authUser);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Notifications fetched successfully',
            data: notifications,
        });
    }

    async markAsRead(req: Request, res: Response) {
        const notificationId = req.params.notificationId;
        const authUser = (req as any).user;
        const result: MarkAsReadResult = await this.notificationService.markAsRead(notificationId, authUser);

        if (result.alreadyRead) {
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Notification already marked as read',
                data: result.notification,
            });
        }

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Notification marked as read',
            data: result.notification,
        });
    }

    async deleteNotification(req: Request, res: Response) {
        const notificationId = req.params.notificationId;
        const authUser = (req as any).user;
        await this.notificationService.deleteNotification(notificationId, authUser);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Notification deleted successfully',
            data: null,
        });
    }
}
