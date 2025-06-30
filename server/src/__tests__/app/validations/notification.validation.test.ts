import { validateNotificationCreateDto, validateUserId, validateNotificationId } from '../../../app/validations/notification.validation';
import { AppError } from '../../../app/middlewares/error.middleware';

describe('validateNotificationCreateDto', () => {
  it('throws for missing/invalid data', () => {
    expect(() => validateNotificationCreateDto(null)).toThrow(AppError);
    expect(() => validateNotificationCreateDto(123)).toThrow(AppError);
  });
  it('throws for missing/invalid user_id', () => {
    expect(() => validateNotificationCreateDto({ message: 'msg' })).toThrow('user_id (number) is required');
    expect(() => validateNotificationCreateDto({ user_id: 'bad', message: 'msg' })).toThrow('user_id (number) is required');
  });
  it('throws for missing/invalid message', () => {
    expect(() => validateNotificationCreateDto({ user_id: 1 })).toThrow('message (string) is required');
    expect(() => validateNotificationCreateDto({ user_id: 1, message: 123 })).toThrow('message (string) is required');
    expect(() => validateNotificationCreateDto({ user_id: 1, message: '' })).toThrow('message (string) is required');
  });
  it('throws for invalid type', () => {
    expect(() => validateNotificationCreateDto({ user_id: 1, message: 'msg', type: 123 })).toThrow('type must be a string');
  });
  it('returns input for valid data', () => {
    const data = { user_id: 1, message: 'msg', type: 'info' };
    expect(validateNotificationCreateDto(data)).toBe(data);
  });
});

describe('validateUserId', () => {
  it('throws for missing/invalid userId', () => {
    expect(() => validateUserId(null)).toThrow('user_id (number) is required');
    expect(() => validateUserId('bad')).toThrow('user_id (number) is required');
  });
  it('returns userId for valid input', () => {
    expect(validateUserId(1)).toBe(1);
  });
});

describe('validateNotificationId', () => {
  it('throws for missing/invalid notificationId', () => {
    expect(() => validateNotificationId(null)).toThrow('notificationId (string) is required');
    expect(() => validateNotificationId(123)).toThrow('notificationId (string) is required');
  });
  it('returns notificationId for valid input', () => {
    expect(validateNotificationId('id')).toBe('id');
  });
});
