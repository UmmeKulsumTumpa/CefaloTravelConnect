import { Notification, NotificationCreateDtoType } from '../dtos/notificationDto.js';
import { INotificationRepository } from '../interfaces/notification.interface.js';
import { validateNotificationCreateDto, validateUserId, validateNotificationId } from '../validations/notification.validation.js';
import { AppError } from '../middlewares/error.middleware.js';

interface AuthUser {
    user_id: number;
    role?: string;
}

export interface MarkAsReadResult {
    notification: Notification;
    alreadyRead: boolean;
}

export class NotificationService {
    constructor(private notificationRepository: INotificationRepository) {}

    async createNotification(data: NotificationCreateDtoType): Promise<Notification> {
        const validData = validateNotificationCreateDto(data);
        return this.notificationRepository.createNotification(validData);
    }

    async getUserNotifications(userId: number, authUser: AuthUser): Promise<Notification[]> {
        const validUserId = validateUserId(userId);
        if (Number(authUser.user_id) !== Number(validUserId) && authUser.role !== 'admin') {
            throw new AppError('Forbidden: You are not allowed to view these notifications', 403);
        }
        return this.notificationRepository.getUserNotifications(validUserId);
    }

    async markAsRead(notificationId: string, authUser: AuthUser): Promise<MarkAsReadResult> {
        const validNotificationId = validateNotificationId(notificationId);
        const notification = await this.notificationRepository.getNotificationById(validNotificationId);
        if (!notification) throw new AppError('Notification not found', 404);
        if (notification.user_id !== authUser.user_id && authUser.role !== 'admin') {
            throw new AppError('Forbidden: You are not allowed to update this notification', 403);
        }
        if (notification.read) {
            return { notification, alreadyRead: true };
        }
        const updated = await this.notificationRepository.markAsRead(validNotificationId);
        return { notification: updated!, alreadyRead: false };
    }

    async deleteNotification(notificationId: string, authUser: AuthUser): Promise<boolean> {
        const validNotificationId = validateNotificationId(notificationId);
        const notification = await this.notificationRepository.getNotificationById(validNotificationId);
        if (!notification && authUser.role !== 'admin') {
            throw new AppError('Notification not found', 404);
        }
        if (notification && notification.user_id !== authUser.user_id && authUser.role !== 'admin') {
            throw new AppError('Forbidden: You are not allowed to delete this notification', 403);
        }
        return this.notificationRepository.deleteNotification(validNotificationId);
    }
}
