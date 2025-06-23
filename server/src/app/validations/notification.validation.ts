import { NotificationCreateDtoType } from '../dtos/NotificationDto.js';
import { AppError } from '../middlewares/error.middleware.js';

export function validateNotificationCreateDto(data: any): NotificationCreateDtoType {
    if (!data || typeof data !== 'object') throw new AppError('Invalid notification data', 400);
    if (!('user_id' in data) || typeof data.user_id !== 'number' || isNaN(data.user_id)) throw new AppError('user_id (number) is required', 400);
    if (!('message' in data) || typeof data.message !== 'string' || !data.message.trim()) throw new AppError('message (string) is required', 400);
    if ('type' in data && typeof data.type !== 'string') throw new AppError('type must be a string', 400);
    // data.data is optional
    return data as NotificationCreateDtoType;
}

export function validateUserId(userId: any): number {
    if (!userId || typeof userId !== 'number' || isNaN(userId)) throw new AppError('user_id (number) is required', 400);
    return userId;
}

export function validateNotificationId(notificationId: any): string {
    if (!notificationId || typeof notificationId !== 'string') throw new AppError('notificationId (string) is required', 400);
    return notificationId;
}
