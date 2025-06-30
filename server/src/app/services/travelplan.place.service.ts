import { AddPlannedPlaceDto } from "../dtos/travelPlanDto.js";
import { ITravelPlanRepository, PlannedPlace } from "../interfaces/travelplan.interface.js";

export class TravelPlanPlaceService {
    constructor(private travelPlanRepository: ITravelPlanRepository) {}

    async addPlannedPlace(data: AddPlannedPlaceDto): Promise<PlannedPlace> {
        return this.travelPlanRepository.addPlannedPlace(data);
    }

    async getPlannedPlaces(plan_id: string): Promise<PlannedPlace[]> {
        return this.travelPlanRepository.getPlannedPlaces(plan_id);
    }
}
