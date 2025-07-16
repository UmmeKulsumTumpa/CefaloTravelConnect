import { POST_EFFORT_LEVELS, POST_VISIBILITY } from '../constants/index.js';

export function validateCreatePost(body: any): string[] {
    const errors: string[] = [];
    // user_id is not required, will be injected from auth token
    if (!body.title || typeof body.title !== 'string') errors.push('title is required and must be a string');
    if (body.description && typeof body.description !== 'string') errors.push('description must be a string');
    if (body.total_cost && typeof body.total_cost !== 'number') errors.push('total_cost must be a number');
    if (body.total_duration && typeof body.total_duration !== 'number') errors.push('total_duration must be a number');
    if (body.effort_level && !POST_EFFORT_LEVELS.includes(body.effort_level)) errors.push(`effort_level must be one of: ${POST_EFFORT_LEVELS.join(', ')}`);
    if (body.categories && !Array.isArray(body.categories)) errors.push('categories must be an array');
    if (body.visibility && !POST_VISIBILITY.includes(body.visibility)) errors.push(`visibility must be one of: ${POST_VISIBILITY.join(', ')}`);
    return errors;
}

export function validateUpdatePost(body: any): string[] {
    const errors: string[] = [];
    if (body.title && typeof body.title !== 'string') errors.push('title must be a string');
    if (body.description && typeof body.description !== 'string') errors.push('description must be a string');
    if (body.total_cost && typeof body.total_cost !== 'number') errors.push('total_cost must be a number');
    if (body.total_duration && typeof body.total_duration !== 'number') errors.push('total_duration must be a number');
    if (body.effort_level && !POST_EFFORT_LEVELS.includes(body.effort_level)) errors.push(`effort_level must be one of: ${POST_EFFORT_LEVELS.join(', ')}`);
    if (body.categories && !Array.isArray(body.categories)) errors.push('categories must be an array');
    if (body.visibility && !POST_VISIBILITY.includes(body.visibility)) errors.push(`visibility must be one of: ${POST_VISIBILITY.join(', ')}`);
    return errors;
}
