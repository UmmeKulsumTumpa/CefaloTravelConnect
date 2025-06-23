import { CreateTravelPlanDto, UpdateTravelPlanDto } from '../dtos/TravelPlanDto.js';
import { TRAVEL_PLAN_STATUS } from '../constants/TravelPlan.constant.js';

export function validateCreateTravelPlan(data: CreateTravelPlanDto): string[] {
    const errors: string[] = [];
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        errors.push('Name is required and must be a non-empty string.');
    }
    if (data.status && !TRAVEL_PLAN_STATUS.includes(data.status)) {
        errors.push('Invalid status value.');
    }
    if (data.start_date && isNaN(Date.parse(data.start_date))) {
        errors.push('Invalid start_date.');
    }
    if (data.end_date && isNaN(Date.parse(data.end_date))) {
        errors.push('Invalid end_date.');
    }
    if (data.total_cost && isNaN(Number(data.total_cost))) {
        errors.push('total_cost must be a number.');
    }
    if (data.total_duration && isNaN(Number(data.total_duration))) {
        errors.push('total_duration must be a number.');
    }
    return errors;
}

export function validateUpdateTravelPlan(data: UpdateTravelPlanDto): string[] {
    const errors: string[] = [];
    if (data.name && (typeof data.name !== 'string' || !data.name.trim())) {
        errors.push('Name must be a non-empty string.');
    }
    if (data.status && !TRAVEL_PLAN_STATUS.includes(data.status)) {
        errors.push('Invalid status value.');
    }
    if (data.start_date && isNaN(Date.parse(data.start_date))) {
        errors.push('Invalid start_date.');
    }
    if (data.end_date && isNaN(Date.parse(data.end_date))) {
        errors.push('Invalid end_date.');
    }
    if (data.total_cost && isNaN(Number(data.total_cost))) {
        errors.push('total_cost must be a number.');
    }
    if (data.total_duration && isNaN(Number(data.total_duration))) {
        errors.push('total_duration must be a number.');
    }
    return errors;
}
