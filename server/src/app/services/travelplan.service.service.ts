import { TravelPlanServiceUnifiedDTO, TravelPlanServiceDetailDTO, TravelPlanTransportDetailDTO } from "../dtos/travelPlanDto.js";
import { ITravelPlanRepository } from "../interfaces/travelplan.interface.js";
import { AppError } from '../middlewares/error.middleware.js';
import { validatePlanService, validatePlanTransport } from '../validations/travelplan.validation.js';

function hasTransportDetails(details: any): details is TravelPlanTransportDetailDTO {
    return !!details && (
        details.planned_departure_time !== undefined ||
        details.planned_arrival_time !== undefined ||
        details.start_point_latitude !== undefined ||
        details.start_point_longitude !== undefined ||
        details.end_point_latitude !== undefined ||
        details.end_point_longitude !== undefined
    );
}

export class TravelPlanService {
    constructor(private travelPlanRepository: ITravelPlanRepository) {}

    async addPlanService(data: TravelPlanServiceUnifiedDTO): Promise<TravelPlanServiceUnifiedDTO> {
        const plan = await this.travelPlanRepository.getTravelPlanById(data.plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const serviceErrors = validatePlanService(data);
        if (serviceErrors.length) throw new AppError(serviceErrors.join(', '), 400);

        const { transport_details, ...serviceData } = data;
        const createdService = await this.travelPlanRepository.addPlanService(serviceData);

        let transportDetails: TravelPlanTransportDetailDTO | null = null;
        if (hasTransportDetails(transport_details)) {
            const transportErrors = validatePlanTransport({ ...transport_details, plan_id: data.plan_id, service_id: createdService.service_id });

            if (transportErrors.length) throw new AppError(transportErrors.join(', '), 400);

            const merged = { ...transport_details, plan_id: data.plan_id, service_id: createdService.service_id };

            transportDetails = await this.travelPlanRepository.addPlanTransport(merged);
        }
        return {
            ...createdService,
            transport_details: transportDetails
        };
    }

    async getPlanService(plan_id: string, service_id: string): Promise<TravelPlanServiceUnifiedDTO | null> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const service = await this.travelPlanRepository.getPlanService(plan_id, service_id);
        if (!service) throw new AppError('Service not found', 404);

        const transport = await this.travelPlanRepository.getPlanTransport(plan_id, service_id);

        return {
            ...service,
            transport_details: transport || null
        };
    }

    async updatePlanService(plan_id: string, service_id: string, data: TravelPlanServiceUnifiedDTO): Promise<TravelPlanServiceUnifiedDTO> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const service = await this.travelPlanRepository.getPlanService(plan_id, service_id);
        if (!service) throw new AppError('Service not found', 404);
        
        const serviceErrors = validatePlanService({ ...data, service_id });
        if (serviceErrors.length) throw new AppError(serviceErrors.join(', '), 400);
        
        const { transport_details, ...serviceData } = data;
        const updatedService = await this.travelPlanRepository.updatePlanService(plan_id, service_id, serviceData);

        let transportDetails: TravelPlanTransportDetailDTO | null = null;
        if (hasTransportDetails(transport_details)) {
            const transportErrors = validatePlanTransport({ ...transport_details, plan_id, service_id });
            if (transportErrors.length) throw new AppError(transportErrors.join(', '), 400);

            const merged = { ...transport_details, plan_id, service_id };
            transportDetails = await this.travelPlanRepository.updatePlanTransport(plan_id, service_id, merged);
        }

        return {
            ...updatedService,
            transport_details: transportDetails
        };
    }

    async deletePlanService(plan_id: string, service_id: string): Promise<void> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const service = await this.travelPlanRepository.getPlanService(plan_id, service_id);
        if (!service) throw new AppError('Service not found', 404);

        await this.travelPlanRepository.deletePlanService(plan_id, service_id);
        await this.travelPlanRepository.deletePlanTransport(plan_id, service_id);
    }

    async getPlanServices(plan_id: string): Promise<TravelPlanServiceUnifiedDTO[]> {
        const plan = await this.travelPlanRepository.getTravelPlanById(plan_id);
        if (!plan) throw new AppError('Travel plan not found', 404);

        const services = await this.travelPlanRepository.getPlanServices(plan_id);
        const transports = await this.travelPlanRepository.getPlanTransports(plan_id);
        
        return services.map(service => ({
            ...service,
            transport_details: transports.find(t => t.service_id === service.service_id) || null
        }));
    }
}
