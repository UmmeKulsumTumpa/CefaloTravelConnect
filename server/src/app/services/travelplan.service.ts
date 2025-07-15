import { CreateTravelPlanDto, UpdateTravelPlanDto, AddPlanParticipantDto, AddPlanCommentDto } from '../dtos/travelPlanDto.js';
import { ITravelPlanRepository, TravelPlan, PlanParticipant, PlanComment } from '../interfaces/travelplan.interface.js';
import { UserFilter } from '../interfaces/user.interface.js';
import { UserService } from './user.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export class TravelPlanService {
    constructor(private travelPlanRepository: ITravelPlanRepository, private userService: UserService) {}

    async createTravelPlan(data: CreateTravelPlanDto , user_id: number): Promise<TravelPlan> {
        const plan = await this.travelPlanRepository.createTravelPlan(data);
        await this.travelPlanRepository.addPlanParticipant({
            plan_id: plan.plan_id,
            user_id: user_id,
            role_permission: 'Owner',
            is_going: true
        });
        return plan;
    }

    async updateTravelPlan(plan_id: string, data: UpdateTravelPlanDto, user_id: number): Promise<TravelPlan> {
        const participant = await this.travelPlanRepository.getPlanParticipant(plan_id, user_id);
        if (!participant || participant.role_permission !== 'Owner') {
            throw new AppError('Forbidden: Only owner can update the plan', 403);
        }
        return this.travelPlanRepository.updateTravelPlan(plan_id, data);
    }

    async deleteTravelPlan(plan_id: string, user_id: number): Promise<number> {
        const participant = await this.travelPlanRepository.getPlanParticipant(plan_id, user_id);
        if (!participant || participant.role_permission !== 'Owner') {
            throw new AppError('Forbidden: Only owner can delete the plan', 403);
        }
        return this.travelPlanRepository.deleteTravelPlan(plan_id);
    }

    async getTravelPlanById(plan_id: string): Promise<TravelPlan | undefined> {
        return this.travelPlanRepository.getTravelPlanById(plan_id);
    }

    async getAllTravelPlans(filters: { user_id?: number; name?: string }): Promise<TravelPlan[]> {
        return this.travelPlanRepository.getAllTravelPlans(filters);
    }

    // plan participants methods
    async addPlanParticipant(data: AddPlanParticipantDto, requester: any): Promise<PlanParticipant> {
        const participant = await this.travelPlanRepository.getPlanParticipant(data.plan_id, requester.user_id);
        // console.log('Participant:', participant);
        
        if (!participant || participant.role_permission === 'Viewer') {
            throw new AppError('Forbidden: Only owner or editor can add participants', 403);
        }
        // console.log('Adding participant:', data);
        
        // check if user already exists in the user db
        // call a user service or repository to check if the user exists
        // const userFilter: UserFilter = {
        //     id: data.user_id
        // };

        // const userExists = await this.userService.getUsers(userFilter, requester);
        // if (!userExists) {
        //     throw new AppError('User does not exist', 404);
        // }
        // console.log('User exists:', userExists);
        

        const existingParticipant = await this.travelPlanRepository.getPlanParticipant(data.plan_id, data.user_id);
        if (existingParticipant) {
            throw new AppError('Participant already exists in the plan', 400);
        }

        return this.travelPlanRepository.addPlanParticipant(data);
    }

    async getPlanParticipants(plan_id: string): Promise<PlanParticipant[]> {
        return this.travelPlanRepository.getPlanParticipants(plan_id);
    }

    async updatePlanParticipant(plan_id: string, user_id: number, data: Partial<PlanParticipant>, requester_id: number): Promise<PlanParticipant> {
        const owner = await this.travelPlanRepository.getPlanParticipant(plan_id, requester_id);
        if (!owner || owner.role_permission !== 'Owner') {
            throw new AppError('Forbidden: Only owner can update participant roles', 403);
        }
        const participant = await this.travelPlanRepository.getPlanParticipant(plan_id, user_id);
        if (!participant) {
            throw new AppError('Participant not found', 404);
        }
        return this.travelPlanRepository.updatePlanParticipant(plan_id, user_id, data);
    }

    async deletePlanParticipant(plan_id: string, user_id: number, requester_id: number): Promise<number> {
        const owner = await this.travelPlanRepository.getPlanParticipant(plan_id, requester_id);
        if (!owner || owner.role_permission !== 'Owner') {
            throw new AppError('Forbidden: Only owner can delete participants', 403);
        }
        const participant = await this.travelPlanRepository.getPlanParticipant(plan_id, user_id);
        if (!participant) {
            throw new AppError('Participant not found', 404);
        }
        return this.travelPlanRepository.deletePlanParticipant(plan_id, user_id);
    }

    // plan comments methods
    async addPlanComment(data: AddPlanCommentDto, requester_id: number): Promise<PlanComment> {
        const participant = await this.travelPlanRepository.getPlanParticipant(data.plan_id, requester_id);
        if (!participant || (participant.role_permission !== 'Owner' && participant.role_permission !== 'Editor')) {
            throw new AppError('Forbidden: Only owner or editor can add comments', 403);
        }
        return this.travelPlanRepository.addPlanComment(data);
    }

    async getPlanComments(plan_id: string): Promise<PlanComment[]> {
        return this.travelPlanRepository.getPlanComments(plan_id);
    }
}
