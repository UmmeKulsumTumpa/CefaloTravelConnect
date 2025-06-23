import { AddPlannedPlaceDto } from "../dtos/TravelPlanDto.js";
import { ITravelPlanRepository, PlannedPlace } from "../interfaces/ITravelPlanRepository.js";

export class TravelPlanPlaceService {
    constructor(private travelPlanRepository: ITravelPlanRepository) {}

    async addPlannedPlace(data: AddPlannedPlaceDto): Promise<PlannedPlace> {
        return this.travelPlanRepository.addPlannedPlace(data);
    }

    async getPlannedPlaces(plan_id: string): Promise<PlannedPlace[]> {
        return this.travelPlanRepository.getPlannedPlaces(plan_id);
    }
}
