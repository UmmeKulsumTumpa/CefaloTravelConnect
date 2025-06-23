import { AddPlanServiceDto } from "../dtos/TravelPlanDto.js";
import { ITravelPlanRepository, PlanService } from "../interfaces/ITravelPlanRepository.js";

export class TravelPlanService {
    constructor(private travelPlanRepository: ITravelPlanRepository) {}

    async addPlanService(data: AddPlanServiceDto): Promise<PlanService> {
        return this.travelPlanRepository.addPlanService(data);
    }

    async getPlanServices(plan_id: string): Promise<PlanService[]> {
        return this.travelPlanRepository.getPlanServices(plan_id);
    }
}   
