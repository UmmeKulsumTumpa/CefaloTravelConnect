export function validatePlaceCreate(input: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.name || typeof input.name !== 'string' || input.name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
    }
    if (typeof input.latitude !== 'number' || isNaN(input.latitude)) {
        errors.push('Latitude is required and must be a number.');
    }
    if (typeof input.longitude !== 'number' || isNaN(input.longitude)) {
        errors.push('Longitude is required and must be a number.');
    }
    if (input.address !== undefined && typeof input.address !== 'string') {
        errors.push('Address must be a string.');
    }
    if (input.notes !== undefined && typeof input.notes !== 'string') {
        errors.push('Notes must be a string.');
    }
    return { valid: errors.length === 0, errors };
}

export function validatePlaceUpdate(input: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (input.name !== undefined && (typeof input.name !== 'string' || input.name.trim() === '')) {
        errors.push('Name must be a non-empty string if provided.');
    }
    if (input.latitude !== undefined && (typeof input.latitude !== 'number' || isNaN(input.latitude))) {
        errors.push('Latitude must be a number if provided.');
    }
    if (input.longitude !== undefined && (typeof input.longitude !== 'number' || isNaN(input.longitude))) {
        errors.push('Longitude must be a number if provided.');
    }
    if (input.address !== undefined && typeof input.address !== 'string') {
        errors.push('Address must be a string if provided.');
    }
    if (input.notes !== undefined && typeof input.notes !== 'string') {
        errors.push('Notes must be a string if provided.');
    }
    return { valid: errors.length === 0, errors };
}

export function validatePlaceQuery(input: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (input.place_id !== undefined && typeof input.place_id !== 'string') {
        errors.push('place_id must be a string if provided.');
    }
    if (input.name !== undefined && typeof input.name !== 'string') {
        errors.push('name must be a string if provided.');
    }
    if (input.address !== undefined && typeof input.address !== 'string') {
        errors.push('address must be a string if provided.');
    }
    if (input.notes !== undefined && typeof input.notes !== 'string') {
        errors.push('notes must be a string if provided.');
    }
    if (input.latitude !== undefined && isNaN(Number(input.latitude))) {
        errors.push('latitude must be a number if provided.');
    }
    if (input.longitude !== undefined && isNaN(Number(input.longitude))) {
        errors.push('longitude must be a number if provided.');
    }
    return { valid: errors.length === 0, errors };
}
