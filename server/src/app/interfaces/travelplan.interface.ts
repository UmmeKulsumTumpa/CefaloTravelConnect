// ITravelPlanRepository.ts
import { CreateTravelPlanDto, UpdateTravelPlanDto, AddPlannedPlaceDto, AddPlanParticipantDto, AddPlanCommentDto, TravelPlanServiceDetailDTO, TravelPlanTransportDetailDTO } from '../dtos/travelPlanDto.js';
import { TravelPlanStatus, VisitPriority, ParticipantRole } from '../constants/travelPlan.constant.js';

export interface TravelPlan {
    plan_id: string;
    name: string;
    start_date?: string;
    end_date?: string;
    total_cost?: number;
    total_duration?: number;
    upvotes?: number;
    downvotes?: number;
    created_at?: string;
}

export interface PlanService {
    plan_service_id: string;
    plan_id: string;
    service_id: string;
    estimated_cost?: number;
    planned_visit_date?: string;
    notes?: string;
    notify_when_near?: boolean;
    created_at: string;
}

export interface PlanTransport {
    plan_transport_id: string;
    plan_id: string;
    service_id: string;
    estimated_cost?: number;
    planned_departure_time?: string;
    planned_arrival_time?: string;
    start_point_latitude: number;
    start_point_longitude: number;
    start_point_address?: string;
    end_point_latitude: number;
    end_point_longitude: number;
    end_point_address?: string;
    notes?: string;
    notify_when_near?: boolean;
    created_at: string;
}

export interface PlannedPlace {
    plan_id: string;
    place_id: string;
    priority?: VisitPriority;
}

export interface PlanParticipant {
    plan_id: string;
    user_id: number;
    is_going?: boolean;
    role_permission?: ParticipantRole;
}

export interface PlanComment {
    comment_id: string;
    plan_id: string;
    user_id: number;
    content: string;
    posted_at: string;
}

export interface ITravelPlanRepository {
    createTravelPlan(data: CreateTravelPlanDto): Promise<TravelPlan>;
    updateTravelPlan(plan_id: string, data: UpdateTravelPlanDto): Promise<TravelPlan>;
    getTravelPlanById(plan_id: string): Promise<TravelPlan | undefined>;
    getAllTravelPlans(filters: { user_id?: number; name?: string }): Promise<TravelPlan[]>;
    deleteTravelPlan(plan_id: string): Promise<number>;

    addPlanService(data: TravelPlanServiceDetailDTO): Promise<PlanService>;
    getPlanService(plan_id: string, service_id: string): Promise<PlanService | null>;
    updatePlanService(plan_id: string, service_id: string, data: TravelPlanServiceDetailDTO): Promise<PlanService>;
    deletePlanService(plan_id: string, service_id: string): Promise<number>;

    addPlanTransport(data: TravelPlanTransportDetailDTO): Promise<PlanTransport>;
    getPlanTransport(plan_id: string, service_id: string): Promise<PlanTransport | null>;
    updatePlanTransport(plan_id: string, service_id: string, data: TravelPlanTransportDetailDTO): Promise<PlanTransport>;
    deletePlanTransport(plan_id: string, service_id: string): Promise<number>;

    getPlanServices(plan_id: string): Promise<PlanService[]>;
    getPlanTransports(plan_id: string): Promise<PlanTransport[]>;

    addPlannedPlace(data: AddPlannedPlaceDto): Promise<PlannedPlace>;
    getPlannedPlaces(plan_id: string): Promise<PlannedPlace[]>;

    addPlanParticipant(data: AddPlanParticipantDto): Promise<PlanParticipant>;
    getPlanParticipants(plan_id: string): Promise<PlanParticipant[]>;
    getPlanParticipant(plan_id: string, user_id: number): Promise<PlanParticipant | undefined>;
    updatePlanParticipant(plan_id: string, user_id: number, data: Partial<PlanParticipant>): Promise<PlanParticipant>;
    deletePlanParticipant(plan_id: string, user_id: number): Promise<number>;

    addPlanComment(data: AddPlanCommentDto): Promise<PlanComment>;
    getPlanComments(plan_id: string): Promise<PlanComment[]>;

    // upvotePlan(plan_id: string, user_id: number): Promise<void>;
    // downvotePlan(plan_id: string, user_id: number): Promise<void>;
}
