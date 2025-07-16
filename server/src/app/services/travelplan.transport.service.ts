import { AppError } from '../middlewares/index.js';
import { TravelPlanTransportDetailDTO } from '../dtos/index.js';
import { PlanTransport } from '../interfaces/index.js';
import { TravelPlanRepository } from '../repositories/index.js';

export class TravelPlanTransportService {
    constructor(private travelPlanRepository: TravelPlanRepository) {}

    async addPlanTransport(data: TravelPlanTransportDetailDTO): Promise<PlanTransport> {
        const plan = await this.travelPlanRepository.getTravelPlanById(data.plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        return this.travelPlanRepository.addPlanTransport(data);
    }

    async getPlanTransport(plan_id: string, service_id: string): Promise<PlanTransport | null> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const transport = await this.travelPlanRepository.getPlanTransport(plan_id, service_id);
        if (!transport) throw new AppError('Transport not found', 404);

        return transport;
    }

    async updatePlanTransport(plan_id: string, service_id: string, data: TravelPlanTransportDetailDTO): Promise<PlanTransport> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const transport = await this.travelPlanRepository.getPlanTransport(plan_id, service_id);
        if (!transport) throw new AppError('Transport not found', 404);

        return this.travelPlanRepository.updatePlanTransport(plan_id, service_id, data);
    }

    async deletePlanTransport(plan_id: string, service_id: string): Promise<number> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const transport = await this.travelPlanRepository.getPlanTransport(plan_id, service_id);
        if (!transport) throw new AppError('Transport not found', 404);

        return this.travelPlanRepository.deletePlanTransport(plan_id, service_id);
    }

    async getPlanTransports(plan_id: string): Promise<PlanTransport[]> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);
        
        return this.travelPlanRepository.getPlanTransports(plan_id);
    }
}
