import { NotificationController } from '../../../app/controllers/notification.controller';
import type { Notification } from '../../../app/dtos/notificationDto';
import { NotificationService } from '../../../app/services/notification.service';
import httpMocks from 'node-mocks-http';

describe('NotificationController', () => {
	let notificationService: jest.Mocked<NotificationService>;
	let controller: NotificationController;
	let req: any, res: any;

	beforeEach(() => {
		notificationService = {
			createNotification: jest.fn(),
			getUserNotifications: jest.fn(),
			markAsRead: jest.fn(),
			deleteNotification: jest.fn(),
		} as any;
		controller = new NotificationController(notificationService);
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
	});

	it('should create notification successfully', async () => {
		const mockNotification: Notification = {
			notification_id: '1',
			user_id: 1,
			message: 'Test message',
			type: 'info',
			data: {},
			read: false,
			created_at: new Date().toISOString()
		};
		notificationService.createNotification.mockResolvedValue(mockNotification);
		req.body = { message: 'test' };

		await controller.createNotification(req, res);

		expect(res._getJSONData().success).toBe(true);
		expect(res.statusCode).toBe(201);
	});

	it('should handle failed notification creation', async () => {
		notificationService.createNotification.mockResolvedValue(undefined as any);
		req.body = { message: 'test' };

		await controller.createNotification(req, res);

		expect(res._getJSONData().success).toBe(false);
		expect(res.statusCode).toBe(400);
	});

	it('should get user notifications', async () => {
		const mockNotification: Notification = {
			notification_id: '1',
			user_id: 1,
			message: 'Test message',
			type: 'info',
			data: {},
			read: false,
			created_at: new Date().toISOString()
		};
		notificationService.getUserNotifications.mockResolvedValue([mockNotification]);
		req.params.userId = '1';
		(req as any).user = { id: 1 };

		await controller.getUserNotifications(req, res);

		expect(res._getJSONData().success).toBe(true);
		expect(res.statusCode).toBe(200);
	});

	it('should mark notification as already read', async () => {
		const mockNotification: Notification = {
			notification_id: '1',
			user_id: 1,
			message: 'Test message',
			type: 'info',
			data: {},
			read: true,
			created_at: new Date().toISOString()
		};

		notificationService.markAsRead.mockResolvedValue({ alreadyRead: true, notification: mockNotification });
		req.params.notificationId = '1';
		(req as any).user = { id: 1 };

		await controller.markAsRead(req, res);

		expect(res._getJSONData().message).toBe('Notification already marked as read');
		expect(res.statusCode).toBe(200);
	});

	it('should mark notification as read', async () => {
		const mockNotification: Notification = {
			notification_id: '1',
			user_id: 1,
			message: 'Test message',
			type: 'info',
			data: {},
			read: false,
			created_at: new Date().toISOString()
		};
		notificationService.markAsRead.mockResolvedValue({ alreadyRead: false, notification: mockNotification });
		req.params.notificationId = '1';
		(req as any).user = { id: 1 };

		await controller.markAsRead(req, res);

		expect(res._getJSONData().message).toBe('Notification marked as read');
		expect(res.statusCode).toBe(200);
	});

	it('should delete notification', async () => {
		notificationService.deleteNotification.mockResolvedValue(true);
		req.params.notificationId = '1';
		(req as any).user = { id: 1 };

		await controller.deleteNotification(req, res);
		
		expect(res._getJSONData().message).toBe('Notification deleted successfully');
		expect(res.statusCode).toBe(200);
	});
});
