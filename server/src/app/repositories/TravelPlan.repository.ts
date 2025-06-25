// TravelPlan.repository.ts
import { Knex } from 'knex';
import { CreateTravelPlanDto, UpdateTravelPlanDto, AddPlannedPlaceDto, AddPlanParticipantDto, AddPlanCommentDto, TravelPlanServiceUnifiedDTO, TravelPlanServiceDetailDTO, TravelPlanTransportDetailDTO } from '../dtos/TravelPlanDto.js';
import { TravelPlan, PlannedPlace, PlanParticipant, PlanComment, PlanService, PlanTransport, ITravelPlanRepository } from '../interfaces/ITravelPlanRepository.js';

export class TravelPlanRepository implements ITravelPlanRepository {
    constructor(private knex: Knex) { }

    // general travel plan methods
    async createTravelPlan(data: CreateTravelPlanDto): Promise<TravelPlan> {
        const [plan] = await this.knex<TravelPlan>('travel_plans').insert(data).returning('*');
        return plan;
    }

    async updateTravelPlan(plan_id: string, data: UpdateTravelPlanDto): Promise<TravelPlan> {
        const [plan] = await this.knex<TravelPlan>('travel_plans').where({ plan_id }).update(data).returning('*');
        return plan;
    }

    async getTravelPlanById(plan_id: string): Promise<TravelPlan | undefined> {
        return await this.knex<TravelPlan>('travel_plans').where({ plan_id }).first();
    }

    async getAllTravelPlans(filters: { user_id?: number; name?: string }): Promise<TravelPlan[]> {
        let query = this.knex<TravelPlan>('travel_plans');
        if (filters.user_id !== undefined) {
            query = query.where('user_id', filters.user_id);
        }
        if (filters.name) {
            query = query.whereILike('name', `%${filters.name}%`);
        }
        return await query;
    }

    async deleteTravelPlan(plan_id: string): Promise<number> {
        return this.knex<TravelPlan>('travel_plans').where({ plan_id }).del();
    }

    // travel plan places methods
    async addPlannedPlace(data: AddPlannedPlaceDto): Promise<PlannedPlace>{
        const [place] = await this.knex<PlannedPlace>('planned_places').insert(data).returning('*');
        return place;
    }

    async getPlannedPlaces(plan_id: string): Promise<PlannedPlace[]> {
        const places = await this.knex<PlannedPlace>('planned_places').where({ plan_id });
        return places;
    }

    // service methods
    async addPlanService(data: TravelPlanServiceDetailDTO): Promise<PlanService> {
        const [service] = await this.knex<PlanService>('plan_services').insert(data).returning('*');
        return service;
    }

    async getPlanService(plan_id: string, service_id: string): Promise<PlanService | null> {
        return (await this.knex<PlanService>('plan_services').where({ plan_id, service_id }).first()) || null;
    }

    async updatePlanService(plan_id: string, service_id: string, data: TravelPlanServiceDetailDTO): Promise<PlanService> {
        const [service] = await this.knex<PlanService>('plan_services').where({ plan_id, service_id }).update(data).returning('*');
        return service;
    }

    async deletePlanService(plan_id: string, service_id: string): Promise<number> {
        return this.knex<PlanService>('plan_services').where({ plan_id, service_id }).del();
    }

    async getPlanServices(plan_id: string): Promise<PlanService[]> {
        return this.knex<PlanService>('plan_services').where({ plan_id });
    }

    // plan_participants methods
    async addPlanParticipant(data: AddPlanParticipantDto): Promise<PlanParticipant> {
        const [participant] = await this.knex<PlanParticipant>('plan_participants').insert(data).returning('*');
        return participant;
    }

    async getPlanParticipants(plan_id: string): Promise<PlanParticipant[]> {
        const participants = await this.knex<PlanParticipant>('plan_participants').where({ plan_id });
        return participants;
    }

    async getPlanParticipant(plan_id: string, user_id: number): Promise<PlanParticipant | undefined> {
        return this.knex<PlanParticipant>('plan_participants').where({ plan_id, user_id }).first();
    }

    async updatePlanParticipant(plan_id: string, user_id: number, data: Partial<PlanParticipant>): Promise<PlanParticipant> {
        const [participant] = await this.knex<PlanParticipant>('plan_participants')
            .where({ plan_id, user_id })
            .update(data)
            .returning('*');
        return participant;
    }

    async deletePlanParticipant(plan_id: string, user_id: number): Promise<number> {
        return this.knex<PlanParticipant>('plan_participants').where({ plan_id, user_id }).del();
    }

    // plan_comments methods
    async addPlanComment(data: AddPlanCommentDto): Promise<PlanComment> {
        const [comment] = await this.knex<PlanComment>('plan_comments').insert(data).returning('*');
        return comment;
    }   

    async getPlanComments(plan_id: string): Promise<PlanComment[]> {
        const comments = await this.knex<PlanComment>('plan_comments').where({ plan_id });
        return comments;
    }

    // travel plan transports methods
    async addPlanTransport(data: TravelPlanTransportDetailDTO): Promise<PlanTransport> {
        const [transport] = await this.knex<PlanTransport>('plan_transports').insert(data).returning('*');
        return transport;
    }

    async getPlanTransport(plan_id: string, service_id: string): Promise<PlanTransport | null> {
        return (await this.knex<PlanTransport>('plan_transports').where({ plan_id, service_id }).first()) || null;
    }

    async updatePlanTransport(plan_id: string, service_id: string, data: TravelPlanTransportDetailDTO): Promise<PlanTransport> {
        const [transport] = await this.knex<PlanTransport>('plan_transports').where({ plan_id, service_id }).update(data).returning('*');
        return transport;
    }

    async deletePlanTransport(plan_id: string, service_id: string): Promise<number> {
        return this.knex<PlanTransport>('plan_transports').where({ plan_id, service_id }).del();
    }

    async getPlanTransports(plan_id: string): Promise<PlanTransport[]> {
        return this.knex<PlanTransport>('plan_transports').where({ plan_id });
    }
}
