import { ServiceRepository } from '../repositories/Service.repository.js';
import { ServiceCreateRequestDto, ServiceUpdateRequestDto, ServiceResponseDto } from '../dtos/ServiceDto.js';
import { ServiceCreateDB, ServiceUpdateDB, ServiceEntity, ServiceFilter } from '../interfaces/IServiceRepository.js';
import { TransportService } from './Transport.service.js';
import { validateService, validateServiceUpdate } from '../validations/Service.validation.js';
import { validateCreateTransport, validateUpdateTransport } from '../validations/transport.validation.js';
import { AppError } from '../middlewares/error.middleware.js';

export class ServiceService {
    constructor(
        private serviceRepository: ServiceRepository,
        private transportService: TransportService
    ) {}

    private toServiceResponseDto(service: ServiceEntity): ServiceResponseDto {
        return {
            ...service,
            latitude: service.latitude ? Number(service.latitude) : undefined,
            longitude: service.longitude ? Number(service.longitude) : undefined,
            created_at: service.created_at,
        };
    }

    public async buildServiceResponseWithTransport(service: ServiceEntity): Promise<ServiceResponseDto> {
        const response = this.toServiceResponseDto(service);
        if (response.type === 'Transport') {
            const transport = await this.transportService.getTransportIfExists(service.service_id);
            return { ...response, transport: transport ?? null };
        }
        return response;
    }

    async createService(data: ServiceCreateRequestDto): Promise<ServiceResponseDto> {
        const validation = validateService(data);
        if (!validation.valid) throw new AppError(validation.errors.join(', '), 400);

        // Remove transport before DB insert
        const { transport, ...serviceData } = data;
        const created = await this.serviceRepository.create(serviceData as ServiceCreateDB);
        let service = await this.serviceRepository.findById(created.service_id);
        if (!service) throw new AppError('Failed to create service', 500);
        let response = this.toServiceResponseDto(service);

        if (response.type === 'Transport' && transport) {
            const transportValidation = validateCreateTransport({ ...transport, service_id: response.service_id });
            if (transportValidation.length) throw new AppError(transportValidation.join(', '), 400);
            await this.transportService.createTransport({ ...transport, service_id: response.service_id });
            const transportDetails = await this.transportService.getTransportById(response.service_id);
            return { ...response, transport: transportDetails };
        }
        // Use builder for consistent response
        return await this.buildServiceResponseWithTransport(service);
    }

    async getServiceById(service_id: string): Promise<ServiceResponseDto | undefined> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);
        return await this.buildServiceResponseWithTransport(service);
    }

    async updateService(service_id: string, data: ServiceUpdateRequestDto): Promise<ServiceResponseDto | undefined> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);
        const validation = validateServiceUpdate(data);
        if (!validation.valid) throw new AppError(validation.errors.join(', '), 400);
        const { transport, ...serviceData } = data;

        const filteredServiceData: ServiceUpdateDB = {};
        const keys: (keyof ServiceUpdateDB)[] = ['name', 'type', 'latitude', 'longitude', 'address', 'description'];
        for (const key of keys) {
            const value = serviceData[key];
            if (typeof value !== 'undefined') {
                (filteredServiceData as any)[key] = value;
            }
        }

        let updatedService: ServiceEntity | undefined = undefined;
        if (Object.keys(filteredServiceData).length > 0) {
            updatedService = await this.serviceRepository.update(service_id, filteredServiceData as ServiceUpdateDB);
            if (!updatedService) throw new AppError('Failed to update service', 500);
        } else {
            updatedService = await this.serviceRepository.findById(service_id);
        }

        let response = this.toServiceResponseDto(updatedService!);

        if (service.type === 'Transport' && transport) {
            const transportValidation = validateUpdateTransport(transport);
            if (transportValidation.length) throw new AppError(transportValidation.join(', '), 400);
            await this.transportService.updateTransport(service_id, transport);
            const transportDetails = await this.transportService.getTransportIfExists(service_id);
            if (transportDetails) {
                return { ...response, transport: transportDetails };
            }
        }
        
        return await this.buildServiceResponseWithTransport(updatedService!);
    }

    async deleteService(service_id: string): Promise<number> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);
        if (service.type === 'Transport') {
            await this.transportService.deleteTransport(service_id);
        }
        const deleted = await this.serviceRepository.delete(service_id);
        if (!deleted) throw new AppError('Failed to delete service', 500);
        return deleted;
    }

    async getAll(filters: ServiceFilter & { mode?: string; operator?: string } = {}): Promise<ServiceResponseDto[]> {
        const { mode, operator, ...serviceFilters } = filters;
        let serviceIds: string[] | undefined = undefined;
        if (mode || operator) {
            const transportQuery: any = {};
            if (mode) transportQuery.mode = mode;
            if (operator) transportQuery.operator = operator;
            const transports = await this.transportService.searchTransports(transportQuery);
            serviceIds = transports.map(t => t.service_id);
            if (serviceIds.length === 0) return [];
        }
        let services: ServiceEntity[];
        if (serviceIds) {
            services = await this.serviceRepository.findByIds(serviceIds);
        } else {
            services = await this.serviceRepository.findAll(serviceFilters);
        }
        const results: ServiceResponseDto[] = [];
        for (const service of services) {
            results.push(await this.buildServiceResponseWithTransport(service));
        }
        return results;
    }

    async findNearbyServices(latitude: number, longitude: number, radiusKm: number): Promise<ServiceResponseDto[]> {
        const radiusMeters = radiusKm * 1000;
        const nearby = await this.serviceRepository.findNearby(latitude, longitude, radiusMeters);
        const results: ServiceResponseDto[] = [];
        for (const service of nearby) {
            results.push(await this.buildServiceResponseWithTransport(service));
        }
        return results;
    }
}
