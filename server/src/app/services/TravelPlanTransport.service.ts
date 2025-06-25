import { AppError } from '../middlewares/error.middleware.js';
import { AddPlanTransportDto } from '../dtos/TravelPlanDto.js';
import { PlanTransport } from '../interfaces/ITravelPlanRepository.js';
import { TravelPlanRepository } from '../repositories/TravelPlan.repository.js';
import { ServiceRepository } from '../repositories/Service.repository.js';
import db from '../../db/db.js';

export class TravelPlanTransportService {
    constructor(private travelPlanRepository: TravelPlanRepository) {}

    async addPlanTransport(data: AddPlanTransportDto): Promise<PlanTransport> {
        // Existence check for travel plan
        const plan = await this.travelPlanRepository.getTravelPlanById(data.plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);
        return this.travelPlanRepository.addPlanTransport(data);
    }

    async getPlanTransports(plan_id: string): Promise<PlanTransport[]> {
        return this.travelPlanRepository.getPlanTransports(plan_id);
    }
}
