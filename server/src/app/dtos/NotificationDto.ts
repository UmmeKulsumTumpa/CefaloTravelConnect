export interface NotificationCreateDtoType {
    user_id: number;
    message: string;
    type?: string;
    data?: any;
}

export interface Notification {
    notification_id: string;
    user_id: number;
    message: string;
    type: string;
    data?: any;
    read: boolean;
    created_at: string;
}
