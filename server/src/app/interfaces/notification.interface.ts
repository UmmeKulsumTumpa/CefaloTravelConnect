import { Notification, NotificationCreateDtoType } from '../dtos/notificationDto.js';

export interface INotificationRepository {
    createNotification(data: NotificationCreateDtoType): Promise<Notification>;
    getUserNotifications(userId: number): Promise<Notification[]>;
    getNotificationById(notificationId: string): Promise<Notification | null>;
    markAsRead(notificationId: string): Promise<Notification | null>;
    deleteNotification(notificationId: string): Promise<boolean>;
}
