import { TransportCreateDto, TransportUpdateDto } from '../dtos/transportDto.js';

export function validateCreateTransport(data: TransportCreateDto): string[] {
    const errors: string[] = [];
    if (!data.mode || typeof data.mode !== 'string') errors.push('mode (string) is required');
    if (data.operator && typeof data.operator !== 'string') errors.push('operator must be a string');
    return errors;
}

export function validateUpdateTransport(data: TransportUpdateDto): string[] {
    const errors: string[] = [];
    if (data.mode && typeof data.mode !== 'string') errors.push('mode must be a string');
    if (data.operator && typeof data.operator !== 'string') errors.push('operator must be a string');
    return errors;
}
