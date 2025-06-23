// ITravelPlanRepository.ts
import { CreateTravelPlanDto, UpdateTravelPlanDto, AddPlanServiceDto, AddPlanTransportDto, AddPlannedPlaceDto, AddPlanParticipantDto, AddPlanCommentDto } from '../dtos/TravelPlanDto.js';
import { TravelPlanStatus, VisitPriority, ParticipantRole } from '../constants/TravelPlan.constant.js';

export interface TravelPlan {
    plan_id: string;
    name: string;
    start_date?: string;
    end_date?: string;
    total_cost?: number;
    total_duration?: number;
    status?: TravelPlanStatus;
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
    user_id: string;
    is_going?: boolean;
    role_permission?: ParticipantRole;
}

export interface PlanComment {
    comment_id: string;
    plan_id: string;
    user_id: string;
    content: string;
    posted_at: string;
}

export interface ITravelPlanRepository {
    createTravelPlan(data: CreateTravelPlanDto): Promise<TravelPlan>;
    updateTravelPlan(plan_id: string, data: UpdateTravelPlanDto): Promise<TravelPlan>;
    getTravelPlanById(plan_id: string): Promise<TravelPlan | undefined>;
    getAllTravelPlans(filters: { user_id?: string; name?: string }): Promise<TravelPlan[]>;
    deleteTravelPlan(plan_id: string): Promise<number>;

    addPlanService(data: AddPlanServiceDto): Promise<PlanService>;
    getPlanServices(plan_id: string): Promise<PlanService[]>;

    addPlannedPlace(data: AddPlannedPlaceDto): Promise<PlannedPlace>;
    getPlannedPlaces(plan_id: string): Promise<PlannedPlace[]>;

    addPlanParticipant(data: AddPlanParticipantDto): Promise<PlanParticipant>;
    getPlanParticipants(plan_id: string): Promise<PlanParticipant[]>;

    addPlanComment(data: AddPlanCommentDto): Promise<PlanComment>;
    getPlanComments(plan_id: string): Promise<PlanComment[]>;

    
    // addPlanTransport(data: AddPlanTransportDto): Promise<PlanTransport>;
    // getPlanTransports(plan_id: string): Promise<PlanTransport[]>;

    // upvotePlan(plan_id: string, user_id: string): Promise<void>;
    // downvotePlan(plan_id: string, user_id: string): Promise<void>;
}
