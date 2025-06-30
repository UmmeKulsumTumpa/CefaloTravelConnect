import { asyncHandler } from '../utils/asyncHandler.js';
import { CreateWishlistDto, UpdateWishlistDto } from '../dtos/wishlistDto.js';

export class WishlistValidation {
    static validateCreate(data: CreateWishlistDto) {
        const errors: string[] = [];
        if (!data.place_id || typeof data.place_id !== 'string') {
            errors.push('place_id is required and must be a string');
        }
        if (!data.name || typeof data.name !== 'string' || data.name.length > 255) {
            errors.push('name is required, must be a string, and max 255 chars');
        }
        if (data.region && data.region.length > 100) {
            errors.push('region max length is 100');
        }
        if (data.theme && data.theme.length > 100) {
            errors.push('theme max length is 100');
        }
        if (data.is_public !== undefined && typeof data.is_public !== 'boolean') {
            errors.push('is_public must be a boolean');
        }
        return errors;
    }

    static validateUpdate(data: UpdateWishlistDto) {
        const errors: string[] = [];
        if (data.name && (typeof data.name !== 'string' || data.name.length > 255)) {
            errors.push('name must be a string and max 255 chars');
        }
        if (data.region && data.region.length > 100) {
            errors.push('region max length is 100');
        }
        if (data.theme && data.theme.length > 100) {
            errors.push('theme max length is 100');
        }
        if (data.is_public !== undefined && typeof data.is_public !== 'boolean') {
            errors.push('is_public must be a boolean');
        }
        return errors;
    }
}
