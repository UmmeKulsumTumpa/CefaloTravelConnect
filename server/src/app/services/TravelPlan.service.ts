import { CreateTravelPlanDto, UpdateTravelPlanDto, AddPlanParticipantDto, AddPlanCommentDto} from '../dtos/TravelPlanDto.js';
import { ITravelPlanRepository, TravelPlan, PlanParticipant, PlanComment } from '../interfaces/ITravelPlanRepository.js';

export class TravelPlanService {
    constructor(private travelPlanRepository: ITravelPlanRepository) {}

    async createTravelPlan(data: CreateTravelPlanDto): Promise<TravelPlan> {
        return this.travelPlanRepository.createTravelPlan(data);
    }

    async updateTravelPlan(plan_id: string, data: UpdateTravelPlanDto): Promise<TravelPlan> {
        return this.travelPlanRepository.updateTravelPlan(plan_id, data);
    }

    async getTravelPlanById(plan_id: string): Promise<TravelPlan | undefined> {
        return this.travelPlanRepository.getTravelPlanById(plan_id);
    }

    async getAllTravelPlans(filters: { user_id?: string; name?: string }): Promise<TravelPlan[]> {
        return this.travelPlanRepository.getAllTravelPlans(filters);
    }

    async deleteTravelPlan(plan_id: string): Promise<number> {
        return this.travelPlanRepository.deleteTravelPlan(plan_id);
    }

    // plan_participants methods
    async addPlanParticipant(data: AddPlanParticipantDto): Promise<PlanParticipant> {
        return this.travelPlanRepository.addPlanParticipant(data);
    }

    async getPlanParticipants(plan_id: string): Promise<PlanParticipant[]> {
        return this.travelPlanRepository.getPlanParticipants(plan_id);
    }

    // plan_comments methods
    async addPlanComment(data: AddPlanCommentDto): Promise<PlanComment> {
        return this.travelPlanRepository.addPlanComment(data);
    }

    async getPlanComments(plan_id: string): Promise<PlanComment[]> {
        return this.travelPlanRepository.getPlanComments(plan_id);
    }
}
