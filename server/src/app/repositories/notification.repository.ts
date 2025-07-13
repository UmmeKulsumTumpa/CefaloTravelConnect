import { Notification, NotificationCreateDtoType } from '../dtos/notificationDto.js';
import { INotificationRepository } from '../interfaces/notification.interface.js';
import { AppError } from '../middlewares/error.middleware.js';

export class NotificationRepository implements INotificationRepository {
    constructor(private db: any) {}

    async createNotification(data: NotificationCreateDtoType): Promise<Notification> {
        try {
            const insertData = {
                ...data,
                type: data.type || 'reminder',
            };
            const [notification] = await this.db('notifications').insert(insertData).returning('*');
            return notification;
        } catch (err) {
            throw new AppError('Failed to create notification', 500);
        }
    }

    async getUserNotifications(userId: number): Promise<Notification[]> {
        try {
            return await this.db('notifications').where({ user_id: userId }).orderBy('created_at', 'desc');
        } catch (err) {
            throw new AppError('Failed to fetch notifications', 500);
        }
    }

    async getNotificationById(notificationId: string): Promise<Notification | null> {
        try {
            const notification = await this.db('notifications')
                .where({ notification_id: notificationId })
                .first();
            return notification || null;
        } catch (err) {
            throw new AppError('Failed to fetch notification', 500);
        }
    }

    async markAsRead(notificationId: string): Promise<Notification | null> {
        try {
            const [notification] = await this.db('notifications')
                .where({ notification_id: notificationId })
                .update({ read: true })
                .returning('*');
            if (!notification) throw new AppError('Notification not found', 404);
            return notification;
        } catch (err) {
            throw new AppError('Failed to mark notification as read', 500);
        }
    }

    async deleteNotification(notificationId: string): Promise<boolean> {
        try {
            const deleted = await this.db('notifications')
                .where({ notification_id: notificationId })
                .del();
            if (!deleted) throw new AppError('Notification not found', 404);
            return true;
        } catch (err) {
            throw new AppError('Failed to delete notification', 500);
        }
    }
}
