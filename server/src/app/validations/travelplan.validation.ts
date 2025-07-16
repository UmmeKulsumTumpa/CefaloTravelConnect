import { CreateTravelPlanDto, UpdateTravelPlanDto, TravelPlanServiceDetailDTO, TravelPlanTransportDetailDTO } from '../dtos/index.js';
import { TRAVEL_PLAN_STATUS } from '../constants/index.js';

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

export function validatePlanService(data: TravelPlanServiceDetailDTO): string[] {
    const errors: string[] = [];
    if (!data.plan_id || typeof data.plan_id !== 'string') {
        errors.push('plan_id is required and must be a string.');
    }
    if (!data.service_id || typeof data.service_id !== 'string') {
        errors.push('service_id is required and must be a string.');
    }
    if (data.estimated_cost && isNaN(Number(data.estimated_cost))) {
        errors.push('estimated_cost must be a number.');
    }
    if (data.planned_visit_date && isNaN(Date.parse(data.planned_visit_date))) {
        errors.push('Invalid planned_visit_date.');
    }
    if (data.notify_when_near !== undefined && typeof data.notify_when_near !== 'boolean') {
        errors.push('notify_when_near must be a boolean.');
    }
    return errors;
}

export function validatePlanTransport(data: TravelPlanTransportDetailDTO): string[] {
    const errors: string[] = [];
    if (!data.plan_id || typeof data.plan_id !== 'string') {
        errors.push('plan_id is required and must be a string.');
    }
    if (!data.service_id || typeof data.service_id !== 'string') {
        errors.push('service_id is required and must be a string.');
    }
    if (data.estimated_cost && isNaN(Number(data.estimated_cost))) {
        errors.push('estimated_cost must be a number.');
    }
    if (data.planned_departure_time && isNaN(Date.parse(data.planned_departure_time))) {
        errors.push('Invalid planned_departure_time.');
    }
    if (data.planned_arrival_time && isNaN(Date.parse(data.planned_arrival_time))) {
        errors.push('Invalid planned_arrival_time.');
    }
    if (data.start_point_latitude !== undefined && typeof data.start_point_latitude !== 'number') {
        errors.push('start_point_latitude must be a number.');
    }
    if (data.start_point_longitude !== undefined && typeof data.start_point_longitude !== 'number') {
        errors.push('start_point_longitude must be a number.');
    }
    if (data.end_point_latitude !== undefined && typeof data.end_point_latitude !== 'number') {
        errors.push('end_point_latitude must be a number.');
    }
    if (data.end_point_longitude !== undefined && typeof data.end_point_longitude !== 'number') {
        errors.push('end_point_longitude must be a number.');
    }
    if (data.notify_when_near !== undefined && typeof data.notify_when_near !== 'boolean') {
        errors.push('notify_when_near must be a boolean.');
    }
    return errors;
}
