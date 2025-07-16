import { ServiceType, ServiceCreateRequestDto, ServiceUpdateRequestDto } from '../dtos/index.js';
import { validateCreateTransport, validateUpdateTransport } from './index.js';

const allowedTypes: ServiceType[] = ['Hotel', 'Restaurant', 'Attraction', 'Transport'];

export function validateService(data: ServiceCreateRequestDto) {
    const errors: string[] = [];
    if (!data.name || typeof data.name !== 'string' || data.name.length > 255) {
        errors.push('Name is required and must be a string up to 255 characters.');
    }
    if (!data.type || !allowedTypes.includes(data.type)) {
        errors.push('Type is required and must be one of: ' + allowedTypes.join(', '));
    }
    if (data.latitude !== undefined && (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90)) {
        errors.push('Latitude must be a number between -90 and 90.');
    }
    if (data.longitude !== undefined && (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180)) {
        errors.push('Longitude must be a number between -180 and 180.');
    }
    if (data.address && typeof data.address !== 'string') {
        errors.push('Address must be a string.');
    }
    if (data.description && typeof data.description !== 'string') {
        errors.push('Description must be a string.');
    }
    if (data.type === 'Transport' && data.transport) {
        const transportErrors = validateCreateTransport({ ...data.transport, service_id: '' });
        errors.push(...transportErrors);
    }
    return { valid: errors.length === 0, errors };
}

export function validateServiceUpdate(data: ServiceUpdateRequestDto) {
    const errors: string[] = [];
    if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length > 255)) {
        errors.push('Name must be a string up to 255 characters.');
    }
    if (data.type !== undefined && !allowedTypes.includes(data.type)) {
        errors.push('Type must be one of: ' + allowedTypes.join(', '));
    }
    if (data.latitude !== undefined && (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90)) {
        errors.push('Latitude must be a number between -90 and 90.');
    }
    if (data.longitude !== undefined && (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180)) {
        errors.push('Longitude must be a number between -180 and 180.');
    }
    if (data.address !== undefined && typeof data.address !== 'string') {
        errors.push('Address must be a string.');
    }
    if (data.description !== undefined && typeof data.description !== 'string') {
        errors.push('Description must be a string.');
    }
    if (data.type === 'Transport' && data.transport) {
        const transportErrors = validateUpdateTransport(data.transport);
        errors.push(...transportErrors);
    }
    return { valid: errors.length === 0, errors };
}
